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
- **현재 단계**: 와이어프레임 기반 프로토타입 (정적 목업, 백엔드 미연결)

## Commands

```bash
npm run dev      # Next.js 개발 서버 (기본 3000, 사용 중이면 자동 변경)
npm run build    # 프로덕션 빌드
npm run start    # 프로덕션 서버
```

> lint, test, format 스크립트는 아직 없음. Batch 0에서 설정 예정.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI**: @gpters-internal/ui + shadcn/ui (Radix primitives)
- **Styling**: Tailwind CSS v4 (CSS-first, `@theme` block in globals.css)
- **Icons**: lucide-react (SVG only)
- **Infra**: Supabase (auth, DB, storage)
- **Language**: TypeScript
- **Path alias**: `@/*` → project root (`tsconfig.json`)

## Styling Architecture

Tailwind v4 CSS-first 방식. `tailwind.config.js` 없음.

```
app/globals.css
├── @import '@gpters-internal/ui/tokens.css'    # 디자인 토큰
├── @import '@gpters-internal/ui/palettes/gpters.css'  # GPTers Orange 팔레트
├── @import "tailwindcss"                        # Tailwind v4
└── @theme { ... }                               # CSS 변수 → Tailwind 테마 매핑
```

PostCSS: `postcss.config.mjs`에서 `@tailwindcss/postcss` 플러그인 사용.

## 디자인 시스템

이 프로젝트는 @gpters-internal/ui 디자인 시스템을 사용합니다.
디자인 방향은 **Reddit-inspired** — 투표 기반 큐레이션, Compact 카드, 계층형 댓글 등 (`docs/prd/04-디자인-가이드.md` 섹션 1.2).

### 토큰
- 모든 색상, 간격, radius는 tokens.css의 CSS 변수를 Tailwind 클래스로 사용

### 규칙 (자동 적용)

