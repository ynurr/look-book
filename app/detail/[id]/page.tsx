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
                <div className={styles.section2}>
                    <div className={styles.middleNav}>
                        <a className={styles.active}>책 정보</a>
                        <a>리뷰 (21)</a>
                    </div>
                </div>
                <div className={styles.section3}>
                    <div>
                        <p>분야</p>
                        <span>국내도서 &gt; 소설/시/희곡 &gt; 호러.공포소설</span>
                    </div>
                    <div className={styles.hrLine}></div>
                    <div>
                        <p>소개글</p>
                        <span>부드럽고 말랑말랑하고 따뜻한, 총천연색 마음으로 쓰인 소설집 트로피컬 나이트는 소름이 돋을 만큼 무서운데도 사랑과 다정함이 충만하다. 한여름의 트로피카나 스파클링 음료수처럼 짜릿하고 다채로운 이 이야기들은 올여름 더위에 지친 우리를 시원하게 위로해줄 것이다.</span>
                    </div>
                    <div className={styles.hrLine}></div>
                    <div>
                        <p>작가의 다른 책</p>
                        <div className={styles.bookList}>
                            <p>조예은</p>
                        </div>
                    </div>
                    <div className={styles.hrLine}></div>
                </div>
                <div className={styles.section4}>
                    <div className={styles.reviewHeader}>
                        <span className={styles.reviewTitle}>리뷰</span>
                        <div className={styles.align}>
                            <span>최신순</span>
                            <span className={styles.separator}>|</span>
                            <span>별점높은순</span>
                            <span className={styles.separator}>|</span>
                            <span>별점낮은순</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}