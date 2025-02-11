'use client'

import { isToday, isYesterday, differenceInHours, format } from 'date-fns';
import BarChart from "./BarChart";
import LeftMenu from "./LeftMenu";
import styles from './Library.module.css'
import { redirect } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { fetchReviewAll } from '@/store/slices/reviewSlice';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchCommentList } from '@/store/slices/commentSlice';
import { fetchReadingBook } from '@/store/slices/readingSlice';
import { fetchUserStat } from '@/store/slices/statSlice';

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
    const bookCount = useSelector((state: RootState) => state.stat.bookCount);
    const reviewCount = useSelector((state: RootState) => state.stat.reviewCount);
    const lastRead = useSelector((state: RootState) => state.stat.lastRead);

    useEffect(() => {
        if (status === "authenticated" && session?.user.sub) {
            dispatch(fetchReviewAll({ user_id: session.user.sub, limit: 3 }))
            dispatch(fetchCommentList({ user_id: session.user.sub, limit: 3 }))
            dispatch(fetchReadingBook({ user_id: session.user.sub }))
            dispatch(fetchUserStat({ user_id: session.user.sub }))
        }
    }, [session, dispatch])


    const formatCommentDate = (date: string) => {
        const newDate = new Date(date).toLocaleString("en-US", { timeZone: "Asia/Seoul" });
        const now = new Date().toLocaleString("en-US", { timeZone: "Asia/Seoul" });

        if (isToday(newDate)) {
            const hour = differenceInHours(now, newDate);
            if (hour === 0) {
                return '조금 전';
            }
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
                    <div className={styles.statGroup}>
                        <span className={styles.statTitle}>📊 독서 리포트</span>
                        <div className={styles.statBox}>
                            <span className={styles.stat}>✍ 작성한 리뷰 <span className={styles.redText}>{reviewCount}권</span></span>
                            <span className={styles.stat}>📚 지금까지 읽은 책 <span className={styles.redText}>{bookCount}권</span></span> 
                            <span className={styles.stat}>👀 마지막 독서 
                                <span className={styles.redText}>
                                    {reviewCount === 0 && bookCount === 0 ? 
                                    ' -일 전' : lastRead == '0' ? ' 오늘' : ' '+lastRead+'일 전'}
                                </span>
                            </span> 
                        </div>
                    </div>
                    <div className={styles.statGroup}>
                        <span className={styles.statTitle}>📈 이번 달 독서량을 확인해보세요!</span>
                        <div className={styles.barChart}>
                            <BarChart />
                        </div>
                    </div>
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
                            {CompletedCnt === 0 ?
                                <div className={styles.noBookData}>
                                    <span>작성 가능한 책이 없습니다.</span>
                                </div>
                                :
                                <>
                                <Link href={`/library/reading/detail?isbn=${CompletedBook?.book_isbn}`}>
                                    <img className={styles.cover} src={CompletedBook?.book_cover} />
                                </Link>
                                <Link href={'/library/reading'}>
                                    <div className={styles.count}>{CompletedCnt > 99 ? "99 +" : `+ ${CompletedCnt === 0 ? 0 : CompletedCnt - 1}`}</div>
                                </Link>
                                </>
                            }
                        </div>
                    </div>
                    <div className={styles.summary}>
                        <div className={styles.menuTitle}>읽고 있는 책</div>
                        <div className={styles.content}>
                            {ReadingCnt === 0 ?
                                <div className={styles.noBookData}>
                                    <span>읽고 있는 책이 없습니다.</span>
                                </div>
                                :
                                <>
                                <Link href={`/library/reading/detail?isbn=${ReadingBook?.book_isbn}`}>
                                    <img className={styles.cover} src={ReadingBook?.book_cover} />
                                </Link>
                                <Link href={'/library/reading'}>
                                    <div className={styles.count}>{ReadingCnt > 99 ? "99 +" : `+ ${ReadingCnt === 0 ? 0 : ReadingCnt - 1}`}</div>
                                </Link>
                                </>
                            }
                        </div>
                    </div>
                    <div className={styles.summary}>
                        <div className={styles.menuTitle}>최근 댓글</div>
                        <div className={styles.content}>
                            <div className={styles.commentList}>
                                {comments.length === 0 ?
                                    <div className={styles.noCommentData}>
                                        <span>댓글이 없습니다.</span>
                                    </div>
                                    :
                                    comments.map((comment, index) => (
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
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}