'use client'

import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleRight, faAngleLeft } from '@fortawesome/free-solid-svg-icons'
import Slider from 'react-slick';
import styles from './../(styles)/Common.module.css'
import Link from 'next/link';

interface Book {
    title: string;
    author: string;
    cover: string;
    isbn13: string;
}

export default function BestList() {
    const [books, setBooks] = useState<Book[]>([]);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isSliderReady, setIsSliderReady] = useState(false);

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await fetch('/api/list?queryType=Bestseller');
                if (!response.ok) {
                    throw new Error('API 요청 실패');
                }
                const data = await response.json();
                setBooks(data.item || []);
                setIsSliderReady(true);
            } catch (error) {
                console.log('에러 발생:', error);
            }
        };

        fetchBooks();
    }, []);

    const PrevArrow = (props: any) => {
        const { onClick, currentSlide } = props;
        return (
            <FontAwesomeIcon icon={faAngleLeft} className={`prev-button ${currentSlide === 0 ? 'hidden' : ''}`} onClick={onClick} />
        );
    };

    const NextArrow = (props: any) => {
        const { onClick } = props;
        const isLastSlide = currentSlide >= books.length - settings.slidesToShow;
        return (
            <FontAwesomeIcon icon={faAngleRight} className={`next-button ${isLastSlide ? 'hidden' : ''}`} onClick={onClick} />
        );
    };

    const settings = {
        dots: false,
        arrows: true,
        draggable: false,
        infinite: false,
        speed: 500,
        slidesToShow: 6,
        slidesToScroll: 6,
        prevArrow: <PrevArrow />,
        nextArrow: <NextArrow />,
        beforeChange: (current: number, next: number) => setCurrentSlide(next),
        responsive: [
            {
                breakpoint: 1023,
                settings: {
                    slidesToShow: 6,
                    slidesToScroll: 6,
                    arrows: false,
                    draggable: true
                }
            },
            {
                breakpoint: 767,
                settings: {
                    slidesToShow: 5,
                    slidesToScroll: 5,
                    arrows: false,
                    draggable: true
                }
            }
        ]
    };

    useEffect(() => {
        const handleResize = () => {
            setIsSliderReady(false);
            setTimeout(() => {
                setIsSliderReady(true);
            }, 100);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <div className='slider-wrapper best-slider'>
            <h1>인기 있는 책</h1>
            {isSliderReady && (
                <Slider {...settings}>
                    {books.map((book: Book, index: number) => (
                        <div key={index} className='slider-item'>
                            <Link href={`/detail?id=${book.isbn13}`}>
                                <img className={styles.cover} src={book.cover} alt={book.title} />
                            </Link>
                            <Link href={`/detail?id=${book.isbn13}`}>
                                <span className={styles.title}>{book.title}</span>
                            </Link>
                            <p className={styles.author}>{book.author}</p>
                        </div>
                    ))}
                </Slider>
            )}
        </div>
    );
}