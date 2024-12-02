import BarChart from "./BarChart";
import DoughnutChart from "./DoughnutChart";
import ProgressBar from "./ProgressBar";
import LeftMenu from "./LeftMenu";
import styles from './Library.module.css'

export default function Library() {
    return (
        <div className={styles.container}>
            <LeftMenu />

            <div className={styles.wrapper}>
                <div className={styles.statSection}>
                    <div className={styles.statItem}>
                        <span className={styles.graphStat}>지난 달보다 <span className={styles.redText}>0권</span> 더 읽었어요!</span>
                        <div className={styles.barChart}>
                            <BarChart />
                        </div>
                    </div>
                    <div className={styles.statItem}>
                        <div className={styles.progressBar}>
                            <span >리뷰 작성률</span>
                            <ProgressBar />
                        </div>
                    </div>
                    <div className={styles.statItem}>
                        <div className={styles.doughnutChart}>
                            <DoughnutChart />
                        </div>
                    </div>
                </div>

                <div className={styles.reviewSection}>
                    <span className={styles.menuTitle}>내가 쓴 리뷰</span>
                    <div className={styles.reviewsList}>
                        <div className={styles.reviewItem}>
                            <span className={styles.bookTitle}>책 제목</span>
                            <span className={styles.reviewContent}>어쩌구저쩌구 리뷰입니다.</span>
                            <span className={styles.reviewDate}>2024.11.02</span>
                        </div>
                        <div className={styles.reviewItem}></div>
                        <div className={styles.reviewItem}></div>
                    </div>
                </div>

                <div className={styles.summarySection}>
                    <div className={styles.summary}>
                        <div className={styles.menuTitle}>리뷰쓰기</div>
                        <div className={styles.content}>
                            <div className={styles.cover}></div>
                            <div className={styles.count}>+ 3</div>
                        </div>
                    </div>
                    <div className={styles.summary}>
                        <div className={styles.menuTitle}>읽고 있는 책</div>
                        <div className={styles.content}>
                            <div className={styles.cover}></div>
                            <div className={styles.count}>+ 3</div>
                        </div>
                    </div>
                    <div className={styles.summary}>
                        <div className={styles.menuTitle}>최근 코멘트</div>
                        <div className={styles.content}>
                            <div className={styles.commentList}>
                                <div className={styles.commentItem}>
                                    <span className={styles.commenter}>김ㅁㅁ</span>
                                    <span className={styles.commentContent}>댓글 내용 댓글 내용 댓글 내용 댓글 내용 댓글 내용 </span>
                                </div>
                                <div className={styles.commentItem}>
                                    <span className={styles.commenter}>김ㅁㅁ</span>
                                    <span className={styles.commentContent}>댓글 내용 댓글 내용 댓글 내용 댓글 내용 댓글 내용 </span>
                                </div>
                                <div className={styles.commentItem}>
                                    <span className={styles.commenter}>김ㅁㅁ</span>
                                    <span className={styles.commentContent}>댓글 내용 댓글 내용 댓글 내용 댓글 내용 댓글 내용 댓글 내용 댓글 내용 댓글 내용 </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}