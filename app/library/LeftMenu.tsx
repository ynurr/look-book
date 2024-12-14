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
                <Link href="/library/reading" className={styles.reading}>독서 현황</Link>
                <Link href="/library/wishlist" className={styles.wishlist}>위시리스트</Link>
                <span className={styles.menuTitle}>활동</span>
                <Link href="/library/my-review" className={styles.myReview}>나의 리뷰</Link>
                <Link href="/library/write-review" className={styles.writeReview}>리뷰 쓰기</Link>
                <Link href="/library/comment" className={styles.comment}>코멘트</Link>
                <span className={styles.menuTitle}>고객센터</span>
                <Link href="/library/inquiry" className={styles.inquiry}>문의하기</Link>
                <Link href="/library/inquiry-history" className={styles.inquiryHistory}>1:1 문의내역</Link>
            </div>
        </div>
    )
}