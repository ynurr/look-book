'use client'

import styles from './Detail.module.css'

export default function Review() {
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
                <div className={styles.reviewList}>
                    <div className={styles.reviewMeta}>
                        <span className={styles.score}>⭐⭐⭐⭐⭐</span>
                        <span className={styles.nickname}>닉네임</span>
                        <span className={styles.reviewDate}>2024.10.02</span>
                    </div>
                    <div className={styles.review}>
                        <span>ㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇ</span>
                    </div>
                    <div className={styles.reviewActions}>
                        <span className={styles.like}>👍 0</span>
                        <span className={styles.reply}>답글 0</span>
                    </div>
                </div>
            ))}
        </div>
    )
}