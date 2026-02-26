# PRD 02 어드민 분석 결과

**분석 대상**: `/docs/prd/02-어드민-PRD.md`
**분석 날짜**: 2026-02-26
**작성자**: analyst-admin

---

## 1. 기능 목록 (17개 기능)

| 기능명 | URL | 우선순위 | 설명 |
|--------|-----|---------|------|
| 대시보드 | `/admin` | MVP필수 | 통계카드(6개), 빠른작업(8개), 최근활동피드 |
| 게시글 관리 | `/admin/posts` | MVP필수 | 검색, 카테고리/상태 필터, 카테고리 이동(P15해결), 일괄작업 |
| 스터디 관리 | `/admin/studies` | MVP필수 | 기수/상태 필터, 상태변경, 최종제출 토글(P13해결), 참여자현황 |
| 배너 관리 | `/admin/banners` | MVP필수 | 드래그순서변경, CRUD, 미리보기, 활성/비활성 토글 |
| 상품/쿠폰 관리 | `/admin/products` | MVP필수 | 상품CRUD, 가격자동전환, 쿠폰CRUD(Retool대체, P16해결) |
| 텍스트/문구 관리 | `/admin/texts` | MVP필수 | 홈/섹션/GNB 텍스트 인라인 편집(P17해결), 미리보기, 히스토리 |
| 기수 관리 | `/admin/cohorts` | MVP확장 | 기수CRUD, 날짜설정, 스터디슬롯배정, 상태일괄전환(P22해결) |
| 수료/환급 관리 | `/admin/completion` | MVP확장 | 수료기준설정, 수료판정, 수료증발급(D15해결), 환급관리(P22해결) |
| 결제/주문 관리 | `/admin/orders` | MVP확장 | 주문조회, 필터, 환불처리(Retool대체, P16해결) |
| 세션 관리 | `/admin/sessions` | MVP확장 | 세션CRUD, 반복패턴, 캘린더뷰(구글캘린더대체, P22해결) |
| 회원 관리 | `/admin/users` | Phase2 | 회원검색, 상세정보, 역할권한관리 |
| 분류 관리 | `/admin/taxonomy` | Phase2 | 카테고리순서/이름수정, 태그병합/삭제, 추천태그설정 |
| DM/알림 관리 | `/admin/messaging` | Phase2 | 자동메시지템플릿, 알림규칙설정, 발송이력조회 |
| 신고/모더레이션 | `/admin/moderation` | Phase2 | 신고큐, 처리액션(기각/비공개/경고/제한/정지) |
| 뱃지 관리 | `/admin/badges` | Phase2 | 뱃지정의CRUD, 자동/수동부여규칙, 조건관리 |
| 데이터/리포트 | `/admin/reports` | Phase2 | 기수별/콘텐츠/전환 리포트, CSV다운로드 |
| 과제연동권한 | `/admin/studies` (서브) | MVP확장 | 기수별 규칙설정, 예외관리, 이력기록(D15해결) |

---

## 2. 화면 목록 (16개 화면)

| URL | 핵심 컴포넌트 수 | 프로토타입 | 상태 |
|-----|-------------|----------|------|
| `/admin` | 4 (통계카드 그룹, 빠른작업, 최근활동) | O | 구현 완료, 사이드바 확장 필요 |
| `/admin/posts` | 5 (검색, 필터 3개, 테이블, 액션바) | O | 구현 완료, 콘텐츠유형필터+원본보기 추가필요 |
| `/admin/studies` | 4 (기수/상태필터, 카드리스트, 상세패널) | O | 구현 완료, 참여자현황매트릭스 추가필요 |
| `/admin/banners` | 3 (탭, 드래그리스트, CRUD폼) | O | 구현 완료, 배너유형탭 추가필요 |
| `/admin/products` | 4 (상품탭: 카드+필터, 쿠폰탭) | X | 신규 구현 필요 |
| `/admin/texts` | 3 (영역선택, 텍스트편집, 미리보기) | X | 신규 구현 필요 |
| `/admin/cohorts` | 4 (기수리스트, 기수폼, 스터디슬롯, 날짜타임라인) | X | 신규 구현 필요 |
| `/admin/completion` | 5 (수료기준, 판정결과, 수료증, 환급) | X | 신규 구현 필요 |
| `/admin/orders` | 3 (주문목록, 주문상세, 환불폼) | X | 신규 구현 필요 |
| `/admin/sessions` | 3 (세션리스트, 캘린더뷰, 세션폼) | X | 신규 구현 필요 |
| `/admin/users` | 3 (회원목록, 회원상세, 권한폼) | X | 신규 구현 필요 |
| `/admin/taxonomy` | 2 (카테고리관리, 태그관리) | X | 신규 구현 필요 |
| `/admin/messaging` | 2 (메시지템플릿, 알림규칙) | X | 신규 구현 필요 |
| `/admin/moderation` | 2 (신고큐, 처리액션) | X | 신규 구현 필요 |
| `/admin/badges` | 2 (뱃지정의, 부여규칙) | X | 신규 구현 필요 |
| `/admin/reports` | 3 (기수리포트, 콘텐츠리포트, 전환퍼널) | X | 신규 구현 필요 |

