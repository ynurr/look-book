'use client'

import { useDispatch, useSelector } from 'react-redux';
import styles from './Search.module.css'
import { useSearchParams } from 'next/navigation';
import { AppDispatch, RootState } from '@/store/store';
import { useEffect, useMemo, useState } from 'react';
import { fetchSearchBooks } from '@/store/slices/searchSlice';
import Pagination from '../components/Pagination';
import Link from 'next/link';
import Image from 'next/image';

export default function Search() {

    const keyword = useSearchParams().get('q');
    const dispatch = useDispatch<AppDispatch>();
    const books = useSelector((state: RootState) => state.search.books || []);

    const [currentPage, setCurrentPage] = useState(1);
    const ItemsPerPage = 10; 

    useEffect(() => {
        if (keyword) {
            dispatch(fetchSearchBooks({ keyword }));
            setCurrentPage(1);
        }
    }, [keyword])

    useEffect(() => {
        console.log('Fetched books:', books);
    }, [books]);

    const pageCount = Math.ceil(books.length / ItemsPerPage);

    const currentItems = useMemo(() => {
        const validBooks = books.filter(book => book.isbn13);
        const start = (currentPage - 1) * ItemsPerPage;
        const end = currentPage * ItemsPerPage;
        return validBooks.slice(start, end);
    }, [books, currentPage]);

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
                                <Image
                                    className={styles.cover}
                                    src={book.cover}
                                    alt={book.title}
                                    width={120}
                                    height={180}
                                     sizes="(max-width: 480px) 100px, 120px"
                                />
                            </Link>
                            <div className={styles.item}>
                                <Link href={`/detail?id=${book.isbn13}`} className={styles.title}>
                                    {book.title}
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
                    key={keyword}
                    pageCount={pageCount}
                    onPageChange={handlePageChange}
                    currentPage={currentPage}
                />
            </div>
        </div>
    )
}
