'use client'

import { useEffect, useState } from 'react';
import LeftMenu from '../../LeftMenu';
import styles from './ReadingDetail.module.css';
import { PiStarFill } from "react-icons/pi";
import { LuThumbsUp } from "react-icons/lu";
import { RiThumbUpFill } from "react-icons/ri";
import { FaRegCommentDots } from "react-icons/fa";
import { useSession } from 'next-auth/react';
import { redirect, useSearchParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { fetchReadingDetail } from '@/store/slices/readingDetailSlice';
import { deleteBook, updateBookStatus } from '@/store/slices/readingSlice';
import Link from 'next/link';
import { fetchUserLike, updateLike } from '@/store/slices/likeSlice';
import { addComment, deleteComment, fetchComments } from '@/store/slices/commentSlice';
import DeleteModal from '@/app/(components)/DeleteModal';

export default function ReviewDetail() {

    const { data: session, status } = useSession();
    const searchParams = useSearchParams();
    const isbn = searchParams.get('isbn');
    
    if (!session && status !== "loading") {
        redirect('/login');
    }

    const dispatch = useDispatch<AppDispatch>();
    const reading = useSelector((state: RootState) => state.readingDetail.reading);
    const review = useSelector((state: RootState) => state.readingDetail.review);
    const likeStatus = useSelector((state: RootState) => state.like.isLike);    
    const [isLiked, setIsLiked] = useState(likeStatus);
    const [likeCount, setLikeCount] = useState(0);
    const comments = useSelector((state: RootState) => (state.comment.comments));
    const [commentTree, setCommentTree] = useState<any[]>([]);
    const [content, setContent] = useState('');
    const [contentReply, setContentReply] = useState('');
    const [isDelete, setIsDelete] = useState<{ active: boolean }>({ active: false });

    useEffect(() => {
        if (session?.user.sub && isbn) {
            dispatch(fetchReadingDetail({user_id: session?.user.sub, book_isbn: isbn}));
        }
    }, [session?.user.sub, isbn, dispatch])

    useEffect(() => {
        if (session?.user.sub && review.review_id) {
            dispatch(fetchUserLike({user_id: session?.user.sub, review_id: review.review_id}));
            dispatch(fetchComments({isbn: '', id: review.review_id}));
        }
    }, [session?.user.sub, review.review_id, dispatch])

    useEffect(() => {
        setIsLiked(likeStatus);
    }, [likeStatus])

    const handleUpdateStatus = async (status: string) => {
        try {
            await dispatch(updateBookStatus({
                    user_id: session?.user.sub || '',
                    book_isbn: reading?.isbn || '',
                    book_title: reading?.title || '',
                    book_cover: reading?.cover || '',
                    book_author: reading?.author || '',
                    status: status,
                })
            ).unwrap();
            
            if (session?.user.sub && isbn) {
                dispatch(fetchReadingDetail({user_id: session?.user.sub, book_isbn: isbn}));
            }
        } catch (error) {
            alert('독서 상태 변경 실패');
        }
    }

    const handleRemoveBook = async () => {
        try {
            await dispatch(deleteBook({
                    user_id: session?.user.sub || '',
                    book_isbn: reading?.isbn || '',
                    book_status: reading?.status || '',
                    review_id: review.review_id || '',
                })
            ).unwrap();

            window.location.href = '/library/reading';
        } catch (error) {
            alert('독서현황 삭제 실패');
        }
    }

    const handleUpdateLike = async () => {
        try {
            await dispatch(updateLike({
                user_id: session?.user.sub || '',
                review_id: review.review_id || '',
                book_isbn: isbn || '',
                isLike: !isLiked
            })).unwrap();

            setLikeCount(isLiked ? likeCount-1 : likeCount+1)
            setIsLiked(!isLiked);
        } catch (error) {
            alert('좋아요 업데이트 실패');
        }
    }

    useEffect(() => {
        if (review.like_count) {
            setLikeCount(review.like_count);
        }
    }, [review.like_count])

    const confirmRemove = () => {
        setIsDelete({ active: true });
    };
    
    const handleConfirmCancel = () => {
        setIsDelete({ active: false });
    };
    
    const handleConfirmProceed = async () => {
        setIsDelete({ active: false });
        await handleRemoveBook();
    };

    const handleSubmit = async (review_id: string, parent_id: string) => {

        if (!session?.user.sub) {
            alert('로그인 후 가능합니다.');
            redirect('/login');
        }
        
        if ((parent_id && !contentReply) || (!parent_id && !content)) {
            alert('댓글을 입력해주세요.');
            return;
        }

        try {
            await dispatch(addComment({
                review_id: review_id,
                book_isbn: isbn || '',
                user_id: session?.user.sub || '',
                content: parent_id ? contentReply : content,
                parent_id: parent_id
            })).unwrap();
                
            await dispatch(fetchComments({isbn: '', id: review.review_id})).unwrap();
            setContent('');
            setContentReply('');
        } catch (error) {
            alert('댓글 작성 실패');
        }
    }

    const buildCommentTree = (comments: any) => {
        const commentMap = new Map();

        comments.forEach((comment: any) => {
            commentMap.set(comment._id, { ...comment, replies: [] });
        });

        const tree: any[] = [];

        comments.forEach((comment: any) => {
            if (comment.parent_id) {
                const parent = commentMap.get(comment.parent_id);
                if (parent) {
                    parent.replies.push(commentMap.get(comment._id));  
                }
            } else {
                tree.push(commentMap.get(comment._id));
            }
        });
        
        return tree;
    }

    useEffect(() => {
        setCommentTree(buildCommentTree(comments));
    },[comments])

    const getCommentCount = (review_id: string) => {
        let count = 0;

        commentTree.forEach((comment) => {
            if (comment.review_id === review_id) {
                count ++;
            }
            if (comment.replies.length > 0) {
                count += comment.replies.filter((reply: any) => reply.review_id === review_id).length;
            }
        })

        return count;
    };

    const handleDeleteComment = async (comment_id: string) => {
        try {
            await dispatch(deleteComment({
                comment_id: comment_id,
                user_id: session?.user.sub || ''
            })).unwrap();

            dispatch(fetchComments({isbn: '', id: review.review_id}));
        } catch (error) {
            alert('댓글 삭제 실패');
        }
    }

    const [isCommentVisible, setIsCommentVisible] = useState<{ [key: number]: boolean }>({});

    const toggleCommentText = (id: number) => {
        setIsCommentVisible(prevState => ({ ...prevState, [id]: !prevState[id] }));
    };

    const handleCommentCancel = (id: number) => {
        setIsCommentVisible(prevState => ({ ...prevState, [id]: false }));
    };

    return (
        <div className={styles.container}>
            <div className={styles.leftMenu}>
                <LeftMenu />
            </div>
            <div className={styles.wrapper}>
                <div className={styles.btnBox}>
                    <button
                        onClick={() => handleUpdateStatus(reading?.status === '0' ? '1' : '0')}
                        className={styles.updateBtn}>{reading?.status === '0' ? '독서 완료' : '독서 중'}
                    </button>
                    {
                        review.review_id !== '' && 
                            <Link href={{
                                pathname: '/write/review',
                                query: {
                                    cover: reading?.cover,
                                    title: reading?.title,
                                    author: reading?.author,
                                    isbn13: reading?.isbn,
                                    status: reading?.status,
                                    id: review.review_id
                                },
                            }}>
                                <button className={styles.modifyBtn}>리뷰수정</button>
                            </Link>
                    }
                    <button onClick={confirmRemove} className={styles.deleteBtn}>삭제</button>
                </div>
                <div className={styles.line}></div>
                {isDelete.active && (
                    <DeleteModal
                        message="작성된 리뷰도 함께 삭제되며 복구할 수 없습니다. 내 서재에서 삭제할까요?"
                        onCancel={handleConfirmCancel} 
                        onConfirm={handleConfirmProceed}
                    />
                )}
                <div>
                    <div className={styles.bookInfo}>   
                        {reading?.cover ? (
                            <img src={reading?.cover} alt={reading?.title} className={styles.cover} />
                        ) : null}
                        <div className={styles.bookDetail}>
                            <Link href={`/detail?id=${reading?.isbn}`} className={styles.title}>
                                {reading?.title}
                            </Link>
                            <p className={styles.author}>{reading?.author}</p>
                            <div className={styles.statusBox}>
                                <span className={styles.label}>독서 상태</span>
                                <span className={styles.status}>{reading?.status === '0' ? '독서 중' : '독서 완료'}</span>
                            </div>
                            <div className={styles.dateBox}>
                                <span className={styles.label}>리뷰 작성</span>
                                <span className={styles.date}>{review.created_at ? review.created_at : '-'}</span>
                            </div>
                            <div className={styles.rating}>
                                {[...Array(5)].map((_, index) => (
                                    <PiStarFill 
                                        key={index}
                                        className={index < review.rating ? styles.starFill : styles.star}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {review.review_id !== '' ?
                        (
                            <div>
                                <div className={styles.reviewBox}>
                                    <p className={styles.review}>{review.content}</p>
                                </div>
                                <div className={styles.reactionBox}>
                                    <span 
                                        className={styles.likeBtn}
                                        onClick={handleUpdateLike}
                                    >
                                        {isLiked ? <RiThumbUpFill className={styles.thumpsUpFill}/> : <LuThumbsUp className={styles.thumpsUp}/>}
                                        <span className={styles.likeCnt}>{likeCount}</span>
                                    </span>
                                    <span className={styles.reply}>댓글 {getCommentCount(review.review_id)}</span>
                                </div>
                                <div>
                                </div>
                                <div className={styles.hrLine}></div>
                                <div className={styles.commentSection}>
                                    {commentTree.map((comment) => (
                                        <div className={styles.commentBox} key={comment.comment_id}>
                                            <div className={styles.commentContent}>
                                                <div className={styles.commentInfo}>
                                                    <span className={styles.nickname}>{comment.nickname}</span>
                                                    <span className={styles.commentDate}>{comment.date}</span>
                                                    {comment.user_id === session?.user.sub &&
                                                        <>
                                                            <span className={styles.dot}>·</span>
                                                            <button className={styles.commentDeleteBtn} onClick={() => handleDeleteComment(comment.comment_id)}>삭제</button> 
                                                        </>
                                                    }
                                                   
                                                </div>
                                                <div className={styles.commentLine}>
                                                    <p className={styles.comment}>{comment.content}</p>
                                                    <FaRegCommentDots className={styles.commentBtn} onClick={() => toggleCommentText(comment.comment_id)}></FaRegCommentDots>
                                                </div>
                                            </div>

                                            {isCommentVisible[comment.comment_id] && (
                                                <div className={styles.textAreaBox}>
                                                    <textarea 
                                                        className={styles.textarea} 
                                                        placeholder='200자 이내로 입력해주세요'
                                                        maxLength={200}
                                                        value={contentReply}
                                                        onChange={(e) => setContentReply(e.target.value)}
                                                        ></textarea>
                                                    <div className={styles.textAreaBtn}>
                                                        <button className={styles.commentCancelBtn} onClick={() => handleCommentCancel(comment.comment_id)}>취소</button>
                                                        <button className={styles.commentSubmitBtn} onClick={() => handleSubmit(review.review_id, comment.comment_id)}>등록</button>
                                                    </div>
                                                </div>
                                            )}
                                            
                                            {comment.replies && comment.replies.length > 0 && 
                                                comment.replies.map((reply: any) => {
                                                    return (
                                                        <div className={styles.replyBox} key={reply._id}>
                                                            <div className={styles.arrowBox}><span className={styles.arrow}>↳</span></div>
                                                            <div className={styles.replyContent}>
                                                                <div className={styles.commentInfo}>
                                                                    <span className={styles.nickname}>{reply.nickname}</span>
                                                                    <span className={styles.commentDate}>{reply.date}</span>
                                                                    {reply.user_id === session?.user.sub &&
                                                                        <>
                                                                            <span className={styles.dot}>·</span>
                                                                            <span className={styles.commentDeleteBtn} onClick={() => handleDeleteComment(reply._id)}>삭제</span> 
                                                                        </>
                                                                    }
                                                                </div>
                                                                <div className={styles.commentLine}>
                                                                    <span className={styles.comment}>{reply.content}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                    ))}

                                    <div className={styles.textAreaBox}>
                                        <textarea 
                                            className={styles.textarea} 
                                            placeholder='200자 이내로 입력해주세요'
                                            maxLength={200}
                                            value={content}
                                            onChange={(e) => setContent(e.target.value)}
                                            ></textarea>
                                        <div className={styles.textAreaBtn}>
                                            <button className={styles.commentSubmitBtn} onClick={() => handleSubmit(review.review_id, '')}>등록</button>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        ) : (
                            <Link href={{
                                pathname: '/write/review',
                                query: {
                                    cover: reading?.cover,
                                    title: reading?.title,
                                    author: reading?.author,
                                    isbn13: reading?.isbn,
                                    status: reading?.status,
                                },
                            }}>
                                <button className={styles.reviewBtn}>리뷰 작성하기</button>
                            </Link>
                        )
                    }

                </div>
            </div>
        </div>
    )
}