'use client'

import { AppDispatch, RootState } from "@/store/store";
import LeftMenu from "../LeftMenu";
import styles from './Comment.module.css';
import { isToday, isYesterday, differenceInHours, format } from 'date-fns';
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCommentList } from "@/store/slices/commentSlice";
import Pagination from "@/app/components/Pagination";
import { URLS } from '@/util/url';

export default function Comment() {

    const { data: session, status } = useSession();
    const dispatch = useDispatch<AppDispatch>();
    const comments = useSelector((state: RootState) => state.comment.commentList || []);

    useEffect(() => {
        if (status === "authenticated" && session?.user.sub) {
            dispatch(fetchCommentList({ user_id: session?.user.sub, limit: 0 }));
        }
    }, [session, dispatch]);

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
            return format(newDate, 'yyyy.MM.dd HH:mm:ss');
        }
    };

    const formatBookTitle = (title: string) => {
        if (title.length > 30) {
            return title.slice(0, 30) + '...';
        }
        return title;
    };

    const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태 관리
    const ItemsPerPage = 6;
    const pageCount = Math.ceil(comments.length / ItemsPerPage);
    const currentItems = comments.slice((currentPage - 1) * ItemsPerPage, currentPage * ItemsPerPage);

    const handlePageChange = (selected: { selected: number }) => {
        setCurrentPage(selected.selected + 1);
    };
    
    return (
        <div className={styles.container}>
            <div className={styles.leftMenu}>
                <LeftMenu />
            </div>
            <div className={styles.wrapper}>
                <div className={styles.topBox}>
                    <h2 className={styles.menuTitle}>댓글 알림</h2>
                    <span className={styles.infoMsg}>30일 이내 댓글만 조회됩니다</span>
                </div>
                <div className={styles.line}></div>
               
                <div className={styles.list}>
                    {comments.length === 0 ?
                        <div className={styles.noData}>
                            <p>댓글 알림이 없습니다.<br />새로운 댓글이 달리면 알려드릴게요.</p>
                        </div>
                        :
                        currentItems.map((item, i) => (
                            <div className={styles.item} key={i}>
                                <Link href={URLS.book.bookDetail(item.isbn)} legacyBehavior>
                                    <div className={styles.itemWrapper}>
                                        <div className={styles.box}>
                                            <span className={styles.title}>{formatBookTitle(item.book_title)}</span>
                                            <span className={styles.info}>
                                                {
                                                    item.gubun === "comment" ? "리뷰의 댓글" : "댓글의 답댓글"
                                                }
                                            </span>
                                        </div>
                                        <p className={styles.content}>{item.content}</p>
                                        <div className={styles.box}>
                                            <span className={styles.commenter}>{item.nickname}</span>
                                            <span>·</span>
                                            <span className={styles.date}>{formatCommentDate(item.created_at)}</span>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))
                    }
                    <Pagination
                        pageCount={pageCount}
                        onPageChange={handlePageChange}
                        currentPage={currentPage}
                    />
                </div>
            </div>
        </div>
    );
}
