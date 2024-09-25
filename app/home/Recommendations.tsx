'use client'

import React, { useEffect, useState } from 'react'
import styles from './../(styles)/Recommendations.module.css'

interface Book {
    title: string;
    author: string;
    cover: string;
    description: string;
}

export default function Recommendations() {

    const [book, setBook] = useState<Book>({} as Book);

    useEffect(()=>{
        const fetchBooks = async () => {
            try {
                const response = await fetch('api/recommend');
                if (!response.ok) {
                    throw new Error('API 요청 실패');
                }
                const data= await response.json();
                setBook(data.item[0]);
            } catch (error) {
                console.log('에러 발생:', error);
            }
        }

        fetchBooks();
    },[])

    return (
        <div>
            <h1>이런 책은 어때요?</h1>
            <div className={styles.wrapper}>
                <div className={styles.box}>
                    <img className={styles.cover} src={book.cover} alt={book.title}></img>
                    <div className={styles.info}>
                        <h3 className={styles.title}>{book.title}</h3>
                        <p className={styles.author}>{book.author}</p>
                        <p className={styles.summary}>{book.description}</p>
                        <p className={styles.button}>찜하기 💗</p>
                    </div>
                </div>
            </div>
        </div>
    )
}