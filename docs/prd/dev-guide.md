# Development Guide

> GPTers 사이트 리뉴얼 프로젝트 — 병렬 개발 가이드
> 생성일: 2026-02-26
> PRD 소스: 01-사이트, 02-어드민, 03-LMS, 04-디자인가이드

---

## 1. Supabase 스키마 (통합 테이블)

PRD 3개에서 추출한 데이터 엔티티를 도메인별로 통합. 중복 제거 완료.

### 1.1 사용자/인증 (3개)

| 테이블 | 주요 필드 | 소스 PRD |
|--------|---------|---------|
| **users** | id, email, name, username, avatar, bio, interest_areas[], external_links[], role(member/study_leader/operator), created_at | 01, 02, 03 |
| **user_badges** | user_id, badge_id, earned_at | 01, 02 |
| **badges** | id, name, icon_url, description, badge_type(auto/manual), award_condition, is_active | 02 |

### 1.2 콘텐츠 (7개)

| 테이블 | 주요 필드 | 소스 PRD |
|--------|---------|---------|
| **posts** | id, slug, title, content(HTML), category_id, author_id, tags[], thumbnail, vote_count, comment_count, is_draft, created_at | 01, 02 |
| **feed_posts** | id, text(≤500자), author_id, image_url, link_preview, tags[], vote_count, created_at | 01 |
| **comments** | id, post_id, author_id, content, parent_id, vote_count, created_at | 01 |
| **votes** | id, user_id, target_type(post/feed_post/comment), target_id, vote_type(up/down) | 01 |
| **bookmarks** | id, user_id, post_id, created_at | 01 |
| **categories** | id, slug, name (6개 대분류) | 01, 02 |
| **tags** | id, name, slug, type(tool/difficulty/format) | 01, 02 |

### 1.3 스터디/기수 (4개)

| 테이블 | 주요 필드 | 소스 PRD |
|--------|---------|---------|
| **cohorts** | id, number, status(준비/모집/진행/완료), recruit_start, recruit_end, study_start, study_end | 02 |
| **studies** | id, slug, title, description, image, cohort_id, leader_id, capacity, status(작성중/모집중/진행중/완료), zoom_url, kakao_url, is_final_submitted, created_at | 01, 02, 03 |
| **week_contents** | id, study_id, week(1~4), title, description, curriculum_text | 03 |
| **sessions** | id, cohort_id, title, type(ai-talk/zoom/offline), date, zoom_url, description, is_recurring | 02, 03 |

### 1.4 결제/상품 (4개)

| 테이블 | 주요 필드 | 소스 PRD |
|--------|---------|---------|
| **products** | id, study_id, cohort_id, price_normal, price_early, price_super_early, early_deadline, super_early_deadline, status | 02 |
| **coupons** | id, code, discount_type(fixed/percent), amount, usage_limit, current_usage, valid_from, valid_to, applicable_product_ids[] | 02 |
| **orders** | id, user_id, product_id, study_id, amount, coupon_id, payment_status(paid/refunded), payment_method, created_at | 01, 02 |
| **buddy_registrations** | id, order_id, buddy_name, buddy_contact | 01 |

### 1.5 수강/학습 (6개)

| 테이블 | 주요 필드 | 소스 PRD |
|--------|---------|---------|
| **enrollments** | id, user_id, study_id, cohort_id, role(student/leader), completion_status(ongoing/completed/incomplete), enrolled_at | 01, 03 |
| **weekly_attendances** | id, enrollment_id, week, attended(bool), session_date | 03 |
| **weekly_assignments** | id, enrollment_id, week, submitted(bool), post_id, submitted_at | 03 |
| **assignment_permissions** | id, user_id, cohort_id, current_week, has_submitted_this_week(bool), updated_at | 03 |
| **videos** | id, study_id, week, title, type(ai-talk/zoom), embed_url, duration, is_visible, uploaded_at | 03 |
| **certificates** | id, enrollment_id, issued_at, is_outstanding(bool), pdf_url | 03 |

