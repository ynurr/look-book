import styles from './../(styles)/UserRanking.module.css'

export default function UserRanking() {
    return (
        <div>
            <h1>유저 랭킹</h1>
            <div className={styles.box}>
                <ul className={styles.list}>
                    <li><span className={styles.name}>신정환</span><span className={styles.count}>150권</span></li>
                    <li><span className={styles.name}>김도훈</span><span className={styles.count}>39권</span></li>
                    <li><span className={styles.name}>닉네임길이일곱</span><span className={styles.count}>22권</span></li>
                    <li><span className={styles.name}>ddd</span><span className={styles.count}>1권</span></li>
                    <li><span className={styles.name}>eee</span><span className={styles.count}>0권</span></li>
                    <li><span className={styles.name}>ddd</span><span className={styles.count}>1권</span></li>
                    <li><span className={styles.name}>eee</span><span className={styles.count}>0권</span></li>
                    <li><span className={styles.name}>ddd</span><span className={styles.count}>1권</span></li>
                    <li><span className={styles.name}>eee</span><span className={styles.count}>0권</span></li>
                    <li><span className={styles.name}>eee</span><span className={styles.count}>0권</span></li>
                </ul>
            </div>
        </div>
    )
}