# GPTers 사이트 리뉴얼 — 포트폴리오 콘텐츠

> 기존 포트폴리오 (portfolio_kimhansol.pdf)와 동일한 구조로 정리한 콘텐츠입니다.
> 각 섹션이 포트폴리오의 한 슬라이드에 대응됩니다.

---

## 표지 항목 (Cover Page에 추가)

```
04
```

**운영진 인터뷰에서 25개 문제를 발견하고**
**커뮤니티 사이트를 전면 재설계하기**

---

## Page 1. Overview

### 제목

**운영진 인터뷰에서 25개 문제를 발견하고**
**커뮤니티 사이트를 전면 재설계하기**

### 성과

`기획 100%` `디자인 100%` `개발 진행중`

### 주요 성과

| 항목 | 내용 |
|------|------|
| 주요 성과 | 운영진 4명 인터뷰 + 유저 불만 24건 분석 → 25개 문제 정의 |
| | 30개 카테고리 → 6개 대분류 + 태그로 IA 재설계 |
| | 관리자 네비게이션 7~9단계 → 1~2단계로 축소 |
| | 11개 페이지 + 2개 부가 페이지 프로토타입 구현 |
| | 18개+ 재사용 가능 컴포넌트 추출 |

### 사용 도구

| 도구 | 용도 |
|------|------|
| **Claude Code** | PRD 작성, 프로토타입 개발, 컴포넌트 추출 |
| | 인터뷰 분석 → 문제 정의 → 개선방향 도출 자동화 |
| **지피터스 커뮤니티** | 운영진 인터뷰 4건 + 유저 불만 24건 수집 |
| | 실 서비스 환경에서 문제 검증 |
| **Next.js 16** | App Router 기반 프로토타입 구현 |
| **@gpters-internal/ui** | 사내 디자인 시스템 (Tailwind CSS v4 + shadcn/ui) |

### 산출물

- PRD 4개 (사이트, 어드민, LMS, 디자인 가이드)
- 11개 페이지 정적 프로토타입 (Next.js)
- 25개 문제 + 13개 개선방향 정의서
- IA 사이트맵 (HTML 시각화)

### 로드맵

```
2026.01    문제 발견
           운영진 4명 인터뷰, 유저 불만 24건 수집 → 25개 문제 정의

           IA 재설계
           30개 카테고리 → 6개 대분류 + 태그, URL 구조 설계

           PRD 작성
           사이트/어드민/LMS/디자인 가이드 4개 문서 작성

2026.02    프로토타입 구현
           Next.js 기반 11개 페이지 + Reddit-inspired 디자인

           컴포넌트 추출 & 디자인 시스템
           18개+ 재사용 컴포넌트 분리, 토큰 아키텍처 정리

2026.03    백엔드 연결 (진행 예정)
           Supabase 연동, 인증, 실 데이터 바인딩
```

---

## Page 2. 문제 발견: 인터뷰와 데이터에서 시작하기

### 배경

지피터스는 12,000명 이상의 회원이 활동하는 AI 커뮤니티다. Bettermode SaaS 위에서 운영하고 있었는데, 운영팀과 사용자 모두 불편함을 호소하고 있었다. "뭐가 이렇게 많지?", "스터디를 어디서 듣는지 모르겠다", "관리 탭에서 원하는 걸 찾으려면 헤맨다" 같은 피드백이 반복됐다.

그래서 문제를 체계적으로 정의하기로 했다. 운영진 4명(신연권, 소연, 재호, 다혜)과 인터뷰를 진행하고, 유저 불만 게시글 24건을 분석했다.

### 인터뷰 → 문제 정의 프로세스

```
인터뷰 4건              유저 불만 24건           리포트 6건
(운영진 심층 인터뷰)     (커뮤니티 게시글)        (UX감사/벤치마킹)
        ↓                      ↓                      ↓
        └──────────────────────┴──────────────────────┘
                               ↓
                    25개 문제 정의 (P1~P25)
                    ─ Critical 8개
                    ─ High 5개
                    ─ Medium 이하 12개
                               ↓
                    13개 개선 방향 도출
```