### 1.6 커뮤니케이션/운영 (4개)

| 테이블 | 주요 필드 | 소스 PRD |
|--------|---------|---------|
| **messages** | id, sender_id, recipient_id, content, type(dm/system), is_read, created_at | 01 |
| **notices** | id, cohort_id, category(member/leader/session), title, content, order, is_hidden | 03 |
| **banners** | id, type(hero/feed/post_bottom), title, image_url, link, order, is_active, start_date, end_date | 02 |
| **texts** | id, section, key, value, updated_by, updated_at | 02 |

### 1.7 통계/로그 (3개)

| 테이블 | 주요 필드 | 소스 PRD |
|--------|---------|---------|
| **leaderboard_entries** | id, cohort_id, user_id, post_count, rank | 03 |
| **challenge_stats** | id, cohort_id, total_certs, sender_name, cert_count, unique_days | 03 |
| **activity_logs** | id, user_id, action_type, target_id, metadata, created_at | 02 |

**총 31개 테이블** (사용자 3 + 콘텐츠 7 + 스터디 4 + 결제 4 + 학습 6 + 운영 4 + 통계 3)

---

## 2. 공유 인프라 (Batch 0 — 모든 배치의 선행 작업)

모든 개발 배치가 시작되기 전에 반드시 완료해야 하는 기반 작업.

### 2.1 Supabase 초기 설정

- [ ] 31개 테이블 마이그레이션 스크립트 작성 및 실행
- [ ] RLS(Row Level Security) 정책 설정: 역할 기반 접근 제어
- [ ] Supabase Auth 설정: 이메일/소셜 로그인
- [ ] Storage 버킷: avatars, post-images, banners, certificates

### 2.2 공통 UI 컴포넌트 (components/ui/)

디자인 가이드 기준 13개 공통 컴포넌트. `@gpters-internal/ui` + shadcn 기반.

| 컴포넌트 | 사용 영역 | 우선순위 |
|---------|---------|---------|
| Button (5 variants) | 전체 | 필수 |
| Card | 전체 | 필수 |
| Tabs | 전체 | 필수 |
| Badge | 전체 | 필수 |
| Input/Form | 전체 | 필수 |
| Avatar | 사이트+LMS | 필수 |
| Table | 어드민+LMS | 필수 |
| List | 전체 | 필수 |
| Pagination | 사이트+어드민 | 필수 |
| Progress | 사이트+LMS | 필수 |
| Accordion | 사이트+LMS | 필수 |
| Breadcrumb | 사이트+LMS | 필수 |
| CTA Section | 사이트+LMS | 필수 |

### 2.3 레이아웃

- [ ] Root Layout (`app/layout.tsx`): Navbar + Footer
- [ ] Navbar: 3상태 GNB (비로그인/로그인 일반/로그인 수강생) — 01 PRD 4.1
- [ ] Footer: 링크, 저작권
- [ ] Admin Layout (`app/admin/layout.tsx`): Sidebar(w-48) + Content

### 2.4 인증/권한

- [ ] 7단계 역할 모델 구현 (03 PRD 5.3 단일 소스)
  - 비회원 → 일반회원 → 수강생 → 과제완료 → 수료자 → 스터디장 → 운영자
- [ ] 미들웨어: 보호 라우트 접근 제어
- [ ] 프로필 드롭다운: 역할별 조건부 메뉴 (01 PRD 4.2)

---

## 3. 개발 배치 (Batch 1~6)

의존성 기반으로 그룹화. 각 배치 내의 작업은 **병렬 실행 가능**.

