# 디자인 가이드

## 1. 개요
ChiDiet(체다이어트)는 한의학 체질 이론과 현대 AI를 결합해 개인 맞춤형 건강 식단을 제공하는 플랫폼입니다. 본 디자인 가이드는 플랫폼 UI/UX의 통일성·일관성·접근성을 보장하고, 모던하면서도 따뜻한 이미지를 전달하기 위해 작성되었습니다.

## 2. 디자인 시스템
### 2.1 컬러 팔레트
컬러는 CSS 변수와 Tailwind CSS의 `theme.extend.colors`를 활용합니다.

| 용도        | CSS 변수       | 예시 값 (H/S/L)      | Tailwind 클래스           |
|------------|---------------|----------------------|---------------------------|
| Primary    | --primary     | 171 60% 50% (teal)   | `bg-primary`, `text-primary`   |
| Secondary  | --secondary   | 220 60% 45% (blue)   | `bg-secondary`, `text-secondary` |
| Accent     | --accent      | 45 90% 51% (orange)  | `bg-accent`, `text-accent`     |
| Background | --background  | 0 0% 100% (white)    | `bg-background`              |
| Card       | --card        | 0 0% 98% (off-white) | `bg-card`                    |
| Border     | --border      | 210 16% 82% (gray)   | `border`                     |
| Muted      | --muted       | 210 16% 93% (light)  | `text-muted`, `bg-muted`     |

### 2.2 타이포그래피
- **Font**: Noto Sans KR (Google Fonts, `next/font/google`)
- **계층**:
  - H1: 2.25rem (36px), font-weight 600
  - H2: 1.875rem (30px), font-weight 600
  - H3: 1.5rem (24px), font-weight 500
  - Body: 1rem (16px), font-weight 400
  - Caption: 0.875rem (14px), font-weight 400

### 2.3 레이아웃 & 그리드
- **Container**: max-width 1200px 이상, horizontal padding `2rem`
- **Spacing Scale**: 0.25rem(`1`), 0.5rem(`2`), 1rem(`4`), 1.5rem(`6`), 2rem(`8`)
- **Breakpoints**:
  - sm: 640px
  - md: 768px
  - lg: 1024px
  - xl: 1280px
  - 2xl: 1400px

## 3. 공통 컴포넌트
### 3.1 버튼 (Button)
- **종류**: Primary, Secondary, Ghost, Disabled
- **모양**: `rounded-lg`, `shadow-sm`
- **예시**:
  ```html
  <button class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
    저장하기
  </button>
  ```

### 3.2 입력 필드 (Input)
- **모양**: `rounded-full`, `border-none`, `shadow-inner`
- **focus**: `ring-2 ring-primary/50`
- **예시**:
  ```html
  <input
    type="text"
    class="px-4 py-3 bg-muted text-foreground rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
    placeholder="검색하기"
  />
  ```

### 3.3 카드 (Card)
- **스타일**: `bg-card`, `border border-border`, `rounded-lg`, `shadow`
- **내부 여백**: `p-4`
- **예시**:
  ```html
  <div class="bg-card border border-border rounded-lg shadow p-4">
    <!-- 콘텐츠 -->
  </div>
  ```

## 4. 레이아웃
### 4.1 NavBar
- **높이**: `4rem` (h-16)
- **배경**: `bg-white`, `border-b border-border`
- **구성**: 왼쪽 로고, 오른쪽 메뉴/아이콘
- **예시**:
  ```html
  <nav class="h-16 bg-white flex items-center justify-between px-6 border-b border-border">
    <!-- 로고 / 아이콘 -->
  </nav>
  ```

### 4.2 사이드바 (SidebarLayout)
- **너비**: `16rem` (w-64)
- **배경**: `bg-background`, `border-r border-border`
- **모바일**: `w-0 md:w-64`

## 5. 애니메이션 & 전환
- **Fade-in**: `animate-fade-in`
- **Slide-up**: `animate-slide-up`
- **모달 / 옵션**: `transition-all duration-300 ease-out`

## 6. 반응형 디자인
- **Mobile-First**
- 주요 레이아웃 전환: `md:` 이상에서 사이드바, `lg:` 이상에서 2-컬럼 등

## 7. 접근성 (Accessibility)
- **색 대비**: WCAG AA 이상
- **키보드 네비게이션**: `:focus-visible` 스타일링
- **ARIA 속성** 활용 (aria-label, aria-hidden 등)

## 8. Tailwind 설정
- `tailwind.config.js`의 `theme.extend`에 위 디자인 토큰 반영
- `content` 경로: `app/`, `components/`, `pages/`

## 9. 폴더 구조 및 네이밍
- **컴포넌트**: `src/components/ui` (shadcn), `src/components/common`
- **페이지**: `src/app/<feature>`
- **컨텍스트 / 훅**: `src/contexts`, `src/lib`

## 10. 문서화 & 커밋 가이드
- **문서**: `document/` 또는 `docs/`에 마크다운 파일 작성
- **커밋 메시지**: Angular 스타일 (feat, fix, refactor) 권장
- **Storybook**: `.storybook/`에 구성하여 컴포넌트 문서화