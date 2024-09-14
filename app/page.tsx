import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'

export default function Home() {
  return (
    <div className="container">
      {/* <h1>LOOK-BOOK</h1> */}
      <h1 className="logo">
        <span className="logo-top">LOOK</span>
        <span className="logo-bottom">BOOK</span>
      </h1>
      <p className="sub-title">나만의 독서 경험을 기록하고<br/>ㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇ</p>
      <div className="search-container">
        <FontAwesomeIcon icon={faSearch} className="search-icon" />
        <input className="search-input" type="text" placeholder="제목 또는 작가를 입력하세요" />
      </div>
      <div>
        <h1>dx</h1>
        <h1>dx</h1>
        <h1>dx</h1>
        <h1>dx</h1>
        <h1>dx</h1>
        <h1>dx</h1>
      </div>
    </div>
  );
}
