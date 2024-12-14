import LeftMenu from "../LeftMenu";
import styles from './Inquiry.module.css'

export default function Inquiry() {
    return (
        <div className={styles.container}>
            <LeftMenu />

            <div className={styles.wrapper}>
                <h2 className={styles.menuTitle}>문의하기</h2>
                <div className={styles.line}></div>
                <div className={styles.formGroup}>
                    <label>제목</label>
                    <input className={styles.title}></input>
                </div>
                <div className={styles.formGroup}>
                    <label>내용</label>
                    <textarea className={styles.content} maxLength={500}></textarea>
                </div>

                <div className={styles.btnBox}>
                    <button className={styles.btn}>등록</button>
                </div>
            </div>
        </div>
    )
}