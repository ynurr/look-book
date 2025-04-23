'use client'

import { isToday, isYesterday, differenceInHours, format } from 'date-fns';
import BarChart from "./BarChart";
import LeftMenu from "./LeftMenu";
import styles from './Library.module.css'
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { fetchReviewAll } from '@/store/slices/reviewSlice';
import { useEffect } from 'react';
import Link from 'next/link';
import { fetchCommentList } from '@/store/slices/commentSlice';
import { fetchReadingBook } from '@/store/slices/readingSlice';
import { FaPen } from "react-icons/fa";
import Image from 'next/image';
import { URLS } from '@/util/url';

export default function Library() {
    
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (!session && status !== 'loading') {
            router.push('/login');
            return;
        }
    }, [session, status, router])

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
    const goal = useSelector((state: RootState) => state.stat.goal);
    const nickname = useSelector((state: RootState) => state.stat.nickname);

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
            <div className={styles.leftMenu}>
                <LeftMenu />
            </div>
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

                    <div className={styles.mobileStatGroup}>
                        <span className={styles.statTitle}>👋 {nickname} 님
                            <Link href={URLS.profile.edit} legacyBehavior>
                                <FaPen className={styles.penIcon} />
                            </Link>
                        </span>
                        <div className={styles.statBox}>
                            <span className={styles.stat}>✍ 작성한 리뷰 <span className={styles.redText}>{reviewCount}권</span></span>
                            <span className={styles.stat}>📚 지금까지 읽은 책 <span className={styles.redText}>{bookCount}권</span></span>
                            <span className={styles.stat}>👀 마지막 독서 
                                <span className={styles.redText}>
                                    {reviewCount === 0 && bookCount === 0 ? 
                                    ' -일 전' : lastRead == '0' ? ' 오늘' : ' '+lastRead+'일 전'}
                                </span>
                            </span> 
                            <div className={styles.goalBox}>
                                <progress value={bookCount} max={goal} className={styles.progressBar}></progress>
                                <span>{Math.round((bookCount / goal) * 100)}%</span>
                            </div>
                        </div>
                    </div>

                    <div className={styles.mobileStatGroup2}>
                        <span className={styles.statTitle}>📊 독서 리포트</span>
                        <div className={styles.statBox}>
                            <div className={styles.profile}>
                                <span className={styles.nickname}>{nickname} 님</span>
                                <Link href={URLS.profile.edit} className={styles.editBtn}>
                                    프로필 수정
                                </Link>
                            </div>

                            <div className={styles.goalBox}>
                                <span>🎯 독서 목표 : {goal}권</span>
                                <progress value={bookCount} max={goal} className={styles.progressBar}></progress>
                                <span>{Math.round((bookCount / goal) * 100)}% 달성</span>
                            </div>

                            <div className={styles.statInner}>
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
                    </div>

                    <div className={styles.statGroup}>
                        <span className={styles.statTitle}>📈 월별 독서량을 확인해보세요!</span>
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
                                <p>작성된 리뷰가 없습니다.</p>
                            </div>
                            :
                            reviews.map((item) => (
                                <Link href={URLS.library.readingDetail(item.isbn)} className={styles.reviewItem} key={item.review_id}>
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
                                    <p>작성 가능한 책이 없습니다.</p>
                                </div>
                                :
                                <>
                                {CompletedBook?.book_isbn && (
                                    <Link href={URLS.library.readingDetail(CompletedBook.book_isbn)}>
                                    {CompletedBook?.book_cover ? ( 
                                        <Image
                                            className={styles.cover}
                                            src={CompletedBook?.book_cover}
                                            alt={"도서 이미지"}
                                            width={110}
                                            height={160}
                                            sizes="(max-width: 480px) 90px, 110px"
                                            />
                                    ) : null}
                                    </Link>
                                )}
                                <Link href={URLS.library.reading}>
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
                                    <p>읽고 있는 책이 없습니다.</p>
                                </div>
                                :
                                <>
                                {ReadingBook?.book_isbn && (
                                    <Link href={URLS.library.readingDetail(ReadingBook.book_isbn)}>
                                    {ReadingBook?.book_cover ? ( 
                                        <Image
                                        className={styles.cover}
                                            src={ReadingBook?.book_cover}
                                            alt={"도서 이미지"}
                                            width={110}
                                            height={160}
                                            sizes="(max-width: 480px) 90px, 110px"
                                        />
                                    ) : null}
                                    </Link>
                                )}
                                <Link href={URLS.library.reading}>
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
                                        <p>댓글이 없습니다.</p>
                                    </div>
                                    :
                                    comments.map((comment, index) => (
                                        <div className={styles.commentItem} key={index}>
                                            <div className={styles.commentInfo}>
                                                <span className={styles.commenter}>{formatNickname(comment.nickname)}</span>
                                                <span className={styles.commentTime}>{formatCommentDate(comment.created_at)}</span>
                                            </div>
                                            <p className={styles.commentContent}>{comment.content}</p>
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