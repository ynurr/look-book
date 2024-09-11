export default function Home() {
  return (
    <div className="container">
      <h1>CSS 테스트 페이지</h1>
      <p>이 텍스트의 스타일이 적용되었는지 확인해보세요.</p>
      <a href="#">이것은 링크입니다</a>
      <div className="image-container">
        <img src="https://via.placeholder.com/300x200" alt="테스트 이미지" />
      </div>
      <div className="box-test">
        이 박스의 크기가 어떻게 계산되는지 확인해보세요.
      </div>
    </div>
  );
}
