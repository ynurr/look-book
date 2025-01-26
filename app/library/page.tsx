'use client'

import { isToday, isYesterday, differenceInHours, format } from 'date-fns';
import BarChart from "./BarChart";
import DoughnutChart from "./DoughnutChart";
import ProgressBar from "./ProgressBar";
import LeftMenu from "./LeftMenu";
import styles from './Library.module.css'
import { redirect } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { fetchReviewAll } from '@/store/slices/reviewSlice';
import { useEffect } from 'react';

export default function Library() {
    
    const { data: session, status } = useSession();

    if (!session && status !== "loading") {
        redirect('/login');
    }

    const dispatch = useDispatch<AppDispatch>();
    const reviews = useSelector((state: RootState) => state.review.reviews || []);

    useEffect(() => {
        if (status === "authenticated" && session?.user.sub) {
            dispatch(fetchReviewAll({ user_id: session.user.sub, limit: 3 }))
        }
    }, [session, dispatch])

    const comments = [
        { commenter: "김도훈", commentTime: "2024-12-04 16:01:18", commentContent: "너무 재밌어요" },
        { commenter: "박지훈", commentTime: "2024-12-03 15:45:18", commentContent: "재밌게 봤습니다" },
        { commenter: "최유정", commentTime: "2024-11-30 12:30:18", commentContent: "감동적이에요" },
    ];

    const formatCommentTime = (commentTime: string) => {
        const commentDate = new Date(commentTime);
        const now = new Date();

        if (isToday(commentDate)) {
            const hour = differenceInHours(now, commentDate);
            return `${hour}시간 전`;
        } else if (isYesterday(commentDate)) {
            return "어제";
        } else {
            return format(commentDate, "yyyy-MM-dd");
        }
    };

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
                    {/* <div className={styles.statItem}>
                        <div className={styles.doughnutChart}>
                            <DoughnutChart />
                        </div>
                    </div> */}
                </div>

                <div className={styles.reviewSection}>
                    <span className={styles.menuTitle}>내가 쓴 리뷰</span>
                    <div className={styles.reviewsList}>
                        {reviews.length === 0 ?
                            <div className={styles.noData}>
                                <span>작성된 리뷰가 없습니다.</span>
                            </div>
                            :
                            reviews.map((item) => (
                                <div className={styles.reviewItem} key={item.review_id}>
                                    <span className={styles.bookTitle}>{item.title}</span>
                                    <span className={styles.reviewContent}>{item.content}</span>
                                    <span className={styles.reviewDate}>{item.created_at}</span>
                                </div>

                            ))
                        }

                        {/* <div className={styles.reviewItem}></div>
                        <div className={styles.reviewItem}></div> */}


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
                        <div className={styles.menuTitle}>최근 댓글</div>
                        <div className={styles.content}>
                            <div className={styles.commentList}>
                                {comments.map((comment, index) => (
                                    <div className={styles.commentItem} key={index}>
                                        <div className={styles.commentInfo}>
                                            <span className={styles.commenter}>김도훈</span>
                                            <span className={styles.commentTime}>{formatCommentTime(comment.commentTime)}</span>
                                        </div>
                                        <span className={styles.commentContent}>너무 재밌어요</span>
                                        {
                                            index < 2 && <div className={styles.hrLine}></div>
                                        }
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}