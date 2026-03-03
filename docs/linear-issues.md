# Linear 이슈 계획

> 프로젝트: 지피터스 사이트 리뉴얼 & 리팩토링
> 팀: Education (EDU)
> 담당자: 김한솔
> 기간: 2026-02-25 → 03-18 (3주)

---

## Phase 1: 기획 & PRD 수립 (02-25 → 03-03) — 마일스톤 생성 완료

### 1. 현황 분석 & 리서치 — ✅ Done | Est: 3 | EDU-6414

**목표**: 리뉴얼 방향 수립을 위한 현황 파악 및 데이터 수집

**작업 내용**:
- **사이트 크롤링**: WebFetch 기반 gpters.org 전체 크롤링 (메인/카테고리/외부 링크 3종), 사이트맵 역추출 (GNB 4개, 사이드바 30개 카테고리), Bettermode 구조적 한계 분석
- **벤치마킹 5개 서비스**: Reddit(2단계 IA, Flair, Karma), 모두의연구소(풀잎스쿨), 패스트캠퍼스(수강생 대시보드), LinkedIn(셀프브랜딩 프로필), 요즘IT(전문공개+게이팅)
- **운영진 인터뷰 4인**: 신연권(대표) — 관리 7단계, 스터디 진입 4단계 / 소연(디자이너) — 가독성, 전환 더딤 / 재호(마케터) — 이모지 혼란, Retool 의존 / 다혜(운영) — "AI계의 LinkedIn" 비전, DM 범람
- **LMS 분석**: Next.js 15 + Airtable 9개 테이블 구조, API 엔드포인트 매핑, 전화번호 인증 방식, n8n 자동화 파이프라인

**산출물** (8건):
- `docs/analysis/crawl-main-pages.md` — 메인 페이지 크롤링
- `docs/analysis/crawl-categories.md` — 30개 카테고리 크롤링
- `docs/analysis/crawl-external.md` — 외부 링크 크롤링
- `docs/analysis/01-current-site-structure.md` — 사이트 구조 분석
- `docs/interview/` — 인터뷰 4건 (신연권, 소연, 재호, 다혜)
- `docs/report/01-사이트-구조-분석.md` — 사이트맵 + 구조 분석
- `docs/report/02-벤치마킹-분석.md` — 5개 서비스 벤치마킹
- `docs/context/lms-migration-reference.md` — Airtable→Supabase 마이그레이션 레퍼런스

---

### 2a. 인터뷰 + 사이트 분석으로 문제정의 — ✅ Done | Est: 3 | EDU-6419

**목표**: 인터뷰 4건 + 유저 불만 24건 + 크롤링 데이터를 교차 분석하여 핵심 문제 정의 및 개선 방향 수립

**작업 내용**:
- **25개 문제점 도출** (6개 영역):
  - 방문자 3개: P1 전환 약함, P2 가독성 나쁨, P3 홈 과부하 "뭐가 이렇게 많지?"
  - 회원 6개: P4 카테고리 30개 혼재(Critical, 4명 전원), P5 검색/북마크 실종, P6 과제제출용 게시판, P7 임시저장 없음, P8 버튼 위치, P9 이모지 노이즈
  - 스터디 참여자 3개: P10 진입 4단계(Critical), P11 결제 전환 저조, P12 이력 안 보임(Critical)
  - 운영자 6개: P13 관리 7단계(Critical), P14 매핑 불명확(Critical), P15 이동 불가+웹훅(Critical), P16 Retool 의존, P17 텍스트 제약, P18 DM 범람
  - 브랜드 2개: P19 디자인 불일치, P20 프로모션 가시성
  - 플랫폼 5개: P21 "중간 다리"(Critical), P22 외부 도구 11개, P23 스터디장 경험, P24 불필요 페이지, P25 온보딩 없음
- **심각도 분류**: Critical 7, High 6, Medium 7, Low 5 — 인터뷰 교차 검증 후 9개 항목 재조정
- **13개 개선 방향** (D2~D16, 3개 흡수/백로그 제외): 정보구조 단순화, 2트랙 콘텐츠, 에디터 개선, 검색 강화, 전환 최적화, 스터디 접근, Admin 재설계, DM, AI 이력서, 디자인 시스템, 프로모션, LMS 내재화, 온보딩
- **문제-개선 매핑 매트릭스** 완성
- **UX 감사**: Nielsen 10가지 휴리스틱 평가 (시스템 가시성 2/5, 시스템-현실 일치 3/5 등)
- **유저 시나리오 5개 페르소나**: AI 입문자, 스터디 참여자, 운영진, 마케터, 일반 활용자 — 각 As-Is/To-Be 시나리오

