import LeftMenu from "../../LeftMenu";
import styles from './InquiryDetail.module.css';

export default function InquiryDetail() {
    return (
        <div className={styles.container}>
            <LeftMenu />

            <div className={styles.wrapper}>
                <h2 className={styles.menuTitle}>1:1 문의내역</h2>
                <div className={styles.line}></div>
               
                <div className={styles.item}>
                    <span className={styles.inquiryTitle}>문의글제목</span>
                    <span className={styles.inquiryDate}>2024.12.20</span>
                    <div className={styles.hrLine}></div>
                    <span className={styles.inquiryContent}>문의글내용내용문의글내용내용문의글내용내용문의글내용내용문의글내용내용문의글내용내용문의글내용내용문의글내용내용문의글내용내용문의글내용내용문의글내용내용문의글내용내용문의글내용내용문의글내용내용문의글내용내용문의글내용내용문의글내용내용</span>
                    <div className={styles.hrLine}></div>
                    <span className={styles.reply}>답변</span>
                    <span className={styles.responder}>관리자</span>
                    <span className={styles.replyContent}>ㅎㅇ 답변입니다.</span>
                    <span className={styles.replyDate}>2024.12.25</span>
                </div>
            </div>
        </div>
    );
}
