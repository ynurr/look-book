'use client'

import { useState } from 'react';
import LeftMenu from '../LeftMenu';
import styles from './WriteReview.module.css'

export default function WriteReview() {

    const [rating, setRating] = useState(0);

    const handleRating = (star: number) => {
        setRating(star)
    };

    return (
        <div className={styles.container}>
            <LeftMenu />

            <div className={styles.wrapper}>
                <h2 className={styles.menuTitle}>리뷰 쓰기</h2>
                <div className={styles.line}></div>
                <div className={styles.bookInfo}>   
                    <div className={styles.cover}>커버</div>
                    <div className={styles.bookDetail}>
                        <span className={styles.title}>제목</span>
                        <span className={styles.author}>작가</span>
                        {/* 별점 선택 */}
                        <div className={styles.rating}>
                            {[1,2,3,4,5].map((star) => (
                                <span
                                    key={star}
                                    className={`${styles.star} ${star <= rating ? styles.selected : ''}`}
                                    onClick={() => handleRating(star)}
                                >★</span>
                            ))}
                        </div>
                    </div>
                </div>
                <textarea className={styles.review} maxLength={1000}></textarea>
                <div className={styles.btnBox}>
                    <button className={styles.btn}>등록</button>
                </div>
            </div>
        </div>
    )
}