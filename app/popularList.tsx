'use client'

import React from 'react'

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
  { id: 1, title: "데미안", author: "헤르만 헤세", color: getRandomColor() },
  { id: 2, title: "아몬드", author: "손원평", color: getRandomColor() },
  { id: 3, title: "The Midnight Library", author: "Matt Haig", color: getRandomColor() },
  { id: 4, title: "달러구트 꿈 백화점", author: "이미예", color: getRandomColor() },
  { id: 5, title: "Atomic Habits", author: "James Clear", color: getRandomColor() },
//   { id: 6, title: "오늘 밤, 세계에서 이 사랑이 사라진다 해도", author: "이치조 미사키", color: getRandomColor() },
//   { id: 7, title: "The Silent Patient", author: "Alex Michaelides", color: getRandomColor() },
//   { id: 8, title: "빛의 과거", author: "은희경", color: getRandomColor() },
//   { id: 9, title: "Where the Crawdads Sing", author: "Delia Owens", color: getRandomColor() },
//   { id: 10, title: "7년의 밤", author: "정유정", color: getRandomColor() },
]

export default function PopularList() {
    return (
        <div>
            <h1>인기 있는 책</h1>
            <ul className='book-list'>
                {books.map((book) => (
                    <li className='book-list-item' key={book.id}>
                        {/* 책 표지 임시 데이터 */}
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
                        ></div>
                        <h3 className='book-title'>{book.title}</h3>
                        <p className='book-author'>{book.author}</p>
                        {/* 별점 위치 */}
                    </li>
                ))}
            </ul>
        </div>
    )
}