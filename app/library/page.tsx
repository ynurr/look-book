'use client'

import { isToday, isYesterday, differenceInHours, format } from 'date-fns';
import BarChart from "./BarChart";
import ProgressBar from "./ProgressBar";
import LeftMenu from "./LeftMenu";
import styles from './Library.module.css'
import { redirect } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { fetchReviewAll } from '@/store/slices/reviewSlice';
import { useEffect } from 'react';
import Link from 'next/link';
import { fetchCommentList } from '@/store/slices/commentSlice';
import { fetchReadingBook } from '@/store/slices/readingSlice';

export default function Library() {
    
    const { data: session, status } = useSession();

    if (!session && status !== "loading") {
        redirect('/login');
    }

    const dispatch = useDispatch<AppDispatch>();
    const reviews = useSelector((state: RootState) => state.review.reviews || []);
    const comments = useSelector((state: RootState) => state.comment.commentList || []);
    const ReadingBook = useSelector((state: RootState) => state.readingStatus.readingBook);
    const CompletedBook = useSelector((state: RootState) => state.readingStatus.completedBook);
    const ReadingCnt = useSelector((state: RootState) => state.readingStatus.readingCount);
    const CompletedCnt = useSelector((state: RootState) => state.readingStatus.completedCount);

    useEffect(() => {
        if (status === "authenticated" && session?.user.sub) {
            dispatch(fetchReviewAll({ user_id: session.user.sub, limit: 3 }))
            dispatch(fetchCommentList({ user_id: session.user.sub, limit: 3 }))
            dispatch(fetchReadingBook({ user_id: session.user.sub }))
        }
    }, [session, dispatch])

    const formatCommentDate = (date: string) => {
        const newDate = new Date(date).toLocaleString("en-US", { timeZone: "Asia/Seoul" });
        const now = new Date().toLocaleString("en-US", { timeZone: "Asia/Seoul" });

        if (isToday(newDate)) {
            const hour = differenceInHours(now, newDate);
            return `${hour}시간 전`;
        } else if (isYesterday(newDate)) {
            return "어제";
        } else {
            return format(newDate, 'yyyy.MM.dd');
        }
    };

    const formatNickname = (nickname: string) => {
        if (nickname.length > 10) {
            return nickname.slice(0, 10) + '...';
        }
        return nickname;
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
                                <Link href={`/library/reading/detail?isbn=${item.isbn}`} className={styles.reviewItem} key={item.review_id}>
                                    <span className={styles.bookTitle}>{item.title}</span>
                                    <span className={styles.reviewContent}>{item.content}</span>
                                    <span className={styles.reviewDate}>{item.created_at}</span>
                                </Link>

                            ))
                        }
                    </div>
                </div>

                <div className={styles.summarySection}>
                    <div className={styles.summary}>
                        <div className={styles.menuTitle}>리뷰 쓰기</div>
                        <div className={styles.content}>
                            <Link href={`/library/reading/detail?isbn=${CompletedBook?.book_isbn}`}>
                                <img className={styles.cover} src={CompletedBook?.book_cover} />
                            </Link>
                            <Link href={'/library/reading'}>
                                <div className={styles.count}>{CompletedCnt > 99 ? "99 +" : `+ ${CompletedCnt === 0 ? 0 : CompletedCnt - 1}`}</div>
                            </Link>
                        </div>
                    </div>
                    <div className={styles.summary}>
                        <div className={styles.menuTitle}>읽고 있는 책</div>
                        <div className={styles.content}>
                            <Link href={`/library/reading/detail?isbn=${ReadingBook?.book_isbn}`}>
                                <img className={styles.cover} src={ReadingBook?.book_cover} />
                            </Link>
                            <Link href={'/library/reading'}>
                                <div className={styles.count}>{ReadingCnt > 99 ? "99 +" : `+ ${ReadingCnt === 0 ? 0 : ReadingCnt - 1}`}</div>
                            </Link>
                        </div>
                    </div>
                    <div className={styles.summary}>
                        <div className={styles.menuTitle}>최근 댓글</div>
                        <div className={styles.content}>
                            <div className={styles.commentList}>
                                {comments.map((comment, index) => (
                                    <div className={styles.commentItem} key={index}>
                                        <div className={styles.commentInfo}>
                                            <span className={styles.commenter}>{formatNickname(comment.nickname)}</span>
                                            <span className={styles.commentTime}>{formatCommentDate(comment.created_at)}</span>
                                        </div>
                                        <span className={styles.commentContent}>{comment.content}</span>
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