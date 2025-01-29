'use client'

import React, { useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleRight, faAngleLeft } from '@fortawesome/free-solid-svg-icons'
import Slider from 'react-slick';
import styles from './../(styles)/Common.module.css'
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';
import { fetchBookList, Books } from '@/store/slices/listSlice';
import { IoChevronForward } from 'react-icons/io5';

export default function LatestList() {
    const dispatch = useDispatch<AppDispatch>();
    const books = useSelector((state: RootState) => state.list.latestList);

    useEffect(() => {
        dispatch(fetchBookList({ type: 'ItemNewSpecial', max: '24', page: '1' }));
    }, [])

    const PrevArrow = (props: any) => {
        const { onClick, currentSlide } = props;
        return (
            <FontAwesomeIcon icon={faAngleLeft} className={`prev-button ${currentSlide === 0 ? 'hidden' : ''}`} onClick={onClick} />
        );
    };

    const NextArrow = (props: any) => {
        const { onClick, currentSlide } = props;
        const isLastSlide = currentSlide >= books.length - 6;
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

    return (
        <div className='slider-wrapper latest-slider'>
            <Link href="/new" className={styles.categoryLink}>화제의 신간<IoChevronForward /></Link>
            <Slider {...settings}>
                {books.map((book: Books, index: number) => (
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
        </div>
    );
}