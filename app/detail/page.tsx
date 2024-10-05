'use client'

import { useEffect, useState } from 'react'
import styles from './Detail.module.css'
import Review from './Review'
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

interface Book {
    title: string;
    author: string;
    publisher: string;
    cover: string;
    description: string;
    pubDate: string;
    categoryName: string;
    cleanAuthor: string;
    isbn13: string;
}

export default function Detail() {

    const [book, setBook] = useState<Book>({} as Book);
    const [book2, setBook2] = useState<Book[]>([]);
    const [currentIsbn, setCurrentIsbn] = useState<string>(''); 
    const param = useSearchParams();
    const id = param.get('id');
    
    useEffect(()=>{
        const fetchBooks = async () => {
            if (!id) return; 
            try {
                const response = await fetch(`/api/detail?id=${id}`)
                if (!response.ok) {
                    throw new Error('API 요청 실패');
                }
                const data = await response.json();
                const copy = {...data.item[0]};
                copy.description = data.item[0].description
                                .replace(/&lt;/g, '<')
                                .replace(/&gt;/g, '>');
                const [year, month, day] = copy.pubDate.split('-');
                copy.pubDate = `${year}년 ${month}월 ${day}일`;
                setBook(copy);
                setCurrentIsbn(copy.isbn13); 
            } catch (error) {
                console.log('에러 발생:', error);
            }
        }

        fetchBooks();
    }, [id])

    const cleanAuthor = book?.author?.replace(/\s*\(지은이\).*/, '') || '';

    useEffect(() => {
        const fetchBooksByAuthor = async () => {
            if (!id) return; 
            try {
                const response = await fetch(`/api/search?id=${cleanAuthor}`);
                if (!response.ok) {
                    throw new Error('API 요청 실패');
                }
                const data = await response.json();
                const allBooks = data.item || [];
                const filteredBooks = allBooks.filter((item: Book) => item.isbn13 !== book.isbn13);
                setBook2(filteredBooks.slice(0, 5) || []);
            } catch (error) {
                console.log('에러 발생:', error);
            }
        }
    
        fetchBooksByAuthor();
    }, [currentIsbn]); 

    return (
        <div className={styles.container}>
            <div className={styles.inner}>
                <div className={styles.section1}>
                    <img className={styles.cover} src={book.cover} alt={book.title}></img>
                    <div className={styles.info}>
                        <h1 className={styles.title}>{book.title}</h1>
                        <div className={styles.subInfo}>
                            <span className={styles.author}>{book.author}</span>
                            <span className={styles.separator}>|</span>
                            <span className={styles.publisher}>{book.publisher}</span>
                        </div>
                        <p className={styles.date}>{book.pubDate}</p>
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
                            <div className={styles.btnBox}>
                                <div className={styles.wishlistBtn}>찜하기🤍</div>
                                <div className={styles.wishlistBtn}>공유하기</div>
                            </div>
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
                        <span>{book.categoryName}</span>
                    </div>
                    <div className={styles.hrLine}></div>
                    <div>
                        <p>소개글</p>
                        <span>{book.description}</span>
                    </div>
                    <div className={styles.hrLine}></div>
                    <div>
                        <p>작가의 다른 책</p>
                        <div className={styles.bookList}>
                            {book2.map((book: Book, index: number) => (
                                <div className={styles.bookItem} key={index}>
                                    <Link href={`/detail?id=${book.isbn13}&type=Author&max=6`}>
                                        <img className={styles.cover2} src={book.cover} alt={book.title}></img>
                                    </Link>
                                    <Link href={`/detail?id=${book.isbn13}&type=Author&max=6`}>
                                        <span className={styles.title2}>{book.title}</span>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className={styles.hrLine}></div>
                </div>
                <Review />
            </div>
        </div>
    )
}