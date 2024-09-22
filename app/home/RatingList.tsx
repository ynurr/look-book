'use client'

import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleRight, faAngleLeft } from '@fortawesome/free-solid-svg-icons'
import Slider from 'react-slick';

interface Book {
  title: string;
  author: string;
  cover: string;
}

export default function RatingList() {

  const [books, setBooks] = useState([]);
  const [currentSlide, setcurrentSlide] = useState(0);
  const totalSlides = books.length;

  useEffect(()=>{
    const fetchBooks = async () => {
        try {
          const response = await fetch('/api/list?queryType=BlogBest'); // 별점 순 수정 필요!
          if (!response.ok) {
            throw new Error('API 요청 실패');
          }
          const data = await response.json();
          setBooks(data.item || []);
        } catch (error) {
          console.log('에러 발생:', error);
        }
    }

    fetchBooks();
  },[])

  const PrevArrow = (props: any) => {
      const { onClick, currentSlide } = props;
      return (
        <FontAwesomeIcon icon={faAngleLeft} className={`prev-button ${currentSlide === 0 ? 'hidden' : ''}`} onClick={onClick}/>
      );
    };
    
    const NextArrow = (props: any) => {
      const { onClick } = props;
      const isLastSlide = currentSlide >= totalSlides - settings.slidesToShow;
      return (
        <FontAwesomeIcon icon={faAngleRight} className={`next-button ${isLastSlide ? 'hidden' : ''}`} onClick={onClick}/>
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
              slidesToShow: 3,
              slidesToScroll: 3,
              initialSlide: 3,
              arrows: false,
              draggable: true
              }
          }
      ]
  }

  return (
      <div className='slider-wrapper'>
          <h1>별점 높은 책</h1>
          <Slider {...settings}>
              {books.map((book : Book, index : number) => (
                  <div key={index} className='slider-item'>
                      <img className='book-cover' src={book.cover} alt={book.title}></img>
                      <h3 className='book-title'>{book.title}</h3>
                      <p className='book-author'>{book.author}</p>
                  </div>
              ))}
          </Slider>
      </div>
  )
}