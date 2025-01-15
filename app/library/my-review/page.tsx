'use client'

import { useSession } from "next-auth/react";
import LeftMenu from "../LeftMenu";
import styles from './myReview.module.css'
import { PiStarFill } from "react-icons/pi";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

interface Review {
    title: string;
    cover: string;
    rating: number;
    content: string;
    like_count: number;
    created_at: string;
}

export default function Review() {

    const { data: session, status } = useSession()

    if (!session && status !== "loading") {
        redirect('/login');
    }

    const [reviews, setReviews] = useState<Review[]>([])

    useEffect(() => {
        if (status === 'authenticated' && session?.user.sub) {
            const fetchReviews = async() => {
                try {
                    const response = await fetch('/api/db/review/list', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ sub: session?.user.sub })
                    })
                    
                    const result = await response.json()

                    if (response.status === 200) {
                        setReviews(result)
                    } else {
                        alert(result.message)
                    }
                } catch (error) {
                    console.error("리뷰 조회 실패", error);
                }
            }

            fetchReviews()
        }
    }, [session, status])

    return (
        <div className={styles.container}>
            <LeftMenu />

            <div className={styles.wrapper}>
                <h2 className={styles.menuTitle}>나의 리뷰</h2>
                <div className={styles.line}></div>

                {reviews.length === 0 ?
                    <p className={styles.noData}>작성된 리뷰가 없습니다.</p>
                    :
                    reviews.map((review, i) => (
                        <div className={styles.list} key={i}>
                            <div className={styles.bookInfo}>
                                <img className={styles.cover} src={review.cover} alt={review.title}/>
                                <div className={styles.bookDetail}>
                                    <span className={styles.title}>{review.title}</span>
                                    <span className={styles.date}>{review.created_at}</span>
                                    <div className={styles.rating}>
                                        {[...Array(5)].map((_, index) => (
                                            <PiStarFill 
                                                key={index}
                                                className={index < review.rating ? styles.starFill : styles.star}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className={styles.reviewBox}>
                                <span className={styles.review}>{review.content}</span>
                            </div>
                            <div className={styles.reactionBox}>
                                <span className={styles.likeCnt}>💙 {review.like_count}</span>
                                <span className={styles.commentCnt}>💬 0</span>
                            </div>
                            <div className={styles.hrLine}></div>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}