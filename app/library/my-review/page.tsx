import LeftMenu from "../LeftMenu";
import styles from './myReview.module.css'
import { PiStarFill } from "react-icons/pi";

export default function Review() {

    const reviews = [
        { id: 1, title: "제목1", date: "2025.01.01", rating: 3, review: "리뷰내용입니다." },
        { id: 2, title: "제목2", date: "2025.01.02", rating: 4, review: "리뷰내용입니다." },
        { id: 3, title: "제목3", date: "2025.01.03", rating: 2, review: "리뷰내용입니다리뷰내용입니다리뷰내용입니다리뷰내용입니다리뷰내용입니다리뷰내용입니다리뷰내용입니다." },
    ];

    return (
        <div className={styles.container}>
            <LeftMenu />

            <div className={styles.wrapper}>
                <h2 className={styles.menuTitle}>나의 리뷰</h2>
                <div className={styles.line}></div>

                {reviews.map((review) => (
                    <div className={styles.list}>
                        <div className={styles.bookInfo}>
                            <div className={styles.cover}>커버</div>
                            <div className={styles.bookDetail}>
                                <span className={styles.title}>{review.title}</span>
                                <span className={styles.date}>{review.date}</span>
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
                        <div className={styles.reviewBox}>
                            <span className={styles.review}>{review.review}</span>
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