---

## 3. 의존성 분석

### 3.1 01-사이트 PRD와의 의존성

| 사이트 기능 | 어드민 관리 | 동기화 방향 |
|-----------|-----------|----------|
| 홈 배너 | `/admin/banners` (배너 CRUD) | 양방향 (매핑테이블 부록A 참조) |
| 게시글 카테고리 | `/admin/posts` (카테고리 이동) | 양방향 |
| 스터디 상세 | `/admin/studies` (최종제출 토글) | 양방향 |
| 텍스트/문구 | `/admin/texts` (모든 텍스트) | 양방향 |
| 상품가격 | `/admin/products` (자동가격전환) | 양방향 |
| GNB 공지 | `/admin/texts` (GNB 공지 바) | 양방향 |
| 프로필 뱃지 | `/admin/badges` (뱃지부여) | 양방향 |

**프론트-어드민 매핑**: 부록A에서 17개 항목 상세 정의

### 3.2 03-LMS PRD와의 의존성

| LMS 기능 | 어드민 관리 | 동기화 방향 |
|---------|-----------|----------|
| 수강생 대시보드 | `/admin/completion` (수료결과, 수료증) | 단방향 (어드민 → LMS) |
| 수강생 대시보드 | `/admin/orders` (결제상태) | 단방향 (어드민 → LMS) |
| 이번주할일 | `/admin/sessions` (세션일정) | 단방향 (어드민 → LMS) |
| 과제제출권한 | `/admin/studies` (과제연동규칙) | 단방향 (어드민 → LMS) |
| 스터디장 대시보드 | `/admin/studies` (최종제출토글) | 양방향 |
| 기수 관리 | `/admin/cohorts` (기수상태/날짜) | 양방향 |

**핵심 자동화** (사이트에서 처리):
- 수료판정 확정 → 수강생 대시보드 수료결과 자동반영
- 수료증 발급 → 수강생 대시보드 "수료증보기" 버튼 활성
- 환급완료 → 수강생 알림(DM/이메일) 발송
- 세션등록 → 수강생 "이번주할일" 세션카드 자동노출
- 과제제출 → 다음주 VOD 잠금해제(주차별 리셋)

---

## 4. Supabase 테이블 매핑 (CRUD 엔티티)

### 4.1 MVP필수 (기본 CRUD)

| 테이블명 | 주요 필드 | CRUD | 관리화면 |
|---------|---------|------|--------|
| `posts` | id, title, slug, category_id, status, author_id | R/U | `/admin/posts` (카테고리이동, 상태변경) |
| `banners` | id, type, title, image_url, link, position, active, period_start, period_end | C/R/U/D | `/admin/banners` (CRUD, 순서, 활성화) |
| `products` | id, study_id, name, super_early_price, early_price, regular_price, status | C/R/U | `/admin/products` (상품CRUD) |
| `coupons` | id, code, discount_type, amount, max_uses, valid_until, status | C/R/U/D | `/admin/products` (쿠폰CRUD) |
| `audit_logs` | id, user_id, action, table_name, record_id, before_value, after_value, created_at | C | 모든 변경 자동기록 |

### 4.2 MVP확장 (기수/수료/결제)