**산출물** (4건):
- `docs/report/00-문제-개선-정의서.md` — 25개 문제 + 13개 개선방향 + 매핑 매트릭스 (313줄, 검토 완료)
- `docs/report/03-UX-감사-보고서.md` — Nielsen 10가지 휴리스틱 평가
- `docs/report/04-유저-시나리오.md` — 5개 페르소나별 As-Is/To-Be
- `docs/analysis/02-ux-analysis.md` — UX 분석 원본 데이터

---

### 2b. 개선점 바탕으로 사이트 구조 설계 — ✅ Done | Est: 3 | EDU-6420

**목표**: 25개 문제와 13개 개선방향을 바탕으로 새 사이트의 정보 구조(IA) 설계 및 핵심 화면 와이어프레임 작성

**작업 내용**:
- **IA 설계**:
  - 8개 설계 원칙: 3클릭 도달, 분류 단순화, 역할 기반 동선, SEO 우선 URL, 전환 최적화, 참여 진입장벽 최소화, 기여 가시화, 메시지 신뢰성
  - GNB 재설계: 4개 → 7개 메뉴 (탐색, 스터디, 커뮤니티, AI 이력서, 메시지, 검색, 프로필)
  - 카테고리: 30개 혼재 → 6개 대분류 + 태그
  - 프로필 드롭다운: 역할별 동적 메뉴 (조건부: 내 스터디, 스터디 관리, 관리자 대시보드)
  - URL 구조: `/explore/feed`, `/posts/{slug}`, `/study/{slug}`, `/profile/{username}`, `/admin/*`, `/study/my`, `/study/manage/{slug}`
  - 유저 플로우 3종: 비회원→회원, 회원→수강생, 수강생 학습 루프
- **와이어프레임 7개 화면** (ASCII):
  1. 홈: 히어로 캐러셀 + 인기 Top 3 + 카테고리 그리드 + 모집 중 스터디
  2. 콘텐츠 피드: 6개 탭 + 태그 필터 + 정렬 + 카드 그리드
  3. 게시글 상세: 본문 + 투표 + 계층형 댓글 + 관련 스터디 + 게이팅 CTA
  4. 스터디 상세: 전용 랜딩(사이드바 제거) + Sticky CTA + 커리큘럼 + 후기 + FAQ
  5. AI 이력서: 4개 탭(개요/이력/작성글/스킬맵) + 수료 뱃지 + 외부 공유
  6. 통합 검색: 게시글/스터디/사용자 3탭 + 자동완성
  7. 어드민: flat 사이드바 + 통계 카드 + 빠른 작업

**산출물** (3건):
- `docs/report/05-Information-Architecture.md` — IA 설계 (8개 원칙, GNB, URL, 유저 플로우)
- `docs/report/06-와이어프레임.md` — 7개 화면 ASCII 와이어프레임
- `docs/analysis/03-ia-proposal.md` — IA 초안 분석 데이터

---

### 3. PRD 작성 (사이트/어드민/LMS/디자인 가이드) — ✅ Done | Est: 5 | EDU-6416

**목표**: 3개 제품 영역별 PRD + 공통 디자인 가이드 + LMS 마이그레이션 레퍼런스 작성