```
Batch 0: 공유 인프라          ← 블로커 (모든 배치의 선행)
  ↓
Batch 1: 콘텐츠 코어          ← 사이트 핵심 (독립)
Batch 2: 어드민 MVP           ← 어드민 핵심 (독립, Batch 1과 병렬 가능)
  ↓
Batch 3: 스터디 + 결제        ← Batch 0 테이블 의존
  ↓
Batch 4: LMS 수강생           ← Batch 1 글쓰기, Batch 3 스터디 의존
  ↓
Batch 5: LMS 스터디장 + 어드민 확장  ← Batch 4 의존
  ↓
Batch 6: 고급 기능            ← Batch 4, 5 의존
```

---

### Batch 1: 콘텐츠 코어

> 사이트의 콘텐츠 소비/생산 경로. 어드민/LMS 의존 없이 독립 개발 가능.

**테이블**: posts, feed_posts, categories, tags, comments, votes, bookmarks

| 작업 | URL | 컴포넌트 | 상세 |
|------|-----|---------|------|
| **홈** | `/` | hero-banner, post-card, study-card, category-card, cta-section | 히어로 캐러셀, 인기 콘텐츠, 카테고리 6개, 모집 중 스터디, 비회원 CTA |
| **콘텐츠 피드** | `/explore/feed` | tabs, badge(필터), post-card, list, pagination | 카테고리 탭(6), 태그 필터, 정렬(인기/최신/추천), 무한스크롤 |
| **게시글 상세** | `/posts/{slug}` | vote, comment, breadcrumb, badge, cta-section, post-card | Sticky 투표바, 본문(720px), 독자 통계, 관련 스터디, 댓글, 관련 글 |
| **커뮤니티 피드** | `/community/feed` | tabs, inline-post-form, list, vote | 피드 포스트 인라인 작성, 4탭(피드/자유/Q&A/이벤트) |
| **글쓰기** | `/write` | input, button, tabs | 타입 선택(피드/사례), 리치 텍스트 에디터, 자동 저장(30초), 임시저장 |

**영역별 컴포넌트 (components/site/)**: hero-banner, post-card, study-card, vote, comment, inline-post-form, star-rating

---

### Batch 2: 어드민 MVP

> 운영자 도구 핵심. Batch 1과 **완전 병렬** 가능. 프로토타입 4개 확장 + 신규 2개.

**테이블**: banners, texts (+posts, categories, tags 공유)

| 작업 | URL | 상태 | 상세 |
|------|-----|------|------|
| **대시보드** | `/admin` | 프로토타입 확장 | 통계 5개(오늘 가입/게시글/댓글/스터디 신청/매출), 빠른 작업 8개, 최근 활동 |
| **게시글 관리** | `/admin/posts` | 프로토타입 확장 | 검색, 카테고리/상태 필터, 테이블 CRUD, 카테고리 이동, 일괄 작업 |
| **배너 관리** | `/admin/banners` | 프로토타입 확장 | 3탭(히어로/피드/하단), 드래그 순서, 활성/비활성, 미리보기 |
| **텍스트 관리** | `/admin/texts` | 신규 | 영역별 인라인 편집, 미리보기, 히스토리, 발행/임시저장 |
| **스터디 관리** | `/admin/studies` | 프로토타입 확장 | 기수 필터, 상태 드롭다운, 최종제출 토글, 참여자 현황 패널 추가 |

**영역별 컴포넌트 (components/admin/)**: sidebar, stat-card, quick-action, bulk-action-bar, activity-feed

---

### Batch 3: 스터디 + 결제

> 스터디 탐색 → 결제 전환 퍼널. Batch 0 테이블(studies, products, orders) 필요.

**테이블**: studies, products, coupons, orders, buddy_registrations

