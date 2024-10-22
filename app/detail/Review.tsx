'use client'

import { useState } from 'react';
import styles from './../(styles)/Detail.module.css'
import Pagination from '../(components)/Pagination'

export default function Review() {

    const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태 관리

    const handlePageChange = (selected: { selected: number }) => {
        setCurrentPage(selected.selected + 1); // 페이지 번호 업데이트
        console.log(`Current Page: ${selected.selected + 1}`); // 현재 페이지 확인
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
            {[...Array(5)].map((_, index) => (
                <div className={styles.reviewList} key={index}>
                    <div className={styles.reviewMeta}>
                        <span className={styles.score}>⭐⭐⭐⭐⭐</span>
                        <span className={styles.nickname}>닉네임</span>
                        <span className={styles.reviewDate}>2024.10.02</span>
                    </div>
                    <div className={styles.review}>
                        <span>ㅇㅇ안녕하세요안녕하세요안녕하세요안녕하세요안녕하세요안녕하세요안녕하세요안녕하세요안녕하세요안녕하세요안녕하세요안녕하세요안녕하세요안녕하세요안녕하세요안녕하세요ㅇㅇ</span>
                    </div>
                    <div className={styles.reviewActions}>
                        <span className={styles.like}>👍 0</span>
                        <span className={styles.reply}>답글 0</span>
                    </div>
                </div>
            ))}
            <Pagination 
                pageCount={5}
                onPageChange={handlePageChange}
                currentPage={currentPage}
            />
        </div>
    )
}