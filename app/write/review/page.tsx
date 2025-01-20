'use client'

import { useEffect, useState } from 'react';
import LeftMenu from '../../library/LeftMenu';
import styles from './WriteReview.module.css'
import { PiStarFill } from "react-icons/pi";
import { useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { fetchEditReview, fetchReviewById, fetchWriteReview } from '@/store/slices/reviewSlice';

export default function WriteReview() {

    const { data: session } = useSession();

    const params = useSearchParams();

    const cover = params.get('cover') || '';
    const title = params.get('title') || '';
    const author = params.get('author') || '';
    const isbn = params.get('isbn13');
    const status = params.get('status');
    const review_id = params.get('id') || '';

    const [rating, setRating] = useState(0);
    const [content, setContent] = useState('');
    const [isEdit, setIsEdit] = useState(false); 

    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        if (review_id) {
            setIsEdit(true);
            dispatch(fetchReviewById(review_id)).unwrap()
                .then((data) => {
                    setRating(data.review.rating || 0);
                    setContent(data.review.content || '');
                })
                .catch((err) => {
                    console.error('리뷰 조회 중 오류 발생:', err);
                });
        }
    }, [review_id])

    const handleSubmit = async () => {
        if (!content) {
            alert('리뷰 내용을 작성해주세요.')
            return
        }

        if (rating === 0) {
            alert('별점을 평가해주세요.')
            return
        }

        try {
            if (isEdit) {
                const result = await dispatch(fetchEditReview({
                    review_id: review_id,
                    content: content,
                    rating: rating,
                })).unwrap();
                
                alert('리뷰 수정 성공');
            } else {
                const result = await dispatch(fetchWriteReview({
                    sub: session?.user.sub || '',
                    isbn: isbn || '',
                    title: title || '',
                    cover: cover || '',
                    author: author || '',
                    content: content || '',
                    rating: rating || 0,
                    status: status || '',
                })).unwrap();
                
                alert('리뷰 작성 성공');
            }
            window.location.href = `/library/reading/detail?isbn=${isbn}`;
        } catch (error) {
            alert('리뷰 작성 중 오류가 발생했습니다.');
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