| 작업 | URL | 컴포넌트 | 상세 |
|------|-----|---------|------|
| **스터디 목록** | `/study` | study-card, badge, tabs | 상태 필터(모집중/진행중/완료), 카드 리스트 |
| **스터디 상세** | `/study/{slug}` | tabs(5), accordion, star-rating, avatar, progress, button(Sticky CTA) | 소개, 커리큘럼(아코디언), 스터디장 프로필, 후기, FAQ, 모집률 바 |
| **체크아웃** | `/checkout/{studyId}` | input, button, card | 스터디 요약, 가격, 쿠폰 입력, 버디 등록, PG 연동(토스페이먼츠), 약관 |
| **계정 설정** | `/settings/*` | tabs(4), input, list | 내 정보, 구매내역, 쿠폰 관리, 알림 설정 |
| **상품/쿠폰 관리** | `/admin/products` | table, input, badge | 상품 CRUD, 가격 단계 설정, 쿠폰 생성/관리 |
| **결제/주문 관리** | `/admin/orders` | table, input, badge | 주문 검색/필터, 주문 상세, 환불 처리 |

---

### Batch 4: LMS 수강생

> 수강생 핵심 경험. **Batch 1**(글쓰기 — 과제 연동)과 **Batch 3**(결제 — enrollment) 완료 필요.

**테이블**: enrollments, week_contents, videos, weekly_attendances, weekly_assignments, assignment_permissions

| 작업 | URL | 컴포넌트 | 상세 |
|------|-----|---------|------|
| **수강생 대시보드** | `/study/my` | enrollment-card, action-item-card, week-progress, vod-card | 진행 중 스터디, 이번 주 할 일, 진도 추적, 수강 이력 |
| **스터디 학습** | `/study/{slug}/learn` | week-progress, action-item-card, accordion | 주차별 커리큘럼, 출석/과제/VOD 상태, 공지 |
| **VOD 다시보기** | `/study/{slug}/learn/vod` | vod-card, vod-lock-card, tabs, assignment-guide | 내 스터디/다른 스터디 탭, 과제 연동 잠금/해제 |
| **과제 현황** | `/study/{slug}/learn/tasks` | badge, list, button | 주차별 과제 상태, 제출 게시글 링크 |
| **청강 VOD** | `/study/my/audit` | vod-card, tabs | 전체 스터디 VOD, 기수/스터디/주차 필터 |
| **결제 후 온보딩** | 체크아웃 완료 후 | card, button | "내 스터디" 진입 안내 |

**영역별 컴포넌트 (components/lms/)**: week-progress, action-item-card, vod-card, vod-lock-card, enrollment-card, assignment-guide

**핵심 로직**:
- 과제 연동 권한: 이번 주 게시글 1개 이상 → 전체 VOD 열람. 매주 월요일 00:00 리셋
- 글쓰기 URL: `/write?type=case&studyId={studyId}&week={week}` (01 PRD 통일)

---

### Batch 5: LMS 스터디장 + 어드민 확장

> Batch 4 완료 후. 스터디장 관리 + 운영자 기수/세션.

**테이블**: notices, sessions, cohorts

| 작업 | URL | 컴포넌트 | 상세 |
|------|-----|---------|------|
| **스터디장 대시보드** | `/study/manage/{slug}` | stat-card, badge, button | 빠른 설정(상세페이지/최종제출), 스터디 요약, 미제출자 목록 |
| **수강생 현황** | `/study/manage/{slug}/members` | attendance-matrix, table, badge | 주차별 출석/과제 테이블, 미제출 필터, 수료 예측 |
| **VOD 관리** | `/study/manage/{slug}/vod` | vod-card, input, button | 주차별 VOD 등록/링크, 드래그 정렬, 공개/비공개 |
| **공지 관리** | `/study/manage/{slug}/notices` | list, input, button | 3카테고리(멤버/스터디장/세션), 순서 변경 |
| **기수 관리** | `/admin/cohorts` | table, input, badge | 기수 CRUD, 날짜 타임라인, 스터디 슬롯 배정 |
| **세션 관리** | `/admin/sessions` | table, input, badge | 세션 CRUD, 반복 패턴, 캘린더 뷰 |

**영역별 컴포넌트 (components/lms/)**: attendance-matrix, session-card

