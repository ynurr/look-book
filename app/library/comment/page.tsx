import Link from "next/link";
import LeftMenu from "../LeftMenu";
import styles from './Comment.module.css';
import { isToday, isYesterday, differenceInHours, format } from 'date-fns';

export default function Comment() {
    const comments = [
        { id: 1, commenter: "김ㅇㅇ", title: "리뷰제목", content: "ddd", date: "2024-12-09", type: "1" },
        { id: 2, commenter: "eee", title: "어쩌구댓글", content: "댓글임", date: "2024-12-05", type: "2" },
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
                <h2 className={styles.menuTitle}>코멘트</h2>
                <div className={styles.line}></div>
               
                <div className={styles.list}>
                    {comments.map((data) => (
                        <div className={styles.item} key={data.id}>
                            <div className={styles.box}>
                                <span className={styles.title}>{data.title}</span>
                                <span className={styles.info}>
                                    {
                                        data.type === "1" ? "글의 댓글" : "댓글의 답댓글"
                                    }
                                </span>
                            </div>
                            <Link href={`/library/review/1`}>
                                <span className={styles.content}>{data.content}</span>
                            </Link>
                            <div className={styles.box}>
                                <span className={styles.commenter}>{data.commenter}</span>
                                <span>·</span>
                                <span className={styles.date}>{formatCommentTime(data.date)}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
