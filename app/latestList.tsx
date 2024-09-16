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
    { id: 1, title: "클라우드 쿠쿠랜드", author: "앤서니 도어", color: getRandomColor() },
    { id: 2, title: "사피엔스", author: "유발 하라리", color: getRandomColor() },
    { id: 3, title: "1984", author: "조지 오웰", color: getRandomColor() },
    { id: 4, title: "침묵의 봄", author: "레이첼 카슨", color: getRandomColor() },
    { id: 5, title: "여행의 이유", author: "김영하", color: getRandomColor() },
    // { id: 6, title: "The Midnight Library", author: "Matt Haig", color: getRandomColor() },
    // { id: 7, title: "7년의 밤", author: "정유정", color: getRandomColor() },
    // { id: 8, title: "Educated", author: "Tara Westover", color: getRandomColor() },
    // { id: 9, title: "총, 균, 쇠", author: "재레드 다이아몬드", color: getRandomColor() },
    // { id: 10, title: "The Silent Patient", author: "Alex Michaelides", color: getRandomColor() },
]

export default function LatestList() {
    return (
        <div>
            <h1>새로 나온 책</h1>
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