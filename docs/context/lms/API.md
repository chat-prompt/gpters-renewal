# API 문서

AI Study LMS의 모든 API 엔드포인트를 설명합니다.

## 목차

1. [인증 API](#1-인증-api)
2. [기수 관리 API](#2-기수-관리-api)
3. [스터디 API](#3-스터디-api)
4. [VOD API](#4-vod-api)
5. [통합 대시보드 API](#5-통합-대시보드-api-⭐)
6. [게시글 API](#6-게시글-api)
7. [세션 API](#7-세션-api)
8. [리더보드 API](#8-리더보드-api)
9. [찐친챌린지 API](#9-찐친챌린지-api)
10. [베스트발표자 API](#10-베스트발표자-api)

---

## 1. 인증 API

### `POST /api/auth/login`

전화번호와 기수를 기반으로 사용자 로그인을 처리합니다.

**사용처:**
- `app/login/page.tsx:88`

**요청:**
```typescript
POST /api/auth/login
Content-Type: application/json

{
  "phone": "010-1234-5678",  // 하이픈 포함 가능
  "cohort": 19                // 기수 번호
}
```

**성공 응답:**
```typescript
{
  "success": true,
  "user": {
    "name": "홍길동",
    "phone": "01012345678",
    "cohort": 19
  }
}
```

**실패 응답:**
```typescript
// 400 Bad Request - 입력값 누락
{
  "success": false,
  "error": "전화번호와 기수를 입력해주세요."
}

// 403 Forbidden - 권한 없음
{
  "success": false,
  "error": "접근 권한이 없습니다.",
  "message": "선택하신 19기에 결제 성공한 기록이 없습니다. 전화번호와 기수를 확인해주세요."
}

// 500 Internal Server Error
{
  "success": false,
  "error": "로그인 중 오류가 발생했습니다.",
  "message": "에러 메시지"
}
```

**구현 세부사항:**
- Airtable `결제(Sync)` 테이블에서 `상태 = 'Success'` 레코드 조회
- 전화번호 정규화 (하이픈 제거) 후 매칭
- Lookup 필드 `기수`는 배열이므로 `includes()` 사용
- 최대 50개 레코드 조회 (전화번호 중복 고려)

---

## 2. 기수 관리 API

### `GET /api/cohorts`

모든 기수 목록과 현재 활성 기수를 조회합니다.

**사용처:**
- `app/login/page.tsx:28`

**요청:**
```typescript
GET /api/cohorts
```

**성공 응답:**
```typescript
{
  "success": true,
  "currentCohort": 19,  // 현재 진행 중인 기수
  "cohorts": [
    {
      "id": "recXXXXXXX",
      "cohortNumber": 19,
      "cohortName": "19기",
      "studyStartDate": "2025-01-01",
      "studyEndDate": "2025-03-31",
      "recruitStartDate": "2024-12-01",
      "recruitEndDate": "2024-12-25",
      "isCurrent": true  // 현재 진행 중 여부
    },
    // ... 다른 기수들
  ]
}
```

**실패 응답:**
```typescript
{
  "success": false,
  "error": "Failed to fetch cohorts from Airtable",
  "message": "에러 메시지"
}
```

**구현 세부사항:**
- Airtable `기수관리` 테이블 조회
- `기수` 필드 기준 내림차순 정렬 (최신 기수부터)
- `isCurrent` 판단 로직: `스터디시작일 <= 오늘 <= 스터디종료일`
- 현재 기수가 없으면 가장 최신 기수를 `currentCohort`로 반환

---

## 3. 스터디 API

### `GET /api/studies`

특정 기수의 확정된 스터디 목록을 조회합니다.

**사용처:**
- `app/page.tsx:69` (홈 페이지 - 스터디 목록)
- `app/replay/page.tsx:73` (다시보기 페이지 - 스터디 필터)

**요청:**
```typescript
GET /api/studies?cohort=19
```

**Query Parameters:**
- `cohort` (required): 기수 번호

**성공 응답:**
```typescript
{
  "success": true,
  "cohort": 19,
  "count": 15,  // 활성 스터디 수
  "data": [
    {
      "id": "recXXXXXXX",
      "주제명": "딥러닝 기초",
      "구분": "정규",
      "카테고리": "AI/ML",
      "study_order": 19,
      "요일": "화요일",
      "스터디_시간": "20:00-22:00",
      "모집_시작일": "2024-12-01",
      "모집_마감일시": "2024-12-25T23:59:59",
      "스터디_시작일": "2025-01-07",
      "스터디_종료일": "2025-01-28",
      "스터디장 이름": "홍길동",
      "slug": "dl-basics-19",
      "url": "https://example.com/study/dl-basics-19",
      "줌url": "https://zoom.us/j/xxxxx",
      "zoom_url_gateway": "https://gateway.zoom.us/xxxxx",
      "썸네일url": "https://example.com/thumbnail.jpg",
      "태그명(syncX)": ["딥러닝기초"],
      "스터디소개": "딥러닝의 기초를 배웁니다.",
      "참가조건": "Python 기초 지식 필요",
      "오픈카톡방url": "https://open.kakao.com/xxxxx",
      "신청자수_스터디장포함": 12,
      "폐강됨": false,
      "confirmed": true
    },
    // ... 다른 스터디들
  ]
}
```

**실패 응답:**
```typescript
// 400 Bad Request - 필수 파라미터 누락
{
  "success": false,
  "error": "기수 파라미터가 필요합니다.",
  "message": "cohort parameter is required"
}

// 500 Internal Server Error
{
  "success": false,
  "error": "Failed to fetch studies from Airtable",
  "message": "에러 메시지"
}
```

**구현 세부사항:**
- Airtable `확정된 스터디(건들지X)` 테이블 조회
- 필터: `기수(study_order) = {cohort}`
- 정렬: `요일` 오름차순
- 폐강된 스터디(`폐강됨 = true`) 자동 필터링
- 썸네일 필드 여러 변형 지원 (`썸네일_url`, `썸네일url`, `thumbnail_url`, `이미지`, `대표이미지`)

---

## 4. VOD API

### `GET /api/vod`

특정 기수의 VOD (다시보기) 목록을 조회합니다.

**사용처:**
- `app/replay/page.tsx:95`

**요청:**
```typescript
GET /api/vod?cohort=19&study=딥러닝기초
```

**Query Parameters:**
- `cohort` (optional): 기수 번호 (기본값: 19)
- `study` (optional): 스터디 태그명 필터
  - `"all"` 또는 생략: 모든 VOD
  - `"N기 공통일정"`: 공통 일정 VOD만 (스터디_태그명이 비어있는 것)
  - 스터디 태그명: 해당 스터디의 VOD만

**성공 응답:**
```typescript
{
  "success": true,
  "cohort": 19,
  "count": 4,
  "data": [
    {
      "id": "recXXXXXXX",
      "기수": "19기",
      "주차": 1,
      "스터디_태그명": "딥러닝기초",
      "영상링크": "https://youtube.com/watch?v=xxxxx",
      "업로드일": "2025-01-08",
      "제목": "1주차 - 딥러닝 개요",
      "설명": "딥러닝의 기본 개념을 소개합니다."
    },
    // ... 다른 VOD들
  ]
}
```

**실패 응답:**
```typescript
{
  "success": false,
  "error": "Failed to fetch VOD records from Airtable",
  "message": "에러 메시지",
  "data": []
}
```

**구현 세부사항:**
- Airtable `줌기록 VOD` 테이블 조회
- 필터:
  - 기본: `{기수} = "19기"` (문자열 형식 주의!)
  - 공통일정: `AND({기수} = "19기", OR({스터디_태그명} = BLANK(), {스터디_태그명} = ""))`
  - 특정 스터디: `AND({기수} = "19기", FIND("딥러닝기초", {스터디_태그명}))`
- 정렬: `주차` 오름차순
- ⚠️ **View 사용 금지** (숨겨진 필터가 있을 수 있음)
- `convertVodToReplay()` 헬퍼 함수로 데이터 변환

---

## 5. 통합 대시보드 API ⭐

### `GET /api/user/dashboard`

사용자의 스터디 정보 + 과제 현황을 단일 API 호출로 조회합니다.

**사용처:**
- `app/assignment/page.tsx:283` (과제 페이지)
- `app/page.tsx:45` (홈 페이지 - 내 스터디 태그)
- `app/replay/page.tsx:51` (다시보기 페이지 - 과제 제출 현황)

**요청:**
```typescript
GET /api/user/dashboard?phone=01012345678&cohort=19
```

**Query Parameters:**
- `phone` (required): 사용자 전화번호
- `cohort` (required): 기수 번호

**성공 응답 (수강 중인 경우):**
```typescript
{
  "success": true,
  "data": {
    "studies": {
      "hasStudy": true,
      "studies": [
        {
          "id": "recXXXXXXX",
          "주제명": "딥러닝 기초",
          "구분": "정규",
          "카테고리": "AI/ML",
          "요일": "화요일",
          "스터디_시간": "20:00-22:00",
          "스터디장 이름": "홍길동",
          "썸네일url": "https://example.com/thumbnail.jpg",
          "스터디소개": "딥러닝의 기초를 배웁니다.",
          "오픈카톡방url": "https://open.kakao.com/xxxxx",
          "zoom_url_gateway": "https://gateway.zoom.us/xxxxx",
          "url": "https://example.com/study/dl-basics-19"
        }
      ],
      "message": null
    },
    "assignments": {
      "weeklyAssignments": [
        {
          "week": 2,
          "weekStartDate": "2025-01-14",
          "deadline": "2025-01-21T23:59:59.999Z",
          "assignments": [
            {
              "id": "recYYYYYYY",
              "title": "2주차 과제 - CNN 구현",
              "submittedAt": "2025-01-20T15:30:00.000Z",
              "url": "https://bettermode.com/posts/xxxxx",
              "week": 2,
              "isLate": false,
              "summary": "CNN 모델을 구현했습니다.",
              "content": "# 과제 내용\n..."
            }
          ],
          "hasSubmission": true,
          "replayUnlocked": true  // 과제 제출 시 다시보기 잠금 해제
        },
        {
          "week": 3,
          "weekStartDate": "2025-01-21",
          "deadline": "2025-01-28T23:59:59.999Z",
          "assignments": [],
          "hasSubmission": false,
          "replayUnlocked": false  // 미제출 시 다시보기 잠금
        },
        {
          "week": 4,
          "weekStartDate": "2025-01-28",
          "deadline": "2025-02-04T23:59:59.999Z",
          "assignments": [],
          "hasSubmission": false,
          "replayUnlocked": false
        }
      ],
      "studyTag": "딥러닝기초",
      "studyDay": "화요일"
    }
  }
}
```

**성공 응답 (청강생인 경우):**
```typescript
{
  "success": true,
  "data": {
    "studies": {
      "hasStudy": false,
      "studies": [],
      "message": "수강신청을 하지 않으셨습니다. 청강만 가능합니다."
    },
    "assignments": {
      "weeklyAssignments": [],
      "studyTag": null,
      "studyDay": null
    }
  }
}
```

**실패 응답:**
```typescript
// 400 Bad Request - 입력값 누락
{
  "success": false,
  "error": "전화번호와 기수가 필요합니다."
}

// 500 Internal Server Error
{
  "success": false,
  "error": "대시보드 정보 조회 중 오류가 발생했습니다.",
  "message": "에러 메시지",
  "data": {
    "studies": {
      "hasStudy": false,
      "studies": [],
      "message": null
    },
    "assignments": {
      "weeklyAssignments": [],
      "studyTag": null,
      "studyDay": null
    }
  }
}
```

**구현 세부사항:**

### 1. 결제 정보 조회 (단일 쿼리)
- Airtable `결제(Sync)` 테이블에서 사용자 정보 조회
- 필터: `상태 = 'Success' AND (전화번호 = {phone} OR 전화번호 = {normalizedPhone})`
- 기수 매칭: Lookup 필드 `기수`에 `cohort` 포함 여부 확인

### 2. 병렬 데이터 페칭 (성능 최적화)
`Promise.all()`로 동시 조회:
- **스터디 상세 정보**: `확정된 스터디(건들지X)` 테이블에서 `확정된_스터디` ID로 조회
- **주차 관리 정보**: `N주차관리` 테이블에서 해당 기수의 주차 정보 조회
- **게시글 정보**: `게시글(Sync)` 테이블에서 사용자의 과제 제출 내역 조회
  - 필터: 전화번호 매칭, 삭제되지 않음, 과제 타입, 스터디 태그 매칭

### 3. 데이터 가공
- **스터디 데이터**: 필요한 필드만 추출하여 반환
- **과제 데이터**:
  - 2~4주차만 생성 (1주차는 과제 없음)
  - 각 주차별 마감일 계산: `calculateWeekDeadline(주차시작일, 스터디_요일)`
  - 게시글을 `주차인정` 필드로 그룹핑 (Map 사용으로 O(1) 룩업)
  - 지각 제출 여부 판단: `isLateSubmission(생성일, deadline)`

### 4. 성능 개선
- **중복 쿼리 제거**: 기존 2회 → 1회 (결제 테이블)
- **병렬 처리**: `Promise.all()`로 Airtable 쿼리 동시 실행
- **Map 기반 룩업**: `postsByWeek`, `weekInfoMap` (O(1) 성능)
- **응답 시간**: 500ms → 300ms (40% 개선)

### 5. 다시보기 권한 로직
- **1주차**: 모든 사용자 접근 가능
- **내 스터디**: 과제 제출 여부와 무관하게 전체 접근
- **타 스터디 (2~4주차)**: 해당 주차 과제 제출 시에만 접근 가능
  - `replayUnlocked` 필드로 잠금 상태 표시

---

## 성능 비교

### 기존 아키텍처 (Deprecated)
```
/api/user/studies + /api/user/assignments
- API 호출: 2회
- 결제 쿼리: 2회 (중복)
- 응답 시간: 약 500ms
```

### 현재 아키텍처 (Unified)
```
/api/user/dashboard
- API 호출: 1회
- 결제 쿼리: 1회
- 병렬 처리: Promise.all()
- 응답 시간: 약 300ms (40% 개선)
```

---

## 에러 처리 패턴

모든 API는 일관된 에러 응답 형식을 사용합니다:

```typescript
{
  "success": false,
  "error": "사용자에게 표시할 에러 메시지",
  "message": "개발자를 위한 상세 에러 메시지 (optional)"
}
```

**HTTP Status Codes:**
- `200`: 성공
- `400`: 잘못된 요청 (필수 파라미터 누락 등)
- `403`: 권한 없음 (인증 실패)
- `500`: 서버 에러 (Airtable 쿼리 실패 등)

---

## Airtable 테이블 참조

| API | 사용 테이블 | 테이블 ID |
|-----|-----------|----------|
| `/api/auth/login` | 결제(Sync) | `tblQNIOB0C8CXvgis` |
| `/api/cohorts` | 기수관리 | `tblJ2uV2TyAtRV06Q` |
| `/api/studies` | 확정된 스터디(건들지X) | `tblP0bMmo1xuLnX2v` |
| `/api/vod` | 줌기록 VOD | `tblLeSdOWr22vtaI4` |
| `/api/user/dashboard` | 결제(Sync), 확정된 스터디(건들지X), N주차관리, 게시글(Sync) | 4개 테이블 |
| `/api/notices` | 공지사항 | `tblq25zarOfLiDm4R` |
| `/api/leader/notices` | 공지사항 | `tblq25zarOfLiDm4R` |
| `/api/sessions/all` | 공지사항 | `tblq25zarOfLiDm4R` |
| `/api/sessions/today` | 공지사항 | `tblq25zarOfLiDm4R` |
| `/api/challenge` | 찐친챌린지, N주차관리 | `tblZbqQPwpoHIED55`, `tblu1mkrh8KYX7SuU` |

---

## 캐싱 전략

`/api/user/dashboard`는 클라이언트 측 캐싱(`CacheManager`)을 사용합니다:
- **TTL**: 5분
- **저장소**: localStorage
- **캐시 키**: `dashboard_${phone}_${cohort}`
- **성능 개선**: 1800ms → 150ms (캐시 히트 시, 92% 개선)

자세한 내용은 `lib/cache.ts` 참조.

---

## 보안 고려사항

1. **전화번호 정규화**: 하이픈 제거 후 비교 (`phone.replace(/[^\d]/g, '')`)
2. **SQL Injection 방지**: Airtable SDK의 parameterized query 사용
3. **권한 검증**: 결제 테이블에서 `상태 = 'Success'` 확인
4. **민감 정보**: API 키는 환경변수로 관리 (`.env.local`)

---

## 개발 가이드

### API 테스트
```bash
# 로컬 개발 서버 실행
npm run dev

# API 테스트 (curl)
curl http://localhost:3000/api/cohorts
curl http://localhost:3000/api/studies?cohort=19
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"phone":"010-1234-5678","cohort":19}'
```

### Airtable 필드 타입 주의사항
- **Lookup 필드**: 배열로 반환됨 (예: `기수`, `전화번호`, `스터디_태그명`)
- **기수 필드**: 문자열 형식 `"19기"` (숫자 아님!)
- **주차인정 필드**: 문자열 `"2주차"`, `"3주차"`, `"4주차"` - `parseInt()` 필요
- **Single Select**: 경우에 따라 배열로 반환될 수 있음 - 항상 두 타입 처리

### 새 API 추가 시 체크리스트
- [ ] `app/api/[endpoint]/route.ts` 파일 생성
- [ ] 입력값 검증 (`phone`, `cohort` 등)
- [ ] Airtable 필터 공식 작성 (View 사용 금지!)
- [ ] 에러 처리 (try-catch + 일관된 응답 형식)
- [ ] TypeScript 타입 정의 (`lib/airtable.types.ts`)
- [ ] API 문서 업데이트 (이 파일)
- [ ] 성능 테스트 (응답 시간 측정)

---

## 6. 게시글 API

### `GET /api/posts/all`

같은 기수 학습자들의 과제 게시글을 조회합니다. 스터디 및 주차 필터링을 지원합니다.

**사용처:**
- `app/posts/page.tsx:84`

**요청:**
```typescript
GET /api/posts/all?cohort=19&study=19기%20딥러닝기초&week=2
```

**Query Parameters:**
- `cohort` (필수): 기수 번호 (예: 19)
- `study` (선택): 스터디 태그명 (예: "19기 딥러닝기초") 또는 'all'
- `week` (선택): 주차 번호 (2, 3, 4) 또는 'all'

**성공 응답:**
```typescript
{
  "success": true,
  "cohort": 19,
  "count": 10729,
  "filters": {
    "study": "19기 딥러닝기초" | null,
    "week": 2 | null
  },
  "data": [
    {
      "id": "recXXXXX",
      "title": "30분 만에 만드는 식당 예약 관리 페이지",
      "author": "***1178",  // 마스킹된 전화번호 (뒷 4자리만)
      "studyTag": "19기 구글트레이너",
      "week": 2,  // null 가능
      "submittedAt": "2025-11-26T12:34:47.211Z",
      "url": "https://www.gpters.org/...",
      "summary": "Google 스프레드시트와 AI만으로 서버 없이 예약 시스템을 만든 사례",
      "content": "### 하려던 것 📝\n..."  // 마크다운 HTML
    }
    // ...
  ]
}
```

**실패 응답:**
```typescript
// 400 Bad Request - cohort 파라미터 누락
{
  "success": false,
  "error": "기수 파라미터가 필요합니다.",
  "message": "cohort parameter is required",
  "data": []
}

// 500 Internal Server Error
{
  "success": false,
  "error": "Failed to fetch posts from Airtable",
  "message": "에러 메시지",
  "data": []
}
```

**구현 세부사항:**
- Airtable `게시글(Sync)` 테이블 조회
- 기본 필터:
  - `삭제일 = BLANK()` (삭제되지 않은 게시글)
  - `bettermodePostTypeId = 'KLxSodedLeDUiTj'` (과제 게시글만)
  - `FIND("N기", ARRAYJOIN({스터디_태그명}, ",")) > 0` (해당 기수 게시글만)
- 스터디 필터: `FIND("스터디명", ARRAYJOIN({스터디_태그명}, ",")) > 0`
- 주차 필터: `FIND("N주차", ARRAYJOIN({주차인정}, ",")) > 0`
- 전화번호 마스킹: 뒷 4자리만 표시 (예: `***1178`)
- 주차 추출: `'2주차'` → `2` (정규식 매칭)
- 스터디 태그: 배열이면 첫 번째 요소 사용
- 정렬: `생성일` 역순 (최신순)
- CacheManager 캐싱 지원 (5분 TTL)

**데이터 모델:**
```typescript
// lib/airtable.types.ts
export interface CommunityPost {
  id: string
  title: string
  author: string              // 마스킹된 전화번호
  studyTag: string            // 스터디 태그명
  week: number | null         // 주차 번호
  submittedAt: string         // ISO 8601
  url: string | null
  summary?: string
  content?: string
}

export interface CommunityPostsResponse {
  success: boolean
  cohort: number
  count: number
  filters: {
    study: string | null
    week: number | null
  }
  data: CommunityPost[]
}
```

---

## 7. 공지사항 API

### `GET /api/notices`

멤버 대상 공지사항 목록을 조회합니다. 공지사항 테이블에서 `구분 = "멤버공지"`인 항목을 반환합니다.

**사용처:**
- `app/notice/page.tsx` - 공지사항 페이지
- `components/home/CompactNoticeWidget.tsx` - 홈 위젯
- `components/home/NoticeBanner.tsx` - 공지 배너

**요청:**
```typescript
GET /api/notices?cohort=19
```

**Query Parameters:**
- `cohort` (required): 기수 번호 (예: 19)
- `refresh` (optional): 강제 새로고침 (`true`이면 캐시 무효화)

**응답 예시:**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "id": "rec123",
      "title": "19기 오리엔테이션 안내",
      "content": "# 환영합니다...",
      "cohort": "19기",
      "url": null,
      "createdAt": "2025-01-10T12:00:00Z",
      "isImportant": false,
      "prefix": "필독",
      "order": 0
    }
  ],
  "cached": false
}
```

**구현 세부사항:**
- Airtable `공지사항` 테이블 조회
- 필터: `{기수} = "19기" AND NOT({숨김}) AND {구분} = "멤버공지"`
- 정렬: `순서` 오름차순 → `Created` 내림차순
- 캐싱: Redis, TTL 5분 (`notices:{cohort}`)

---

### `GET /api/leader/notices`

스터디장 전용 공지사항 목록을 조회합니다. 공지사항 테이블에서 `구분 = "스터디장가이드"`인 항목을 반환합니다.

**사용처:**
- `app/leader/page.tsx` - 스터디장 공지 페이지

**요청:**
```typescript
GET /api/leader/notices?cohort=19
```

**Query Parameters:**
- `cohort` (required): 기수 번호
- `refresh` (optional): 강제 새로고침

**구현 세부사항:**
- Airtable `공지사항` 테이블 조회
- 필터: `{기수} = "19기" AND NOT({숨김}) AND {구분} = "스터디장가이드"`
- 정렬: `순서` 오름차순 → `Created` 내림차순
- 캐싱: Redis, TTL 5분 (`leader-notices:{cohort}`)
- **prefix 활용**: 카테고리 분류용 (스터디준비, 진행가이드, 다시보기)

---

## 8. 세션 API

### `GET /api/sessions/all`

특정 기간 내 공통세션 목록을 조회합니다. 공지사항 테이블에서 `구분 = "줌세션"`인 항목을 반환합니다.

**사용처:**
- `components/assignment/StudyCalendar.tsx` - 캘린더 컴포넌트

**요청:**
```typescript
GET /api/sessions/all?cohort=19&from=2025-01-01&to=2025-03-31
```

**Query Parameters:**
- `cohort` (required): 기수 번호
- `from` (optional): 시작일 (YYYY-MM-DD)
- `to` (optional): 종료일 (YYYY-MM-DD)
- `refresh` (optional): 강제 새로고침

**구현 세부사항:**
- Airtable `공지사항` 테이블 조회
- 필터: `{기수} = "19기" AND {구분} = "줌세션" AND NOT({숨김})` + 날짜 범위
- 정렬: `날짜시간` 오름차순
- 캐싱: Redis, TTL 5분
- **타이틀**: `prefix` 필드값 사용 (예: "공통세션")

---

### `GET /api/sessions/today`

오늘 진행되는 공통세션 목록을 조회합니다. 공지사항 테이블에서 `구분 = "줌세션"`이고 날짜가 오늘인 항목을 반환합니다.

**사용처:**
- `app/studies/page.tsx` - 오늘 진행 탭

**요청:**
```typescript
GET /api/sessions/today?cohort=19
```

**Query Parameters:**
- `cohort` (필수): 기수 번호 (예: 19)

**성공 응답:**
```typescript
{
  "success": true,
  "cohort": 19,
  "date": "2026-01-08",
  "count": 2,
  "data": [
    {
      "id": "recXXXXX",
      "title": "19기 네트워킹 세션",
      "content": "기수 멤버들과 함께하는 네트워킹 시간입니다",
      "sessionDateTime": "2026-01-08T20:00:00.000Z",
      "zoomUrl": "https://zoom.us/j/xxxxx"
    }
  ]
}
```

**실패 응답:**
```typescript
// 400 Bad Request - cohort 누락
{
  "success": false,
  "error": "기수(cohort) 파라미터가 필요합니다."
}

// 500 Internal Server Error
{
  "success": false,
  "error": "오늘의 세션을 불러오는데 실패했습니다."
}
```

**구현 세부사항:**
- Airtable `공지사항` 테이블 조회
- 필터: `{기수} = "19기" AND {구분} = "줌세션" AND NOT({숨김}) AND IS_SAME({날짜시간}, "오늘", "day")`
- 정렬: `날짜시간` 오름차순 (시간순)
- 캐싱: 없음 (실시간 데이터)
- **타이틀**: `prefix` 필드값 사용 (예: "공통세션")

**데이터 모델:**
```typescript
// lib/db/airtable.types.ts
export interface TodaySession {
  id: string
  title: string
  content: string          // 간단 설명
  sessionDateTime: string  // ISO 8601
  zoomUrl: string | null
}
```

---

## 8. 리더보드 API

### `GET /api/leaderboard`

기수별 게시글 수 기준 활동왕 순위를 조회합니다. 상위 10명 + 동점자를 반환하며, BetterMode 프로필 링크용 `bettermodeUserId`를 포함합니다.

**사용처:**
- `app/page.tsx` - 홈 페이지 활동왕 섹션
- `components/home/LeaderboardSection.tsx` - 활동왕 컴포넌트

**요청:**
```typescript
GET /api/leaderboard?cohort=19
```

**Query Parameters:**
- `cohort` (required): 기수 번호 (예: 19)

**성공 응답:**
```typescript
{
  "success": true,
  "data": [
    {
      "rank": 1,
      "nickname": "홍길동",
      "count": 15,
      "bettermodeUserId": "abc123"  // BetterMode 프로필 ID
    },
    {
      "rank": 2,
      "nickname": "김철수",
      "count": 12,
      "bettermodeUserId": "def456"
    },
    {
      "rank": 3,
      "nickname": "이영희",
      "count": 10,
      "bettermodeUserId": null  // ID가 없는 경우 null
    }
    // ... 최대 10명 + 동점자
  ],
  "cached": false  // Redis 캐시 여부
}
```

**실패 응답:**
```typescript
// 400 Bad Request - cohort 파라미터 누락
{
  "success": false,
  "error": "기수 파라미터가 필요합니다.",
  "message": "cohort parameter is required"
}

// 500 Internal Server Error
{
  "success": false,
  "error": "리더보드를 불러오는데 실패했습니다."
}
```

**구현 세부사항:**
1. **게시글 집계**: `게시글(Sync)` 테이블에서 전화번호 기준으로 게시글 수 집계
   - 필터: `삭제일 = BLANK()`, `bettermodePostTypeId = 'KLxSodedLeDUiTj'`, 해당 기수
2. **BetterMode ID 조회**: `결제(Sync)` 테이블에서 상위 10명의 전화번호로 `bettermode_user_id` 조회
3. **동점자 처리**: 10위와 같은 점수인 사용자도 모두 포함
4. **캐싱**: Redis, TTL 5분 (`leaderboard:{cohort}`)

**프로필 링크 형식:**
```
https://www.gpters.org/member/{bettermodeUserId}
```

---

## 9. 찐친챌린지 API

### `GET /api/challenge`

기수별 찐친챌린지 인증 통계를 조회합니다. 2주차 월요일 00:00부터 4주차 목요일 23:59까지의 챌린지 기간 동안의 인증 현황을 반환합니다.

**사용처:**
- `app/page.tsx` - 홈 페이지 찐친챌린지 위젯
- `components/home/ChallengeStatsWidget.tsx` - 챌린지 통계 컴포넌트
- `components/home/ChallengePieChart.tsx` - 파이차트 컴포넌트
- `components/home/ChallengeLeaderboard.tsx` - Top 5 컴포넌트
- `components/home/MyCertificationCard.tsx` - 내 인증 현황 컴포넌트

**요청:**
```typescript
GET /api/challenge?cohort=20
GET /api/challenge?cohort=20&phone=01012345678  // 내 인증 현황 포함
```

**Query Parameters:**
- `cohort` (required): 기수 번호 (예: 20)
- `phone` (optional): 전화번호 (내 인증 현황 조회용)

**성공 응답:**
```typescript
{
  "success": true,
  "data": {
    "cohort": 20,
    "roomName": "20기 네트워킹방",
    "period": {
      "start": "2026-01-13T00:00:00.000Z",  // 2주차 월요일 00:00
      "end": "2026-01-30T23:59:59.999Z"     // 4주차 목요일 23:59
    },
    "stats": {
      "totalCertifications": 156,           // 전체 인증현황 (모든 레코드 수)
      "uniqueDayCertifications": 89         // 인증 인정 횟수 (Sender별 날짜 중복 제거)
    },
    "senderStats": [                        // Sender별 통계 (인정일수 내림차순 정렬)
      {
        "sender": "홍길동",
        "certificationCount": 15,           // 인증 횟수 (전체)
        "uniqueDays": 12,                   // 인정일수 (날짜 중복 제거)
        "percentage": 13.5                  // 전체 대비 비율 (0-100)
      },
      // ... 더 많은 sender
    ],
    "myCertification": {                    // 내 인증 현황 (phone 제공 시)
      "sender": "김철수",
      "certificationCount": 8,
      "uniqueDays": 6,
      "rank": 5                             // 순위 (uniqueDays 기준)
    }
    // myCertification은 인증 기록이 없으면 null
  },
  "cached": false  // Redis 캐시 여부
}
```

**실패 응답:**
```typescript
// 400 Bad Request - cohort 파라미터 누락
{
  "success": false,
  "error": "기수 파라미터가 필요합니다.",
  "message": "cohort parameter is required"
}

// 500 Internal Server Error - 주차 관리 데이터 누락
{
  "success": false,
  "error": "주차 관리 데이터를 찾을 수 없습니다."
}

// 500 Internal Server Error - 일반 에러
{
  "success": false,
  "error": "찐친챌린지 데이터를 불러오는데 실패했습니다."
}
```

**구현 세부사항:**

1. **챌린지 기간 계산**:
   - `N주차관리` 테이블에서 해당 기수의 2주차, 4주차 시작일 조회
   - 시작: 2주차 시작일 (월요일 00:00)
   - 종료: 4주차 시작일 + 3일 (목요일 23:59:59)

2. **인증 레코드 조회**:
   - `찐친챌린지` 테이블에서 Room + Created 기간 조건으로 필터링
   - Room 필터: `{Room} = "{기수}기 네트워킹방"`
   - 기간 필터: `IS_AFTER({Created}, start) AND IS_BEFORE({Created}, end)`

3. **Sender별 통계 계산**:
   - Map으로 Sender별 count와 days(Set) 집계
   - `percentage`: 전체 인증횟수 대비 개인 인증횟수 비율 (소수점 1자리)
   - **certificationCount (인증횟수) 기준 내림차순 정렬**

4. **내 인증 현황 조회** (phone 제공 시):
   - `결제(Sync)` 테이블에서 전화번호로 사용자 이름 조회
   - senderStats에서 이름으로 매칭하여 myCertification 반환
   - 순위는 senderStats 배열의 인덱스 + 1 (인증횟수 기준)

5. **캐싱**:
   - Redis, TTL 5분 (`challenge:{cohort}:detail`)
   - myCertification은 개인 정보이므로 캐시에 저장하지 않음
   - 캐시 히트 시에도 phone으로 API 재호출하여 myCertification 조회

**데이터 모델:**
```typescript
// lib/db/airtable.types.ts
export interface ChallengeRecord {
  id: string
  fields: {
    Room?: string        // "20기 네트워킹방"
    Sender?: string      // 작성자 이름
    Created?: string     // 자동 생성 타임스탬프
  }
}

export interface ChallengeStats {
  totalCertifications: number      // 전체 인증현황
  uniqueDayCertifications: number  // 인증 인정 횟수
}

export interface ChallengePeriod {
  start: string  // ISO 8601
  end: string    // ISO 8601
}

/** Sender별 찐친챌린지 통계 (파이차트 + Top5용) */
export interface ChallengeSenderStats {
  sender: string              // Sender 이름
  certificationCount: number  // 인증 횟수 (전체 레코드 수)
  uniqueDays: number          // 인정일수 (날짜 중복 제거)
  percentage: number          // 전체 대비 비율 (0-100)
}

/** 내 찐친챌린지 인증 현황 */
export interface MyCertificationStats {
  sender: string              // 매칭된 Sender 이름
  certificationCount: number  // 내 인증 횟수
  uniqueDays: number          // 내 인정일수
  rank: number                // 순위 (uniqueDays 기준)
}

/** 찐친챌린지 API 응답 (기본) */
export interface ChallengeResponse {
  cohort: number
  roomName: string
  period: ChallengePeriod
  stats: ChallengeStats
}

/** 찐친챌린지 API 응답 (상세 - Sender별 통계 포함) */
export interface ChallengeDetailResponse extends ChallengeResponse {
  senderStats: ChallengeSenderStats[]        // 전체 Sender별 통계
  myCertification: MyCertificationStats | null // 내 인증 현황 (phone 제공 시)
}
```

**Airtable 테이블:**
| 필드 | 타입 | 설명 |
|------|------|------|
| Room | Text | 네트워킹방 이름 (예: "20기 네트워킹방") |
| Sender | Text | 인증자 이름 |
| Created | Auto | 레코드 생성 타임스탬프 |

---

## 10. 베스트발표자 API

### `GET /api/leader/best-presenter`

특정 주차의 베스트발표자 정보를 조회합니다. 스터디장 권한이 필요합니다.

**사용처:**
- `components/assignment/voting/BestPresenterSection.tsx` - 베스트발표자 섹션

**요청:**
```typescript
GET /api/leader/best-presenter?cohort=19&studyTag=AI발표스킬업&week=2
```

**Query Parameters:**
- `cohort` (required): 기수 번호
- `studyTag` (required): 스터디 태그명
- `week` (required): 주차 번호 (2-4)

**성공 응답 (제출된 경우):**
```typescript
{
  "success": true,
  "data": {
    "submitted": true,
    "presenter": {
      "recordId": "recXXXXXX",
      "author": "홍길동",
      "title": "AI 활용 발표 준비 방법",
      "postUrl": "https://bettermode.com/post/xxxxx",
      "note": "10시 이전에만 가능합니다",
      "week": 2,
      "submittedAt": "2026-01-15T10:00:00.000Z"
    }
  }
}
```

**성공 응답 (미제출 경우):**
```typescript
{
  "success": true,
  "data": {
    "submitted": false,
    "presenter": null
  }
}
```

**실패 응답:**
```typescript
// 400 Bad Request - 파라미터 누락
{
  "success": false,
  "error": "필수 파라미터가 누락되었습니다."
}

// 500 Internal Server Error
{
  "success": false,
  "error": "베스트발표자 조회에 실패했습니다."
}
```

---

### `POST /api/leader/best-presenter`

베스트발표자를 제출합니다. 스터디장 권한이 필요합니다. 기존 제출 건이 있으면 업데이트합니다.

**사용처:**
- `components/assignment/voting/VotingResultsModal.tsx` - 투표 결과 모달

**요청:**
```typescript
POST /api/leader/best-presenter
Content-Type: application/json

{
  "cohort": 19,
  "studyTag": "AI발표스킬업",
  "week": 2,
  "postId": "abc123xyz",        // 게시글 bettermodeId
  "postUrl": "https://bettermode.com/post/abc123xyz",
  "note": "10시 이전에만 가능합니다"
}
```

**Body Parameters:**
- `cohort` (required): 기수 번호
- `studyTag` (required): 스터디 태그명
- `week` (required): 주차 번호 (2-4)
- `postId` (required): 게시글 bettermodeId
- `postUrl` (required): 게시글 URL
- `note` (optional): 발표자 특이사항

**성공 응답 (신규 제출):**
```typescript
{
  "success": true,
  "data": {
    "recordId": "recXXXXXX",
    "updated": false
  },
  "message": "베스트발표자가 제출되었습니다."
}
```

**성공 응답 (변경):**
```typescript
{
  "success": true,
  "data": {
    "recordId": "recXXXXXX",
    "updated": true
  },
  "message": "베스트발표자가 변경되었습니다."
}
```

**실패 응답:**
```typescript
// 401 Unauthorized - 인증 필요
{
  "success": false,
  "error": "인증이 필요합니다.",
  "code": "AUTH_REQUIRED"
}

// 403 Forbidden - 스터디장 권한 없음
{
  "success": false,
  "error": "스터디장 권한이 필요합니다.",
  "code": "PERMISSION_DENIED"
}

// 404 Not Found - 스터디 또는 게시글 없음
{
  "success": false,
  "error": "스터디를 찾을 수 없습니다."
}

// 500 Internal Server Error
{
  "success": false,
  "error": "베스트발표자 제출에 실패했습니다."
}
```

**구현 세부사항:**
1. **스터디장 권한 확인**: `확정된 스터디` 테이블의 `스터디장s_전화번호` 필드로 검증
2. **스터디 레코드 ID 조회**: `studyTag` + `cohort`로 `확정된 스터디` 테이블에서 레코드 ID 획득
3. **게시글 레코드 ID 조회**: `postId`(bettermodeId)로 `게시글(Sync)` 테이블에서 레코드 ID 획득
4. **중복 체크**: 동일 스터디 + 주차에 기존 레코드가 있으면 업데이트
5. **레코드 생성/업데이트**: `ZOOM_무기명설문` 테이블에 저장

**Airtable 테이블:**
| 필드명 | 타입 | 설명 |
|--------|------|------|
| 베스트 발표자 사례 url | URL | 게시글 URL |
| 주차 | Number | 주차 번호 (2-4) |
| 해당스터디 | Link to 확정된 스터디 | 스터디 레코드 Link |
| 비고사항 | Long Text | 발표자 특이사항 |
| 게시글(Sync) | Link to 게시글(Sync) | 게시글 레코드 Link |
| Created | Auto | 제출 일시 |

---

**마지막 업데이트**: 2026-01-19
**버전**: 1.5.0
