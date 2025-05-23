'use client'

import React, { useEffect, useState } from 'react'
import styles from './Recommendations.module.css'
import Link from 'next/link';
import Image from 'next/image';
import { URLS } from '@/util/url';

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
                    <Link href={URLS.book.bookDetail(book.isbn13)}>
                    {book.cover &&
                        <Image
                            className={styles.cover}
                            src={book.cover}
                            alt={book.title || "추천 도서 이미지"}
                            width={190}
                            height={290}
                        />
                    }
                    </Link>
                    <div className={styles.info}>
                        <Link href={URLS.book.bookDetail(book.isbn13)}>
                            <span className={styles.title}>{book.title}</span>
                        </Link>
                        <p className={styles.author}>{book.author}</p>
                        <p className={styles.summary}>{book.description}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}