**작업 내용**:
- **01-사이트 PRD** (928줄): 11개 기능(F1~F11), 7개 화면 상세 스펙, 화면별 컴포넌트/데이터/인터랙션 정의, 전환 퍼널 설계
- **02-어드민 PRD** (1,339줄): 17개 기능, flat IA 16개 메뉴(기존 7단계→1~2클릭), 역할 기반 접근 제어, 프론트-어드민 매핑 21개(Appendix A), TBD 15개(Appendix B), 유저 플로우 7종
- **03-LMS PRD** (1,051줄): 수강생 파트(대시보드 6종 카드, 학습 상세, VOD, 수료), 스터디장 파트(관리 대시보드, 수강생 현황, VOD 등록, 공지, 베스트발표자), UX 플로우 5개 이슈(과제 연동 권한, 찐친챌린지, 세션→VOD, 리더보드, 수료 판정)
- **04-디자인 가이드**: 기술 스택(Next.js 16, Tailwind v4, @gpters-internal/ui, lucide-react, Supabase), 18개 공통 컴포넌트 카탈로그, 3종 레이아웃 패턴, 컴포넌트 구조(ui/site/admin/lms)
- **LMS 마이그레이션 레퍼런스**: Airtable 9개 테이블→Supabase 1:1 매핑, API 대응, 비즈니스 로직 이관(과제 연동 권한, 수료 기준, 가격 자동 전환)

**산출물** (5건):
- `docs/prd/01-사이트-PRD.md` (928줄)
- `docs/prd/02-어드민-PRD.md` (1,339줄)
- `docs/prd/03-LMS-수강생대시보드-PRD.md` (1,051줄)
- `docs/prd/04-디자인-가이드.md`
- `docs/context/lms-migration-reference.md`

---

### 4. PRD 교차 검증 & 정합성 확보 — ✅ Done | Est: 3 | EDU-6417

**목표**: 3개 PRD + 디자인 가이드 간 충돌/누락/불일치를 발견하고 해소하여 단일 정합성 확보

**작업 내용**:
- **시스템 구조도 작성** (450줄, 9개 섹션):
  - 시스템 관계 개요, 역할별 동선 5종, URL 소유권 맵 37개, 데이터 흐름도 5종
  - 핵심 자동화 체인 5개, 프로필 드롭다운 통합 뷰, 데이터 오너십 맵
- **10개 불일치/갭 도출 → 전수 해결**:
  1. GNB 구조 불일치 → 3상태 GNB로 통일 (비로그인/로그인 일반/로그인 수강생)
  2. 프로필 드롭다운 불일치 → 01-사이트를 단일 소스로, 03은 참조
  3. 스터디장 접근 경로 충돌 → LMS 경로로 통일 (/study/manage)
  4. 사이트맵에 LMS 라우트 미반영 → 11개 라우트 추가
  5. 리더보드 홈 미포함 → 수강생 대시보드에만 배치
  6. 통합 권한 모델 부재 → 7단계 역할 모델 (03-LMS 단일 소스), 마케터 역할 제거
  7. 디자인 가이드 LMS 컴포넌트 미반영 → 6개 컴포넌트 추가
  8. 글쓰기 URL 패턴 불일치 → `/write?type=case` 통일
  9. 수료 기준 표현 → 충돌 없음, 예시 표기 명확화
  10. 최종제출 토글 이중 존재 → 의도된 이중 접근, 수정 불필요
