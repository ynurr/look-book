export default function Recommendations() {
    return (
        <div className="recommendations-box">
            <h1>오늘의 추천 책</h1>
            <div className="recommendations-book-container">
                <div
                    className='recommendations-book-cover'
                    style={{
                        backgroundColor: '#000',
                        minWidth: '170px',
                        height: '220px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginBottom: '10px',
                        boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                    }}
                ></div>
                <div className="recommendations-book-info">
                    <h3 className='recommendations-book-title'>책 제목이세요</h3>
                    <p className='recommendations-book-author'>작가작가</p>
                    <p className="recommendations-book-summary">설명설명설명설명설명설명설명설명설명설명설명설명설명설명설명설명설명설명설명설명설명설명설명설명</p>
                    <a>자세히 보러 가기 👉</a>
                </div>
            </div>
        </div>
    )
}