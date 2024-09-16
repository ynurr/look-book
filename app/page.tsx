import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import PopularList from './popularList'
import RatingList from './ratingList'
import UserRanking from './userRanking';
import Recommendations from './recommendations';
import LatestList from './latestList';

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
        <section className='popular-book-list-section'>
          <PopularList />
        </section>
        <section className='rating-book-list-section'>
          <RatingList />
        </section>
        <section className='latest-book-list-section'>
          <LatestList />
        </section>
        <div className="side-by-side-sections">
          <section className='user-ranking-section'>
            <UserRanking />
          </section>
          <section className='book-recommendations-section'>
            <Recommendations />
          </section>
        </div>
      </main>
    </div>
  );
}
