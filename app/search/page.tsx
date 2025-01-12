'use client'

import { useDispatch, useSelector } from 'react-redux';
import styles from '../(styles)/Search.module.css'
import { useSearchParams } from 'next/navigation';
import { AppDispatch, RootState } from '@/store/store';
import { useEffect, useState } from 'react';
import { fetchSearchBooks } from '@/store/slices/searchSlice';
import Pagination from '../(components)/Pagination';
import Link from 'next/link';

export default function Search() {

    const keyword = useSearchParams().get('q');
    const dispatch = useDispatch<AppDispatch>();
    const books = useSelector((state: RootState) => state.search.books || []);

    const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태 관리
    const ItemsPerPage = 10; 

    useEffect(() => {
        if (keyword) {
            dispatch(fetchSearchBooks({ keyword: keyword }));
        }
    }, [keyword])

    useEffect(() => {
        console.log('Fetched books:', books);
    }, [books]);

    const pageCount = Math.ceil(books.length / ItemsPerPage); // 총 페이지 수
    const currentItems = books.slice((currentPage - 1) * ItemsPerPage, currentPage * ItemsPerPage);

    const handlePageChange = (selected: { selected: number }) => {
        setCurrentPage(selected.selected + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    return (
        <div className={styles.container}>
            <div className={styles.wrapper}>
                <h2>'{keyword}' 검색 결과</h2>
                <hr className={styles.hr}/>
                {currentItems.map((book, index) => (
                    <div key={index} className={styles.inner}>
                        <div className={styles.contents}>
                            <Link href={`/detail?id=${book.isbn13}`}>
                                <img className={styles.cover} src={book.cover} alt={book.title}></img>
                            </Link>
                            <div className={styles.item}>
                                <Link href={`/detail?id=${book.isbn13}`}>
                                    <p className={styles.title}>{book.title}</p>
                                </Link>
                                <p className={styles.author}>{book.author}</p>
                                <div className={styles.info}>
                                    <span className={styles.publisher}>{book.publisher}</span>
                                    <span className={styles.separator}>|</span>
                                    <span className={styles.pubDate}>{book.pubDate}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                <Pagination
                    pageCount={pageCount}
                    onPageChange={handlePageChange}
                    currentPage={currentPage}
                />
            </div>
        </div>
    )
}
