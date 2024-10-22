import styles from './Find.module.css'

export default function Find({searchParams}: {searchParams: { q: string }}) {

    const query = searchParams.q
    console.log('검색어:'+query)

    return (
        <div className={styles.container}>
            <div className={styles.wrapper}>
                <h2>'해리포터' 검색 결과</h2>
                <hr className={styles.hr}/>
                {[...Array(5)].map((_, index) => (
                    <div key={index} className={styles.inner}>
                        <div className={styles.content}>
                            <div className={styles.cover}>표지</div>
                            <div className={styles.item}>
                                <p className={styles.title}>해리 포터와 마법사의 돌</p>
                                <p className={styles.author}>J.K. 롤링 (지은이)</p>
                                <div className={styles.info}>
                                    <span className={styles.publisher}>문학수첩</span>
                                    <span className={styles.separator}>|</span>
                                    <span className={styles.pubDate}>2019년 11월 19일</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
