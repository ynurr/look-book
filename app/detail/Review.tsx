'use client'

import { useEffect, useRef, useState } from 'react';
import styles from './../(styles)/Detail.module.css'
import Pagination from '../(components)/Pagination'
import { PiStarFill } from "react-icons/pi";
import { LuThumbsUp } from "react-icons/lu";
import { RiThumbUpFill } from "react-icons/ri";
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { fetchReviewByBook } from '@/store/slices/reviewSlice';
import { useSession } from 'next-auth/react';
import { fetchUserLikeList, updateLike } from '@/store/slices/likeSlice';
import { addComment, deleteComment, fetchComments } from '@/store/slices/commentSlice';
import { FaRegCommentDots } from "react-icons/fa";
import { redirect } from 'next/navigation';

export default function Review({ isbn }: { isbn: string | undefined }) {

    const { data: session, status } = useSession();
    const dispatch = useDispatch<AppDispatch>();
    const reviews = useSelector((state: RootState) => (state.review.bookReviews));
    const reviewCount = useSelector((state: RootState) => (state.review.totalCount));
    const likeIds = useSelector((state: RootState) => (state.like.likeReviewIds));
    const [localLikeIds, setLocalLikeIds] = useState<string[]>([]);
    const [localCounts, setLocalCounts] = useState<Record<string, number>>({});
    const [content, setContent] = useState('');
    const [contentReply, setContentReply] = useState('');
    const comments = useSelector((state: RootState) => (state.comment.comments));
    const [commentTree, setCommentTree] = useState<any[]>([]);

    useEffect(() => {
        if (isbn) {
            dispatch(fetchReviewByBook({isbn, sort: '0'}))
            dispatch(fetchComments({isbn, id: ''}))
        }
    }, [isbn, dispatch])

    useEffect(() => {
        if (session?.user.sub && isbn) {
            dispatch(fetchUserLikeList({user_id: session?.user.sub, book_isbn: isbn}))
        }
    }, [session?.user.sub, isbn, dispatch])

    useEffect(() => {
        if (likeIds.length > 0) {
            setLocalLikeIds(likeIds);
        }
    }, [likeIds]);

    const handleUpdateLike = async (review_id: string, currentCount: number) => {

        if (!session?.user.sub) {
            alert('로그인 후 가능합니다.');
            redirect('/login');
        }
        
        try {
            const isLiked = localLikeIds.length > 0 ? localLikeIds.includes(review_id) : likeIds.includes(review_id);

            setLocalLikeIds((prev) => {
                const currentIds = prev.length > 0 ? prev : likeIds; 
                return currentIds.includes(review_id)
                    ? currentIds.filter((id) => id !== review_id)
                    : [...currentIds, review_id];
            });

            setLocalCounts((prev) => ({
                ...prev,
                [review_id]: (prev[review_id] ?? currentCount) + (isLiked ? -1 : 1),
            }));

            dispatch(updateLike({
                user_id: session?.user.sub || '',
                review_id: review_id,
                book_isbn: isbn || '',
                isLike: !isLiked
            }))

        } catch (error) {
            alert('좋아요 업데이트 실패');
        }
    }

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
                
            await dispatch(fetchComments({isbn: isbn || '', id: ''})).unwrap();
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

            await dispatch(fetchComments({isbn: isbn || '', id: ''}));
        } catch (error) {
            alert('댓글 삭제 실패');
        }
    }

    const [isCommentVisible, setIsCommentVisible] = useState<{ [key: string]: boolean }>({});

    const toggleCommentText = (id: string) => {
        setIsCommentVisible(prevState => ({ ...prevState, [id]: !prevState[id] }))
    };

    const handleCommentCancel = (id: string) => {
        setIsCommentVisible(prevState => ({ ...prevState, [id]: false }))
    };

    const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태 관리
    const ItemsPerPage = 5;
    const pageCount = Math.ceil(reviews.length / ItemsPerPage);
    const currentItems = reviews.slice((currentPage - 1) * ItemsPerPage, currentPage * ItemsPerPage);

    const handlePageChange = (selected: { selected: number }) => {
        setCurrentPage(selected.selected + 1);
    };

    const [active, setActive] = useState('최신순');

    const handleSortChange = (option: string) => {
        setActive(option);

        if (isbn) {
            if (option === '최신순') {
                dispatch(fetchReviewByBook({ isbn, sort: '0' }));
            } else if (option === '별점높은순') {
                dispatch(fetchReviewByBook({ isbn, sort: '1' }));
            } else if (option === '별점낮은순') {
                dispatch(fetchReviewByBook({ isbn, sort: '2' }));
            }
        }
    }

    const refs = useRef<Record<string, HTMLParagraphElement | null>>({});
    const [isOverflow, setIsOverflow] = useState<Record<string, boolean>>({});
    const [expanded, setExpanded] = useState<Record<string, boolean>>({});

    useEffect(() => {
        const newOverflow: Record<string, boolean> = {};
    
        currentItems.forEach((review) => {
            const element = refs.current[review.review_id];
            if (element) {
                newOverflow[review.review_id] = element.scrollHeight > 60;
            }
        });
    
        console.log("초기 isOverflow:", JSON.stringify(isOverflow));
        console.log("계산된 newOverflow:", JSON.stringify(newOverflow));
    
        if (JSON.stringify(newOverflow) !== JSON.stringify(isOverflow)) {
            console.log("🔄 상태 변경 발생!");
            setIsOverflow(newOverflow);
        }
    }, [currentItems, isOverflow]); 
    
    return (
        <div className={styles.section3}>
            <div className={styles.reviewHeader}>
                <span className={styles.reviewTitle}>리뷰 ({reviewCount})</span>
                <div className={styles.align}>
                    <span 
                        className={`${styles.sort} ${active === '최신순' ? styles.active : ''}`}
                        onClick={() => handleSortChange('최신순')}
                        >최신순</span>
                    <span className={styles.separator}>|</span>
                    <span 
                        className={`${styles.sort} ${active === '별점높은순' ? styles.active : ''}`}
                        onClick={() => handleSortChange('별점높은순')}
                        >별점높은순</span>
                    <span className={styles.separator}>|</span>
                    <span 
                        className={`${styles.sort} ${active === '별점낮은순' ? styles.active : ''}`}
                        onClick={() => handleSortChange('별점낮은순')}
                    >별점낮은순</span>
                </div>
            </div>
            { currentItems.length > 0 ? (
                currentItems.map((review) => (
                    <div className={styles.reviewBox} key={review.review_id}>
                        <div className={styles.reviewList}>
                            <div className={styles.reviewMeta}>
                                <div className={styles.score}>
                                    {[...Array(5)].map((_, index) => (
                                        <PiStarFill 
                                            key={index}
                                            className={index < review.rating ? styles.starFill : styles.star}
                                        />
                                    ))}
                                </div>
                                <span className={styles.nickname}>{review.nickname}</span>
                                <span className={styles.reviewDate}>{review.date}</span>
                            </div>
                            <div className={styles.review}>
                                <p 
                                    ref={(el) => {
                                        if (el) refs.current[review.review_id] = el;
                                    }}
                                    className={`${styles.reviewContent} ${expanded[review.review_id] ? styles.expanded : ''}`}
                                >
                                    {review.content}
                                </p>
                                {isOverflow[review.review_id] && !expanded[review.review_id] && (
                                    <button 
                                        className={styles.expandBtn} 
                                        onClick={() => setExpanded((prev) => ({ ...prev, [review.review_id]: true }))}
                                    >
                                        더보기
                                    </button>
                                )}
                            </div>
                            <div className={styles.reviewActions}>
                                <span className={styles.like} onClick={() => handleUpdateLike(review.review_id, review.like_count)}>
                                    {localLikeIds.includes(review.review_id) ? <RiThumbUpFill /> : <LuThumbsUp />}
                                    {localCounts[review.review_id] ?? review.like_count}
                                </span>
                                <span className={styles.reply} onClick={() => toggleCommentText(review.review_id)}>댓글 {getCommentCount(review.review_id)}</span>
                            </div>
                        </div>

                        {isCommentVisible[review.review_id] && (
                        <>
                            <div className={styles.textAreaBox}>
                                <textarea 
                                    className={styles.textarea} 
                                    placeholder='200자 이내로 입력해주세요'
                                    maxLength={200}
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    ></textarea>
                                <div className={styles.textAreaBtn}>
                                    <button onClick={() => handleCommentCancel(review.review_id)}>취소</button>
                                    <button onClick={() => handleSubmit(review.review_id, '')}>등록</button>
                                </div>
                            </div>
                    
                            <div className={styles.commentSection}>
                                {commentTree.filter(comment => comment.review_id === review.review_id).map((comment) => (
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
                                                <span className={styles.comment}>{comment.content}</span>
                                                <FaRegCommentDots className={styles.commentBtn} onClick={() => toggleCommentText(comment.comment_id)} />
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
                                                    <button onClick={() => handleCommentCancel(comment.comment_id)}>취소</button>
                                                    <button onClick={() => handleSubmit(review.review_id, comment.comment_id)}>등록</button>
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
                                <div className={styles.line}></div>
                            </div>
                        </>
                        )}
                    </div>
                ))
            ) : (
                <div className={styles.noData}>
                    <span>작성된 리뷰가 없습니다.</span>
                </div>
            )
        }
            <Pagination 
                pageCount={pageCount}
                onPageChange={handlePageChange}
                currentPage={currentPage}
            />
        </div>
    )
}