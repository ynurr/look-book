'use client'

import { useState } from 'react';
import styles from './../(styles)/Detail.module.css'
import Pagination from '../(components)/Pagination'

export default function Review() {

    const comments = [
        { id: 1, content: "리뷰1", nickname: "User1", date: "2024.12.14" },
        { id: 2, content: "리뷰리뷰", nickname: "User2", date: "2024.12.20" },
        { id: 3, content: "재밌어요", nickname: "닉넴", date: "2024.12.25" },
        { id: 4, content: "노잼이에요..", nickname: "vdvdd", date: "2024.12.26" },
        { id: 5, content: "강추", nickname: "하이", date: "2025.01.26" },
        { id: 6, content: "인생책 인생책", nickname: "유저", date: "2025.02.26" },
        { id: 7, content: "꿀잼", nickname: "사용자", date: "2025.02.26" },
    ];

    const [isCommentVisible, setIsCommentVisible] = useState<{ [key: number]: boolean }>({});
    const [isReplyVisible, setIsReplyVisible] = useState<{ [key: number]: boolean}>({});

    const toggleCommentText = (id: number) => {
        setIsCommentVisible(prevState => ({ ...prevState, [id]: !prevState[id] }))
    };

    const toggleReplyText = (id: number) => {
        setIsReplyVisible(prevState => ({ ...prevState, [id]: !prevState[id] }))
    };
    
    const handleCommentCancel = (id: number) => {
        setIsCommentVisible(prevState => ({ ...prevState, [id]: false }))
    };

    const handleReplyCancel = (id: number) => (
        setIsReplyVisible(prevState => ({ ...prevState, [id]: false }))
    );

    const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태 관리
    const ItemsPerPage = 5;
    const pageCount = Math.ceil(comments.length / ItemsPerPage);
    const currentItems = comments.slice((currentPage - 1) * ItemsPerPage, currentPage * ItemsPerPage);

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
            {currentItems.map((comment) => (
                <div className={styles.reviewBox}>
                    <div className={styles.reviewList} key={comment.id}>
                        <div className={styles.reviewMeta}>
                            <span className={styles.score}>⭐⭐⭐⭐⭐</span>
                            <span className={styles.nickname}>{comment.nickname}</span>
                            <span className={styles.reviewDate}>{comment.date}</span>
                        </div>
                        <div className={styles.review}>
                            <span>{comment.content}</span>
                        </div>
                        <div className={styles.reviewActions}>
                            <span className={styles.like}>💙 0</span>
                            <span className={styles.reply} onClick={() => toggleCommentText(comment.id)}>댓글 0</span>
                        </div>
                    </div>

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