| 테이블명 | 주요 필드 | CRUD | 관리화면 |
|---------|---------|------|--------|
| `cohorts` | id, number, recruit_period_start, recruit_period_end, study_period_start, study_period_end, status | C/R/U | `/admin/cohorts` (기수CRUD) |
| `cohort_studies` | cohort_id, study_id | C/R/D | `/admin/cohorts` (스터디슬롯) |
| `orders` | id, user_id, study_id, amount, coupon_id, status, created_at | R/U | `/admin/orders` (조회, 환불) |
| `sessions` | id, cohort_id, title, type, date, time, zoom_url, description | C/R/U/D | `/admin/sessions` (세션CRUD) |
| `completions` | id, user_id, study_id, status (완료/미완료), completed_at | C/R/U | `/admin/completion` (수료판정) |
| `certificates` | id, user_id, study_id, pdf_url, issued_at | C/R | `/admin/completion` (수료증발급) |
| `refunds` | id, order_id, amount, reason, status, processed_at | C/R/U | `/admin/orders` (환급) |
| `assignment_settings` | cohort_id, min_posts, vod_access_scope, reset_timing | C/R/U | `/admin/studies` (과제연동규칙) |
| `attendance` | id, user_id, session_id, attended | C/R | `/admin/completion` (출석추적) |

### 4.3 Phase2 (사용자/권한/콘텐츠)

| 테이블명 | 주요 필드 | CRUD | 관리화면 |
|---------|---------|------|--------|
| `profiles` | user_id, role (admin/study_lead/user), managed_studies | R/U | `/admin/users` (권한관리) |
| `reports` | id, type, user_id, target_type, reason, status, handled_at | R/U | `/admin/moderation` (신고처리) |
| `badges` | id, name, icon_url, description, criteria_type | C/R/U/D | `/admin/badges` (뱃지정의) |
| `user_badges` | user_id, badge_id, awarded_at | C/R/D | `/admin/badges` (부여이력) |
| `text_content` | id, section, key, value, updated_at | R/U | `/admin/texts` (텍스트관리) |
| `text_history` | id, text_content_id, old_value, new_value, changed_by, changed_at | C | 변경이력추적 |

---

## 5. 병렬 개발 가능 그룹 분류

### Group A: 대시보드 & 기본관리 (MVP필수) — 순차의존 없음, 병렬개발 가능

**리더**: analyst-admin
**테이블**: posts, banners, audit_logs
**화면**: `/admin`, `/admin/posts`, `/admin/banners`
**상태**: 프로토타입 구현 완료 → 확장작업만 필요

작업 항목:
- 사이드바 메뉴 확장 (상품/쿠폰, 텍스트, DM/알림 메뉴 추가)
- `/admin/posts` 콘텐츠유형 필터 추가
- `/admin/posts` "원본보기" 링크 추가
- `/admin/banners` 배너유형 탭 추가

**예상 리소스**: 1-2인, 1주

---

### Group B: 상품/쿠폰 & 텍스트 (MVP필수, Retool & P17 대체) — 병렬개발 가능

**리더**: TBD
**테이블**: products, coupons, text_content, text_history
**화면**: `/admin/products`, `/admin/texts`
**상태**: 신규 구현 필요

**의존성**:
- `/admin/products` → 가격자동전환 로직 (백엔드 스케줄러)
- `/admin/texts` → 프론트 렌더링 반영 (사이트와 연동)

작업 항목:
- 상품 목록/CRUD 화면
- 가격자동전환 설정UI (날짜기반 계산)
- 쿠폰 목록/CRUD 화면
- 텍스트 영역별 인라인편집 (홈/섹션/GNB)
- 미리보기 기능 (실제프론트 렌더링)

**예상 리소스**: 2-3인, 2주

---

### Group C: 기수 & 과제연동권한 (MVP확장) — 순차의존

**리더**: TBD
**테이블**: cohorts, cohort_studies, assignment_settings
**화면**: `/admin/cohorts` + `/admin/studies` 확장
**상태**: 신규 구현 필요

**의존성**:
- 기수 생성 → 가격전환날짜 자동계산 (Group B의 가격로직에 의존)
- 기수 상태변경 → 스터디 상태일괄전환 (LMS PRD와 조율)
- 과제연동규칙 → 백엔드 자동화 (n8n or Edge Function 마이그레이션 필요)

작업 항목:
- 기수 목록/CRUD 화면
- 기수-스터디 슬롯배정 (다대다 관계)
- 날짜타임라인 (마일스톤 자동계산)
- 기수 상태변경 시 스터디 일괄전환
- 과제연동권한 규칙설정 UI

**예상 리소스**: 2인, 1.5주 (가격로직 완료 후)

