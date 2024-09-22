'use client'

import React, { useEffect, useState } from 'react'

interface Book {
    title: string;
    author: string;
    cover: string;
    description: string;
}

export default function Recommendations() {

    const [book, setBook] = useState<Book>({} as Book);

    useEffect(()=>{
        const fetchBooks = async () => {
            try {
                const response = await fetch('api/recommend');
                if (!response.ok) {
                    throw new Error('API 요청 실패');
                }
                const data= await response.json();
                setBook(data.item[0]);
            } catch (error) {
                console.log('에러 발생:', error);
            }
        }

        fetchBooks();
    },[])

    return (
        <div>
            <h1>이런 책은 어때요?</h1>
            <div className="recommendations-box">
                {/* <h1 className="ranking-recommendations-title">오늘의 추천 책</h1> */}
                <div className="recommendations-book-container">
                    <img className='recommendations-book-cover' src={book.cover} alt={book.title}></img>
                    <div className='recommendations-info'>
                        <h3 className='recommendations-book-title'>{book.title}</h3>
                        <p className='recommendations-book-author'>{book.author}</p>
                        <p className="recommendations-book-summary">{book.description}</p>
                        <p className="liked-button">찜하기 💗</p>
                    </div>
                </div>
            </div>
        </div>
    )
}