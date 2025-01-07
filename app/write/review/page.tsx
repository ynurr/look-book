'use client'

import { useState } from 'react';
import LeftMenu from '../../library/LeftMenu';
import styles from './WriteReview.module.css'
import { PiStarFill } from "react-icons/pi";
import { useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function WriteReview() {

    const { data: session } = useSession()

    const params = useSearchParams()

    const cover = params.get('cover') || ''
    const title = params.get('title') || ''
    const author = params.get('author') || ''
    const isbn = params.get('isbn13')

    const [rating, setRating] = useState(0)
    const [content, setContent] = useState('')

    const handleSubmit = async () => {
        if (!content) {
            alert('리뷰 내용을 작성해주세요.')
            return
        }

        if (rating === 0) {
            alert('별점을 평가해주세요.')
            return
        }

        const data = {
            isbn,
            title,
            cover,
            author,
            content,
            rating,
            sub: session?.user.sub
        }

        try {
            const response = await fetch('/api/db/review/write', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })

            const result = await response.json()

            if (response.status === 200) {
                alert('리뷰 작성 성공')
                window.location.href = '/library/my-review'
            } else {
                alert(result.message || '리뷰 작성 실패')
            }
        } catch (error) {
            alert('리뷰 작성 중 오류가 발생했습니다.')
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.wrapper}>
                <h2 className={styles.menuTitle}>리뷰 쓰기</h2>
                <div className={styles.line}></div>
                <div className={styles.bookInfo}>   
                    <img className={styles.cover} src={cover} alt={title} />
                    <div className={styles.bookDetail}>
                        <span className={styles.title}>{title}</span>
                        <span className={styles.author}>{author}</span>

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
                <textarea 
                    className={styles.review}
                    maxLength={1000}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                ></textarea>
                <div className={styles.btnBox}>
                    <button onClick={handleSubmit} className={styles.btn}>등록</button>
                </div>
            </div>
        </div>
    )
}