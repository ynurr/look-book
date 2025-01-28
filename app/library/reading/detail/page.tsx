'use client'

import { useEffect, useState } from 'react'
import LeftMenu from '../../LeftMenu'
import styles from './ReadingDetail.module.css'
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
    const [isDelete, setIsDelete] = useState(false);
    const [isLiked, setIsLiked] = useState(likeStatus);
    const [likeCount, setLikeCount] = useState(review.like_count);

    useEffect(() => {
        if (session?.user.sub && isbn) {
            dispatch(fetchReadingDetail({user_id: session?.user.sub, book_isbn: isbn}))
        }
    }, [session?.user.sub, isbn, dispatch])

    useEffect(() => {
        if (session?.user.sub && review.review_id) {
            dispatch(fetchUserLike({user_id: session?.user.sub, review_id: review.review_id}))
        }
    }, [session?.user.sub, review.review_id, dispatch])

    useEffect(() => {
        setIsLiked(likeStatus);
    }, [likeStatus]);

    const handleUpdateStatus = async (status: string) => {
        try {
            const result = await dispatch(
                updateBookStatus({
                    user_id: session?.user.sub || '',
                    book_isbn: reading?.isbn || '',
                    book_title: reading?.title || '',
                    book_cover: reading?.cover || '',
                    book_author: reading?.author || '',
                    status: status,
                })
            ).unwrap();
            
            alert(result.message);
            if (session?.user.sub && isbn) {
                dispatch(fetchReadingDetail({user_id: session?.user.sub, book_isbn: isbn}));
            }
        } catch (error) {
            alert('독서 상태 변경 실패');
        }
    }

    const handleRemoveBook = async () => {
        try {
            const result = await dispatch(deleteBook({
                    user_id: session?.user.sub || '',
                    book_isbn: reading?.isbn || '',
                    book_status: reading?.status || '',
                    review_id: review.review_id || '',
                })
            ).unwrap();

            alert(result.message);
            window.location.href = '/library/reading';
        } catch (error) {
            alert('독서현황 삭제 실패');
        }
    }

    const handleUpdateLike = async () => {
        try {
            dispatch(updateLike({
                user_id: session?.user.sub || '',
                review_id: review.review_id || '',
                book_isbn: isbn || '',
                isLike: !isLiked
            }))

            // setLikeCount((prev) => isLiked ? prev - 1 : prev + 1);
            setLikeCount(isLiked ? likeCount-1 : likeCount+1)
            setIsLiked(!isLiked);
        } catch (error) {
            alert('좋아요 업데이트 실패');
        }
    }

    const confirmRemove = () => {
        setIsDelete(true);
    }

    const handleConfirmCancel = () => {
        setIsDelete(false);
    }

    const handleConfirmProceed = () => {
        setIsDelete(false);
        handleRemoveBook(); 
    }

    const comments = [
        { id: 1, content: "첫 번째 댓글 내용", nickname: "User1", date: "2025.12.24" },
        { id: 2, content: "두 번째 댓글 내용", nickname: "User2", date: "2025.12.25" },
        { id: 3, content: "세 번째 댓글 내용", nickname: "User3", date: "2025.12.26" },
    ];
    
    const replys = [
        { id: 1, commentId: 1, content: "1 대댓글", nickname: "사용자531", date: "2025.12.30" },
        { id: 2, commentId: 3, content: "2 대댓글", nickname: "사용자9989", date: "2025.12.30" },
        { id: 3, commentId: 3, content: "2 대댓글", nickname: "사용자9989", date: "2025.12.31" },
    ];

    const [isCommentVisible, setIsCommentVisible] = useState<{ [key: number]: boolean }>({});

    const toggleCommentText = (id: number) => {
        setIsCommentVisible(prevState => ({ ...prevState, [id]: !prevState[id] }))
    };

    const handleCommentCancel = (id: number) => {
        setIsCommentVisible(prevState => ({ ...prevState, [id]: false }))
    };

    return (
        <div className={styles.container}>
            <LeftMenu />

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
                {isDelete && (
                    <div className={styles.modal}>
                        <p>작성된 리뷰도 함께 삭제되며 복구할 수 없습니다. 내 서재에서 삭제할까요?</p>
                        <div className={styles.confirmBtnBox}>
                            <button onClick={handleConfirmCancel} className={styles.cancelBtn}>취소</button>
                            <button onClick={handleConfirmProceed} className={styles.confirmBtn}>확인</button>
                        </div>
                    </div>
                )}
                <div>
                    <div className={styles.bookInfo}>   
                        {reading?.cover ? (
                            <img src={reading?.cover} alt={reading?.title} className={styles.cover} />
                        ) : null}
                        <div className={styles.bookDetail}>
                            <Link href={`/detail?id=${reading?.isbn}`}>
                                <span className={styles.title}>{reading?.title}</span>
                            </Link>
                            <span className={styles.author}>{reading?.author}</span>
                            <div className={styles.statusBox}>
                                <span className={styles.label}>독서 상태</span>
                                <span className={styles.status}>{reading?.status === '0' ? '독서 중' : '독서 완료'}</span>
                            </div>
                            <div className={styles.dateBox}>
                                <span className={styles.label}>리뷰 작성</span>
                                <span className={styles.date}>{review.created_at ? review.created_at : '-'}</span>
                            </div>
                            <span className={styles.rating}>
                                {[...Array(5)].map((_, index) => (
                                    <PiStarFill 
                                        key={index}
                                        className={index < review.rating ? styles.starFill : styles.star}
                                    />
                                ))}
                            </span>
                        </div>
                    </div>

                    {review.review_id !== '' ?
                        (
                            <div>
                                <div className={styles.reviewBox}>
                                    <span className={styles.review}>{review.content}</span>
                                </div>
                                <div className={styles.reactionBox}>
                                    <span 
                                        className={styles.likeBtn}
                                        onClick={handleUpdateLike}
                                    >
                                        {isLiked ? <RiThumbUpFill className={styles.thumpsUpFill}/> : <LuThumbsUp className={styles.thumpsUp}/>}
                                        <span className={styles.likeCnt}>{likeCount}</span>
                                    </span>
                                </div>
                                <div className={styles.hrLine}></div>
                                <div className={styles.commentSection}>
                                    {comments.map((comment) => (
                                        <div className={styles.commentBox} key={comment.id}>
                                            <div className={styles.commentContent}>
                                                <div className={styles.commentInfo}>
                                                    <span className={styles.nickname}>{comment.nickname}</span>
                                                    <span className={styles.commentDate}>{comment.date}</span>
                                                    {/* 댓글 작성자 본인만 표기 
                                                    <span className={styles.commentEditBtn}>수정</span>
                                                    <span className={styles.commentDeleteBtn}>삭제</span> 
                                                    */}
                                                </div>
                                                <div className={styles.commentLine}>
                                                    <span className={styles.comment}>{comment.content}</span>
                                                    <FaRegCommentDots className={styles.commentBtn} onClick={() => toggleCommentText(comment.id)}></FaRegCommentDots>
                                                </div>
                                            </div>

                                            {/* 댓글 작성 입력창 */}
                                            {isCommentVisible[comment.id] && (
                                                <div className={styles.textAreaBox}>
                                                    <textarea 
                                                        className={styles.textarea} 
                                                        placeholder='200자 이내로 입력해주세요'
                                                        maxLength={200}
                                                        ></textarea>
                                                    <div className={styles.textAreaBtn}>
                                                        <button onClick={() => handleCommentCancel(comment.id)}>취소</button>
                                                        <button>등록</button>
                                                    </div>
                                                </div>
                                            )}
                                            
                                            {replys.filter(reply => reply.commentId === comment.id).map((reply) => (
                                                <div className={styles.reply} key={reply.id}>
                                                    <div className={styles.replyBox}>
                                                        <div className={styles.arrowBox}><span className={styles.arrow}>↳</span></div>
                                                        <div className={styles.replyContent}>
                                                            <div className={styles.commentInfo}>
                                                                <span className={styles.nickname}>{reply.nickname}</span>
                                                                <span className={styles.commentDate}>{reply.date}</span>
                                                                {/* 댓글 작성자 본인만 표기 
                                                                <span className={styles.commentEditBtn}>수정</span>
                                                                <span className={styles.commentDeleteBtn}>삭제</span> 
                                                                */}
                                                            </div>
                                                            <div className={styles.commentLine}>
                                                                <span className={styles.comment}>{reply.content}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ))}
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