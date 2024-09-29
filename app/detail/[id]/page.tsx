import styles from './Detail.module.css'

export default function Detail() {
    return (
        <div className={styles.container}>
            <div className={styles.inner}>
                <div className={styles.section1}>
                    <div className={styles.cover}>표지사진</div>
                    <div className={styles.info}>
                        <p className={styles.category}>국내도서 &gt; 소설/시/희곡 &gt; 호러.공포소설</p>
                        <h1 className={styles.title}>트로피컬 나이트</h1>
                        <div className={styles.subInfo}>
                            <span className={styles.author}>조예은 지음</span>
                            <span className={styles.separator}>|</span>
                            <span className={styles.publisher}>한겨례출판</span>
                        </div>
                        <p className={styles.date}>2022년 8월 17일</p>
                        <div className={styles.rating}>
                            <div>⭐⭐⭐⭐⭐</div>
                            <span className={styles.ratingAverage}>9.1</span>
                            <span className={styles.reviewCount}>(3,460)</span>
                        </div>
                        <div className={styles.wishlistBox}>
                            <div className={styles.wishlistContent}>
                                <p>아직 책제목을 읽어보지 않으셨나요?</p>
                                <p>지금 읽고 싶은 책으로 찜해보세요.</p>
                            </div>
                            <div className={styles.wishlistBtn}>찜하기🤍</div>
                        </div>
                        <button className={styles.reviewBtn}>후기작성</button>
                    </div>
                </div>
                <div className={styles.section2}></div>
                <div className={styles.section3}></div>
            </div>
        </div>
    )
}