### 발견한 핵심 문제 (Critical 8개)

| 문제 | 심각도 | 현재 상태 | 근거 |
|------|--------|----------|------|
| P3. 홈에 들어오면 뭐가 뭔지 모르겠다 | Critical | 30개 카테고리 + 콘텐츠 동시 노출 | 신연권: "뭐가 이렇게 많지?" |
| P4. 카테고리 30개, 기준도 제각각 | Critical | 도구/분야/시간별 혼재 | 4명 전원 언급 |
| P10. 스터디 어디서 듣는지 모름 | Critical | 진입 4단계 | 유료 고객 서비스 진입 불가 |
| P12. 활동이 이력/포폴로 안 보임 | Critical | 프로필에 이름/사진만 | "AI계의 LinkedIn" 비전 |
| P13. 관리 탭 7단계 이상 | Critical | 배너 수정에 9단계 | 운영진 반복 언급 |
| P14. 프론트-어드민 매핑 불명 | Critical | 수정해도 어디 바뀌는지 모름 | |
| P15. 게시글 이동 불가 | Critical | 삭제→재게시 필요 | n8n 중복 발동 부작용 |
| P21. 사이트 = 중간 다리 | Critical | LMS가 외부 이동 | |

### 스크린샷

- [ ] `screenshots/interview-process.png` — 인터뷰 진행 과정 or 문제 정의서 일부
- [ ] `screenshots/problem-definition.png` — 25개 문제 목록 (심각도별 색상)
- [ ] `screenshots/bettermode-current.png` — AS-IS 사이트 홈 스크린샷

---

## Page 3. IA 재설계: 30개 카테고리를 6개로 줄이기

### 기존 IA의 문제

**30개 카테고리, 기준이 제각각이다**

현재 지피터스의 카테고리는 30개다. 도구별(클로드, 코파일럿), 분야별(마케팅), 시간별(기수) 분류가 혼재되어 있다. 인터뷰한 운영진 4명 전원이 "카테고리가 너무 많다"고 언급했고, 실제로 사용되는 건 3~4개뿐이었다.

**관리자 네비게이션이 7~9단계**

홈 배너를 수정하려면: 관리 → 디자인스튜디오 → 컬렉션및공간 → 컬렉션없음 → 홈 → Body → 판매주간홈배너 → Column2 → 게시물6. 9단계를 거쳐야 한다.

### 새로운 IA 설계

```
AS-IS                              TO-BE
─────────                          ─────────
GNB: 30개 카테고리 노출              GNB: 탐색 | 스터디 | 커뮤니티 | AI이력서

카테고리:                           카테고리 (6개):
  ├─ 클로드                          ├─ AI 활용법
  ├─ ChatGPT                        ├─ 프롬프트
  ├─ 코파일럿                        ├─ 자동화
  ├─ Midjourney                     ├─ 개발/코딩
  ├─ 마케팅                          ├─ 비즈니스
  ├─ ... (25개 더)                   └─ 뉴스
  └─ 20기 사례글
                                    태그:
어드민: 7~9단계 네비게이션              도구 (Claude, GPT, ...)
                                    난이도 (입문/중급/고급)
                                    형태 (튜토리얼/사례/뉴스)

                                    어드민: 1~2단계 Flat 구조
```

### 핵심 수치

| 지표 | Before | After | 변화 |
|------|--------|-------|------|
| 카테고리 수 | 30개 | 6개 + 태그 | -80% |
| GNB 메뉴 | 30개+ 동시 노출 | 4개 핵심 메뉴 | -87% |
| 어드민 네비 뎁스 | 7~9단계 | 1~2단계 | -80% |
| 스터디 진입 | 4단계 | 1클릭 | -75% |
| 외부 운영 도구 | 11개 | 핵심 내재화 | 단계적 제거 |

### 스크린샷

- [ ] `screenshots/ia-before.png` — AS-IS 사이드바 (30개 카테고리)
- [ ] `screenshots/ia-after.png` — TO-BE IA 사이트맵 (docs/ia-sitemap.html 캡처)
- [ ] `screenshots/gnb-before-after.png` — GNB 비교 (Before/After)

