'use client'

import { useState } from 'react'
import LeftMenu from '../../LeftMenu'
import styles from './ReviewDetail.module.css'
import { PiStarFill } from "react-icons/pi";
import { LuThumbsUp } from "react-icons/lu";
import { RiThumbUpFill } from "react-icons/ri";
import { FaRegCommentDots } from "react-icons/fa";

export default function ReviewDetail() {

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
            <h2 className={styles.menuTitle}>나의 리뷰</h2>
            <div className={styles.line}></div>
                <div>
                    <div className={styles.bookInfo}>   
                        <div className={styles.cover}>커버</div>
                        <div className={styles.bookDetail}>
                            <span className={styles.title}>제목</span>
                            <span className={styles.author}>작가</span>
                            <span className={styles.date}>2025.01.01</span>
                            <span className={styles.rating}>
                                {[...Array(5)].map((_, index) => (
                                    <PiStarFill 
                                        key={index}
                                        className={ styles.starFill}
                                    />
                                ))}
                            </span>
                        </div>
                    </div>
                    <div className={styles.reviewBox}>
                        <span className={styles.review}>리뷰내용입니다 리뷰내용입니다 리뷰내용입니다 리뷰내용입니다 리뷰내용입니다 리뷰내용입니다 리뷰내용입니다 리뷰내용입니다 리뷰내용입니다 리뷰내용입니다 리뷰내용입니다 리뷰내용입니다 리뷰내용입니다 리뷰내용입니다 리뷰내용입니다 리뷰내용입니다 리뷰내용입니다 리뷰내용입니다 리뷰내용입니다 리뷰내용입니다 리뷰내용입니다 리뷰내용입니다 리뷰내용입니다 리뷰내용입니다 리뷰내용입니다 리뷰내용입니다 리뷰내용입니다 리뷰내용입니다 리뷰내용입니다 리뷰내용입니다 리뷰내용입니다 리뷰내용입니다 리뷰내용입니다 리뷰내용입니다 리뷰내용입니다 리뷰내용입니다 리뷰내용입니다 </span>
                    </div>
                    <div className={styles.reactionBox}>
                        <span className={styles.likeCnt}><LuThumbsUp /> 0</span>
                    </div>
                    <div className={styles.hrLine}></div>
                    <div className={styles.commentSection}>
                        {comments.map((comment) => (
                            <div className={styles.commentBox}>
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
                    </div>
                </div>
            </div>
        </div>
    )
}