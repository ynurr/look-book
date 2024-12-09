import LeftMenu from "../LeftMenu";
import styles from './InquiryHistory.module.css';

export default function Inquiry() {
    const inquiries = [
        { id: 1, title: "문의글제목", date: "2024-12-08", status: "답변완료" },
        { id: 2, title: "다른문의글", date: "2024-12-07", status: "미답변" },
    ];

    return (
        <div className={styles.container}>
            <LeftMenu />

            <div className={styles.wrapper}>
                <h2 className={styles.menuTitle}>1:1 문의내역</h2>
                <div className={styles.line}></div>
                {inquiries.map((inquiry) => (
                    <div key={inquiry.id} className={styles.list}>
                        <div className={styles.item}>
                            <span className={styles.title}>{inquiry.title}</span>
                            <span className={styles.date}>{inquiry.date}</span>
                        </div>
                        <span
                            className={
                                inquiry.status === "답변완료"
                                    ? styles.statusComplete
                                    : styles.statusPending
                            }
                        >
                            {inquiry.status}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
