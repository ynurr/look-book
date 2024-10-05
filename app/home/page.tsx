import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import RatingList from './RatingList'
import UserRanking from './UserRanking';
import Recommendations from './Recommendations';
import LatestList from './LatestList';
import BestList from './BestList';
import styles from './../(styles)/HomePage.module.css'

export default function Main() {
  return (
    <div className={styles['container']}>
      <main>
        <section>
          <h1 className={styles['logo']}>
            <span className={styles['logo-top']}>LOOK</span>
            <span className={styles['logo-bottom']}>BOOK</span>
          </h1>
        </section>
        <section className={styles['search-section']}>
          <p className={styles['sub-title']}>나만의 독서 경험을 기록하고<br/>다양한 독자들의 감상을 살펴보세요</p>
          <div className={styles['search-container']}>
            <FontAwesomeIcon icon={faSearch} className={styles['search-icon']} />
            <input className={styles['search-input']} type="text" placeholder="책 제목을 입력하세요" />
          </div>
        </section>
        <section className={styles['best-book-list-section']}>
          <BestList />
        </section>
        <section className={styles['rating-book-list-section']}>
          <RatingList />
        </section>
        <section className={styles['latest-book-list-section']}>
          <LatestList />
        </section>
        <section className={styles['ranking-and-recommendations-section']}>
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
