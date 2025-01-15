'use client'

import { useEffect, useState } from 'react';
import styles from './../(styles)/Detail.module.css';
import Review from './Review';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBookDetails, clearBook } from '@/store/slices/detailSlice';
import { fetchAuthorBooks, Books } from '@/store/slices/authorBooksSlice';
import { RootState, AppDispatch } from '@/store/store';
import { PiStarFill } from "react-icons/pi";
import { fetchWishlist } from '@/store/slices/wishlistSlice';
import { useSession } from 'next-auth/react';
import { fetchAddWishlist } from '@/store/slices/addWishlistSlice';
import { fetchRemoveWishlist } from '@/store/slices/removeWishlistSlice';

export default function Detail() {

    const { data: session, status } = useSession()

    const dispatch = useDispatch<AppDispatch>();
    const param = useSearchParams();
    const id = param.get('id');

    const book = useSelector((state: RootState) => state.detail.book); 
    const authorBooks = useSelector((state: RootState) => state.authorBooks.books || []); 
    const wishlist = useSelector((state: RootState) => state.wishlist.wishlist);

    const [filteredBooks, setFilteredBooks] = useState<Books[]>([]);
    const [isReady, setIsReady] = useState(false);
    
    useEffect(() => {
        dispatch(clearBook());
        if (id) {
            dispatch(fetchBookDetails(id));
            setIsReady(true);
        }
    }, [id, dispatch]);

    useEffect(() => {
        if (book && book.cleanAuthor && isReady) {
            console.log('현재 author:', book?.cleanAuthor);
            dispatch(fetchAuthorBooks({ keyword: book.cleanAuthor }));
        }
    }, [book, dispatch, isReady]);

    useEffect(() => {
        if (authorBooks.length > 0) {
            const newFilteredBooks = authorBooks.filter((item: Books) => item.isbn13 !== book?.isbn13).slice(0, 5);
            setFilteredBooks(newFilteredBooks);
        } else {
            setFilteredBooks([]);
        }
    }, [authorBooks, book?.isbn13]);

    useEffect(() => {
        dispatch(fetchWishlist(session?.user.sub || ''))
    }, [id, session?.user.sub, dispatch])

    const isWishlist = wishlist.some((item) => item.isbn === id);

    const handleAddWishlist = async () => {
        try {
            const result = await dispatch(
                fetchAddWishlist({
                    user_id: session?.user.sub || '',
                    book_isbn: book?.isbn13 || '',
                    book_title: book?.title || '',
                    book_author: book?.author || '',
                    book_cover: book?.cover || ''
                })
            ).unwrap();
      
            alert(result.message);
            dispatch(fetchWishlist(session?.user.sub || ''));
        } catch (error) {
            alert('위시리스트 추가 실패');
        }
    }
    
    const handleRemoveWishlist = async () => {
        try {
            const result = await dispatch(
                fetchRemoveWishlist({
                    user_id: session?.user.sub || '',
                    book_isbn: [book?.isbn13 || '']
                })
            ).unwrap();
      
            alert(result.message);
            dispatch(fetchWishlist(session?.user.sub || ''));
        } catch (error) {
            alert('위시리스트 삭제 실패');
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.inner}>
                <div className={styles.section1}>
                    <img className={styles.cover} src={book?.cover} alt={book?.title}></img>
                    <div className={styles.info}>
                        <p className={styles.title}>{book?.title}</p>
                        <div className={styles.subInfo}>
                            <span className={styles.author}>{book?.author}</span>
                            <span className={styles.separator}>|</span>
                            <span className={styles.publisher}>{book?.publisher}</span>
                        </div>
                        <p className={styles.date}>{book?.pubDate}</p>
                        <div className={styles.rating}>
                            <div>
                                {[...Array(5)].map((_, index) => (
                                    <PiStarFill className={styles.starFill} key={index}/>
                                ))}
                            </div>
                            <span className={styles.ratingAverage}>9.1</span>
                            <span className={styles.reviewCount}>(3,460)</span>
                        </div>
                        <div className={styles.wishlistBox}>
                            <div className={styles.wishlistContent}>
                                <p>아직 이 책을 읽어보지 않으셨나요?</p>
                                <p>지금 읽고 싶은 책으로 담아보세요.</p>
                            </div>
                            <div className={styles.btnBox}>
                                <button onClick={() => {
                                    if (isWishlist) {
                                        handleRemoveWishlist()
                                    } else {
                                        handleAddWishlist()
                                    }
                                }} className={styles.wishlistBtn}>
                                    {
                                        isWishlist ? '위시리스트❤' : '위시리스트🤍'
                                    }
                                </button>
                            </div>
                        </div>
                        {book && (
                            <Link
                                href={`/write/review?cover=${encodeURIComponent(book.cover)}&title=${encodeURIComponent(book.title)}&author=${encodeURIComponent(book.author)}&isbn13=${book.isbn13}`}
                            >
                                <button className={styles.reviewBtn}>리뷰 작성</button>
                            </Link>
                        )}
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
                        <span>{book?.description  || '소개글이 등록되어 있지 않습니다.'}</span>
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