UI 생성 시 design-rules가 PostToolUse hook에서 자동 로드됩니다:
- 하드코딩 색상 금지 (#fff, rgb 등) → Tailwind 클래스 사용 (`bg-primary`, `text-foreground`)
- 간격은 Tailwind 4px 기반 스케일 (`p-4`, `gap-6`)
- radius는 토큰만 사용 (`rounded-md`, `rounded-lg`)
- Shadow 금지 (Modal/Dropdown/Toast 제외)
- 이모지/텍스트 아이콘 금지 → SVG만 사용 (lucide-react)

> design-rules.md 전체: `node_modules/@gpters-internal/ui/.claude/skills/design-rules.md`

### 컴포넌트 생성 규칙 (필수)

**디자인 가이드의 컴포넌트 코드는 삭제됨. 이름/용도만 참고하고 코드는 직접 새로 작성한다.**

1. **design-rules.md + Reddit-inspired 방향(04-디자인-가이드.md §1.2)을 기준으로 새로 작성**
2. **컴포넌트 목록**: `04-디자인-가이드.md` 섹션 3 (이름/용도만 정리됨)
3. **생성 후 자가 검증**: lint-design-rules.sh 자동 실행됨
4. **기존 컴포넌트 위반 발견 시**: 사용자에게 보고, 새 컴포넌트는 규칙대로 작성

## 작업 방식: 에이전트 팀 활용

`CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS`가 활성화되어 있다 (`.claude/settings.local.json`).

**큰 작업(Development Guide 작성, 다중 PRD 분석, 병렬 구현 등)은 Task tool로 에이전트를 구성해서 처리한다:**

- 분석/조사가 필요하면 Explore 에이전트를 병렬로 띄워 동시에 수집
- 설계가 필요하면 Plan 에이전트로 구조 잡기
- 구현이 필요하면 general-purpose 에이전트로 병렬 개발
- 상황에 맞게 에이전트를 조합하되, 커스텀 스킬에 의존하지 말고 Task tool로 직접 구성

## Hooks

- **PostToolUse (Write|Edit)**: `components/` 또는 `app/` 파일 수정 시 design-rules.md 로드 + lint-design-rules.sh 자동 실행

## App Structure

```
app/
├── layout.tsx                    # Root layout (Navbar + Footer)
├── page.tsx                      # 홈: 히어로 배너, 인기 게시글, 카테고리, 모집 중 스터디
├── globals.css                   # Tailwind v4 + 디자인 토큰 임포트
├── explore/feed/page.tsx         # 콘텐츠 피드: 카테고리 탭, 태그 필터, 정렬
├── community/feed/page.tsx       # 커뮤니티 피드
├── posts/[slug]/page.tsx         # 게시글 상세: 본문, 투표, 댓글, 관련 스터디
├── study/[slug]/page.tsx         # 스터디 상세(랜딩): 소개, 커리큘럼, 스터디장, 후기, FAQ
├── profile/[username]/page.tsx   # AI 이력서: 스터디 이력, 사례글, 스킬맵
├── search/page.tsx               # 통합 검색: 게시글/스터디/사용자
├── messages/page.tsx             # 메시지
└── admin/                        # 관리자
    ├── page.tsx                  # 대시보드: 통계, 빠른 작업, 최근 활동
    ├── posts/page.tsx            # 게시글 관리: 검색, 필터, 일괄 작업
    ├── studies/page.tsx          # 스터디 관리: 상태 변경, 최종제출 토글
    ├── banners/page.tsx          # 배너 관리: 순서 변경, 활성/비활성
    └── products/page.tsx         # 상품 관리
components/
├── navbar.tsx                    # GNB ('use client', usePathname)
├── footer.tsx                    # 푸터
├── ui/                           # (계획) 공통 재사용 컴포넌트 — Batch 0에서 생성
├── site/                         # (계획) 사이트 전용 — Batch 1에서 생성
├── admin/                        # (계획) 어드민 전용 — Batch 2에서 생성
└── lms/                          # (계획) LMS 전용 — Batch 4에서 생성
```

> 컴포넌트 구조 상세: `docs/prd/04-디자인-가이드.md` 섹션 7.3
> 배치별 개발 계획: `docs/dev-guide.md`

## Domain Context: AI 스터디

GPTers AI 스터디는 4주간의 커뮤니티형 학습 프로그램입니다.

### 핵심 흐름
1. **준비** (D-42~D-0): 스터디장 모집 → 선발 → 상세페이지 작성 → 사전판매 → 수강신청 오픈
2. **모집** (D-14~D-4): 가격 자동 전환 (슈퍼얼리버드 → 얼리버드 → 일반가), 할인쿠폰, 버디 등록
3. **진행** (4주): 사례 게시글(과제) 작성 → 다시보기 열람 권한 자동 부여, AI토크/줌 세션
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
├── linear-issues.md              # 프로젝트 이슈 트래커 (Phase 1 완료, Phase 2~3 진행 중)
├── context/
│   ├── 방향성.md                 # 프로젝트 방향성, 해결할 4가지 문제
│   ├── about-ai-study.md        # AI 스터디 철학/구조/운영 시스템
│   ├── study-prep-checklist.md  # 기수 시작 전 준비 플레이북 (D-42~D-0)
│   ├── study-runtime-checklist.md # 기수 진행 중 운영 플레이북 (4주)
│   └── study-site-tasks.md      # 사이트에서 처리하는 작업만 추출 정리
├── interview/                    # 운영진 인터뷰 (신연권, 소연, 재호, 다혜)
├── analysis/                     # 크롤링/분석 원본 데이터
├── report/
│   ├── 00-문제-개선-정의서.md    # 25개 문제 + 13개 개선방향 (검토 완료)
│   ├── 01~04                     # 사이트 구조, 벤치마킹, UX감사, 유저시나리오
│   ├── 05-Information-Architecture.md  # IA: 6 GNB, URL 구조, 유저 플로우
│   └── 06-와이어프레임.md         # 7개 화면 와이어프레임 (프로토타입 기반)
└── prd/
    ├── 01-사이트-PRD.md           # 프론트엔드: 11개 기능, 7개 화면 스펙
    ├── 02-어드민-PRD.md           # 어드민: 9개 기능, flat IA, 6개 화면
    ├── 03-LMS-수강생대시보드-PRD.md  # LMS: 수강생/스터디장/운영자 3파트
    └── 04-디자인-가이드.md        # 공통 컴포넌트 카탈로그, 토큰, 레이아웃, Reddit-inspired 방향
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
