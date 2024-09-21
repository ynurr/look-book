import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import PopularList from './(components)/bestList'
import RatingList from './(components)/ratingList'
import UserRanking from './(components)/userRanking';
import Recommendations from './(components)/recommendations';
import LatestList from './(components)/latestList';

export default function Home() {
  return (
    <div className="container">
      <main>
        <section>
          <h1 className="logo">
            <span className="logo-top">LOOK</span>
            <span className="logo-bottom">BOOK</span>
          </h1>
        </section>
        <section>
          <p className="sub-title">나만의 독서 경험을 기록하고<br/>ㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇ</p>
          <div className="search-container">
            <FontAwesomeIcon icon={faSearch} className="search-icon" />
            <input className="search-input" type="text" placeholder="제목 또는 작가를 입력하세요" />
          </div>
        </section>
        <section className='best-book-list-section'>
          <PopularList />
        </section>
        {/* <section className='rating-book-list-section'>
          <RatingList />
        </section> */}
        <section className='latest-book-list-section'>
          <LatestList />
        </section>
        <section className='ranking-and-recommendations-section'>
          <div>
            <UserRanking />
          </div>
          <div>
            <Recommendations />
          </div>
        </section>
      </main>
    </div>
  );
}
