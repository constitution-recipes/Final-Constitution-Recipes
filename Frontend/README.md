# 🩺🍽️ ChiDiet - 체질 기반 건강 식단 플랫폼

<img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white"> <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black"> <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=JavaScript&logoColor=black"> <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white"> <img src="https://img.shields.io/badge/shadcn%2Fui-000000?style=for-the-badge&logo=shadcnui&logoColor=white"> <img src="https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white"> <img src="https://img.shields.io/badge/Zustand-000000?style=for-the-badge&logo=zustand&logoColor=white"> <img src="https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white"> <img src="https://img.shields.io/badge/Zod-3E67B1?style=for-the-badge&logo=zod&logoColor=white">

## 프로젝트 개요
ChiDiet는 한의학 기반의 체질 진단을 통해 사용자에게 개인화된 건강 레시피와 식단을 제안하는 웹 플랫폼입니다. Next.js와 React를 기반으로 개발되었으며, LLM(챗봇)을 활용한 체질 진단부터 맞춤형 레시피 추천, 식단 플래너, 장바구니 자동화까지 원스톱 서비스를 제공합니다. 사용자 친화적인 UI/UX와 반응형 디자인을 통해 접근성을 높였으며, Shadcn UI와 Tailwind CSS를 활용하여 모던하고 일관된 디자인 시스템을 구축했습니다. 프론트엔드는 Next.js의 App Router를 활용한 서버 컴포넌트와 클라이언트 컴포넌트의 하이브리드 방식으로 최적화된 성능을 제공합니다.

## 프로젝트 구조
```
frontend
 ┣ src
 ┃ ┣ app
 ┃ ┃ ┣ auth/                  # 로그인/회원가입 관련 페이지
 ┃ ┃ ┣ constitution-diagnosis/ # 체질 진단 페이지
 ┃ ┃ ┣ constitution-detail/   # 체질 상세 정보 페이지 
 ┃ ┃ ┣ constitution-intro/    # 체질 소개 페이지
 ┃ ┃ ┣ chatbot/               # 챗봇 인터페이스 페이지
 ┃ ┃ ┣ recommend_recipes/     # 레시피 추천 페이지
 ┃ ┃ ┣ recipe/                # 개별 레시피 상세 페이지
 ┃ ┃ ┣ saved/                 # 저장된 레시피/식단 페이지
 ┃ ┃ ┣ profile/               # 사용자 프로필 페이지
 ┃ ┃ ┣ admin/                 # 관리자 페이지
 ┃ ┃ ┣ page.js                # 메인 홈페이지
 ┃ ┃ ┣ layout.js              # 루트 레이아웃
 ┃ ┃ ┗ globals.css            # 전역 스타일
 ┃ ┣ components
 ┃ ┃ ┣ ui/                    # shadcn/ui 기반 UI 컴포넌트
 ┃ ┃ ┣ layout/                # 레이아웃 관련 컴포넌트
 ┃ ┃ ┣ common/                # 공통 컴포넌트
 ┃ ┃ ┣ auth/                  # 인증 관련 컴포넌트
 ┃ ┃ ┗ recipe/                # 레시피 관련 컴포넌트
 ┃ ┣ contexts/                # 전역 상태 및 컨텍스트
 ┃ ┣ lib/                     # 유틸리티 함수 및 헬퍼
 ┃ ┗ middleware.js            # Next.js 미들웨어
 ┣ document                    # 프로젝트 문서화
 ┣ public                      # 정적 파일
 ┣ tailwind.config.js          # Tailwind 설정
 ┣ package.json                # 의존성 관리
 ┗ next.config.js              # Next.js 설정
```

## 사용법

### 개발 환경 설정
```bash
# 저장소 클론
git clone <repository-url>
cd frontend

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

### 빌드 및 배포
```bash
# 프로덕션 빌드
npm run build

# 서버 실행
npm run start
```

### 주요 기능

#### 체질 진단
- **AI 챗봇 진단**: 사용자와 대화를 통해 8체질(목양·목음·토양·토음·금양·금음·수양·수음) 진단
- **진단 결과 시각화**: 체질별 특성, 권장/비권장 식품 정보 제공

#### 맞춤형 레시피
- **개인화 추천**: 체질·선호도·알러지 기반 맞춤형 레시피 추천
- **레시피 상세**: 준비 재료, 조리 과정, 영양 정보, 체질 적합성 표시

#### 레시피 생성
- **RAG 기반 레시피 생성**: 체질 정보와 사용자 선호도를 바탕으로 레시피 벡터 DB에서 유사 레시피를 검색하여 맞춤형 레시피 자동 생성
- **Agent 기반 동적 생성**: 내부 검색 실패 시 Agent가 웹 크롤링, DB 검색, LLM 생성 등의 도구를 조합하여 새로운 레시피 생성
- **자동 품질 평가**: 생성된 레시피는 논리성, 영양 균형, 체질 적합성 등을 AI로 자동 평가하여 고품질 레시피만 제공
- **커스터마이징**: 생성된 레시피를 사용자 요구에 맞게 재료 대체, 조리법 변경 등 실시간 조정 가능

## 기술 스택 세부 설명

### Frontend
- **Next.js 15**: App Router 기반 서버 컴포넌트와 클라이언트 컴포넌트 하이브리드 구조
- **React 18**: 최신 React 기능과 훅 활용
- **Tailwind CSS**: 유틸리티 우선 CSS 프레임워크
- **shadcn/ui**: 재사용 가능한 UI 컴포넌트 시스템
- **Framer Motion**: 부드러운 애니메이션과 전환 효과
- **Zustand**: 간결한 전역 상태 관리
- **Zod**: 타입 유효성 검증
- **Axios**: HTTP 클라이언트

### 디자인 시스템
- **컬러 팔레트**: 그린 계열 중심의 자연친화적 색상 체계
- **타이포그래피**: Noto Sans KR 기반의 가독성 높은 체계
- **애니메이션**: 페이지 전환 및 요소 등장 시 자연스러운 모션
- **반응형 디자인**: 모바일, 태블릿, 데스크톱 대응

## 시작하기

### 필수 요구사항
- Node.js 18.0 이상
- npm 또는 yarn

### 개발 명령어
```bash
# 개발 서버 실행 
npm run dev

# 린트 검사
npm run lint

# 프로덕션 빌드
npm run build

# 빌드된 앱 실행
npm run start
```

## 참여하기
- 이슈 등록: GitHub Issues를 통해 버그 신고 또는 기능 제안
- PR 제출: 코드 기여는 PR을 통해 제출해주세요
- 코드 스타일: ESLint 규칙을 준수해주세요

## 라이선스
이 프로젝트는 MIT 라이선스를 따릅니다.
