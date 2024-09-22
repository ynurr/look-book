export default function UserRanking() {
    return (
        <div>
            <h1>유저 랭킹</h1>
            <div className="user-ranking-box">
                {/* <h1 className="ranking-recommendations-title">유저 랭킹 👑</h1> */}
                <ul className="user-ranking-list">
                    <li><span className="user-name">신정환</span><span className="book-count">150권</span></li>
                    <li><span className="user-name">김도훈</span><span className="book-count">39권</span></li>
                    <li><span className="user-name">닉네임길이일곱</span><span className="book-count">22권</span></li>
                    <li><span className="user-name">ddd</span><span className="book-count">1권</span></li>
                    <li><span className="user-name">eee</span><span className="book-count">0권</span></li>
                    <li><span className="user-name">ddd</span><span className="book-count">1권</span></li>
                    <li><span className="user-name">eee</span><span className="book-count">0권</span></li>
                    <li><span className="user-name">ddd</span><span className="book-count">1권</span></li>
                    <li><span className="user-name">eee</span><span className="book-count">0권</span></li>
                    <li><span className="user-name">eee</span><span className="book-count">0권</span></li>
                </ul>
            </div>
        </div>
    )
}