- **추가 PRD 보강**: 체크아웃 페이지(/checkout/{studyId}), 계정 설정(/settings/*) 신규 추가

**산출물** (2건):
- `docs/prd/05-시스템-구조도.md` (450줄, 9개 섹션)
- `docs/prd/교차-검증.md` (10개 이슈 + 해결 내역)

---

### 5. Development Guide 작성 — ✅ Done | Est: 3 | EDU-6418

**목표**: PRD를 병렬 개발 가능한 작업 단위로 분해하고, 에이전트 팀 기반 실행 구조 설계

**작업 내용**:
- 에이전트 팀(TeamCreate) 구성: 리드 1 + Explore 에이전트 4명이 PRD 병렬 분석
- **Supabase 통합 스키마**: 31개 테이블, 7개 도메인 (사용자/콘텐츠/스터디/결제/학습/운영/통계)
- **개발 배치 6개** (의존성 기반 그룹화, 배치 내 병렬 가능):
  - Batch 0: 공유 인프라 (DB, Auth, 공통 UI 13개, 레이아웃, 권한 모델)
  - Batch 1: 콘텐츠 코어 (홈, 피드, 게시글, 글쓰기, 커뮤니티)
  - Batch 2: 어드민 MVP (대시보드, 게시글/배너/텍스트/스터디 관리)
  - Batch 3: 스터디 + 결제 (목록, 상세, 체크아웃, 상품/쿠폰, 계정 설정)
  - Batch 4: LMS 수강생 (대시보드, 학습, VOD, 과제, 청강)
  - Batch 5: LMS 스터디장 + 어드민 확장 (스터디장 대시보드, 기수/세션)
  - Batch 6: 고급 기능 (AI 이력서, 검색, 메시지, 수료, 리더보드 등 14개 — 서로 독립)
- **병렬 실행 가이드**: 에이전트 배정, 의존성 체크리스트
- **PRD 참조 맵**: 배치별 참조할 PRD 섹션 매핑
- **핵심 자동화 로직 4개**: 과제 연동 권한, 가격 자동 전환, 수료 판정, GNB 상태 분기

**산출물** (1건):
- `docs/dev-guide.md` (Supabase 31개 테이블 + 6개 배치 + 병렬 실행 가이드)

---

## Phase 2: 프로토타입 구현 (03-03 → 03-14) — 마일스톤 생성 완료

> dev-guide.md의 Batch 0~6 구조 기반. 배치 내 작업은 병렬 실행 가능.

### 5-1. 디자인 시스템 정리 & 핵심 페이지 리디자인 — ✅ Done | Est: 3 | EDU-6485

**목표**: 프로토타입의 디자인 시스템 정리 및 핵심 3개 페이지 Reddit-inspired 스타일 리디자인

**작업 내용**:
- 색상 토큰 단순화: `@gpters-internal/ui` 임포트 제거 → `globals.css` @theme에 직접 hex 값 (3-layer → 1-layer)
- 핵심 페이지 Reddit 스타일 리디자인 3개: 홈, 탐색, 커뮤니티 (2컬럼 피드 + 사이드바)
- 공용 컴포넌트 추출 7개: announcement-bar, sort-tabs, community-info-card, category-list, sidebar-study-list, community-rules, feed-post
- Navbar 드롭다운 메뉴 (알림 + 프로필) + useClickOutside 훅
- Footer Reddit 스타일 변경, bg-background 불필요 클래스 정리 (~40 파일), hero-banner.tsx 삭제, CLAUDE.md 업데이트

---

### 5-2. 남은 페이지 컴포넌트 추출 & 디자인 일관성 적용 — 📋 Todo | Est: 2 | EDU-6486

**목표**: 나머지 4개 페이지(게시글 상세/프로필/검색/메시지) 하드코딩 UI → 컴포넌트 추출, Reddit-inspired 디자인 일관성 적용

**작업 내용**:
- 게시글 상세 (`/posts/[slug]`) — 6개 섹션 (InlineSignupCTA, ReaderStats, RelatedStudyCard 등)
- 프로필 (`/profile/[username]`) — 9개 섹션 (ProfileHeader, SkillMap, BadgesList 등)
- 검색 (`/search`) — 4개 섹션 (SearchInput, TypeFilter 등)
- 메시지 (`/messages`) — 3개 섹션 (MessageItem, NotificationItem 등)

---

### 6. Batch 0 — 공유 인프라 — 📋 Todo | Est: 3 | EDU-6487

**목표**: 모든 배치의 선행 작업. DB, Auth, 공통 UI, 레이아웃 완성

**작업 내용**:
- Supabase 31개 테이블 마이그레이션 + RLS + Auth + Storage 버킷
- 공통 UI 컴포넌트 13개 (Button, Card, Tabs, Badge, Avatar, Input, Table, List, Pagination, Progress, Accordion, Breadcrumb, CTA Section)
- Root Layout: 3상태 GNB (비로그인/로그인 일반/로그인 수강생) + Footer
- Admin Layout: Sidebar(w-48) + Content
- 7단계 역할 모델 구현 + 미들웨어 접근 제어 + 프로필 드롭다운

**참조**: dev-guide.md §2, 01-사이트 4.1~4.3, 03-LMS 5.3

---

### 7. Batch 1 — 콘텐츠 코어 — 📋 Todo | Est: 3 | EDU-6488

> **Blocked by**: EDU-6487 (Batch 0)

> Batch 2와 **병렬 가능**

**목표**: 콘텐츠 소비/생산 핵심 경로. 어드민/LMS 의존 없이 독립 개발

**작업 내용**:
- 홈 (`/`): 히어로 캐러셀, 인기 콘텐츠, 카테고리 6개, 모집 중 스터디, 비회원 CTA
- 콘텐츠 피드 (`/explore/feed`): 카테고리 탭, 태그 필터, 정렬(인기/최신/추천), 무한스크롤
- 게시글 상세 (`/posts/{slug}`): Sticky 투표바, 본문(720px), 독자 통계, 댓글, 관련 글
- 커뮤니티 피드 (`/community/feed`): 인라인 작성 폼, 4탭(피드/자유/Q&A/이벤트)
- 글쓰기 (`/write`): 타입 선택, 리치 텍스트 에디터, 자동 저장(30초), 임시저장
- **site/ 컴포넌트**: hero-banner, post-card, study-card, vote, comment, inline-post-form

**참조**: dev-guide.md §3 Batch 1, 01-사이트 5.1~5.3, F1~F4

---

### 8. Batch 2 — 어드민 MVP — 📋 Todo | Est: 3 | EDU-6489

> **Blocked by**: EDU-6487 (Batch 0)

> Batch 1과 **병렬 가능**. 프로토타입 4개 확장 + 신규 2개

**목표**: 운영자 핵심 도구. 대시보드, 게시글/배너/텍스트/스터디 관리

**작업 내용**:
- 대시보드 (`/admin`): 통계 5개, 빠른 작업 8개, 최근 활동 피드
- 게시글 관리 (`/admin/posts`): 검색, 필터, 카테고리 이동(1클릭), 일괄 작업
- 배너 관리 (`/admin/banners`): 3탭, 드래그 순서, 활성/비활성, 미리보기
- 텍스트 관리 (`/admin/texts`): 영역별 인라인 편집, 미리보기, 히스토리 — **신규**
- 스터디 관리 (`/admin/studies`): 기수 필터, 상태 드롭다운, 최종제출 토글, 참여자 현황 패널 추가
- **admin/ 컴포넌트**: sidebar, stat-card, quick-action, bulk-action-bar, activity-feed

**참조**: dev-guide.md §3 Batch 2, 02-어드민 3.1~3.6, 5.1~5.3

---

### 9. Batch 3 — 스터디 + 결제 — 📋 Todo | Est: 3

**목표**: 스터디 탐색 → 결제 전환 퍼널 + 상품/쿠폰 관리

**작업 내용**:
- 스터디 목록 (`/study`): 상태 필터, 카드 리스트
- 스터디 상세 (`/study/{slug}`): 5탭, 커리큘럼 아코디언, Sticky CTA, 모집률 바
- 체크아웃 (`/checkout/{studyId}`): 가격, 쿠폰, 버디, PG 연동(토스페이먼츠), 약관 — **신규**
- 계정 설정 (`/settings/*`): 내 정보, 구매내역, 쿠폰, 알림 — **신규**
- 상품/쿠폰 관리 (`/admin/products`): 상품 CRUD, 가격 단계, 쿠폰 — **신규**
- 결제/주문 관리 (`/admin/orders`): 주문 검색, 환불 처리 — **신규**

**참조**: dev-guide.md §3 Batch 3, 01-사이트 5.4/5.7/5.8, 02-어드민 3.7~3.8

---

### 10. Batch 4 — LMS 수강생 — 📋 Todo | Est: 3

**목표**: 수강생 핵심 경험. 대시보드, 학습, VOD, 과제 연동

**선행**: Batch 1(글쓰기) + Batch 3(결제/enrollment) 완료

**작업 내용**:
- 수강생 대시보드 (`/study/my`): 진행 중 스터디, 이번 주 할 일, 진도 추적
- 스터디 학습 (`/study/{slug}/learn`): 주차별 커리큘럼, 출석/과제/VOD 상태
- VOD 다시보기 (`/study/{slug}/learn/vod`): 내 스터디/다른 스터디 탭, 과제 연동 잠금/해제
- 과제 현황 (`/study/{slug}/learn/tasks`): 주차별 과제 상태
- 청강 VOD (`/study/my/audit`): 전체 스터디 VOD, 필터
- **lms/ 컴포넌트**: week-progress, action-item-card, vod-card, vod-lock-card, enrollment-card, assignment-guide
- **핵심 로직**: 과제 연동 권한 (매주 월요일 리셋), 글쓰기 URL 통일 (`/write?type=case&studyId=...&week=...`)

**참조**: dev-guide.md §3 Batch 4, 03-LMS 3.1/3.3/4.1

---

### 11. Batch 5 — LMS 스터디장 + 어드민 확장 — 📋 Todo | Est: 3

**선행**: Batch 4 완료

**목표**: 스터디장 관리 도구 + 운영자 기수/세션 관리

**작업 내용**:
- 스터디장 대시보드 (`/study/manage/{slug}`): 설정, 최종제출 토글, 스터디 요약, 미제출자
- 수강생 현황 (`/study/manage/{slug}/members`): 출석/과제 매트릭스, 수료 예측
- VOD 관리 (`/study/manage/{slug}/vod`): VOD 등록, 드래그 정렬
- 공지 관리 (`/study/manage/{slug}/notices`): 3카테고리, 순서 변경
- 기수 관리 (`/admin/cohorts`): 기수 CRUD, 타임라인, 스터디 슬롯 — **신규**
- 세션 관리 (`/admin/sessions`): 세션 CRUD, 반복 패턴, 캘린더 — **신규**
- **lms/ 컴포넌트**: attendance-matrix, session-card

**참조**: dev-guide.md §3 Batch 5, 03-LMS 3.2/4.2, 02-어드민 3.10~3.11

---

### 12. Batch 6 — 고급 기능 — 📋 Todo | Est: 4

> 각 작업이 **서로 독립적**이므로 에이전트 2~3명 병렬 가능

**목표**: AI 이력서, 검색, 메시지, 수료, 리더보드 등 부가 기능

**작업 내용**:
- AI 이력서 (`/profile/{username}`): 프로필, AI 요약, 스킬 맵, 스터디 이력, 4탭
- 검색 (`/search`): 통합 검색, 타입 필터 탭, 페이지네이션
- 메시지 (`/messages`): 3탭(받은/보낸/알림), 미읽음 배지
- 수료/환급 (`/admin/completion`): 수료 기준 설정, 판정 실행, 수료증 발급, 환급 — **신규**
- 리더보드: 활동왕 Top 10 (수강생 대시보드 내)
- 찐친챌린지: 인증 현황 + Top 5
- 베스트발표자: 스터디장 선정 카드
- 수강 이력 (`/study/my/history`), 수료증 (`/study/my/certificates`)
- 회원 관리 (`/admin/users`), 뱃지 (`/admin/badges`), 분류 (`/admin/taxonomy`)
- 신고/모더레이션 (`/admin/moderation`), 리포트 (`/admin/reports`)
- **lms/ 컴포넌트**: certificate-view, leaderboard, challenge-widget, best-presenter-card

**참조**: dev-guide.md §3 Batch 6, 01-사이트 F7~F8, 02-어드민 3.11~3.15, 03-LMS 3.3.4~3.3.6

---

## Phase 3: 통합 & 릴리즈 준비 (03-14 → 03-18) — 마일스톤 미생성

### 13. Supabase 연동 & 데이터 바인딩 — 📋 Todo | Est: 3

**목표**: 정적 프로토타입을 실제 데이터와 연결하여 동작하는 상태로 전환

**작업 내용**:
- 정적 목업 → Supabase DB 연결 (서버 액션/API 라우트)
- RLS 정책 적용 (7단계 역할별 접근 제어)
- Supabase Auth 연동 (회원가입/로그인/세션)
- 핵심 자동화 로직 구현: 과제 연동 권한(매주 리셋), 가격 자동 전환, 수료 판정
- 실시간 구독 검토 (공지사항, 리더보드 등)

---

### 14. 통합 점검 & 배포 — 📋 Todo | Est: 2

**목표**: 전체 화면 간 연결 확인 및 초기 배포

**작업 내용**:
- 화면 간 네비게이션 & 권한 플로우 검증 (3상태 GNB, 역할별 라우트)
- 반응형/크로스 브라우저 확인 (Chrome, Safari, Mobile)
- Vercel 배포 & 도메인 연결
- 운영진 데모 & 피드백 수집

---

### 15. 피드백 반영 & 최종 조정 — 📋 Todo | Est: 2

**목표**: 운영진 피드백 반영 및 프로토타입 완성

**작업 내용**:
- 운영진 리뷰 피드백 반영
- UI 디테일 조정 (간격, 색상, 반응형)
- 프로젝트 문서 최종 정리
- 다음 단계 (정식 개발) 로드맵 정리
