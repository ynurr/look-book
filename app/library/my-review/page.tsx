import LeftMenu from "../LeftMenu";
import styles from './myReview.module.css'

export default function Review() {
    return (
        <div className={styles.container}>
            <LeftMenu />

            <div className={styles.wrapper}>
                <h2 className={styles.menuTitle}>나의 리뷰</h2>
                <div className={styles.line}></div>

                {[...Array(3)].map((_, index) => (
                    <div className={styles.list}>
                        <div className={styles.bookInfo}>
                            <div className={styles.cover}>커버</div>
                            <div className={styles.bookDetail}>
                                <span className={styles.title}>제목</span>
                                <span className={styles.date}>2025.01.01</span>
                                <span className={styles.star}>⭐⭐⭐⭐⭐</span>
                            </div>
                        </div>
                        <div className={styles.reviewBox}>
                            <span className={styles.review}>리뷰내용입니다 리뷰내용입니다 리뷰내용입니다 리뷰내용입니다 리뷰내용입니다 리뷰내용입니다 리뷰내용입니다 리뷰내용입니다 리뷰내용입니다 리뷰내용입니다 리뷰내용입니다 리뷰내용입니다 리뷰내용입니다 리뷰내용입니다 리뷰내용입니다 리뷰내용입니다 리뷰내용입니다 리뷰내용입니다 리뷰내용입니다 리뷰내용입니다 리뷰내용입니다 리뷰내용입니다 리뷰내용입니다 리뷰내용입니다 리뷰내용입니다 리뷰내용입니다 리뷰내용입니다 리뷰내용입니다 리뷰내용입니다 리뷰내용입니다 리뷰내용입니다 리뷰내용입니다 리뷰내용입니다 리뷰내용입니다 리뷰내용입니다 리뷰내용입니다 리뷰내용입니다 </span>
                        </div>
                        <div className={styles.reactionBox}>
                            <span className={styles.likeCnt}>💙 0</span>
                            <span className={styles.commentCnt}>💬 0</span>
                        </div>
                        <div className={styles.hrLine}></div>
                    </div>
                ))}
            </div>
        </div>
    )
}