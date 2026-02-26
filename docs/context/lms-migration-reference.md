# LMS 마이그레이션 레퍼런스

> 목적: 프로토타입 이후 실제 개발 시 참고용. 현재 LMS 시스템의 기술 구현 세부사항을 정리.
> 원본: `docs/context/lms/` (CLAUDE.md, API.md, airtable-schema.md)

---

## 1. 현재 LMS 기술 스택

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript 5.9, Tailwind CSS 3.4
- **Backend/DB**: Airtable (9개 테이블)
- **Cache**: Upstash Redis (서버), localStorage 5분 TTL (클라이언트)
- **배포**: Vercel (BetterMode iframe 임베드)
- **인증**: 전화번호 기반 간편 로그인 (iframe 이중 로그인 회피용)
- **자동화**: n8n (카카오톡 공지 → Airtable 자동 등록)

---

## 2. Airtable → Supabase 테이블 매핑

| Airtable 테이블 | Table ID | 용도 | Supabase 테이블 (예정) |
|-----------------|----------|------|----------------------|
| 줌기록 VOD | `tblLeSdOWr22vtaI4` | VOD 녹화본 | `vod_recordings` |
| 기수관리 | `tblJ2uV2TyAtRV06Q` | 기수별 일정/설정 | `cohorts` |
| 확정된 스터디(건들지X) | `tblP0bMmo1xuLnX2v` | 스터디 상세 정보 | `studies` |
| 스터디 신청 | `tblHtC3jZO0Oscrrt` | 수강 신청 내역 | `enrollments` |
| 결제(Sync) | `tblQNIOB0C8CXvgis` | 결제/수강생 정보 | `payments` + `users` |
| 게시글(Sync) | `tbl0MRlu5YU6ALd5L` | 과제 게시글 | `posts` |
| N주차관리 | `tblu1mkrh8KYX7SuU` | 주차별 마감일 | `week_schedules` |
| 공지사항 | `tblq25zarOfLiDm4R` | 공지/세션/가이드 | `notices` |
| 찐친챌린지 | `tblZbqQPwpoHIED55` | 네트워킹 인증 | `challenge_logs` |

---

## 3. 현재 LMS API → 새 사이트 대응

| 현재 LMS API | 용도 | 새 사이트 대응 |
|-------------|------|---------------|
| `POST /api/auth/login` | 전화번호 로그인 | Supabase Auth |
| `GET /api/cohorts` | 기수 목록 + 현재 기수 | Supabase `cohorts` |
| `GET /api/studies?cohort=N` | 확정 스터디 목록 | Supabase `studies` |
| `GET /api/vod?cohort=N&study=태그` | VOD 다시보기 | Supabase `vod_recordings` |
| `GET /api/user/dashboard?phone=X&cohort=N` | 통합 대시보드 | Supabase RPC 또는 서버 액션 |
| `GET /api/posts/all?cohort=N` | 과제 게시글 | 기존 커뮤니티 `posts` 통합 |
| `GET /api/notices?cohort=N` | 멤버 공지 | Supabase `notices` |
| `GET /api/leader/notices?cohort=N` | 스터디장 가이드 | Supabase `notices` (category 필터) |
| `GET /api/sessions/all?cohort=N` | 공통 세션 캘린더 | Supabase `notices` (category='zoom-session') |
| `GET /api/sessions/today?cohort=N` | 오늘의 세션 | 동일 |
| `GET /api/leaderboard?cohort=N` | 활동왕 Top 10 | Supabase 집계 쿼리 |
| `GET /api/challenge?cohort=N` | 찐친챌린지 통계 | Supabase `challenge_logs` |
| `GET/POST /api/leader/best-presenter` | 베스트발표자 선정 | Supabase `best_presenters` |

---

## 4. 핵심 데이터 모델 — Airtable 필드 매핑

### 4.1 스터디 (확정된 스터디 테이블)

| 새 사이트 필드 | Airtable 필드 | 비고 |
|---------------|-------------|------|
| title | 주제명 | Primary |
| slug | slug(study_id) | BetterMode 연동용 |
| generation | 기수(study_order) | 숫자 |
| category | 카테고리 | 비즈니스&마케팅, 개발&자동화, 콘텐츠&지식, AI개발 |
| dayOfWeek | 요일 | 화요일, 수요일, 목요일 |
| studyTime | 스터디_시간 | "20:00-22:00" |
| period.start | 스터디_시작일 | |
| period.end | 스터디_종료일 | |
| leader.name | 스터디장 이름 | |
| leader.phone | 스터디장s_전화번호 | 권한 검증에 사용 |
| currentMembers | 신청자수_스터디장포함 | |
| isFinalSubmitted | 최종제출여부 | confirmed 기반 |
| thumbnailUrl | 썸네일_url | 여러 변형 지원 (썸네일url, thumbnail_url 등) |
| zoomUrl | 줌url, zoom_url_gateway | |
| kakaoUrl | 오픈카톡방url | |
| isCancelled | 폐강됨 | |

### 4.2 VOD (줌기록 VOD 테이블)

