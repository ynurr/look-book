export default function UserRanking() {
    return (
        <div className="user-ranking-box">
            <h1>유저 랭킹 👑</h1>
            <div className="user-ranking-container">
                <div>
                    <h3 className="user-ranking-title">다독왕</h3>
                    <ul className="user-ranking-list">
                        <li><span className="user-name">aaa</span><span className="book-count">4권</span></li>
                        <li><span className="user-name">bbb</span><span className="book-count">3권</span></li>
                        <li><span className="user-name">ccc</span><span className="book-count">2권</span></li>
                        <li><span className="user-name">ddd</span><span className="book-count">1권</span></li>
                        <li><span className="user-name">eee</span><span className="book-count">0권</span></li>
                    </ul>
                </div>
                <div className="vertical-line"></div>
                <div>
                    <h3 className="user-ranking-title">인기리뷰어</h3>
                    <ul className="user-ranking-list">
                        <li><span className="user-name">aaa</span><span className="book-count">4권</span></li>
                        <li><span className="user-name">bbb</span><span className="book-count">3권</span></li>
                        <li><span className="user-name">ccc</span><span className="book-count">2권</span></li>
                        <li><span className="user-name">ddd</span><span className="book-count">1권</span></li>
                        <li><span className="user-name">eee</span><span className="book-count">0권</span></li>
                    </ul>
                </div>
            </div>
        </div>
    )
}