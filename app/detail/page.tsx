'use client'

import { useEffect, useState } from 'react';
import styles from './Detail.module.css';
import Review from './Review';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBookDetails } from '@/store/slices/detailSlice';
import { fetchSearchBooks, Books } from '@/store/slices/searchSlice';
import { RootState } from '@/store/store';

export default function Detail() {
    const dispatch = useDispatch();
    const param = useSearchParams();
    const id = param.get('id');

    const book = useSelector((state: RootState) => state.detail.book); 
    const authorBooks = useSelector((state: RootState) => state.search.books || []); 

    useEffect(() => {
        if (id) {
            dispatch<any>(fetchBookDetails(id));
        }
    }, [id, dispatch]);

    const cleanAuthor = book?.author?.replace(/\s*\(지은이\).*/, '') || '';

    useEffect(() => {
        if (cleanAuthor) {
            dispatch<any>(fetchSearchBooks({ author: cleanAuthor, type: 'Author', max: '6' }));
        }
    }, [cleanAuthor, book?.isbn13, dispatch])

    const filteredBooks = authorBooks.filter((item: Books) => item.isbn13 !== book?.isbn13).slice(0, 5); 

    return (
        <div className={styles.container}>
            <div className={styles.inner}>
                <div className={styles.section1}>
                    <img className={styles.cover} src={book?.cover} alt={book?.title}></img>
                    <div className={styles.info}>
                        <h1 className={styles.title}>{book?.title}</h1>
                        <div className={styles.subInfo}>
                            <span className={styles.author}>{book?.author}</span>
                            <span className={styles.separator}>|</span>
                            <span className={styles.publisher}>{book?.publisher}</span>
                        </div>
                        <p className={styles.date}>{book?.pubDate}</p>
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
                                <div className={styles.wishlistBtn}>찜🤍</div>
                                <div className={styles.wishlistBtn}>공유</div>
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
                        <span>{book?.categoryName}</span>
                    </div>
                    <div className={styles.hrLine}></div>
                    <div>
                        <p>소개글</p>
                        <span>{book?.description}</span>
                    </div>
                    <div className={styles.hrLine}></div>
                    <div>
                        <p>작가의 다른 책</p>
                        <div className={styles.bookList}>
                            {filteredBooks.map((book: Books, index: number) => (
                                <div className={styles.bookItem} key={index}>
                                    <Link href={`/detail?id=${book.isbn13}`}>
                                        <img className={styles.cover2} src={book.cover} alt={book.title}></img>
                                    </Link>
                                    <Link href={`/detail?id=${book.isbn13}`}>
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
    );
}
