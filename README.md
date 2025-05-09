# 🩺🍽️ ChiDiet – 체질 기반 건강 식단 플랫폼

<img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white"> <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black"> <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black"> <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white"> <img src="https://img.shields.io/badge/shadcn%2Fui-000000?style=for-the-badge&logo=shadcnui&logoColor=white"> <img src="https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white"> <img src="https://img.shields.io/badge/Zustand-000000?style=for-the-badge&logo=zustand&logoColor=white"> <img src="https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white"> <img src="https://img.shields.io/badge/Zod-3E67B1?style=for-the-badge&logo=zod&logoColor=white">

<img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white"> <img src="https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white"> <img src="https://img.shields.io/badge/OpenAI-412991?style=for-the-badge&logo=OpenAI&logoColor=white"> <img src="https://img.shields.io/badge/LangChain-000000?style=for-the-badge&logo=LangChain&logoColor=white"> <img src="https://img.shields.io/badge/ChromaDB-40496D?style=for-the-badge&logo=ChromaDB&logoColor=white"> <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white"> <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white"> <img src="https://img.shields.io/badge/docker--compose-2496ED?style=for-the-badge&logo=docker&logoColor=white"> <img src="https://img.shields.io/badge/Uvicorn-339933?style=for-the-badge&logo=uvicorn&logoColor=white">

---

# ✅ 프로젝트 개요

ChiDiet는 한의학 기반 체질 진단을 통해 사용자에게 개인화된 건강 레시피와 식단을 제안하는 웹 플랫폼입니다.  
- **AI 데이터 파이프라인 & LLM API**: `Ai-Data`  
- **REST API 서버**: `Backend` (FastAPI + MongoDB + WebSocket)  
- **사용자 인터페이스**: `Frontend` (Next.js 14 App Router + Shadcn UI + Tailwind CSS)

### ✔️ 주요 기능
- 체질 진단 챗봇 (LangChain + OpenAI)  
- 맞춤형 레시피 추천 (RAG + Agent 기반 생성/평가)  
- 웹소켓 실시간 알림 및 업데이트  

---

# ✅ 프로젝트 구조

```bash
.
├── Ai-Data
│   ├── crawling/         # 레시피 데이터 크롤링 스크립트
│   ├── data/             # 전처리된 CSV 데이터
│   └── llm/              # LangChain + FastAPI LLM API
├── Frontend
│   ├── src/
│   │   ├── app/          # Next.js App Router 페이지
│   │   ├── components/   # shadcn/ui & 공통 컴포넌트
│   │   ├── contexts/     # Zustand 전역 상태
│   │   └── lib/          # 유틸 및 API 호출
│   └── public/           # 정적 자산
└── Backend
    ├── api/              # FastAPI 라우터
    ├── db/               # MongoDB 연결 및 초기화
    ├── models/           # Pydantic 스키마/모델
    ├── crud/             # CRUD 유틸리티
    └── main.py           # FastAPI 앱 진입점
```

---

# ✅ 시작하기

## 1. 저장소 클론
```bash
git clone <repository-url>
cd constitution-recipe/web
```

## 2. Ai-Data 실행
```bash
cd Ai-Data
# 데이터 크롤링
python crawling/ttrecipe_crawl.py
python crawling/ttrecipe_crawl_multi.py

# LLM API
cd llm
pip install -r requirements.txt
cp .env.example .env  # OPENAI_API_KEY 등 설정
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## 3. Backend 실행
```bash
cd ../../Backend
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 1492
```

## 4. Frontend 실행
```bash
cd ../Frontend
npm install
npm run dev
```

---

# ✅ 추가 자료
- 프로젝트 상세 문서  
  - Ai-Data: `Ai-Data/README.md`  
  - Frontend: `Frontend/README.md`  
  - Backend: `Backend/README.md`  
- Next.js Docs: https://nextjs.org/docs  
- Shadcn/UI Docs: https://ui.shadcn.com/docs  

---

# ✅ 라이선스
이 프로젝트는 MIT 라이선스를 따릅니다.  