---

## Page 4. PRD 작성: 4개 문서로 전체 스펙 정의

### 체계적인 기획 프로세스

**인터뷰 → 문제 정의 → 개선 방향 → PRD → 프로토타입**

25개 문제와 13개 개선방향을 기반으로 4개의 PRD를 작성했다. 각 PRD는 문제 번호(P1~P25)를 참조하여 "이 기능이 어떤 문제를 해결하는지"를 명확히 했다.

### PRD 구조

| PRD | 범위 | 핵심 기능 | 해결하는 문제 |
|-----|------|----------|-------------|
| **01. 사이트 PRD** | 프론트엔드 | 11개 기능, 7개 화면 | P1~P12 (방문자/회원/수강생) |
| **02. 어드민 PRD** | 관리자 | 17개 기능, 6개 화면 | P13~P17, P22~P23 (운영 효율) |
| **03. LMS PRD** | 수강생 대시보드 | 수강생/스터디장/운영자 | P10, P21 (학습 경험) |
| **04. 디자인 가이드** | 컴포넌트 카탈로그 | 토큰, 레이아웃, 컴포넌트 | P2, P9 (가독성/일관성) |

### 문제 → PRD → 화면 매핑 (예시)

```
P3. 홈이 혼란스럽다 (Critical)
  → 01-사이트 PRD: "홈 피드 재설계"
    → app/page.tsx: Reddit-inspired 2컬럼 피드

P10. 스터디 진입 4단계 (Critical)
  → 03-LMS PRD: "내 스터디 대시보드"
    → app/study/my: GNB 1클릭 → 이번 주 할 일 + 진행 중 스터디

P13. 관리 탭 7단계 (Critical)
  → 02-어드민 PRD: "Flat 어드민 대시보드"
    → app/admin: 오늘의 요약 + 빠른 작업 + 최근 활동
```

### 스크린샷

- [ ] `screenshots/prd-structure.png` — PRD 문서 구조 (4개 문서 개요)
- [ ] `screenshots/problem-prd-mapping.png` — 문제→PRD→화면 매핑 다이어그램

---

## Page 5. 프로토타입: Reddit-inspired 디자인으로 11개 화면 구현

### 디자인 방향 결정

**왜 Reddit인가?**

지피터스의 핵심은 "사용자가 만드는 콘텐츠"다. 투표로 좋은 글이 올라오고, 누구나 가볍게 글을 쓸 수 있어야 한다. 이 구조에 가장 잘 맞는 레퍼런스가 Reddit이었다.

- **투표 기반 큐레이션**: 좋은 콘텐츠가 자연스럽게 상단에
- **Compact 카드**: 한 화면에 더 많은 콘텐츠 노출
- **계층형 댓글**: 대화 맥락이 유지되는 토론
- **2컬럼 레이아웃**: 피드 + 사이드바 (커뮤니티 정보, 규칙)

### 구현한 화면 (11 + 2)

| # | 화면 | 핵심 변화 |
|---|------|----------|
| 1 | 홈 | 공지 배너 + 인라인 글쓰기 + 투표 피드 + 사이드바 |
| 2 | 콘텐츠 탐색 | 7개 탭 + 태그 필터 + 정렬 |
| 3 | 커뮤니티 피드 | 4개 탭 (피드/자유/Q&A/이벤트) |
| 4 | 게시글 상세 | 계층형 댓글 + 스티키 투표 사이드바 + CTA |
| 5 | 스터디 상세 | 전용 랜딩 (히어로 + 5탭 + 스티키 CTA) |
| 6 | AI 이력서 | 스킬맵 + 뱃지 + 스터디이력 + AI 요약 |
| 7 | 검색 | 통합 검색 (게시글 + 스터디 + 사용자) |
| 8 | 어드민 대시보드 | Flat 구조 + 오늘의 요약 + 빠른 작업 |
| 9 | 게시글 관리 | 필터 + 일괄 이동/삭제 |
| 10 | 스터디 관리 | 인라인 상태 변경 + 기수 필터 |
| 11 | 내 스터디 | 이번 주 할 일 + 진행도 + VOD |
| +1 | 메시지/알림 | 메시지 + 알림 통합 |
| +2 | 배너 관리 | 드래그 순서 변경 + 활성/비활성 |

