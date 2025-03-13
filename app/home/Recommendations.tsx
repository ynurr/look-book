'use client'

import React, { useEffect, useState } from 'react'
import styles from './../(styles)/Recommendations.module.css'
import Link from 'next/link';

interface Book {
    title: string;
    author: string;
    cover: string;
    description: string;
    isbn13: string;
}

export default function Recommendations() {

    const [book, setBook] = useState<Book>({} as Book);

    useEffect(()=>{
        const fetchBooks = async () => {
            try {
                const response = await fetch('api/external/recommend');
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
            <h1 className={styles.sectionTitle}>이런 책은 어때요?</h1>
            <div className={styles.wrapper}>
                <div className={styles.box}>
                    <Link href={`/detail?id=${book.isbn13}`}>
                        <img className={styles.cover} src={book.cover} alt={book.title}></img>
                    </Link>
                    <div className={styles.info}>
                        <Link href={`/detail?id=${book.isbn13}`}>
                            <p className={styles.title}>{book.title}</p>
                        </Link>
                        <p className={styles.author}>{book.author}</p>
                        <p className={styles.summary}>{book.description}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}