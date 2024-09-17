'use client'

import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleRight, faAngleLeft } from '@fortawesome/free-solid-svg-icons'

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

    const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태 관리
    const booksPerPage = 5; // 한 페이지에 표시할 책의 수
    const totalPages = Math.ceil(books.length / booksPerPage); // 총 페이지 수 계산
    const isLastPage = currentPage === totalPages; // 마지막 페이지인지 확인
    
    // 다음 페이지 이동 함수
    const handleNextPage = () => {
        setCurrentPage((currentPage) => currentPage < totalPages ? currentPage + 1 : currentPage);
    };

    // 이전 페이지 이동 함수
    const handlePrevPage = () => {
        setCurrentPage((currentPage) => currentPage > 1 ? currentPage - 1 : currentPage);
    };

    const startIndex = (currentPage - 1) * booksPerPage; // 현재 페이지에 해당하는 책 목록 계산
    const endIndex = startIndex + booksPerPage; // 시작 인덱스에 한 페이지당 책 수를 더하여 끝 인덱스 계산
    const currentBooks = books.slice(startIndex, endIndex); // books 배열에서 startIndex부터 endIndex 전까지의 책들을 선택

    return (
        <div className='latest-book-list-container'>
            <h1>새로 나온 책</h1>
            <ul className='book-list'>
                {currentBooks.map((book, i) => (
                    <li className='book-list-item' key={book.id}>
                        <div
                            className='book-cover'
                            style={{
                                backgroundColor: book.color,
                                width: '170px',
                                height: '220px',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginBottom: '10px',
                                borderRadius: '5px',
                                boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                            }}
                        >
                        {i === 4 && !isLastPage && (
                            <FontAwesomeIcon icon={faAngleRight} className="next-button" onClick={handleNextPage}/>
                        )}
                        {i === 0 && currentPage > 1 && (
                            <FontAwesomeIcon icon={faAngleLeft} className="prev-button" onClick={handlePrevPage}/>
                        )}
                        </div>
                        <h3 className='book-title'>{book.title}</h3>
                        <p className='book-author'>{book.author}</p>
                    </li>
                ))}
            </ul>
        </div>
    )
}