### 핵심 Before / After

#### 홈

| 관점 | Before | After |
|------|--------|-------|
| 정보 구조 | 띠배너 + 웨비나 + 최신/인기/베스트 + 30개 카테고리 동시 | 공지 배너 + 인라인 글쓰기 + 정렬 탭 + 피드 + 사이드바 |
| 카드 형태 | 목록 나열 | Reddit Compact 카드 (투표 + 메타 + 댓글수) |
| 글쓰기 | 카테고리 선택 후 별도 페이지 이동 | 홈에서 바로 인라인 글쓰기 |

#### 어드민

| 관점 | Before | After |
|------|--------|-------|
| 네비게이션 | 7~9단계 | 1~2단계 Flat |
| 배너 수정 | 9단계 | 2단계 (대시보드→배너 관리) |
| 게시글 이동 | 불가능 (삭제→재게시) | 1클릭 (드롭다운) |

### 스크린샷

- [ ] `screenshots/home-before.png` — AS-IS 홈 (Bettermode)
- [ ] `screenshots/home-after.png` — TO-BE 홈 (프로토타입)
- [ ] `screenshots/post-detail-before.png` — AS-IS 게시글 상세
- [ ] `screenshots/post-detail-after.png` — TO-BE 게시글 상세
- [ ] `screenshots/admin-before.png` — AS-IS 어드민 (Bettermode 관리)
- [ ] `screenshots/admin-after.png` — TO-BE 어드민 대시보드
- [ ] `screenshots/profile-before.png` — AS-IS 프로필 (이름/사진만)
- [ ] `screenshots/profile-after.png` — TO-BE AI 이력서

---

## Page 6. 컴포넌트 추출 & 디자인 시스템

### 하드코딩 → 재사용 컴포넌트

프로토타입 초기에는 빠른 구현을 위해 각 페이지에 UI를 직접 작성했다. 11개 페이지가 완성된 후, 반복되는 패턴을 식별하고 18개 이상의 재사용 컴포넌트로 추출했다.

### 추출 과정

```
Phase 1: 홈/탐색/커뮤니티 (3개 페이지)
────────────────────────────────────
페이지별 하드코딩 UI 블록 식별
  → 7개 공용 컴포넌트 추출
  → components/site/ 디렉토리

  AnnouncementBar    SortTabs       CommunityInfoCard
  CategoryList       SidebarStudyList   CommunityRules
  FeedPost (기존 개선)

Phase 2: 게시글/프로필/검색/메시지 (4개 페이지)
────────────────────────────────────
  → 11개 추가 컴포넌트 추출
  → 기존 ui/ 컴포넌트 5개 재사용

  TagList          StatGrid        SkillBarList
  ActivityList     UserRow         RelatedPostCard
  PostActionsSidebar   CommentInput   SectionHeader
  MessageRow       NotificationRow
```

### 토큰 아키텍처 정리

```
Before (3-layer, 디버깅 어려움)          After (1-layer, 직관적)
─────────────────────────               ─────────────────────────
tokens.css (CSS 변수)                   globals.css @theme {
  → palettes/gpters.css (팔레트)           --color-background: #ffffff;
    → globals.css @theme (매핑)             --color-primary: #EF6020;
                                           --color-muted: #f5f5f5;
var() 참조 체인                            ...
3단계 추적 필요                           }

                                        직접 hex 값, 1단계로 해결
```

### 스크린샷

- [ ] `screenshots/component-extraction.png` — 컴포넌트 추출 Before/After (코드 비교)
- [ ] `screenshots/component-list.png` — components/site/ 디렉토리 구조
- [ ] `screenshots/token-architecture.png` — 토큰 아키텍처 Before/After

---

## Page 7. 기술 스택 & 향후 계획

### 기술 스택