---

### Batch 6: 고급 기능

> Batch 4~5 데이터 축적 후. 각 작업은 **서로 독립적**이므로 병렬 가능.

**테이블**: certificates, leaderboard_entries, challenge_stats, messages, activity_logs

| 작업 | URL | 의존 | 상세 |
|------|-----|------|------|
| **AI 이력서** | `/profile/{username}` | enrollments, certificates | 프로필 헤더, AI 활용 자동 요약, 스킬 맵, 스터디 이력, 4탭 |
| **검색** | `/search` | posts, studies, users | 통합 검색, 타입 필터 탭, 페이지네이션 |
| **메시지** | `/messages` | messages | 3탭(받은/보낸/알림), 미읽음 배지 |
| **수료/환급** | `/admin/completion` | enrollments, certificates | 수료 기준 설정(기수별), 판정 실행, 수료증 발급, 환급 |
| **리더보드** | 대시보드 내 | leaderboard_entries | 활동왕 Top 10 (수강생 대시보드에만 노출) |
| **찐친챌린지** | 대시보드 내 | challenge_stats | 인증 현황 + Top 5 |
| **베스트발표자** | 스터디장 대시보드 내 | posts | 주차별 우수 발표자 선정 |
| **수강 이력** | `/study/my/history` | enrollments | 기수별 참여 이력, 수료증 링크 |
| **수료 현황** | `/study/my/certificates` | certificates | 수료증 조회/다운로드/공유 |
| **회원 관리** | `/admin/users` | users | 검색/필터, 회원 상세, 권한 부여 |
| **신고/모더레이션** | `/admin/moderation` | — | 신고 큐, 처리 액션 |
| **뱃지 관리** | `/admin/badges` | badges | 뱃지 CRUD, 부여 규칙 |
| **분류 관리** | `/admin/taxonomy` | categories, tags | 카테고리/태그 순서, 태그 병합 |
| **리포트** | `/admin/reports` | 전체 | 기수별/콘텐츠/퍼널 리포트, CSV |

**영역별 컴포넌트 (components/lms/)**: certificate-view, leaderboard, challenge-widget, best-presenter-card

---

## 4. 병렬 실행 가이드

### 4.1 에이전트 배정 예시

```
[Batch 0] 인프라 — 리드가 직접 또는 1명
  DB 스키마 + Auth + 공통 컴포넌트 + 레이아웃

[Batch 1 + 2 병렬] — 에이전트 2명
  에이전트 A: Batch 1 (콘텐츠 코어 — 홈, 피드, 게시글, 글쓰기)
  에이전트 B: Batch 2 (어드민 MVP — 대시보드, 게시글/배너/텍스트 관리)

[Batch 3] — 에이전트 1~2명
  스터디 목록/상세 + 체크아웃 + 상품/쿠폰 관리

[Batch 4 + 5 병렬] — 에이전트 2명
  에이전트 C: Batch 4 (수강생 대시보드, VOD, 과제)
  에이전트 D: Batch 5 (스터디장 대시보드, 기수/세션 관리)

[Batch 6] — 에이전트 2~3명 (각 작업 독립)
  AI 이력서 / 검색 / 메시지 / 수료 / 리더보드 등
```

### 4.2 의존성 체크리스트

배치 시작 전 확인:

| 배치 | 선행 조건 |
|------|----------|
| Batch 1 | Batch 0 완료 (DB + 공통 컴포넌트 + 레이아웃) |
| Batch 2 | Batch 0 완료 (DB + Admin 레이아웃) |
| Batch 3 | Batch 0 완료 (studies, products, orders 테이블) |
| Batch 4 | Batch 1 `/write` 완료 (과제 연동), Batch 3 결제 완료 (enrollment) |
| Batch 5 | Batch 4 수강생 대시보드 완료 |
| Batch 6 | Batch 4~5 데이터 축적 |

