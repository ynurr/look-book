## 독서 관리 웹 사이트 LookBook (반응형)
<p align="center">
  <img src="https://github.com/user-attachments/assets/8020033f-c722-4ea3-9d1c-e180a7d333d5" />
</p>

- 배포 URL : [https://look-book-nine.vercel.app](https://look-book-nine.vercel.app/)
<br/>

## 프로젝트 소개

- 개요
    - LookBook은 사용자의 독서 현황을 기록하고, 별점과 함께 작성한 리뷰를 공유할 수 있는 웹 사이트입니다.
    - 메인 페이지에서 '많이 보고 있는 책'과 '화제의 신간' 리스트 및 독서 랭킹을 확인할 수 있고, 도서 검색을 통해 상세 정보를 조회할 수 있습니다.
    - '내 서재' 페이지에서는 월별 독서 통계, 위시리스트, 좋아요 누른 리뷰 등을 확인할 수 있습니다.
- 개발 기간
    - 2024.09.15 ~ 2025.03.19
    <br/>

## 개발 환경

- Next.js 15, React, TypeScript, Redux Toolkit, HTML, CSS, MongoDB
- Open API : 알라딘 도서 API
- 작업 관리 : Git
- 배포 : Vercel
<br/>

## 기술 채택 이유

- **React**
    - 리액트의 강점인 컴포넌트화를 통한 유지보수 및 재사용성을 위해 선택했습니다. 추후 기능 확장에도 유용할 것으로 생각했습니다.
- **Redux Toolkit**
    - 상태 변경 흐름(액션>리듀서>스토어)이 명확하고, 상태를 따로 정의해두고 필요한 곳에서 쉽게 가져다 쓸 수 있어 선택했습니다.
    - 기존 리덕스는 설정도 복잡하고 코드도 길어지는 편인데 리덕스 툴킷은 그런 부분을 많이 줄여줘서 편하게 관리할 수 있습니다.
- **Next.js**
    - 폴더 구조만으로 페이지가 자동으로 생성되는 라우팅의 간편함과 초기 렌더링 속도 향상을 위해 선택했습니다. 또한 리액트만으로는 직접 처리해야 했던 SEO 대응도 기본적으로 지원돼서 개발이 더 수월했습니다.
    - 인증 기능은 NextAuth를 활용해 구현하고자 했으며, Next.js 환경에 최적화되어 있어서 복잡한 인증 로직을 간결하게 구성할 수 있습니다.
- **TypeScript**
    - 복잡한 데이터 구조에서도 타입을 정의해 안정적으로 개발하고, 컴파일 단계에서 오류를 확인하여 효율적인 개발을 하고자 선택했습니다.

<br/>

## 프로젝트 구조

```
app
 ┣ (components)
 ┃ ┣ DeleteModal.module.css
 ┃ ┣ DeleteModal.tsx
 ┃ ┣ Navbar.module.css
 ┃ ┣ Navbar.tsx
 ┃ ┗ Provider.tsx
 ┃    .
 ┃    .
 ┃    .
 ┣ api
 ┃ ┣ auth
 ┃ ┃ ┗ [...nextauth]
 ┃ ┃ ┃ ┗ route.ts
 ┃ ┣ db
 ┃ ┃ ┣ account
 ┃ ┃ ┃ ┣ leave
 ┃ ┃ ┃ ┃ ┗ route.ts
 ┃ ┃ ┃ ┣ modify
 ┃ ┃ ┃ ┣ reset-password
 ┃ ┃ ┃ ┗ search
 ┃ ┃    .
 ┃ ┃    .
 ┃ ┃    .
 ┣ account
 ┃ ┣ leave
 ┃ ┃ ┣ AccountLeave.module.css
 ┃ ┃ ┗ page.tsx
 ┃ ┗ modify
 ┣ admin
 ┃ ┗ inquiry
 ┃ ┃ ┣ detail
 ┣ detail
 ┣ find
 ┃ ┣ id
 ┃ ┗ password
 ┣ home
 ┣ library
 ┃ ┣ comment
 ┃ ┣ inquiry
 ┃ ┃ ┣ history
 ┃ ┃ ┃ ┣ detail
 ┃ ┣ like
 ┃ ┣ my-review
 ┃ ┣ reading
 ┃ ┃ ┣ detail
 ┃ ┣ wishlist
 ┣ login
 ┣ new
 ┣ popular
 ┣ profile
 ┃ ┗ edit
 ┣ search
 ┣ signup
 ┣ terms
 ┣ types
 ┃ ┗ next-auth.d.ts
 ┣ write
 ┃ ┗ review
 ┣ favicon.ico
 ┣ globals.css
 ┣ layout.tsx
 ┣ page.module.css
 ┗ page.tsx

```
<br/>

## 트러블 슈팅
- <작가의 다른 책> 리스트가 이전 페이지의 데이터를 보여주는 이슈
- 검색어 변경 시 페이지네이션의 현재 페이지가 초기화되지 않는 이슈
- iOS에서 메뉴 스크롤이 안 되는 이슈
<br/>

## 페이지별 기능 소개

#### [메인]
<p align="center">
  <img src="https://github.com/user-attachments/assets/90cbe053-770d-41c6-a38b-4110e5a7c281" width="40%" />
  <img src="https://github.com/user-attachments/assets/3708b2d6-5bb0-43f8-af8b-06aafeaa65d9" width="40%" />
</p>

- 접속 시 처음 보이는 화면으로, 인기 도서와 신규 도서 리스트를 가로 스크롤 형식으로 제공합니다.
- 리스트에 있는 도서를 클릭하면 도서 상세 페이지로 이동합니다.
- 회원들의 독서 랭킹과 추천 도서를 보여줍니다.

#### [로그인]
<p align="center">
  <img src="https://github.com/user-attachments/assets/dea51fac-563c-4377-83ee-c3d78e0a1b2e" width="50%" />
</p>

- 아이디와 비밀번호를 입력하고 로그인 버튼을 클릭하면 유효성 검사가 진행됩니다. 검사가 실패한 경우, 오류 메시지가 표시됩니다.
- 카카오 로그인(SNS 로그인)을 통해 사용자가 손쉽게 로그인할 수 있습니다. 만약 회원 정보가 없다면, 자동으로 회원가입이 진행됩니다.
- 로그인에 성공하면 메인 페이지로 이동합니다.

#### [회원가입]
<p align="center">
  <img src="https://github.com/user-attachments/assets/3071d188-dcb6-4ee7-8440-918a63db23ed" width="50%" />
</p>

- 모든 form을 입력한 후 회원가입 버튼을 클릭하면 유효성 검사가 진행됩니다. 실패한 경우 오류 메시지가 표시됩니다.
- 아이디와 닉네임은 ’중복 확인‘ 버튼을 눌러 중복 여부를 검증할 수 있습니다.
- 회원가입에 성공하면 메인 페이지로 이동합니다.

#### [인기/신규]
<p align="center">
  <img src="https://github.com/user-attachments/assets/f38e169f-1c9f-4345-ad2e-f2a6583b03cb" width="50%" />
</p>

- 메인 페이지에 표시되는 것과 동일한 인기 도서와 신규 도서 리스트를 제공합니다.

#### [도서 상세]
<p align="center">
  <img src="https://github.com/user-attachments/assets/f4562039-1eaa-42e2-8434-9a54b4218843" width="45%" />
  <img src="https://github.com/user-attachments/assets/41f72cd4-a665-4745-9804-01699b8bd048" width="45%" />
</p>

- 도서 카테고리, 출판사, 소개글, 작가의 다른 책 등 도서에 대한 상세 정보를 제공합니다.
- 해당 도서의 독서 상태를 ‘독서 중’ 또는 ‘독서 완료’으로 설정할 수 있습니다.
- 해당 도서에 리뷰를 작성하거나 위시리스트에 추가할 수 있습니다.
- LookBook 회원들이 작성한 리뷰와 별점이 페이지 하단에 표시됩니다. 각 리뷰에 좋아요를 누르거나 댓글을 작성할 수 있습니다.

#### [도서 검색]
<p align="center">
  <img src="https://github.com/user-attachments/assets/9fa5a951-e339-4511-aab0-7df447f53f3b" width="50%" />
</p>

- 도서 제목 또는 작가명을 검색하면 결과가 리스트로 표시됩니다.
- 검색 결과에 표시된 도서 표지나 제목을 클릭하면 해당 도서의 상세 페이지로 이동합니다.

#### [내 서재]
<p align="center">
  <img src="https://github.com/user-attachments/assets/454c0f74-9a1a-41e3-a87b-ed031a063e96" width="50%" />
</p>

- 프로필 수정 버튼을 클릭하면 이름, 닉네임, 독서 목표를 변경할 수 있습니다.
- 리뷰 작성 횟수, 다 읽은 책의 권수, 마지막 독서일을 보여줍니다.
- 독서 목표 달성률은 Progress Bar 형태로, 월별 독서 통계는 Bar Chart로 확인할 수 있습니다.
- 내가 작성한 리뷰, 최근 댓글 등을 간략하게 표시합니다.

#### [내 서재 > 독서 현황]
<p align="center">
  <img src="https://github.com/user-attachments/assets/55570508-3a2a-4a6f-aa2b-754068986d3d" width="50%" />
</p>

  - ‘다 읽은 책’과 ‘읽고 있는 책’ 탭으로 구분됩니다. 도서를 클릭하면 독서현황 상세 페이지로 이동합니다.
  - 상세 페이지의 상단 우측 버튼을 통해 독서 상태 변경, 리뷰 수정, 독서현황에서 삭제할 수 있습니다. 삭제 버튼을 클릭하면 삭제 여부를 재확인하는 모달이 나타납니다.
  - 작성된 리뷰에 댓글이 달린 경우, 댓글이 표시되며 추가 댓글을 입력 또는 기존 댓글 삭제가 가능합니다.
  - 작성된 리뷰가 없을 경우, ‘리뷰 작성하기’ 버튼이 표시됩니다.

#### [내 서재 > 위시리스트]
<p align="center">
  <img src="https://github.com/user-attachments/assets/022add07-4857-4978-941c-8d7b63fced89" width="50%" />
</p>

  - 위시리스트에 추가된 도서 목록을 확인할 수 있습니다.
  - ‘전체 선택’ 버튼을 눌러 위시리스트를 모두 삭제하거나, 특정 도서만 선택하여 삭제할 수 있습니다. 삭제 버튼을 클릭하면 삭제 여부를 재확인하는 모달이 나타납니다.

#### [내 서재 > 나의 리뷰]
<p align="center">
  <img src="https://github.com/user-attachments/assets/5e33bf03-1c37-4335-be09-0b17c330fe39" width="50%" />
</p>

  - 내가 작성한 리뷰를 보여줍니다.

#### [내 서재 > 댓글 알림]
<p align="center">
  <img src="https://github.com/user-attachments/assets/f8ef3000-79f2-4efd-b81c-af313ab2a393" width="50%" />
</p>

  - 내가 작성한 리뷰에 달린 댓글을 보여줍니다.

#### [내 서재 > 리뷰 공감 기록]
<p align="center">
  <img src="https://github.com/user-attachments/assets/7f809d51-9eb1-445c-9eb1-a8df96525f79" width="50%" />
</p>

  - 내가 좋아요를 누른 리뷰 목록이 표시됩니다.

#### [내 서재 > 문의하기/1:1 문의내역]
<p align="center">
  <img src="https://github.com/user-attachments/assets/43a61ecf-28e9-4624-a8ea-76d155880590" width="50%" />
</p>

  - 사이트 이용에 관한 궁금한 점이 있으면 문의글을 등록할 수 있고, 작성한 문의글 목록과 각 문의글의 답변 상태가 표시됩니다. 클릭하면 답변을 확인할 수 있습니다.
  - 관리자 계정으로 접속하여 문의글에 답변을 등록할 수 있습니다.

#### [내 서재 > 비밀번호 변경]
<p align="center">
  <img src="https://github.com/user-attachments/assets/7dbd349c-aee8-47b2-b801-fa1c1c501ea8" width="50%" />
</p>

  - 유효성 검사 후 비밀번호를 변경할 수 있습니다.

#### [내 서재 > 회원탈퇴]
<p align="center">
  <img src="https://github.com/user-attachments/assets/ff084402-13ec-497c-b04a-fb75c5d2e66b" width="50%" />
</p>

  - 탈퇴 사유를 다중 선택할 수 있습니다.
  - 탈퇴 전에 동의 체크 후 회원탈퇴 버튼을 클릭할 수 있습니다.
  - 탈퇴가 완료되면 메인 페이지로 이동합니다.
  <br/>

## 프로젝트 후기

기획부터 디자인, 개발까지 직장과 병행하며 진행하느라 예상보다 시간이 많이 걸렸지만, 얻은 것도 많았던 프로젝트입니다. 오랜만에 리액트를 사용한 프로젝트였고, 개발 도중 렌더링 타이밍 이슈나 Hook 관련 오류로 꽤 애를 먹기도 했습니다. 하지만 원인을 파악하고 해결해 나가는 과정에서 프론트엔드 구조와 리액트에 대한 이해도가 높아지고 그만큼 성장할 수 있었습니다.
이번 프로젝트는 단순히 기능 구현에 그치지 않고 성능과 구조까지 함께 고민해볼 수 있어서 굉장히 의미있는 시간이었습니다. 🤭
<br/>
