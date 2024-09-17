'use client'

import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleRight, faAngleLeft } from '@fortawesome/free-solid-svg-icons'
import Slider from 'react-slick';

interface Book {
  id: number;
  title: string;
  author: string;
  color: string;
}

// 랜덤 색상 생성 함수
const getRandomColor = () => {
  return '#' + Math.floor(Math.random()*16777215).toString(16);
}

// 책 데이터에 랜덤 색상 추가
const books: Book[] = [
    { id: 1, title: "클라우드 쿠쿠랜드", author: "앤서니 도어", color: getRandomColor() },
    { id: 2, title: "사피엔스", author: "유발 하라리", color: getRandomColor() },
    { id: 3, title: "1984", author: "조지 오웰", color: getRandomColor() },
    { id: 4, title: "침묵의 봄", author: "레이첼 카슨", color: getRandomColor() },
    { id: 5, title: "여행의 이유", author: "김영하", color: getRandomColor() },
    { id: 6, title: "The Midnight Library", author: "Matt Haig", color: getRandomColor() },
    { id: 7, title: "7년의 밤", author: "정유정", color: getRandomColor() },
    { id: 8, title: "Educated", author: "Tara Westover", color: getRandomColor() },
    { id: 9, title: "총, 균, 쇠", author: "재레드 다이아몬드", color: getRandomColor() },
    { id: 10, title: "The Silent Patient", author: "Alex Michaelides", color: getRandomColor() },
    { id: 11, title: "해리 포터와 마법사의 돌", author: "J.K. 롤링", color: getRandomColor() },
    { id: 12, title: "어린 왕자", author: "앙투안 드 생텍쥐페리", color: getRandomColor() },
    { id: 13, title: "데미안", author: "헤르만 헤세", color: getRandomColor() },
    { id: 14, title: "노인과 바다", author: "어니스트 헤밍웨이", color: getRandomColor() },
    { id: 15, title: "코스모스", author: "칼 세이건", color: getRandomColor() }
]

export default function LatestList() {

    const settings = {
        dots: false,
        arrows: true,
        draggable: false,
        infinite: false,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 5,
        responsive: [
            {
                breakpoint: 1023,
                settings: {
                slidesToShow: 5,
                slidesToScroll: 5,
                arrows: false,
                draggable: true
                }
            },
            {
                breakpoint: 700,
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
            <h1>새로 나온 책</h1>
            <Slider {...settings}>
                {books.map((book) => (
                    <div key={book.id} className='slider-item'>
                        <div className='book-cover'></div>
                        <h3 className='book-title'>{book.title}</h3>
                        <p className='book-author'>{book.author}</p>
                    </div>
                ))}
            </Slider>
        </div>
    )
}