| 새 사이트 필드 | Airtable 필드 | 비고 |
|---------------|-------------|------|
| title | 제목 | |
| week | 주차 | 숫자 |
| studyTag | 스터디_태그명 | 빈 값 = 공통 일정 |
| embedUrl | 영상링크 | YouTube URL → embed URL 변환 필요 |
| uploadedAt | 업로드일 | |
| cohort | 기수 | **문자열** "19기" (숫자 아님!) |

### 4.3 수강 기록 (결제(Sync) 테이블)

| 새 사이트 필드 | Airtable 필드 | 비고 |
|---------------|-------------|------|
| user.name | 이름 / 이름_닉네임 | |
| user.phone | 전화번호 | 정규화 필요 (하이픈 제거) |
| user.email | 이메일 | |
| paymentId | paymentId | |
| paymentStatus | 상태 | Success, Cancel, VBankIssued, PartialCancel |
| paymentAmount | 실결제금액 | |
| study | 확정된_스터디 | Link |
| studyTag | 스터디_태그명 | Lookup |
| studyDay | 스터디_요일 | Lookup |
| role | 유형 | 스터디장, 스터디장수강, 임직원무료, 무료참여 |
| certificate.issued | 수료증발급 | |
| certificate.url | 수료증 링크 | |
| refund | 환급자 취합 | |

### 4.4 과제 (게시글(Sync) 테이블)

| 새 사이트 필드 | Airtable 필드 | 비고 |
|---------------|-------------|------|
| week | 주차인정 | **문자열** "2주차" — parseInt 필요 |
| phone | 전화번호 | Lookup, 배열 가능 |
| studyTag | 스터디_태그명 | Lookup, 배열 가능 |
| postTypeId | bettermodePostTypeId | 'KLxSodedLeDUiTj' = 과제 |
| deletedAt | 삭제일 | 빈 값 = 삭제 안 됨 |
| title | 제목 | |
| url | 링크 | BetterMode 게시글 URL |
| createdAt | 생성일 | |

---

## 5. 핵심 비즈니스 로직

### 5.1 과제 연동 권한 (VOD 접근 제어)

```
1주차: 모든 사용자 접근 가능
내 스터디: 과제 제출 여부 무관, 전체 접근
타 스터디 (2~4주차): 해당 주차 과제 제출 시에만 접근

체크 로직:
1. 게시글(Sync)에서 사용자 전화번호 + 주차 매칭
2. 삭제되지 않은 게시글만 유효
3. 스터디 태그 매칭
4. 주차별 replayUnlocked 플래그로 반환
```

### 5.2 마감일 자동 계산

```
마감일 = N주차관리.주차시작일 + 스터디_요일 오프셋
예: 주차시작일 = 월요일, 스터디_요일 = 화요일 → 마감일 = 해당 화요일 23:59:59

calculateWeekDeadline(weekStartDate, studyDay) 함수 참고
```

### 5.3 찐친챌린지 기간 계산

```
시작: 2주차 시작일 (월요일 00:00)
종료: 4주차 시작일 + 3일 (목요일 23:59:59)
N주차관리 테이블에서 2주차/4주차 시작일 조회
```

### 5.4 리더보드 집계

```
1. 게시글(Sync)에서 전화번호별 게시글 수 집계
2. 삭제 안 된 과제 게시글만 (bettermodePostTypeId 필터)
3. 해당 기수만
4. 상위 10명 + 동점자 포함
5. 결제(Sync)에서 bettermode_user_id 조회 (프로필 링크용)
```

---

## 6. Airtable 필드 타입 주의사항

- **기수 필드**: 문자열 "19기" (숫자 아님)
- **주차인정 필드**: 문자열 "2주차" — `parseInt(str.replace(/[^0-9]/g, ''), 10)`
- **Lookup 필드**: 배열 반환 (`전화번호?: string[]`, `스터디_태그명?: string | string[]`)
- **Single Select**: 때때로 배열 반환 — 항상 두 타입 처리
- **Link 필드 필터링**: `FIND()` + `ARRAYJOIN()` 안 됨 → 클라이언트 사이드 필터링 필요
- **View 사용 금지**: 숨겨진 필터가 있을 수 있음 → 항상 테이블 직접 쿼리

---

## 7. 캐싱 전략 (참고)

현재 LMS 성능 메트릭:
- API 응답: 500ms → 300ms (통합 API, 40% 개선)
- 페이지 로드 (첫 방문): 1800ms → 1100ms (39% 개선)
- 페이지 로드 (캐시 히트): 1800ms → 150ms (92% 개선)
- API 콜/페이지: 2 → 1 (또는 캐시 히트 시 0)

새 사이트 권장: SWR 또는 React Query로 클라이언트 캐싱, Supabase 실시간 구독 검토

---

## 8. YouTube 임베드 패턴

```typescript
// 현재 LMS에서 사용 중인 YouTube embed 변환
const getYouTubeEmbedUrl = (url: string) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
  const match = url.match(regExp)
  if (match && match[2].length === 11) {
    return `https://www.youtube.com/embed/${match[2]}`
  }
  return url
}

// 반응형 16:9 iframe
// paddingBottom: '56.25%' (= 9/16 * 100)
```
