import BarChart from './BarChart'
import DoughnutChart from './DoughnutChart'
import styles from './Library.module.css'
import ProgressBar from './ProgressBar'

export default function Library() {
    return (
        <div className={styles.container}>
            <div className={styles.gridContainer}>
                <div className={styles.item1}>
                    <span className={styles.nickname}>신유 님</span>
                    <span className={styles.stat}>현재 내 랭킹 <span className={styles.redText}>0권</span></span>
                    <span className={styles.stat}>리뷰 작성 <span className={styles.redText}>0권</span></span>
                    <span className={styles.stat}>지금까지 읽은 책 <span className={styles.redText}>0권</span></span> 
                    <span className={styles.stat}>마지막 독서 <span className={styles.redText}>3일 전</span></span> 
                </div>
                
                <div className={styles.item2Container}>
                    <div className={styles.item2}>
                        <span className={styles.graphStat}>지난 달보다 <span className={styles.redText}>0권</span> 더 읽었어요!</span>
                        <div className={styles.barChart}>
                            <BarChart />
                        </div>
                    </div>
                    <div className={styles.item2}>
                        <div className={styles.progressBar}>
                            <span >리뷰 작성률</span>
                            <ProgressBar />
                        </div>
                    </div>
                    <div className={styles.item2}>
                        <div className={styles.doughnutChart}>
                            <DoughnutChart />
                        </div>
                    </div>
                </div>
        
                <div className={styles.item3Container}>
                    <span className={styles.menuTitle}>내가 쓴 리뷰</span>
                    <div className={styles.item3}>
                        <div className={styles.reviewItem}>
                            <span className={styles.bookTitle}>책 제목</span>
                            <span className={styles.reviewContent}>어쩌구저쩌구 리뷰입니다.</span>
                            <span className={styles.reviewDate}>2024.11.02</span>
                            {/* {[...Array(3)].map((_, index) => (
                                <div className={styles.reviewItem} key={index}></div>
                            ))} */}
                        </div>
                        <div className={styles.reviewItem}></div>
                        <div className={styles.reviewItem}></div>
                    </div>
                </div>

                <div className={styles.item4}>
                    <span className={styles.menu1}>내 서재</span>
                    <span className={styles.reading}>읽고 있는/다 읽은 책</span>
                    <span className={styles.wishlist}>찜 목록</span>
                    <span className={styles.report}>독서 리포트</span>
                    <span className={styles.menu2}>활동</span>
                    <span className={styles.review}>리뷰</span>
                    <span className={styles.comment}>코멘트</span>
                    <span className={styles.menu2}>고객센터</span>
                    <span className={styles.inquiry}>1:1 문의내역</span>
                </div>

                <div className={styles.item5Container}>
                    <div className={styles.item5}>
                        <div className={styles.menuTitle}>리뷰쓰기</div>
                        <div className={styles.content}>
                            <div className={styles.cover}></div>
                            <div className={styles.count}>+ 3</div>
                        </div>
                    </div>
                    <div className={styles.item5}>
                        <div className={styles.menuTitle}>읽고 있는 책</div>
                        <div className={styles.content}>
                            <div className={styles.cover}></div>
                            <div className={styles.count}>+ 3</div>
                        </div>
                    </div>
                    <div className={styles.item5}>
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