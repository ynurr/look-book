import Link from 'next/link'
import styles from './LeftMenu.module.css'

export default function LeftMenu() {
    return (
        <div className={styles.container}>
            <div className={styles.userInfo}>
                <span className={styles.nickname}>신유 님</span>
                <span className={styles.stat}>현재 내 랭킹 <span className={styles.redText}>0권</span></span>
                <span className={styles.stat}>리뷰 작성 <span className={styles.redText}>0권</span></span>
                <span className={styles.stat}>지금까지 읽은 책 <span className={styles.redText}>0권</span></span> 
                <span className={styles.stat}>마지막 독서 <span className={styles.redText}>3일 전</span></span> 
            </div>
            <div className={styles.menu}>
                <span className={styles.menuTitle}>내 서재</span>
                <Link href="/library/reading" className={styles.reading}>읽고 있는/다 읽은 책</Link>
                <Link href="/library/wishlist" className={styles.wishlist}>찜 목록</Link>
                <Link href="/library/report" className={styles.report}>독서 리포트</Link>
                <span className={styles.menuTitle}>활동</span>
                <Link href="/library/review" className={styles.review}>리뷰</Link>
                <Link href="/library/comment" className={styles.comment}>코멘트</Link>
                <span className={styles.menuTitle}>고객센터</span>
                <Link href="/library/inquiry" className={styles.inquiry}>1:1 문의내역</Link>
            </div>
        </div>
    )
}