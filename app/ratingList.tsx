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
  { id: 1, title: "해리 포터와 마법사의 돌", author: "J.K. 롤링", color: getRandomColor() },
  { id: 2, title: "어린 왕자", author: "앙투안 드 생텍쥐페리", color: getRandomColor() },
  { id: 3, title: "The Alchemist", author: "Paulo Coelho", color: getRandomColor() },
  { id: 4, title: "죽고 싶지만 떡볶이는 먹고 싶어", author: "백세희", color: getRandomColor() },
  { id: 5, title: "To Kill a Mockingbird", author: "Harper Lee", color: getRandomColor() },
//   { id: 6, title: "나미야 잡화점의 기적", author: "히가시노 게이고", color: getRandomColor() },
//   { id: 7, title: "The Da Vinci Code", author: "Dan Brown", color: getRandomColor() },
//   { id: 8, title: "돈의 속성", author: "김승호", color: getRandomColor() },
//   { id: 9, title: "Norwegian Wood", author: "Haruki Murakami", color: getRandomColor() },
//   { id: 10, title: "82년생 김지영", author: "조남주", color: getRandomColor() },
]

export default function RatingList() {
    return (
        <div>
            <h1>별점 높은 책</h1>
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