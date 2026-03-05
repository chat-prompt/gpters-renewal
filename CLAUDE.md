# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 문서 관리 규칙

- 이 파일은 500줄 이내 유지 (최대 1500줄 초과 금지)
- 새 규칙 추가 시 오래된 규칙 정리
- 프로젝트 진행하며 학습한 패턴만 기록

## 코드 원칙

- 간결하게: 최소한의 코드로 목적 달성
- 재사용 우선: 기존 것 활용, 없으면 재사용 가능하게 작성
- 중복 금지: 비슷한 코드 반복되면 추상화
- 변경 전 기존 코드 먼저 읽기
- 요청받은 범위만 수정, 과도한 리팩토링 금지

## Project Overview

GPTers 커뮤니티 사이트(gpters.org) 리뉴얼 프로젝트. Bettermode 기반 → Next.js 자체 플랫폼으로 전환.

- **대상 사용자**: AI 활용에 관심 있는 일반인 (비개발자 중심)
- **핵심 기능**: 콘텐츠 커뮤니티 + AI 스터디 + AI 이력서
- **브랜드 컬러**: GPTers Orange (#EF6020)
- **현재 단계**: 프로토타입 완성 (정적 목업 37페이지, 백엔드 미연결)
- **GitHub**: `chat-prompt/gpters-renewal` (push 시 `gh auth switch --user hskim-a11y` 필요)

## Commands

```bash
npm run dev      # Next.js 개발 서버 (기본 3000, 사용 중이면 자동 변경)
npm run build    # 프로덕션 빌드 (타입 체크 포함)
npm run start    # 프로덕션 서버
```

> lint, test, format 스크립트는 아직 없음.

## Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **UI Components**: shadcn/ui (Radix UI 기반, `components.json` 설정)
- **Styling**: Tailwind CSS v4 (CSS-first, `@theme` block in globals.css)
- **Utility**: `cn()` from `lib/utils.ts` (clsx + tailwind-merge)
- **Icons**: lucide-react (SVG only)
- **Infra**: Supabase (auth, DB, storage) — 아직 미연결
- **Language**: TypeScript v5 (strict mode)
- **Path alias**: `@/*` → project root (`tsconfig.json`)

## Styling Architecture

Tailwind v4 CSS-first 방식. `tailwind.config.js` 없음.

```
app/globals.css
├── @import "tailwindcss"        # Tailwind v4
└── @theme { ... }               # 색상, radius, 폰트 직접 정의 (hex값)
```

**globals.css가 유일한 디자인 토큰 소스.** 외부 import 없이 모든 색상/radius/폰트를 `@theme` 블록에 hex값으로 직접 정의한다.

PostCSS: `postcss.config.mjs`에서 `@tailwindcss/postcss` 플러그인 사용.

### shadcn/ui

`components.json`으로 설정. 새 컴포넌트 추가: `npx shadcn@latest add <component> --overwrite`

**주의 — shadcn API 차이점:**
- Button: `variant="default"` (primary 없음), size는 `"default"` | `"sm"` | `"lg"` | `"icon"`
- Select: `onValueChange` 사용 (onChange 아님), Radix 컴포지션 패턴
- Checkbox: `onCheckedChange` 사용 (onChange 아님)
- Avatar: `<Avatar><AvatarImage /><AvatarFallback /></Avatar>` 컴포지션
- Input: icon prop 없음 — 아이콘 필요 시 wrapper div으로 배치

## 디자인 시스템

디자인 방향은 **Reddit-inspired** — 투표 기반 큐레이션, Compact 카드, 계층형 댓글 등 (`docs/prd/04-디자인-가이드.md` 섹션 1.2).

### 색상 토큰 (globals.css @theme)

| Tailwind 클래스 | 값 | 용도 |
|---|---|---|
| `bg-background` | `#ffffff` | 페이지 배경 (body에 적용됨, 하위 요소에 중복 사용 금지) |
| `text-foreground` | `#171717` | 기본 텍스트 |
| `bg-primary` / `text-primary` | `#EF6020` | GPTers 오렌지 (CTA, 강조) |
| `bg-muted` | `#f5f5f5` | 비활성/태그 배경 |
| `text-muted-foreground` | `#525252` | 보조 텍스트 |
| `bg-accent` | `#fff5ed` | hover 강조 배경 (연한 오렌지) |
| `border-border` | `#e5e5e5` | 기본 테두리 |

> 전체 토큰: `app/globals.css` @theme 블록 참조

### 규칙

- Tailwind 클래스만 사용 — 하드코딩 색상 금지 (#fff, rgb 등)
- `bg-background` 중복 금지 — body에 이미 적용됨. input/select/sticky 요소만 예외
- 간격은 Tailwind 4px 기반 스케일 (`p-4`, `gap-6`)
- Shadow 금지 (Modal/Dropdown/Toast 제외)
- 이모지/텍스트 아이콘 금지 → SVG만 사용 (lucide-react)

## 프로토타입 아키텍처

**모든 페이지가 정적 목업.** 각 page.tsx 파일 상단에 하드코딩된 mock data가 있고, Supabase 연결 없이 렌더링한다.

```tsx
// 전형적인 페이지 패턴
const posts = [{ slug: "...", title: "...", ... }];  // mock data
export default function Page() { return <PostCard {...posts[0]} /> }
```

컴포넌트는 props를 통해 데이터를 받으므로, 나중에 mock data를 API 호출로 교체하면 된다.

## 작업 방식: 에이전트 팀 활용

`CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS`가 활성화되어 있다 (`.claude/settings.local.json`).

**큰 작업(Development Guide 작성, 다중 PRD 분석, 병렬 구현 등)은 Task tool로 에이전트를 구성해서 처리한다:**

- 분석/조사가 필요하면 Explore 에이전트를 병렬로 띄워 동시에 수집
- 설계가 필요하면 Plan 에이전트로 구조 잡기
- 구현이 필요하면 general-purpose 에이전트로 병렬 개발
- 상황에 맞게 에이전트를 조합하되, 커스텀 스킬에 의존하지 말고 Task tool로 직접 구성

## Hooks

- **PostToolUse (Write|Edit)**: `components/` 또는 `app/` 파일 수정 시 `.claude/scripts/lint-design-rules.sh` 자동 실행 (이모지/하드코딩 색상/간격/shadow 위반 탐지)

## App Structure

### Layout

```
app/layout.tsx          # Root: Navbar + <main> + Footer (모든 페이지 공통)
app/admin/layout.tsx    # Admin: 좌측 Sidebar + Content (admin/* 페이지 공통)
```

### 페이지 (37개)

**사이트 핵심** — 홈(`/`), 탐색(`/explore/feed`), 커뮤니티(`/community/feed`), 게시글(`/posts/[slug]`), 글쓰기(`/write`), 검색(`/search`), 메시지(`/messages`)

**스터디** — 목록(`/study`), 상세(`/study/[slug]`), 체크아웃(`/checkout/[studyId]`)

**수강생 LMS** — 내 스터디(`/study/my`), 학습(`/study/[slug]/learn`), 과제(`/study/[slug]/learn/tasks`), VOD(`/study/[slug]/learn/vod`), 수강이력(`/study/my/history`), 청강(`/study/my/audit`), 수료증(`/study/my/certificates`)

**스터디장** — 관리(`/study/manage/[slug]`), 수강생현황(`/study/manage/[slug]/members`), 공지(`/study/manage/[slug]/notices`), VOD관리(`/study/manage/[slug]/vod`)

**프로필/설정** — AI이력서(`/profile/[username]`), 설정(`/settings`)

**어드민** (14개) — 대시보드, 게시글, 스터디, 배너, 텍스트, 상품, 회원, 기수, 세션, 수료/환급, 분류, 신고/모더레이션, 뱃지, 리포트 (`/admin/*`)

### 컴포넌트 (75개)

```
components/
├── navbar.tsx          # GNB ('use client') — IconButton + DropdownMenu 사용
├── footer.tsx          # 푸터 (Reddit 스타일 — 한 줄 텍스트)
├── ui/    (18개)       # shadcn/ui 기반: button, card, select, avatar, table, input, checkbox, textarea 등
├── site/  (42개)       # 사이트: post-card, feed-post, hero-carousel, sidebar-study-list 등
├── admin/ (4개)        # 어드민: stat-card, activity-feed, bulk-action-bar, quick-action
└── lms/   (9개)        # LMS: week-progress, vod-card, attendance-matrix, enrollment-card 등
```

**핵심 공용 컴포넌트:**
- `ui/icon-button` — 아이콘 버튼 (Link/button 자동 분기, 뱃지 지원)
- `ui/dropdown-menu` — 드롭다운 메뉴 컨테이너 + 아이템 + 디바이더
- `site/user-meta` — 유저 아바타+이름+시간 (5개 페이지에서 공용)
- `site/sidebar-study-list` — 기수 단위 스터디 사이드바 위젯

## Domain Context: AI 스터디

GPTers AI 스터디는 4주간의 커뮤니티형 학습 프로그램입니다.

### 기수(Cohort) 모델

**스터디는 기수당 하나만 열린다.** 예: "21기 AI 스터디"가 열리면 그 안에 여러 프로그램(AI 자동화, 프롬프트 엔지니어링, 바이브코딩 등)이 포함된다. 가격도 기수 단위로 하나. 여러 스터디가 동시에 별도 가격으로 모집되는 구조가 아님.

```
21기 AI 스터디 (150,000원)
├── AI 자동화
├── 프롬프트 엔지니어링
├── 바이브 코딩
├── AI 비즈니스
├── AI 디자인
└── AI 데이터 분석
```

### 핵심 흐름
1. **준비** (D-42~D-0): 스터디장 모집 → 선발 → 상세페이지 작성 → 수강신청 오픈
2. **모집** (D-14~D-4): 가격 자동 전환 (슈퍼얼리버드 → 얼리버드 → 일반가)
3. **진행** (4주): 사례 게시글(과제) 작성 → 다시보기 열람 권한 자동 부여
4. **종료 후**: 수료 판정, 수료증 발급, 환급 처리

### 핵심 자동화 (사이트)
- **과제 연동 권한**: 게시글 1개 이상 작성 → 전체 15개 스터디 다시보기 열람 가능 (주차별 리셋)
- **가격 자동 전환**: 마감일 기반으로 슈퍼얼리버드 → 얼리버드 → 일반가
- **수료증 자동 발급**: 출석 + 과제 데이터 기반

> 도메인 상세: `docs/context/study-site-tasks.md`, `docs/context/about-ai-study.md`

## Documentation

```
docs/
├── dev-guide.md                  # 개발 가이드: Batch 0~6, 31 테이블, 병렬 실행 계획
├── linear-issues.md              # 프로젝트 이슈 트래커 (Phase 1 완료, Phase 2 진행 중)
├── page-review.md                # 37개 페이지 리뷰 & 레퍼런스 추적
├── context/                      # 프로젝트 방향성, AI 스터디 운영 체계, 체크리스트
├── interview/                    # 운영진 인터뷰 4인 (신연권, 소연, 재호, 다혜)
├── report/                       # 문제정의서, 벤치마킹, UX감사, IA, 와이어프레임
└── prd/
    ├── 01-사이트-PRD.md           # 프론트엔드: 11개 기능, 7개 화면 스펙
    ├── 02-어드민-PRD.md           # 어드민: 17개 기능, flat IA, 6개 화면
    ├── 03-LMS-수강생대시보드-PRD.md  # LMS: 수강생/스터디장/운영자 3파트
    └── 04-디자인-가이드.md        # 컴포넌트 카탈로그, 토큰, 레이아웃, Reddit-inspired 방향
```

## PRD/기획 작성 가이드

새 기능 기획 시 아래 항목을 사용자에게 질문하며 구체화:

- **목표**: 이 기능으로 해결하려는 문제는? (P번호 참조)
- **대상 사용자**: 누가 사용하는가? (비회원/일반회원/수강생/스터디장/운영자)
- **핵심 기능**: 반드시 있어야 할 기능은?
- **제약 조건**: 기술적/시간적 제약이 있는가?
- **성공 기준**: 어떻게 되면 성공인가?

> 문제-개선 매핑: `docs/report/00-문제-개선-정의서.md`

## Custom Commands

- `/interview` — 운영진 인터뷰 진행 (AskUserQuestion 기반, docs/interview/에 저장)
