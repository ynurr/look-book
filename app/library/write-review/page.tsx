'use client'

import { useState } from 'react';
import LeftMenu from '../LeftMenu';
import styles from './WriteReview.module.css'
import { PiStarFill } from "react-icons/pi";

export default function WriteReview() {

    const [rating, setRating] = useState(0);

    return (
        <div className={styles.container}>
            <LeftMenu />
            
            <div className={styles.wrapper}>
                <h2 className={styles.menuTitle}>리뷰 쓰기</h2>
                <div className={styles.line}></div>
                <div className={styles.bookInfo}>   
                    <div className={styles.cover}>커버</div>
                    <div className={styles.bookDetail}>
                        <span className={styles.title}>제목</span>
                        <span className={styles.author}>작가</span>

                        <div className={styles.rating}>
                            {
                                [...Array(rating)].map((a,i) => (
                                    <PiStarFill className={styles.starFill} key={i} onClick={() => setRating(i + 1)} />
                                ))
                            }

                            {
                                [...Array(5 - rating)].map((a,i) => (
                                    <PiStarFill className={styles.star} key={i} onClick={() => setRating(rating + i + 1)}/>
                                ))
                            }
                        </div>

                    </div>
                </div>
                <textarea className={styles.review} maxLength={1000}></textarea>
                <div className={styles.btnBox}>
                    <button className={styles.btn}>등록</button>
                </div>
            </div>
        </div>
    )
}