---

### Group D: 수료/환급/결제 (MVP확장, P22 대체) — 순차의존

**리더**: TBD
**테이블**: orders, completions, certificates, refunds, attendance
**화면**: `/admin/completion`, `/admin/orders`
**상태**: 신규 구현 필요

**의존성**:
- 수료판정 → 출석+과제 데이터 수집 (LMS의 과제/출석 기능 완료 필요)
- 수료증발급 → PDF생성 (별도 라이브러리 필요)
- 환금처리 → PG연동 (결제시스템 정의 필요)
- 환급자동송금 → 재무팀 협의 (TBD, 부록B 참조)

작업 항목:
- 주문 목록/조회/필터 화면
- 환불 처리 폼 (사유/금액/확인)
- 수료기준 설정 (기수별)
- 수료판정 자동집계 + 수동조정 UI
- 수료증 미리보기 + PDF발급
- 환급대상자 추출 + 상태관리

**예상 리소스**: 2-3인, 2주 (LMS 기능 완료 후)

---

### Group E: 세션 관리 (MVP확장) — 병렬개발 가능

**리더**: TBD
**테이블**: sessions, attendance
**화면**: `/admin/sessions`
**상태**: 신규 구현 필요

**의존성**:
- 세션캘린더 표시 → 기수데이터 필요 (Group C와 경계)
- 세션참여자추적 → Zoom webhook 또는 CSV업로드 (Phase2로 연기 가능)

작업 항목:
- 세션 목록/CRUD 화면
- 반복패턴 설정 (매주 패턴 → 4주분 일괄생성)
- 캘린더뷰 (기수별)
- Zoom URL 관리

**예상 리소스**: 1-2인, 1주

---

### Group F: 회원/권한/모더레이션 (Phase2) — 병렬개발 가능

**리더**: TBD
**테이블**: profiles, reports
**화면**: `/admin/users`, `/admin/moderation`
**상태**: 신규 구현 필요

**의존성**: 없음 (Phase2이므로 MVP 완료 후)

작업 항목:
- 회원검색/필터 화면
- 회원상세 (프로필, 스터디이력, 콘텐츠, 결제이력)
- 역할권한 변경 드롭다운
- 신고큐 (상태필터, 우선순위)
- 처리액션 (기각/비공개/경고/제한/정지)
- 제재이력 로그

**예상 리소스**: 2인, 1.5주

---

### Group G: 분류/DM/뱃지/리포트 (Phase2) — 병렬개발 가능

**리더**: TBD
**테이블**: text_content, badges, user_badges
**화면**: `/admin/taxonomy`, `/admin/messaging`, `/admin/badges`, `/admin/reports`
**상태**: 신규 구현 필요

**의존성**: 없음 (Phase2이므로 MVP 완료 후)

작업 항목:
- 카테고리/태그 순서변경, 병합, 삭제
- 메시지템플릿 (가입/신청/리마인더/수료)
- 알림규칙 설정 (채널, 유형별ON/OFF)
- 뱃지정의 CRUD (자동/수동부여)
- 기수별/콘텐츠/전환 리포트 (차트시각화)
- CSV다운로드

**예상 리소스**: 2-3인, 2주

---

## 6. 개발 일정 권고

### Phase 1: MVP필수 (4주)

| 주차 | Group | 작업 | 리소스 |
|------|-------|------|--------|
| Week 1 | A | 사이드바확장, 게시글/배너 추가기능 | 1-2인 |
| Week 1-2 | B | 상품/쿠폰/텍스트 화면 신규구현 | 2-3인 |
| Week 2 | C | 기수관리 화면 (가격로직 선행필요) | 2인 |
| Week 3-4 | D | 수료/환급/결제 화면 (LMS연동 병렬) | 2-3인 |
| Week 2-3 | E | 세션관리 화면 | 1-2인 |

**병렬도**: A/B/E 동시진행 가능, C는 B의 가격로직 완료 후, D는 LMS과제/출석 완료 후

---

### Phase 1.5: MVP확장 (2주)

| 주차 | 작업 |
|------|------|
| Week 5-6 | Group C/D 완성 (과제연동, 수료환급 마무리) |

---

### Phase 2: 후속기능 (4주)

| 주차 | Group | 작업 |
|------|-------|------|
| Week 7-10 | F/G | 회원/모더레이션, 분류/DM/뱃지/리포트 |