| 영역 | Before (Bettermode) | After (자체 플랫폼) |
|------|---------------------|-------------------|
| 프레임워크 | Bettermode SaaS (위젯 기반) | Next.js 16 (App Router) |
| 스타일링 | Bettermode 테마 + 인라인 CSS | Tailwind CSS v4 (CSS-first) |
| 컴포넌트 | Bettermode 위젯 | shadcn/ui + 커스텀 18개+ |
| 아이콘 | 이모지 텍스트 | lucide-react (SVG only) |
| 인증 | Bettermode auth | Supabase Auth |
| DB | Bettermode 종속 | Supabase PostgreSQL |
| 자동화 | n8n (외부) | Supabase Edge Functions |
| 디자인 토큰 | 없음 | @theme 1-layer 직접 정의 |

### 외부 도구 의존도 변화

| 도구 | Before | After |
|------|--------|-------|
| Retool | 상품/쿠폰 관리 | 어드민 내재화 |
| 에어테이블 | 수강생/기수 데이터 | Supabase DB |
| n8n | 웹훅/자동화 | Edge Functions |
| 구글캘린더 | 세션 일정 관리 | 어드민 세션 관리 |
| 구글시트 | 수료/환급 판정 | 어드민 기능 |

### 향후 계획

```
2026.03 (Phase 3)
  ├─ Batch 0: 공유 인프라 (Supabase 스키마, 인증, 레이아웃)
  ├─ Batch 1: 콘텐츠 코어 (게시글 CRUD, 피드, 투표)
  └─ Batch 2: 어드민 MVP (대시보드, 게시글/스터디/배너 관리)

2026.04 (Phase 4)
  ├─ Batch 3: 스터디 & 결제 (상품, 쿠폰, PG 연동)
  └─ Batch 4: LMS (수강생 대시보드, VOD, 진도 추적)

2026.05 (Phase 5)
  └─ 베타 출시 & 데이터 마이그레이션
```

---

## 스크린샷 촬영 가이드

### 필수 스크린샷 (최소 8장)

| # | 파일명 | 내용 | 촬영 방법 |
|---|--------|------|----------|
| 1 | `home-before.png` | AS-IS 홈 (Bettermode) | gpters.org 메인 캡처 |
| 2 | `home-after.png` | TO-BE 홈 (프로토타입) | localhost:3000 캡처 |
| 3 | `admin-before.png` | AS-IS 어드민 (9단계 네비) | Bettermode 관리 탭 캡처 |
| 4 | `admin-after.png` | TO-BE 어드민 대시보드 | localhost:3000/admin 캡처 |
| 5 | `profile-before.png` | AS-IS 프로필 | gpters.org 프로필 캡처 |
| 6 | `profile-after.png` | TO-BE AI 이력서 | localhost:3000/profile/honggildong 캡처 |
| 7 | `gnb-before.png` | AS-IS GNB (30개 카테고리) | gpters.org 사이드바 캡처 |
| 8 | `ia-sitemap.png` | TO-BE IA 시각화 | docs/ia-sitemap.html 캡처 |

### 선택 스크린샷 (인상 깊은 변화 강조용)

| # | 파일명 | 내용 |
|---|--------|------|
| 9 | `post-detail-before.png` | AS-IS 게시글 상세 |
| 10 | `post-detail-after.png` | TO-BE 게시글 상세 (계층형 댓글) |
| 11 | `study-detail-after.png` | TO-BE 스터디 랜딩 (스티키 CTA) |
| 12 | `community-feed-after.png` | TO-BE 커뮤니티 피드 (4탭) |
| 13 | `search-after.png` | TO-BE 통합 검색 |
| 14 | `my-study-after.png` | TO-BE 내 스터디 대시보드 |

### 촬영 팁

- **Before**: gpters.org에서 직접 캡처 (로그인 상태 + 비로그인 상태)
- **After**: `npm run dev` 후 localhost에서 캡처
- **해상도**: 1440x900 이상 (포트폴리오 PDF 기준)
- **크롭**: 브라우저 탭 제거, 콘텐츠 영역만 (기존 포트폴리오와 동일)
- **IA 사이트맵**: `docs/ia-sitemap.html`을 브라우저에서 열고 캡처

---

*마지막 업데이트: 2026-02-27*
