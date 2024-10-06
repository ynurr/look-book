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

export default function RatingList() {

	const [books, setBooks] = useState<Book[]>([]);
	const [currentSlide, setcurrentSlide] = useState(0);
	const [isSliderReady, setIsSliderReady] = useState(false); // 추가
	const totalSlides = books.length;

	useEffect(() => {
		const fetchBooks = async () => {
			try {
				const response = await fetch('/api/list?queryType=BlogBest'); // 별점 순
				if (!response.ok) {
					throw new Error('API 요청 실패');
				}
				const data = await response.json();
				setBooks(data.item || []);
				setIsSliderReady(true); // 슬라이더 렌더링 준비 완료
			} catch (error) {
				console.log('에러 발생:', error);
			}
		}

		fetchBooks();
	}, []);

	// 화면 크기 변경 시 슬라이더 재렌더링
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

	const PrevArrow = (props: any) => {
		const { onClick, currentSlide } = props;
		return (
			<FontAwesomeIcon icon={faAngleLeft} className={`prev-button ${currentSlide === 0 ? 'hidden' : ''}`} onClick={onClick} />
		);
	};

	const NextArrow = (props: any) => {
		const { onClick } = props;
		const isLastSlide = currentSlide >= totalSlides - settings.slidesToShow;
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
		beforeChange: (current: number, next: number) => setcurrentSlide(next),
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
		<div className='slider-wrapper rating-slider'>
			<h1>별점 높은 책</h1>
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
	)
}