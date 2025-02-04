'use client'

import { useEffect, useRef, useState } from 'react';
import styles from './../(styles)/Detail.module.css';
import Review from './Review';
import { redirect, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBookDetails, clearBook } from '@/store/slices/detailSlice';
import { fetchAuthorBooks, Books } from '@/store/slices/authorBooksSlice';
import { RootState, AppDispatch } from '@/store/store';
import { PiStarFill } from "react-icons/pi";
import { addWishlist, deleteWishlist, fetchWishlist } from '@/store/slices/wishlistSlice';
import { useSession } from 'next-auth/react';
import { updateBookStatus, fetchUserReadingState } from '@/store/slices/readingSlice';
import { GoHeart } from "react-icons/go";
import { GoHeartFill } from "react-icons/go";
import { FaBook } from "react-icons/fa";
import { FaBookOpen } from "react-icons/fa6";

export default function Detail() {

    const { data: session, status } = useSession()

    const dispatch = useDispatch<AppDispatch>();
    const param = useSearchParams();
    const id = param.get('id');

    const book = useSelector((state: RootState) => state.detail.book); 
    const authorBooks = useSelector((state: RootState) => state.authorBooks.books || []); 
    const wishlist = useSelector((state: RootState) => state.wishlist.wishlist);
    const userStatus = useSelector((state: RootState) => state.readingStatus.data);

    const [filteredBooks, setFilteredBooks] = useState<Books[]>([]);
    const [isReady, setIsReady] = useState(false);
    const [rating, setRating] = useState({ avgRating: "0.0", totalCount: 0 });

    useEffect(() => {
        const fetchData = async () => {
            dispatch(clearBook());
            
            if (id) {
                await dispatch(fetchBookDetails(id));
                setIsReady(true);
            }
        };
    
        fetchData(); 
    }, [id, dispatch]);

    useEffect(() => {
        if (book && book.cleanAuthor && isReady) {
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
        if (status === "authenticated" && session?.user.sub && book?.isbn13) {
            dispatch(fetchWishlist(session?.user.sub || ''))
            dispatch(fetchUserReadingState({user_id: session?.user.sub || '', book_isbn: book?.isbn13 || ''}))
        }
    }, [id, session?.user.sub, book?.isbn13, dispatch])

    useEffect(() => {
        const fetchRating = async () => {
            try {
                const response = await fetch(`/api/db/review/rating?isbn=${book?.isbn13}`, {
                    method: 'GET'
                })

                const data = await response.json();
                setRating(data.data);
            } catch (error) {
                console.log('별점 조회 실패')
            }
        }

        fetchRating();
    }, [book?.isbn13])
    
    const isWishlist = wishlist.some((item) => item.isbn === id);

    const handleAddWishlist = async () => {
        
        if (!session?.user.sub) {
            alert('로그인 후 가능합니다.');
            redirect('/login');
        }
        
        try {
            if (!session && status !== "loading") {
                redirect('/login');
            }
            
            await dispatch(addWishlist({
                    user_id: session?.user.sub || '',
                    book_isbn: book?.isbn13 || '',
                    book_title: book?.title || '',
                    book_author: book?.author || '',
                    book_cover: book?.cover || ''
            }));
      
            await dispatch(fetchWishlist(session?.user.sub || ''));
        } catch (error) {
            alert('위시리스트 추가 실패');
        }
    }
    
    const handleRemoveWishlist = async () => {
        try {
            if (!session && status !== "loading") {
                redirect('/login');
            }

            await dispatch(deleteWishlist({
                    user_id: session?.user.sub || '',
                    book_isbn: [book?.isbn13 || '']
            }));
      
            await dispatch(fetchWishlist(session?.user.sub || ''));
        } catch (error) {
            alert('위시리스트 삭제 실패');
        }
    }

    const handleUpdateStatus = async (status: string) => {
        
        if (!session?.user.sub) {
            alert('로그인 후 가능합니다.');
            redirect('/login');
        }
        
        try {
            await dispatch(updateBookStatus({
                user_id: session?.user.sub || '',
                book_isbn: book?.isbn13 || '',
                book_title: book?.title || '',
                book_author: book?.author || '',
                book_cover: book?.cover || '',
                status: status,
            }));

            await dispatch(fetchUserReadingState({user_id: session?.user.sub || '', book_isbn: book?.isbn13 || ''}));
        } catch (error) {
            alert('독서 상태 변경 실패');
        }
    }

    const reviewSectionRef = useRef<HTMLDivElement>(null);
    const scrollToReview = () => {
        reviewSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
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
                            <div className={styles.starIcon} onClick={scrollToReview}>
                                {[...Array(5)].map((_, index) => (
                                    <PiStarFill
                                        key={index}
                                        className={index < Math.round(Number(rating.avgRating)) ? styles.starFill : styles.star}/>
                                ))}
                            </div>
                            <span className={styles.ratingAverage}>{rating.avgRating}</span>
                            <span className={styles.reviewCount}>({rating.totalCount})</span>
                        </div>
                        <div className={styles.wishlistBox}>
                            <div className={styles.wishlistContent}>
                                <p>하트를 눌러 위시리스트에 저장하거나</p>
                                <p>독서 상태를 변경하여 현황을 관리해보세요.</p>
                            </div>
                            <div className={styles.btnBox}>
                                <button 
                                    onClick={() => handleUpdateStatus('0')} 
                                    className={`${styles.readingBtn} ${userStatus?.status === '0' ? styles.activeColor : ''}`}
                                ><FaBookOpen />독서 중</button>
                                <button 
                                    onClick={() => handleUpdateStatus('1')} 
                                    className={`${styles.finishBtn} ${userStatus?.status === '1' ? styles.activeColor : ''}`}
                                ><FaBook />독서 완료</button>
                            </div>
                        </div>
                        <div className={styles.btnBox2}>
                            <button
                                onClick={() => {
                                    if (!session?.user.sub) {
                                        alert('로그인 후 가능합니다.')
                                        redirect('/login')
                                    }
                                    if (userStatus?.review_id) {
                                        alert('이미 작성된 리뷰가 있습니다.');
                                        window.location.href = `/library/reading/detail?isbn=${book?.isbn13}`;
                                    } else if (book) {
                                        window.location.href = `/write/review?cover=${encodeURIComponent(book.cover ?? '')}&title=${encodeURIComponent(book.title ?? '')}&author=${encodeURIComponent(book.author ?? '')}&isbn13=${book.isbn13 ?? ''}&status=${userStatus?.status ?? ''}`;
                                    } else {
                                        alert('도서 정보가 없습니다.');
                                    }   
                                }}
                                className={styles.reviewBtn}
                            >리뷰 작성</button>
                            <button onClick={() => {
                                if (isWishlist) {
                                    handleRemoveWishlist()
                                } else {
                                    handleAddWishlist()
                                }
                            }} className={styles.wishlistBtn}>
                                { isWishlist ? <GoHeartFill className={styles.heartSolid} /> : <GoHeart className={styles.heartRegular} /> }
                            </button>
                        </div>
                    </div>
                </div>
                <div className={styles.section2}>
                    <div>
                        <p className={styles.label}>분야</p>
                        <span>{book?.categoryName}</span>
                    </div>
                    <div className={styles.hrLine}></div>
                    <div>
                        <p className={styles.label}>소개글</p>
                        <span>{book?.description  || '소개글이 등록되어 있지 않습니다.'}</span>
                    </div>
                    <div className={styles.hrLine}></div>
                    <div>
                        <p className={styles.label}>작가의 다른 책</p>
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
                <div ref={reviewSectionRef}>
                    <Review isbn={book?.isbn13} />
                </div>
            </div>
        </div>
    );
}
