import { useEffect, useState } from 'react'
import styles from './../(styles)/UserRanking.module.css'

export default function UserRanking() {

    const [ranking, setRanking] = useState<{ nickname: string; book_count: number|string }[]>([]);

    useEffect(() => {
        const fetchRanking = async () => {
            try {
                const response = await fetch('/api/db/rank', {
                    method: 'GET'
                })
    
                const data = await response.json();

                setRanking(data.result);
            } catch (error) {
                console.log('에러')
            }
        }

        fetchRanking();
    }, [])
    
    return (
        <div>
            <h1>독서왕 랭킹 👑</h1>
            <div className={styles.box}>
                <ul className={styles.list}>
                    {
                        [...Array(10)].map((_, i) => {
                            const user = ranking[i] || { nickname: "-", book_count: "-" };
                            const isEmpty = user.nickname === "-" && user.book_count === "-";
                            return (
                                <li key={i}>
                                    <span className={styles.rank}>{i + 1}위</span>
                                    <span className={`${styles.name} ${user.nickname === "-" ? styles.empty : ""}`}>
                                        {user.nickname}
                                    </span>
                                    <span className={`${styles.count} ${user.book_count === "-" ? styles.empty : ""}`}>
                                        {typeof user.book_count === "number" && user.book_count > 999 ? "999+" : user.book_count}권
                                    </span>
                                </li>
                            )
                        })
                    }
                </ul>
            </div>
        </div>
    )
}