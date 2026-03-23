# GPTers 리뉴얼 — 개발자 인수인계 가이드

> 마지막 업데이트: 2026-03-23

## 1. 프로젝트 개요

GPTers(gpters.org) 커뮤니티 사이트를 Bettermode 기반에서 Next.js 자체 플랫폼으로 전환하는 리뉴얼 프로젝트입니다. AI 활용에 관심 있는 비개발자 대상이며, 콘텐츠 커뮤니티 + AI 스터디 + AI 이력서가 핵심 기능입니다. Next.js 16 (App Router) + shadcn/ui + Tailwind CSS v4 + Supabase 스택을 사용합니다.

## 2. 빠른 시작

```bash
npm install          # 의존성 설치
npm run dev          # 개발 서버 (localhost:3000)
npm run build        # 프로덕션 빌드 (타입 체크 포함)
```

> lint, test, format 스크립트는 아직 없음. Turbopack 기본 활성화.

## 3. 폴더 구조

```
app/                  # 페이지 (53개 page.tsx) — App Router 구조
  admin/              # 어드민 16페이지 (별도 사이드바 레이아웃)
  study/my/           # 수강생 LMS 대시보드 (별도 사이드바 레이아웃)
  events/             # 이벤트 목록/상세/개설/수정
  ...
components/
  ui/     (19개)      # shadcn/ui 기반 공용 컴포넌트
  site/   (42개)      # 사이트 전용 (post-card, event-card, feed-post 등)
  admin/  (4개)       # 어드민 전용 (stat-card, bulk-action-bar 등)
  lms/    (9개)       # LMS 전용 (week-progress, vod-card 등)
  navbar.tsx          # GNB (3-column, 검색 내장)
  footer.tsx          # 푸터 (한 줄 텍스트)
lib/
  auth-context.tsx    # useAuth() 훅 — 데모용 인증 컨텍스트
  auth-provider-wrapper.tsx  # AuthProvider 래퍼 (SSR 분리)
  utils.ts            # cn() 유틸리티 (clsx + tailwind-merge)
docs/                 # 기능명세서, PRD, 디자인, 리서치
public/               # 정적 에셋
```

## 4. 핵심 문서 읽기 순서

1. **`CLAUDE.md`** — 프로젝트 전체 컨벤션, 기술 스택, 디자인 시스템 규칙
2. **`docs/기능명세서.md`** — 52개 화면별 기능/인터랙션 상세 명세
3. **`docs/prd/01-사이트-PRD.md`** — 프론트엔드 11개 기능, 7개 화면 스펙
4. **`docs/prd/02-어드민-PRD.md`** — 어드민 17개 기능, Flat IA 설계
5. **`docs/prd/03-LMS-수강생대시보드-PRD.md`** — LMS 3파트 명세
6. **`docs/context/about-ai-study.md`** — 도메인 이해 (AI 스터디 운영 체계)

## 5. 현재 상태

- **53페이지 정적 목업 완성** — 모든 page.tsx 상단에 mock data 하드코딩
- **백엔드 미연결** — Supabase 계정 준비 중, API 라우트 없음
- **인증 데모 구현** — `useAuth()` 훅으로 로그인/비로그인 UI 분기 (toggle 방식)
- **어드민 16페이지** — 사이드바 레이아웃, 필터/정렬/인라인편집 프로토타입
- **LMS 9페이지** — 수강생 대시보드, 학습, VOD, 과제, 수료증
- **디자인 토큰** — `app/globals.css` @theme 블록에 색상/spacing/타이포 정의

## 6. 주요 코딩 패턴

### 인증

```tsx
// lib/auth-context.tsx — 데모용 (Supabase 교체 예정)
const { user, isLoggedIn, isAdmin, isOwner, toggle } = useAuth();
```

- 비로그인 시 CTA 표시, 로그인 시 프로필/액션 표시
- `from` 쿼리 파라미터로 로그인 후 원래 페이지 복귀

### 데이터 패턴

```tsx
// 모든 page.tsx의 공통 패턴
const mockData = [{ id: "1", title: "..." }];  // 상단 mock data
export default function Page() { ... }         // mock data로 렌더링
// → 백엔드 연결 시 mock data를 API 호출로 교체
```

### 컴포넌트

- **shadcn/ui** — `components/ui/` (Button, Card, Input, Select 등)
- **커스텀 컴포넌트** — `components/site/` (PostCard, FeedPost, EventCard 등)
- **스타일링** — Tailwind v4 CSS-first, 시맨틱 spacing 토큰 (`gap-group`, `pt-section` 등)
- **아이콘** — lucide-react, `strokeWidth={1.5}`, 액션 `w-5 h-5` / 장식 `w-4 h-4`

### 레이아웃 구조

| 레이아웃 | 경로 | 구조 |
|---------|------|------|
| 루트 | `app/layout.tsx` | Navbar + main + Footer |
| 어드민 | `app/admin/layout.tsx` | 좌측 Sidebar + Content |
| LMS | `app/study/my/layout.tsx` | 좌측 Sidebar + Content |

## 7. 알려진 제한사항

- **Empty State UI 미구현** — 모든 목록에 빈 상태 표시 없음 (→ `docs/기능명세서.md` "개발자 TO-DO" 참조)
- **실시간 기능 없음** — 알림, 메시지 모두 정적 mock
- **PG 미연동** — 체크아웃 페이지는 UI만 존재
- **검색** — 클라이언트 사이드 mock 필터링만 구현
- **이미지 업로드** — 아바타/커버/첨부 모두 미구현
- **반응형** — 주요 페이지는 대응되나 일부 어드민 테이블은 미대응
- **접근성** — 기본 시맨틱 HTML 수준, ARIA/키보드 네비게이션 미보강

## 8. 백엔드 연결 체크포인트

아래 순서로 연결을 권장합니다.

### Phase 1: 기반 (인증 + DB)
- [ ] Supabase 프로젝트 생성 및 테이블 마이그레이션
- [ ] `lib/auth-context.tsx`를 Supabase Auth로 교체
- [ ] 미들웨어로 보호 라우트 처리 (`/write`, `/messages`, `/settings`, `/checkout`)

### Phase 2: 핵심 읽기
- [ ] 게시글/커뮤니티 CRUD API 라우트 (`app/api/`)
- [ ] 검색 API (Supabase full-text search)
- [ ] 페이지네이션 (cursor 또는 offset 기반)

### Phase 3: 핵심 쓰기
- [ ] 글쓰기/댓글 → DB 저장
- [ ] 좋아요/북마크/팔로우 → DB 저장
- [ ] 이미지 업로드 → Supabase Storage

### Phase 4: 결제 + 스터디
- [ ] PG 연동 (선정 TBD)
- [ ] 스터디 수강신청/결제 플로우
- [ ] 쿠폰 서버 검증
- [ ] 과제 연동 → 다시보기 권한 자동 부여

### Phase 5: 어드민 + 운영
- [ ] 어드민 API 라우트 (게시글/배너/상품/회원 관리)
- [ ] 알림 시스템 (WebSocket 또는 Polling)
- [ ] 수료/환급 자동화

> 상세 개발 계획: `CLAUDE.md` "Domain Context" 섹션 및 `docs/prd/` 참조