---

## 7. 해결되는 문제 매핑

| 문제번호 | 문제설명 | 해결 기능 | 어드민 화면 |
|---------|--------|---------|-----------|
| P13 | 7단계 네비게이션 | Flat 구조 + 빠른작업 + 인라인조작 | `/admin` (대시보드) |
| P14 | 프론트-어드민 매핑 불명확 | 프론트에서보기 링크 + 미리보기 | 모든 화면 (부록A) |
| P15 | 게시글 이동 불가 + 웹훅중복 | 카테고리 이동 드롭다운 + 일괄이동 | `/admin/posts` |
| P16 | Retool 의존 | 상품/쿠폰 완전내재화 + 결제/주문관리 | `/admin/products`, `/admin/orders` |
| P17 | 텍스트 수정 제약 | 텍스트 인라인편집 + 미리보기 | `/admin/texts` |
| P22 | 외부도구 11개 의존 | 에어테이블/n8n/구글캘린더 대체 | `/admin/cohorts`, `/admin/completion`, `/admin/sessions` |
| D15 | LMS 내재화 | 수료/환급/기수/세션/과제권한 | `/admin/completion` 외 |

---

## 8. 주요 고려사항

### 기술적 고려사항

1. **사이드바 공통화**: 현재 각 페이지에서 사이드바 중복정의 → `app/admin/layout.tsx`로 추출
2. **역할기반분기**: Supabase auth의 custom claims 또는 profiles.role로 메뉴조건부렌더링
3. **서버/클라이언트분리**: 데이터페칭은 Server Component, 상호작용(토글/드롭다운)은 Client Component
4. **자동화 마이그레이션**: 기존 n8n 웹훅을 Supabase Edge Function으로 전환 (TBD, 부록B)
5. **에어테이블연동**: 범위정의 필요 (완전이관 vs 읽기동기화, TBD 부록B)

### 운영/정책 결정 필요

1. **가격전환시간**: 자정 기준 등 세부정의 필요
2. **쿠폰코드형식**: 길이/문자구성 패턴
3. **환급자동송금**: 사이트직송 vs 대상자추출만
4. **신고임계값**: 자동비공개 처리 기준
5. **뱃지자동부여**: 게시글수/투표수 등 구체적임계값
6. **관리자활동로그**: 보존기간정책
7. **결제PG연동**: PG사/환불API지원범위

---

## 9. 프로토타입 구현 현황 요약

| 화면 | 현황 | 완성도 | 추가작업 |
|------|------|--------|--------|
| `/admin` | 구현완료 | 80% | 사이드바 메뉴확장 |
| `/admin/posts` | 구현완료 | 85% | 콘텐츠유형필터 + 원본보기 |
| `/admin/studies` | 구현완료 | 80% | 참여자현황매트릭스 + 과제연동규칙UI |
| `/admin/banners` | 구현완료 | 85% | 배너유형탭 + 미리보기(실제렌더링) |
| `/admin/products` | 신규필요 | 0% | 전체신규 |
| `/admin/texts` | 신규필요 | 0% | 전체신규 |
| `/admin/cohorts` | 신규필요 | 0% | 전체신규 |
| `/admin/completion` | 신규필요 | 0% | 전체신규 |
| `/admin/orders` | 신규필요 | 0% | 전체신규 |
| `/admin/sessions` | 신규필요 | 0% | 전체신규 |
| 기타 Phase2 | 신규필요 | 0% | 전체신규 |

---

## 10. 의존성 요약 (다른 PRD와의 관계)

```
PRD-01 사이트
  ├→ /admin/banners (배너관리)
  ├→ /admin/texts (텍스트관리)
  ├→ /admin/posts (게시글카테고리)
  └→ /admin/products (상품가격)

PRD-03 LMS
  ├← /admin/completion (수료결과반영)
  ├← /admin/orders (결제상태반영)
  ├← /admin/sessions (세션일정반영)
  ├← /admin/studies (과제연동규칙)
  └← /admin/cohorts (기수상태일괄전환)
```

**방향**: 사이트←→어드민 양방향 / 어드민→LMS 단방향

---

## 별첨

- **부록A**: 프론트-어드민 매핑 테이블 (17개 항목) — PRD P1298~1323
- **부록B**: 미결 사항 (TBD, 10개) — PRD P1327~1344