### 4.3 프로토타입 현황

이미 구현된 정적 목업 (백엔드 미연결):

| 파일 | 화면 | 배치 | 작업 |
|------|------|------|------|
| `app/page.tsx` | 홈 | 1 | 데이터 바인딩 + 캐러셀 |
| `app/explore/feed/page.tsx` | 콘텐츠 피드 | 1 | 필터/정렬 로직 + API |
| `app/posts/[slug]/page.tsx` | 게시글 상세 | 1 | 투표/댓글 + API |
| `app/study/[slug]/page.tsx` | 스터디 상세 | 3 | CTA + 결제 연결 |
| `app/profile/[username]/page.tsx` | AI 이력서 | 6 | 데이터 바인딩 |
| `app/search/page.tsx` | 검색 | 6 | 검색 API |
| `app/admin/page.tsx` | 어드민 대시보드 | 2 | 실시간 통계 + API |
| `app/admin/posts/page.tsx` | 게시글 관리 | 2 | 일괄 작업 + API |
| `app/admin/studies/page.tsx` | 스터디 관리 | 2 | 참여자 현황 패널 추가 |
| `app/admin/banners/page.tsx` | 배너 관리 | 2 | 드래그 + API |

---

## 5. PRD 참조 맵

| 배치 | 참조 PRD | 핵심 섹션 |
|------|---------|----------|
| Batch 0 | 04-디자인가이드 7.3 | 컴포넌트 카탈로그 |
| Batch 0 | 01-사이트 4.1~4.3 | GNB, 프로필 드롭다운, 사이트맵 |
| Batch 0 | 03-LMS 5.3 | 통합 권한 모델 (단일 소스) |
| Batch 1 | 01-사이트 5.1~5.3, F1~F4 | 홈, 피드, 게시글, 글쓰기 |
| Batch 2 | 02-어드민 3.1~3.6, 5.1~5.3 | 대시보드, 관리 화면, 사이드바 |
| Batch 3 | 01-사이트 5.4, 5.7~5.8, F5~F6 | 스터디 상세, 체크아웃, 계정 |
| Batch 3 | 02-어드민 3.7~3.8 | 상품/쿠폰, 결제/주문 |
| Batch 4 | 03-LMS 3.1, 3.3, 4.1 | 수강생 대시보드, 학습 기능, 플로우 |
| Batch 5 | 03-LMS 3.2, 4.2 | 스터디장 대시보드, 플로우 |
| Batch 5 | 02-어드민 3.10~3.11 | 기수, 세션 관리 |
| Batch 6 | 01-사이트 F7~F8, F10~F11 | 메시지, AI 이력서, 프로모션, 온보딩 |
| Batch 6 | 02-어드민 3.11~3.15 | 수료/환급, 회원, 뱃지, 리포트 |
| Batch 6 | 03-LMS 3.3.4~3.3.6 | 수료, 리더보드, 찐친챌린지 |

---

## 6. 핵심 자동화 로직 (구현 시 주의)

| 로직 | 배치 | 설명 | 참조 |
|------|------|------|------|
| **과제 연동 권한** | 4 | 이번 주 게시글 1개 → 전체 VOD 열람. 매주 월요일 00:00 리셋 | 03-LMS 3.3.3 |
| **가격 자동 전환** | 3 | 마감일 기반 슈퍼얼리버드 → 얼리버드 → 일반가 | 02-어드민 3.7 |
| **수료 판정** | 6 | 출석 N회 + 과제 N주 (기수별 설정). 자동 집계 → 수동 조정 → 확정 | 03-LMS 3.3.4 |
| **수료증 발급** | 6 | 수료 확정 → PDF 자동 생성 → 대시보드/AI 이력서 반영 | 03-LMS 3.3.5 |
| **GNB 상태 분기** | 0 | 비로그인/로그인 일반/로그인 수강생 3상태 | 01-사이트 4.1 |
