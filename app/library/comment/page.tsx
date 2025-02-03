'use client'

import LeftMenu from "../LeftMenu";
import styles from './Comment.module.css';
import { isToday, isYesterday, differenceInHours, format } from 'date-fns';
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Comment {
    gubun: string;
    isbn: string;
    book_title: string;
    content: string;
    created_at: string;
    nickname: string;
    user_id: string;
}

export default function Comment() {

    const { data: session, status } = useSession();
    const [comments, setComments] = useState<Comment[]>([]);

    useEffect(() => {
        if (status === "authenticated" && session?.user.sub) {
            const fetchComments = async () => {
                try {
                    const response = await fetch('/api/db/comment/list', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ user_id: session?.user.sub })
                    });
            
                    if (!response.ok) {
                        throw new Error('댓글 조회 실패');
                    }
            
                    const data = await response.json();
                    setComments(data.result);
            
                    console.log("📌: " + JSON.stringify(data.result, null, 2));
                } catch (error) {
                    console.error('Fetch error:', error);
                }
            };
        
            fetchComments();
        }
    }, [session]);

    const formatCommentDate = (date: string) => {
        const newDate = new Date(date).toLocaleString("en-US", { timeZone: "Asia/Seoul" });
        const now = new Date().toLocaleString("en-US", { timeZone: "Asia/Seoul" });

        if (isToday(newDate)) {
            const hour = differenceInHours(now, newDate);
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

    return (
        <div className={styles.container}>
            <LeftMenu />

            <div className={styles.wrapper}>
                <h2 className={styles.menuTitle}>코멘트</h2>
                <div className={styles.line}></div>
               
                <div className={styles.list}>
                    {comments.map((item, i) => (
                        <div className={styles.item} key={i}>
                            <Link href={`/detail?id=${item.isbn}`} legacyBehavior>
                                <div className={styles.itemWrapper}>
                                    <div className={styles.box}>
                                        <span className={styles.title}>{formatBookTitle(item.book_title)}</span>
                                        <span className={styles.info}>
                                            {
                                                item.gubun === "comment" ? "글의 댓글" : "댓글의 답댓글"
                                            }
                                        </span>
                                    </div>
                                    <span className={styles.content}>{item.content}</span>
                                    <div className={styles.box}>
                                        <span className={styles.commenter}>{item.nickname}</span>
                                        <span>·</span>
                                        <span className={styles.date}>{formatCommentDate(item.created_at)}</span>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
