'use client'

import { useState } from 'react';
import styles from './../(styles)/Detail.module.css'
import Pagination from '../(components)/Pagination'
import { PiStarFill } from "react-icons/pi";

export default function Review() {

    const reivews = [
        { id: 1, content: "리뷰1", nickname: "User1", date: "2024.12.14", rating: 2 },
        { id: 2, content: "리뷰리뷰", nickname: "User2", date: "2024.12.20", rating: 5 },
        { id: 3, content: "재밌어요", nickname: "닉넴", date: "2024.12.25", rating: 4 },
        { id: 4, content: "노잼이에요..", nickname: "vdvdd", date: "2024.12.26", rating: 4 },
        { id: 5, content: "강추", nickname: "하이", date: "2025.01.26", rating: 1 },
        { id: 6, content: "인생책 인생책", nickname: "유저", date: "2025.02.26", rating: 5 },
        { id: 7, content: "꿀잼", nickname: "사용자", date: "2025.02.26", rating: 3 },
    ];

    const comments = [
        { id: 1, reviewId: 1, content: "첫 번째 댓글 내용", nickname: "User1", date: "2024.11.01" },
        { id: 2, reviewId: 2, content: "두 번째 댓글 내용", nickname: "zjql", date: "2024.11.06" },
        { id: 3, reviewId: 2, content: "두 번째 댓글 내용22", nickname: "ddww", date: "2024.11.06" },
        { id: 4, reviewId: 4, content: "세 번째 댓글 내용", nickname: "닌텐도", date: "2024.11.12" },
    ];
        
    const replys = [
        { id: 1, commentId: 1, content: "댓글 1등", nickname: "xxxxx", date: "2024.11.26" },
        { id: 2, commentId: 3, content: "두번째댓글", nickname: "유저99", date: "2024.11.30" },
        { id: 3, commentId: 3, content: "333 공감", nickname: "시계", date: "2025.01.10" },
    ];

    const [isCommentVisible, setIsCommentVisible] = useState<{ [key: number]: boolean }>({});

    const toggleCommentText = (id: number) => {
        setIsCommentVisible(prevState => ({ ...prevState, [id]: !prevState[id] }))
    };

    const handleCommentCancel = (id: number) => {
        setIsCommentVisible(prevState => ({ ...prevState, [id]: false }))
    };

    const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태 관리
    const ItemsPerPage = 5;
    const pageCount = Math.ceil(reivews.length / ItemsPerPage);
    const currentItems = reivews.slice((currentPage - 1) * ItemsPerPage, currentPage * ItemsPerPage);

    const handlePageChange = (selected: { selected: number }) => {
        setCurrentPage(selected.selected + 1);
    };

    return (
        <div className={styles.section4}>
            <div className={styles.reviewHeader}>
                <span className={styles.reviewTitle}>리뷰 (21)</span>
                <div className={styles.align}>
                    <span>최신순</span>
                    <span className={styles.separator}>|</span>
                    <span>별점높은순</span>
                    <span className={styles.separator}>|</span>
                    <span>별점낮은순</span>
                </div>
            </div>
            {currentItems.map((review) => (
                <div className={styles.reviewBox} key={review.id}>
                    <div className={styles.reviewList}>
                        <div className={styles.reviewMeta}>
                            <span className={styles.score}>
                                {[...Array(5)].map((_, index) => (
                                    <PiStarFill 
                                        key={index}
                                        className={index < review.rating ? styles.starFill : styles.star}
                                    />
                                ))}
                            </span>
                            <span className={styles.nickname}>{review.nickname}</span>
                            <span className={styles.reviewDate}>{review.date}</span>
                        </div>
                        <div className={styles.review}>
                            <span>{review.content}</span>
                        </div>
                        <div className={styles.reviewActions}>
                            <span className={styles.like}>💙 0</span>
                            <span className={styles.reply} onClick={() => toggleCommentText(review.id)}>댓글 0</span>
                        </div>
                    </div>

                    {isCommentVisible[review.id] && (
                    <>
                        <div className={styles.textAreaBox}>
                            <textarea 
                                className={styles.textarea} 
                                placeholder='200자 이내로 입력해주세요'
                                maxLength={200}
                                ></textarea>
                            <div className={styles.textAreaBtn}>
                                <button onClick={() => handleCommentCancel(review.id)}>취소</button>
                                <button>등록</button>
                            </div>
                        </div>
                   
                        <div className={styles.commentSection}>
                            {comments.filter(comment => comment.reviewId === review.id).map((comment) => (
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
                                            <span className={styles.commentBtn} onClick={() => toggleCommentText(comment.id)}>💬</span>
                                        </div>
                                    </div>
                                    
                                    {replys.filter(reply => reply.commentId === comment.id).map((reply) => (
                                        <div className={styles.reply}>
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
                            <div className={styles.line}></div>
                        </div>
                    </>
                    )}
                </div>
            ))}
            <Pagination 
                pageCount={pageCount}
                onPageChange={handlePageChange}
                currentPage={currentPage}
            />
        </div>
    )
}