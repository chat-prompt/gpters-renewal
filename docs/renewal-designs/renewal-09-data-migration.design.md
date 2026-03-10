# renewal-09: 데이터 마이그레이션 설계서

> Neon PostgreSQL + Airtable + Bettermode + R2 + Upstash → AWS 통합 마이그레이션 전체 설계

| 항목 | 내용 |
|------|------|
| 문서 ID | renewal-09 |
| 유형 | 설계서 (Design) |
| 작성일 | 2026-03-06 |
| 버전 | v2.0 |
| 상위 계획 | docs/01-plan/gpters-renewal-plan-plus.md SS5 |
| 선행 문서 | docs/02-design/04-RE-01-data-schema.design.md, docs/02-design/04-RE-08-production-data.design.md |
| 작성자 | Migration Planner (Claude) |

---

## 목차

1. [마이그레이션 개요](#1-마이그레이션-개요)
2. [AWS RDS 타겟 환경 구성](#2-aws-rds-타겟-환경-구성)
3. [소스별 마이그레이션 매핑 테이블](#3-소스별-마이그레이션-매핑-테이블)
4. [필드별 변환 규칙](#4-필드별-변환-규칙)
5. [ETL 스크립트 구조](#5-etl-스크립트-구조)
6. [Bettermode 커뮤니티 마이그레이션](#6-bettermode-커뮤니티-마이그레이션)
7. [R2 → S3 파일 마이그레이션](#7-r2--s3-파일-마이그레이션)
8. [Upstash → ElastiCache 전환](#8-upstash--elasticache-전환)
9. [검증 쿼리](#9-검증-쿼리)
10. [롤백 스크립트](#10-롤백-스크립트)
11. [4단계 마이그레이션 실행 계획](#11-4단계-마이그레이션-실행-계획)
12. [데이터 정합성 크론 검사 로직](#12-데이터-정합성-크론-검사-로직)
13. [위험 요소 및 대응](#13-위험-요소-및-대응)

---

## 1. 마이그레이션 개요

### 1.1 소스 시스템 현황

| # | 소스 | 설명 | 예상 규모 |
|---|------|------|-----------|
| 1 | gpters-study PostgreSQL (Neon) | 레거시 메인 DB. 53개 테이블 (활성 34 + deprecated 15 + 마이그레이션 전용 4) | ~50,000 rows |
| 2 | Airtable (Reboot AI Study Base: appq8xK4PLp7D7aCg) | 9개 테이블. 기수관리, 확정 스터디, 줌기록 VOD, 게시글, 결제, N주차관리, 공지, 멤버, 환불 | ~16,100 rows |
| 3 | Bettermode (Community) | 커뮤니티 게시글, 댓글, 리액션 | ~10,000 items |
| 4 | Cloudflare R2 | 파일 스토리지 (프로필 이미지, 첨부파일) | ~5GB |
| 5 | Upstash Redis | 세션, 캐시, Rate Limiting | 휘발성 데이터 |

### 1.2 타겟 시스템

```
AWS 서울 리전 (ap-northeast-2)
├── RDS PostgreSQL 16      ← Neon + Airtable + Bettermode 데이터
├── S3                     ← R2 파일
├── ElastiCache (Redis 7)  ← Upstash 대체 (데이터 이관 불필요)
├── VPC + Security Group   ← 네트워크 격리
└── KMS                    ← PII 암호화 키 관리
```

- **AWS RDS PostgreSQL** (서울 리전, db.t4g.medium 시작)
- Self-managed `users` 테이블 기반 사용자 시스템 (Supabase Auth 미사용)
- OAuth Provider ID 직접 관리 (kakao_id, naver_id 컬럼)
- 기존 Airtable 동기화 의존 완전 제거
- HighTouch 양방향 sync 중단
- Bettermode 의존 완전 제거 (자체 커뮤니티 테이블)

### 1.3 마이그레이션 원칙

1. **데이터 손실 Zero**: Soft Delete 레코드 포함 전체 이관
2. **비즈니스 로직 보존**: 0원 결제(`impUid` `X-` 패턴), 환급 조건, VOD 권한 로직
3. **FK 순서 보장**: User → Product → Order → Payment → UserEnrollment → Study 순
4. **롤백 가능**: 각 Phase별 롤백 스크립트 준비
5. **검증 우선**: 각 테이블 이관 후 레코드 수, 합계, FK 정합성 검증
6. **ORM 일관성**: Drizzle Kit으로 스키마 마이그레이션 관리

### 1.4 Airtable 테이블 현황 (레거시 코드 분석 기반)

레거시 코드 `gpters-study/packages/airtable/src/` 분석 결과, 실제 사용 중인 Airtable 테이블은 다음과 같다.

| # | Airtable 테이블 | Base ID | Table ID | 용도 |
|---|----------------|---------|----------|------|
| 1 | 기수관리 | appq8xK4PLp7D7aCg | tblj2uv2tyatrv0 | 기수(Cohort) 마스터 |
| 2 | 확정된 스터디 (Study List) | appq8xK4PLp7D7aCg | tblP0bMmo1xuLnX2v | 스터디 목록 |
| 3 | N주차관리 (Study Session) | appq8xK4PLp7D7aCg | tbllsAHl2ZGjprebv | 주차별 스케줄 |
| 4 | 줌기록 VOD (Session Item) | appq8xK4PLp7D7aCg | tblVn8o4qsUZzhS2I | 발표별 VOD 정보 |
| 5 | 결제(Sync) (Bootcamp Join) | tblK0vUN3qOTbn9cX | - | 결제 + 수강 정보 |
| 6 | 게시글(Sync) (Members) | tblAV1fM6DdHEMfWR | - | 회원 동기화 |
| 7 | 공지사항 (Bootcamps) | tblr91vtWuFZsIegj | - | 스터디 공지/상세 |
| 8 | 환불 | tblrohBMFjx2YTxzM | - | 환불 요청 |
| 9 | 사용자(Users) | - | tblryJjitdqf3h0uw | 사용자 프로필 |

### 1.5 전체 마이그레이션 흐름도

```mermaid
flowchart LR
    subgraph Sources["소스 시스템"]
        Neon["Neon PostgreSQL<br/>24 tables"]
        AT["Airtable<br/>9 tables"]
        BM["Bettermode<br/>Posts/Comments"]
        R2["Cloudflare R2<br/>~5GB files"]
        Upstash["Upstash Redis<br/>Sessions"]
    end

    subgraph ETL["ETL Pipeline"]
        Script["TypeScript ETL<br/>(scripts/migration/)"]
        Rclone["rclone / DataSync"]
    end

    subgraph Target["AWS ap-northeast-2"]
        RDS["RDS PostgreSQL 16<br/>Self-managed Auth"]
        S3["S3 Bucket<br/>gpters-assets"]
        EC["ElastiCache Redis 7<br/>(재설정만)"]
    end

    Neon --> Script --> RDS
    AT --> Script --> RDS
    BM --> Script --> RDS
    R2 --> Rclone --> S3
    Upstash -.->|"이관 불필요<br/>재설정만"| EC
```

---

## 2. AWS RDS 타겟 환경 구성

### 2.1 RDS 인스턴스 설정

| 항목 | 값 |
|------|-----|
| Engine | PostgreSQL 16.x |
| Instance Class | db.t4g.medium (2 vCPU, 4GB RAM) |
| Storage | gp3 50GB (IOPS 3,000 / Throughput 125 MB/s) |
| Multi-AZ | No (비용 절감, 운영 안정 후 전환) |
| Region | ap-northeast-2 (서울) |
| Parameter Group | `gpters-pg16` (커스텀) |
| Backup Retention | 7일 자동 백업 |
| Encryption | AES-256 (AWS KMS managed) |
| Publicly Accessible | No (VPC 내부만) |

### 2.2 VPC 네트워크 구성

```mermaid
graph TD
    subgraph VPC["VPC: 10.0.0.0/16"]
        subgraph PublicSubnet["Public Subnet"]
            Bastion["Bastion Host<br/>(마이그레이션 작업용)"]
        end
        subgraph PrivateSubnet["Private Subnet"]
            RDS["RDS PostgreSQL<br/>10.0.10.x"]
            EC["ElastiCache<br/>10.0.11.x"]
        end
    end

    Vercel["Vercel Edge<br/>(Production App)"] -->|"RDS Proxy<br/>or Direct"| RDS
    Bastion -->|"psql/ETL Script"| RDS
    Dev["개발자 로컬<br/>(SSH Tunnel)"] -->|"SSH"| Bastion
```

### 2.3 Security Group 설정

| SG | Inbound | Port | Source |
|----|---------|------|--------|
| sg-rds | PostgreSQL | 5432 | sg-bastion, sg-app |
| sg-bastion | SSH | 22 | 개발자 IP only |
| sg-elasticache | Redis | 6379 | sg-app |
| sg-app | HTTPS | 443 | 0.0.0.0/0 |

### 2.4 마이그레이션 접근 경로

ETL 스크립트 실행을 위한 네트워크 접근:

```bash
# 1. Bastion Host를 통한 SSH 터널
ssh -L 5432:gpters-rds.xxx.ap-northeast-2.rds.amazonaws.com:5432 \
    ec2-user@bastion-ip

# 2. 로컬에서 ETL 스크립트 실행
DATABASE_URL="postgresql://gpters_admin:xxx@localhost:5432/gpters" \
    npx tsx scripts/migration/index.ts

# 3. 또는 Bastion Host에서 직접 실행 (권장)
# Bastion에 Node.js + pnpm 설치 후 스크립트 복사 실행
```

### 2.5 Drizzle Kit 스키마 마이그레이션

```typescript
// drizzle.config.ts
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './src/db/schema/*',
  out: './drizzle/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
})
```

```bash
# 스키마 변경 시 마이그레이션 생성
pnpm drizzle-kit generate

# 마이그레이션 적용
pnpm drizzle-kit migrate

# 스키마 Push (개발 환경)
pnpm drizzle-kit push
```

---

## 3. 소스별 마이그레이션 매핑 테이블

### 3.1 전체 마이그레이션 매핑 요약

| Source | Target 테이블 | 예상 레코드 수 | 전략 | 난이도 |
|--------|--------------|--------------|------|--------|
| **Neon PostgreSQL** | | | | |
| User | users | ~4,000 | Batch ETL + OAuth ID 매핑 | 높음 |
| Order | orders | ~5,000 | Batch ETL | 중간 |
| OrderItem | order_items | ~5,000 | Batch ETL | 낮음 |
| Payment | payments | ~5,000 | Batch ETL | 높음 |
| Refund | refunds | ~300 | Batch ETL | 중간 |
| UserEnrollment | enrollments | ~6,000 | Batch ETL | 중간 |
| Cohort | cohorts | ~21 | Manual + Verify | 낮음 |
| Study | studies | ~300 | Batch ETL | 중간 |
| StudyUser | study_users | ~3,000 | Batch ETL | 중간 |
| CommunityPost | posts | ~7,000 | Batch ETL | 높음 |
| CourseProduct | products | ~100 | Manual + Verify | 낮음 |
| Coupon | coupons | ~200 | Batch ETL | 낮음 |
| UserCoupon | user_coupons | ~500 | Batch ETL | 낮음 |
| **Airtable** | | | | |
| 기수관리 | cohorts (보완) | ~21 | 중복 검증 후 보완 | 낮음 |
| 확정된 스터디 | studies (보완) | ~300 | 중복 검증 후 보완 | 중간 |
| N주차관리 | week_schedules | ~100 | Batch ETL | 낮음 |
| 줌기록 VOD | vod_recordings | ~500 | Batch ETL | 낮음 |
| 공지사항 | notices | ~200 | Batch ETL | 낮음 |
| 환불 | refunds (보완) | ~300 | 중복 검증 후 보완 | 중간 |
| 멤버 | users (보완) | ~4,000 | 전화번호 매칭 | 높음 |
| **Bettermode** | | | | |
| Posts | community_posts | ~5,000 | GraphQL API 추출 | 높음 |
| Comments | community_comments | ~3,000 | GraphQL API 추출 | 중간 |
| Reactions | community_reactions | ~2,000 | GraphQL API 추출 | 낮음 |

### 3.2 Neon PostgreSQL → AWS RDS 상세 매핑

#### 3.2.1 User → users (Self-managed)

| 소스 필드 (User) | 타겟 필드 | 타입 변환 | 비고 |
|----------------|----------|---------|------|
| id | id | Int → UUID (gen_random_uuid()) | PK 전환 |
| - | legacy_id | - → Int | 레거시 ID 보존 |
| email | email | String | UNIQUE 제약 |
| name | full_name | String | |
| nickname | username | String | |
| phone | phone_encrypted | String → bytea | AES-256-GCM (AWS KMS) |
| profileImage | avatar_url | String? | S3 URL로 재매핑 |
| bettermodeUserId | bettermode_user_id | String? | 일몰 후 제거 |
| - | kakao_id | - → String? | OAuth Provider ID (Account 테이블에서 추출) |
| - | naver_id | - → String? | OAuth Provider ID (Account 테이블에서 추출) |
| - | password_hash | - → String? | 신규 비밀번호 설정 시 bcrypt |
| createdAt | created_at | DateTime | |
| deletedAt | deleted_at | DateTime? | Soft Delete 보존 |
| signupStatus | signup_status | Enum | 변환 규칙 SS4.1 |
| memberFields | member_fields | Json[] | jsonb |
| customData | custom_data | Json? | jsonb |

**OAuth Provider ID 추출 로직**:
```sql
-- 레거시 Account 테이블에서 Provider ID 추출
SELECT
  u.id as user_id,
  u.email,
  MAX(CASE WHEN a."providerId" = 'kakao' THEN a."providerAccountId" END) as kakao_id,
  MAX(CASE WHEN a."providerId" = 'naver' THEN a."providerAccountId" END) as naver_id
FROM "User" u
LEFT JOIN "Account" a ON a."userId" = u.id
GROUP BY u.id, u.email;
```

#### 3.2.2 Cohort → cohorts

| 소스 필드 (Cohort) | 타겟 필드 | 타입 변환 | 비고 |
|------------------|----------|---------|------|
| id | id | Int | autoincrement 재설정 필요 |
| cohort | cohort_number | Int | |
| name | name | String | |
| leaderRecruitEndDate | leader_recruit_end_date | DateTime? | |
| preSaleStartDate | pre_sale_start_date | DateTime? | |
| preSaleEndDate | pre_sale_end_date | DateTime? | |
| saleStartDate | sale_start_date | DateTime? | |
| saleEndDate | sale_end_date | DateTime? | |
| startDate | start_date | DateTime? | |
| endDate | end_date | DateTime? | |
| kakaoOpenChatUrl | kakao_open_chat_url | String? | |
| networkingKakaoChatUrl | networking_kakao_chat_url | String? | |
| airtableId | - | 제거 | Airtable 일몰 |
| lastMigratedAt | - | 제거 | Airtable 일몰 |

#### 3.2.3 Study → studies

| 소스 필드 (Study) | 타겟 필드 | 타입 변환 | 비고 |
|-----------------|----------|---------|------|
| id | id | Int | |
| name | name | String | |
| cohort | cohort_id | String → FK | 소프트 FK → 정식 FK 전환 |
| leaderId | leader_id | Int → UUID | User 재매핑 |
| leaderName | leader_name | String | |
| status | status | Enum | ready/inprogress/finished/closed |
| startDate | start_date | DateTime? | |
| endDate | end_date | DateTime? | |

#### 3.2.4 Payment → payments

| 소스 필드 (Payment) | 타겟 필드 | 타입 변환 | 비고 |
|-------------------|----------|---------|------|
| id | id | Int | |
| merchantUid | merchant_uid | String | 결제 고유 ID |
| impUid | imp_uid | String | PG 거래 ID. `X-` 패턴 = 0원 결제 |
| actualPrice | actual_price | Decimal → Int | 원화 기준 Int 변환 |
| status | status | Enum | Success/Cancel/VBankIssued 등 |
| cancelHistory | cancel_history | Json[] | 부분취소 이력 보존 |
| vbankInfo | vbank_info | Json? | 가상계좌 정보 |
| deletedAt | deleted_at | DateTime? | Soft Delete 보존 |

#### 3.2.5 UserEnrollment → enrollments

| 소스 필드 (UserEnrollment) | 타겟 필드 | 타입 변환 | 비고 |
|--------------------------|----------|---------|------|
| id | id | Int | |
| userId | user_id | Int → UUID | User 재매핑 |
| courseProductId | product_id | Int | |
| cohort | cohort_number | Int | |
| startsAt | starts_at | DateTime? | |
| expiredAt | expired_at | DateTime? | |
| cancelledAt | cancelled_at | DateTime? | |
| parentId | parent_id | Int? | 자기참조 보존 |
| accessRole | access_role | Enum | STUDENT/AUDITOR/STAFF |
| sourceProgram | source_program | String? | |
| deletedAt | deleted_at | DateTime? | Soft Delete 보존 |

#### 3.2.6 CommunityPost → posts

| 소스 필드 (CommunityPost) | 타겟 필드 | 타입 변환 | 비고 |
|--------------------------|----------|---------|------|
| id | id | Int | |
| name | title | String | |
| content | content | String | XSS sanitize 필요 |
| slug | slug | String | SEO URL 유지 |
| bettermodeId | bettermode_id | String? | 일몰 후 제거 |
| bettermodeAuthorId | - | 제거 후 userId 매핑 | BM ID → userId 변환 |
| bettermodeSpaceId | - | 제거 후 category_id | Space → 카테고리 매핑 |
| tagNames | tags | String[] | |
| deletedAt | deleted_at | DateTime? | Soft Delete 보존 |
| isHide | is_hidden | Boolean | |

### 3.3 Airtable → AWS RDS 상세 매핑

#### 3.3.1 Airtable 필드 타입 변환 주의사항

Airtable 필드는 PostgreSQL 타입과 1:1 매핑되지 않는다. 아래 변환 규칙을 반드시 적용한다.

| Airtable 필드 타입 | 변환 규칙 | 예시 |
|-------------------|---------|------|
| String (기수) | 정규식 파싱: `/(\d+)기/` → Int | "19기" → 19 |
| Linked Record (Array) | 첫 번째 요소만 사용 또는 Junction 테이블 | `["recXXX"]` → FK |
| Lookup (Array) | 배열 평탄화 후 단일 값 추출 | `["바이브코딩"]` → "바이브코딩" |
| Date (Mixed Format) | ISO 8601 정규화 | "2026-03-07" / "Mar 7, 2026" → Date |
| Airtable Record ID | UUID 매핑 테이블 유지 | "recXXX" → UUID |
| Checkbox | Boolean 변환 | true/false |
| Number (Float) | Int 변환 (KRW 기준) | 49000.0 → 49000 |

#### 3.3.2 Airtable N주차관리 → week_schedules

| 소스 필드 (Study Session) | 타겟 필드 | 비고 |
|--------------------------|----------|------|
| id (airtable record id) | airtable_id | 매핑 테이블에 보존 |
| linkedStudy | study_id | Study 테이블과 연결 |
| name | name | 예: "21기 바이브코딩 2주차" |
| subject | subject | 주제 |
| dateStart | week_start_date | 주차 시작일 |
| date | session_date | 세션 날짜 |
| studyTagName | study_tag | 스터디 태그명 |
| bestPresentationPostId | best_post_id | 베스트 발표 게시글 |

#### 3.3.3 Airtable 줌기록 VOD → vod_recordings

| 소스 필드 (Session Item) | 타겟 필드 | 비고 |
|------------------------|----------|------|
| id | airtable_id | |
| title | title | 발표 제목 |
| authorNickname | author_nickname | |
| studySession | week_schedule_id | N주차관리와 연결 |
| postId | post_id | 게시글 연결 |
| startTime | start_time | |
| endTime | end_time | |
| contentSummary | summary | |
| url | vod_url | YouTube URL |
| isPresented | is_presented | |

#### 3.3.4 Airtable 공지사항 → notices

| 소스 필드 | 타겟 필드 | 비고 |
|---------|----------|------|
| title | title | |
| visible | is_visible | 전체공개/비공개 |
| slug | slug | |
| summary | summary | |
| period (cohort) | cohort_number | |
| startDate | start_date | |
| endDate | end_date | |
| announce | content | HTML 본문 |

#### 3.3.5 Airtable 환불 → refunds (보완)

| 소스 필드 (Refund) | 타겟 필드 | 비고 |
|-----------------|----------|------|
| id | airtable_id | |
| bootcampJoinId | order_id | 결제 ID로 연결 |
| reason | reason | 환불 사유 |
| reasonAdditional | reason_additional | 추가 사유 |
| note | note | 메모 |

#### 3.3.6 Airtable 기수관리 → cohorts (보완)

Neon PostgreSQL에서 이관한 cohorts 테이블을 Airtable 데이터로 보완한다.

| Airtable 필드 | 보완 대상 | 변환 규칙 |
|-------------|---------|---------|
| 기수 | cohort_number | `"19기"` → `parseInt("19기".match(/\d+/)[0])` = 19 |
| 스터디 수 | study_count | Lookup 배열 길이 |
| 리더 모집 마감 | leader_recruit_end_date | ISO Date 파싱 |
| 상태 | status | "모집중"/"진행중"/"종료" → Enum |

**중복 검증 프로세스**:
```typescript
// Neon과 Airtable 양쪽에 존재하는 Cohort 검증
async function verifyCohortDuplicates() {
  const neonCohorts = await extractNeonCohorts()
  const airtableCohorts = await extractAirtableCohorts()

  for (const atCohort of airtableCohorts) {
    const cohortNum = parseInt(atCohort.name.match(/\d+/)?.[0] ?? '0')
    const existing = neonCohorts.find(c => c.cohort === cohortNum)

    if (existing) {
      // 보완: Airtable에만 있는 필드 UPDATE
      console.log(`Cohort ${cohortNum}: Neon 레코드 존재, Airtable 보완 필드 업데이트`)
    } else {
      // 신규: Airtable에만 있는 Cohort INSERT
      console.log(`Cohort ${cohortNum}: Airtable 전용, 신규 INSERT`)
    }
  }
}
```

#### 3.3.7 Airtable 확정된 스터디 → studies (보완)

| Airtable 필드 | 보완 대상 | 변환 규칙 |
|-------------|---------|---------|
| 스터디명 | name | 직접 매핑 |
| 기수 | cohort_number | `"19기"` 파싱 |
| 리더 | leader_name | 직접 매핑 |
| 상태 | status | "준비중"→ready, "진행중"→inprogress, "종료"→finished |
| 인원 | max_members | Int 변환 |
| 카테고리 | category | String |

#### 3.3.8 Airtable 결제(Sync) → orders/payments (검증용)

결제 데이터는 Neon PostgreSQL이 SoR(Source of Record)이다. Airtable 결제 데이터는 **검증 용도**로만 사용한다.

```typescript
// Airtable 결제 데이터와 Neon 데이터 교차 검증
async function crossValidatePayments() {
  const atPayments = await extractAirtablePayments()
  const neonPayments = await extractNeonPayments()

  const mismatches: string[] = []
  for (const atPay of atPayments) {
    const neonPay = neonPayments.find(p => p.merchantUid === atPay.merchantUid)
    if (!neonPay) {
      mismatches.push(`Airtable에만 존재: ${atPay.merchantUid}`)
    } else if (neonPay.actualPrice !== atPay.amount) {
      mismatches.push(`금액 불일치: ${atPay.merchantUid} (Neon: ${neonPay.actualPrice}, AT: ${atPay.amount})`)
    }
  }
  return mismatches
}
```

#### 3.3.9 Airtable 멤버 → users (전화번호 매칭 보완)

| Airtable 필드 | 보완 대상 | 변환 규칙 |
|-------------|---------|---------|
| 이름 | full_name | 보완 (NULL인 경우) |
| 전화번호 | phone_encrypted | 매칭 키 (010-XXXX-XXXX → 01XXXXXXXXX 정규화) |
| 닉네임 | username | 보완 (NULL인 경우) |

**전화번호 정규화 및 매칭**:
```typescript
function normalizePhone(phone: string): string {
  return phone.replace(/[-\s]/g, '').replace(/^(\+82)/, '0')
}

async function matchAirtableMembers() {
  const atMembers = await extractAirtableMembers()
  const rdsUsers = await db.select().from(users)

  for (const atMember of atMembers) {
    const normalized = normalizePhone(atMember.phone)
    // phone_encrypted는 복호화 후 비교 필요
    const matched = rdsUsers.find(u =>
      decrypt(u.phone_encrypted) === normalized
    )
    if (matched) {
      // 보완 필드 UPDATE
    } else {
      console.warn(`매칭 불가 멤버: ${atMember.name} (${normalized})`)
    }
  }
}
```

---

## 4. 필드별 변환 규칙

### 4.1 Enum 매핑

#### PaymentStatus

| 레거시 (Payment.status) | RDS (payments.status) |
|------------------------|----------------------|
| Success | success |
| VBankIssued | vbank_issued |
| VBankExpired | vbank_expired |
| Invalid | invalid |
| Error | error |
| PartialCancel | partial_cancel |
| Cancel | cancel |

#### OrderStatus

| 레거시 (Order.status) | RDS (orders.status) |
|---------------------|---------------------|
| Pending | pending |
| Completed | completed |
| Cancelled | cancelled |
| PartialCancelled | partial_cancelled |

#### StudyStatus

| 레거시 (Study.status) | RDS (studies.status) |
|---------------------|---------------------|
| ready | ready |
| inprogress | inprogress |
| finished | finished |
| closed | closed |

#### StudyRole

| 레거시 (StudyUser.role) | RDS (study_users.role) |
|----------------------|----------------------|
| leader | leader |
| member | member |
| buddy | buddy |

#### EnrollmentAccessRole

| 레거시 | RDS |
|--------|-----|
| STUDENT | student |
| AUDITOR | auditor |
| STAFF | staff |

### 4.2 타입 변환 규칙

| 변환 | 규칙 | 비고 |
|------|------|------|
| Decimal → Int | `Math.round(Number(decimal))` | Payment.actualPrice 등 |
| Json[] → jsonb[] | 직접 삽입 | cancelHistory 등 |
| Int ID → UUID | 별도 매핑 테이블 유지 | User.id 재매핑 |
| BM ID → userId | `bettermodeUserId` 조인 | 매핑 불가 시 NULL 처리 |
| airtableId → NULL | 마이그레이션 후 제거 | Airtable 일몰 |
| Timestamptz | UTC 유지 | 타임존 변환 없음 |
| Airtable String → Int | 정규식 파싱 | "19기" → 19 |
| Airtable Lookup[] → String | 첫 번째 요소 추출 | `["값"]` → "값" |

### 4.3 0원 결제 처리 규칙 (필수 보존)

```
impUid 패턴이 'X-'로 시작하는 결제 = 0원 결제 (PG 미호출)
- actualPrice = 0
- status = Cancel (Success 아님)
- Payment 레코드는 반드시 보존
- ETL 시 이 패턴 그대로 유지
```

### 4.4 기본값 처리

| 필드 | 소스 NULL 처리 | 비고 |
|------|--------------|------|
| avatar_url | NULL 허용 | |
| deleted_at | NULL = 활성 레코드 | Soft Delete |
| cohort_number | 0 → NULL 처리 | UserEnrollment.cohort = 0 은 무의미 |
| access_role | STUDENT | 기본값 |
| source_program | NULL 허용 | |
| kakao_id | NULL 허용 | Account 테이블에 없으면 NULL |
| naver_id | NULL 허용 | Account 테이블에 없으면 NULL |

### 4.5 PII 처리 규칙

| 필드 | 처리 방법 |
|------|---------|
| User.phone | AES-256-GCM 암호화 (AWS KMS CMK) |
| Refund.bankAccount | 마스킹 (뒤 4자리만 보존) |
| User.email | 평문 유지 (UNIQUE 제약) |
| User.kakao_id | 평문 (Provider 식별자) |
| User.naver_id | 평문 (Provider 식별자) |

---

## 5. ETL 스크립트 구조

### 5.1 전체 구조

```
scripts/migration/
├── index.ts                  # 메인 실행 진입점
├── config.ts                 # 소스/타겟 DB 연결 설정
├── id-mapping.ts             # 레거시 ID → RDS UUID 매핑 테이블
├── extract/
│   ├── pg-extractor.ts       # Neon PostgreSQL 읽기
│   ├── airtable-extractor.ts # Airtable API 읽기
│   └── bettermode-extractor.ts # Bettermode GraphQL API 읽기
├── transform/
│   ├── user.transform.ts     # User 변환 (OAuth ID 포함)
│   ├── cohort.transform.ts   # Cohort 변환
│   ├── study.transform.ts    # Study 변환
│   ├── payment.transform.ts  # Payment 변환
│   ├── enrollment.transform.ts # UserEnrollment 변환
│   ├── post.transform.ts     # CommunityPost 변환
│   ├── airtable.transform.ts # Airtable 전체 변환
│   └── bettermode.transform.ts # Bettermode 변환
├── load/
│   ├── rds-loader.ts         # RDS PostgreSQL INSERT (Drizzle ORM)
│   └── batch.ts              # 배치 처리 유틸
├── validate/
│   ├── count.validator.ts    # 레코드 수 검증
│   ├── fk.validator.ts       # FK 정합성 검증
│   └── amount.validator.ts   # 금액 합계 검증
└── rollback/
    ├── rollback-phase0.ts    # Phase 0 롤백
    └── rollback-phase1.ts    # Phase 1 롤백
```

### 5.2 설정 파일

```typescript
// scripts/migration/config.ts
import { drizzle } from 'drizzle-orm/node-postgres'
import { neon } from '@neondatabase/serverless'
import pg from 'pg'

// Source: Neon PostgreSQL (레거시)
export const legacyDb = neon(process.env.LEGACY_DATABASE_URL!)

// Target: AWS RDS PostgreSQL
const rdsPool = new pg.Pool({
  connectionString: process.env.DATABASE_URL!,
  ssl: { rejectUnauthorized: true },
  max: 10,
  idleTimeoutMillis: 30_000,
})
export const rds = drizzle(rdsPool)

export const BATCH_SIZE = 500
export const RETRY_LIMIT = 3
export const RETRY_DELAY_MS = 1000
```

### 5.3 ID 매핑 테이블

```typescript
// scripts/migration/id-mapping.ts
// 레거시 Int ID → RDS UUID 매핑을 유지
// 마이그레이션 기간 동안 조회용으로 사용

export const idMapping = {
  users: new Map<number, string>(),    // legacyId → UUID
  orders: new Map<number, number>(),   // legacyId → newId (Int 유지)
  payments: new Map<number, number>(), // legacyId → newId
  products: new Map<number, number>(), // legacyId → newId
  airtable: new Map<string, number>(), // airtableRecordId → newId
}

// 매핑 테이블을 JSON 파일로 저장 (중단 후 재개 시 사용)
export async function saveMapping(path: string) {
  const data = {
    users: Object.fromEntries(idMapping.users),
    orders: Object.fromEntries(idMapping.orders),
    airtable: Object.fromEntries(idMapping.airtable),
  }
  await fs.writeFile(path, JSON.stringify(data, null, 2))
}
```

### 5.4 User ETL (OAuth Provider ID 매핑 포함)

```typescript
// scripts/migration/transform/user.transform.ts
import { idMapping } from '../id-mapping'
import { encryptWithKMS } from '../utils/crypto'
import { randomUUID } from 'crypto'

interface LegacyUser {
  id: number
  email: string
  name: string
  nickname: string
  phone: string | null
  profileImage: string | null
  bettermodeUserId: string | null
  createdAt: Date
  deletedAt: Date | null
  signupStatus: string
  memberFields: Array<{ key: string; value: string }>
}

interface LegacyAccount {
  userId: number
  providerId: string       // 'kakao' | 'naver'
  providerAccountId: string // OAuth Provider의 사용자 ID
}

interface RdsUser {
  id: string               // UUID (자체 생성)
  legacy_id: number        // 레거시 ID 보존
  email: string
  full_name: string
  username: string
  phone_encrypted: string | null
  avatar_url: string | null
  bettermode_user_id: string | null
  kakao_id: string | null  // OAuth Provider ID
  naver_id: string | null  // OAuth Provider ID
  password_hash: string | null // 초기에는 NULL (소셜 로그인만)
  signup_status: string
  member_fields: Array<{ key: string; value: string }>
  created_at: Date
  deleted_at: Date | null
}

export async function transformUser(
  legacyUser: LegacyUser,
  accounts: LegacyAccount[],
): Promise<RdsUser> {
  const userId = randomUUID()

  // UUID 매핑 등록
  idMapping.users.set(legacyUser.id, userId)

  // OAuth Provider ID 추출
  const kakaoAccount = accounts.find(a => a.providerId === 'kakao')
  const naverAccount = accounts.find(a => a.providerId === 'naver')

  return {
    id: userId,
    legacy_id: legacyUser.id,
    email: legacyUser.email,
    full_name: legacyUser.name,
    username: legacyUser.nickname,
    phone_encrypted: legacyUser.phone
      ? await encryptWithKMS(legacyUser.phone)
      : null,
    avatar_url: legacyUser.profileImage
      ? legacyUser.profileImage.replace(
          'r2.gpters.org',
          'gpters-assets.s3.ap-northeast-2.amazonaws.com'
        )
      : null,
    bettermode_user_id: legacyUser.bettermodeUserId,
    kakao_id: kakaoAccount?.providerAccountId ?? null,
    naver_id: naverAccount?.providerAccountId ?? null,
    password_hash: null, // 소셜 로그인 사용자는 비밀번호 없음
    signup_status: legacyUser.signupStatus,
    member_fields: legacyUser.memberFields,
    created_at: legacyUser.createdAt,
    deleted_at: legacyUser.deletedAt,
  }
}
```

### 5.5 Payment ETL (0원 결제 보존)

```typescript
// scripts/migration/transform/payment.transform.ts
import { idMapping } from '../id-mapping'

interface LegacyPayment {
  id: number
  merchantUid: string
  impUid: string
  actualPrice: string // Decimal as string
  status: string
  cancelHistory: Array<Record<string, unknown>>
  orderId: number | null
  deletedAt: Date | null
}

export function transformPayment(legacy: LegacyPayment) {
  // 0원 결제 검증: impUid가 'X-'로 시작하는 경우
  const isZeroPayment = legacy.impUid.startsWith('X-')

  if (isZeroPayment) {
    // 0원 결제는 반드시 Cancel 상태여야 함
    if (legacy.status !== 'Cancel') {
      console.warn(
        `[WARNING] 0원 결제(${legacy.impUid})의 status가 Cancel이 아님: ${legacy.status}`,
      )
    }
  }

  return {
    id: legacy.id,
    merchant_uid: legacy.merchantUid,
    imp_uid: legacy.impUid,
    // Decimal → Int 변환 (KRW는 소수점 없음)
    actual_price: Math.round(Number(legacy.actualPrice)),
    status: legacy.status.toLowerCase(),
    is_zero_payment: isZeroPayment,
    cancel_history: legacy.cancelHistory,
    order_id: legacy.orderId,
    deleted_at: legacy.deletedAt,
  }
}
```

### 5.6 Airtable 추출기

```typescript
// scripts/migration/extract/airtable-extractor.ts
import Airtable from 'airtable'

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY! }).base(
  'appq8xK4PLp7D7aCg',
)

// Airtable 필드 타입 변환 유틸
function parseCohortNumber(value: string): number | null {
  const match = value.match(/(\d+)/)
  return match ? parseInt(match[1], 10) : null
}

function flattenLookup(value: unknown): string | null {
  if (Array.isArray(value) && value.length > 0) return String(value[0])
  if (typeof value === 'string') return value
  return null
}

function parseAirtableDate(value: unknown): Date | null {
  if (!value) return null
  const d = new Date(String(value))
  return isNaN(d.getTime()) ? null : d
}

export async function extractCohorts() {
  const records: unknown[] = []
  await base('tblj2uv2tyatrv0') // 기수관리 테이블
    .select({ view: 'Grid view' })
    .eachPage((pageRecords, fetchNextPage) => {
      records.push(...pageRecords.map((r) => ({
        id: r.id,
        ...r.fields,
        // 파싱된 필드 추가
        _cohortNumber: parseCohortNumber(String(r.fields['기수'] ?? '')),
        _startDate: parseAirtableDate(r.fields['시작일']),
        _endDate: parseAirtableDate(r.fields['종료일']),
      })))
      fetchNextPage()
    })
  return records
}

export async function extractStudySessions() {
  const records: unknown[] = []
  await base('tbllsAHl2ZGjprebv') // N주차관리 (Study Session)
    .select({ view: 'Grid view' })
    .eachPage((pageRecords, fetchNextPage) => {
      records.push(...pageRecords.map((r) => ({
        id: r.id,
        ...r.fields,
        _studyName: flattenLookup(r.fields['스터디명']),
        _sessionDate: parseAirtableDate(r.fields['날짜']),
      })))
      fetchNextPage()
    })
  return records
}

export async function extractVodRecordings() {
  const records: unknown[] = []
  await base('tblVn8o4qsUZzhS2I') // 줌기록 VOD (Session Item)
    .select({ view: 'Grid view' })
    .eachPage((pageRecords, fetchNextPage) => {
      records.push(...pageRecords.map((r) => ({ id: r.id, ...r.fields })))
      fetchNextPage()
    })
  return records
}

export async function extractAirtableStudies() {
  const records: unknown[] = []
  await base('tblP0bMmo1xuLnX2v') // 확정된 스터디
    .select({ view: 'Grid view' })
    .eachPage((pageRecords, fetchNextPage) => {
      records.push(...pageRecords.map((r) => ({
        id: r.id,
        ...r.fields,
        _cohortNumber: parseCohortNumber(String(r.fields['기수'] ?? '')),
      })))
      fetchNextPage()
    })
  return records
}

export async function extractAirtableMembers() {
  const records: unknown[] = []
  await base('tblryJjitdqf3h0uw') // 사용자(Users)
    .select({ view: 'Grid view' })
    .eachPage((pageRecords, fetchNextPage) => {
      records.push(...pageRecords.map((r) => ({ id: r.id, ...r.fields })))
      fetchNextPage()
    })
  return records
}
```

### 5.7 RDS Loader (Drizzle ORM)

```typescript
// scripts/migration/load/rds-loader.ts
import { rds } from '../config'
import { users, cohorts, studies, payments, enrollments, posts } from '../../src/db/schema'

export async function insertUsers(batch: RdsUser[]) {
  await rds.insert(users).values(batch).onConflictDoNothing()
}

export async function insertPayments(batch: TransformedPayment[]) {
  await rds.insert(payments).values(batch).onConflictDoNothing()
}

export async function insertEnrollments(batch: TransformedEnrollment[]) {
  await rds.insert(enrollments).values(batch).onConflictDoNothing()
}

// 등 모든 테이블에 대해 동일 패턴
```

### 5.8 배치 처리 + 재시도 로직

```typescript
// scripts/migration/load/batch.ts
import { BATCH_SIZE, RETRY_LIMIT, RETRY_DELAY_MS } from '../config'

export async function batchInsert<T>(
  tableName: string,
  records: T[],
  insertFn: (batch: T[]) => Promise<void>,
  options = { onConflict: 'skip' },
) {
  const total = records.length
  let processed = 0
  let errors = 0

  for (let i = 0; i < records.length; i += BATCH_SIZE) {
    const batch = records.slice(i, i + BATCH_SIZE)
    let attempt = 0
    let success = false

    while (attempt < RETRY_LIMIT && !success) {
      try {
        await insertFn(batch)
        processed += batch.length
        success = true
        console.log(
          `[${tableName}] ${processed}/${total} 처리 완료`,
        )
      } catch (error) {
        attempt++
        console.error(
          `[${tableName}] 배치 오류 (시도 ${attempt}/${RETRY_LIMIT}):`,
          error,
        )
        if (attempt < RETRY_LIMIT) {
          await sleep(RETRY_DELAY_MS * attempt)
        } else {
          errors += batch.length
          console.error(
            `[${tableName}] 배치 최종 실패. ${batch.length}건 스킵.`,
          )
        }
      }
    }
  }

  console.log(
    `[${tableName}] 완료: 성공 ${processed}, 실패 ${errors}, 전체 ${total}`,
  )
  return { processed, errors, total }
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
```

### 5.9 메인 실행 스크립트

```typescript
// scripts/migration/index.ts
import { extractUsers, extractPayments, extractAccounts } from './extract/pg-extractor'
import { extractCohorts, extractStudySessions, extractVodRecordings } from './extract/airtable-extractor'
import { extractBettermodePosts, extractBettermodeComments } from './extract/bettermode-extractor'
import { validateAll } from './validate/count.validator'

async function runMigration() {
  console.log('=== GPTers 데이터 마이그레이션 시작 ===')
  console.log(`타겟: AWS RDS PostgreSQL (ap-northeast-2)`)
  console.log(`실행 시각: ${new Date().toISOString()}`)

  try {
    // Phase A: 기준 데이터 (의존성 없음)
    console.log('\n[Phase A] 기준 데이터 이관')
    await migrateCohorts()       // Cohort (21건)
    await migrateProducts()      // CourseProduct (100건)
    await migrateCoupons()       // Coupon (200건)

    // Phase B: 사용자 데이터 (OAuth ID 매핑 포함)
    console.log('\n[Phase B] 사용자 데이터 이관')
    await migrateUsers()         // User (4,000건) - users 테이블 직접 INSERT

    // Phase C: 주문/결제 데이터 (User 의존)
    console.log('\n[Phase C] 주문/결제 데이터 이관')
    await migrateOrders()        // Order (5,000건)
    await migratePayments()      // Payment (5,000건)
    await migrateRefunds()       // Refund (300건)

    // Phase D: 수강/스터디 데이터 (User + Product + Order 의존)
    console.log('\n[Phase D] 수강/스터디 데이터 이관')
    await migrateEnrollments()   // UserEnrollment (6,000건)
    await migrateStudies()       // Study (300건)
    await migrateStudyUsers()    // StudyUser (3,000건)

    // Phase E: 커뮤니티 데이터 (PostgreSQL + Bettermode)
    console.log('\n[Phase E] 커뮤니티 데이터 이관')
    await migratePosts()                  // CommunityPost (7,000건)
    await migrateBettermodePosts()        // Bettermode Posts (5,000건)
    await migrateBettermodeComments()     // Bettermode Comments (3,000건)

    // Phase F: Airtable 전용 데이터
    console.log('\n[Phase F] Airtable 데이터 이관')
    await migrateWeekSchedules()  // N주차관리 (100건)
    await migrateVodRecordings()  // 줌기록 VOD (500건)
    await migrateNotices()        // 공지사항 (200건)
    await supplementCohorts()     // Airtable → cohorts 보완
    await supplementStudies()     // Airtable → studies 보완
    await supplementUsers()       // Airtable 멤버 → users 보완

    // Phase G: 검증
    console.log('\n[Phase G] 데이터 검증')
    const result = await validateAll()
    if (!result.passed) {
      throw new Error('검증 실패: ' + result.errors.join(', '))
    }

    console.log('\n=== 마이그레이션 완료 ===')
  } catch (error) {
    console.error('\n=== 마이그레이션 실패 ===', error)
    process.exit(1)
  }
}

runMigration()
```

---

## 6. Bettermode 커뮤니티 마이그레이션

### 6.1 개요

Bettermode 의존성을 완전 제거하고, 커뮤니티 데이터를 자체 관리 테이블로 이관한다.

```mermaid
flowchart LR
    subgraph Source["Bettermode"]
        BMPosts["Posts<br/>(GraphQL API)"]
        BMComments["Comments<br/>(GraphQL API)"]
        BMReactions["Reactions<br/>(GraphQL API)"]
        BMSpaces["Spaces<br/>(카테고리)"]
    end

    subgraph Target["RDS PostgreSQL"]
        Posts["community_posts"]
        Comments["community_comments"]
        Reactions["community_reactions"]
        Categories["post_categories"]
    end

    BMPosts --> Posts
    BMComments --> Comments
    BMReactions --> Reactions
    BMSpaces --> Categories
```

### 6.2 Bettermode GraphQL 추출기

```typescript
// scripts/migration/extract/bettermode-extractor.ts
const BM_API = 'https://app.bettermode.com/api/v2/graphql'
const BM_TOKEN = process.env.BETTERMODE_ACCESS_TOKEN!

interface BettermodePost {
  id: string
  title: string
  slug: string
  shortContent: string
  content: string // HTML
  createdAt: string
  publishedAt: string
  status: string
  space: { id: string; name: string; slug: string }
  owner: { member: { id: string; name: string } }
  tags: Array<{ id: string; title: string }>
  reactionsCount: number
  repliesCount: number
}

async function fetchPosts(after?: string): Promise<{
  posts: BettermodePost[]
  hasNextPage: boolean
  endCursor: string
}> {
  const query = `
    query GetPosts($after: String, $limit: Int!) {
      posts(after: $after, limit: $limit, orderBy: createdAt, reverse: true) {
        totalCount
        pageInfo { hasNextPage endCursor }
        nodes {
          id title slug shortContent
          fields { key value }
          createdAt publishedAt status
          space { id name slug }
          owner { member { id name } }
          tags { id title }
          reactionsCount repliesCount
        }
      }
    }
  `

  const res = await fetch(BM_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${BM_TOKEN}`,
    },
    body: JSON.stringify({
      query,
      variables: { after, limit: 50 },
    }),
  })

  const data = await res.json()
  return {
    posts: data.data.posts.nodes,
    hasNextPage: data.data.posts.pageInfo.hasNextPage,
    endCursor: data.data.posts.pageInfo.endCursor,
  }
}

export async function extractBettermodePosts(): Promise<BettermodePost[]> {
  const allPosts: BettermodePost[] = []
  let cursor: string | undefined
  let hasNext = true

  while (hasNext) {
    const { posts, hasNextPage, endCursor } = await fetchPosts(cursor)
    allPosts.push(...posts)
    hasNext = hasNextPage
    cursor = endCursor
    console.log(`[BM Posts] ${allPosts.length}건 추출 중...`)
    await sleep(500) // Rate limit 대응
  }

  console.log(`[BM Posts] 총 ${allPosts.length}건 추출 완료`)
  return allPosts
}

// Comments 추출도 유사 패턴 (post ID별 pagination)
export async function extractBettermodeComments(
  postIds: string[],
): Promise<BettermodeComment[]> {
  // 각 post에 대해 replies를 pagination으로 추출
  // ...
}
```

### 6.3 Bettermode → RDS 매핑

#### community_posts

| BM 필드 | RDS 필드 | 변환 규칙 |
|---------|----------|---------|
| id | bettermode_id | String 보존 (일몰 후 제거) |
| title | title | 직접 매핑 |
| slug | slug | SEO URL 보존 |
| content (HTML) | content | DOMPurify sanitize |
| createdAt | created_at | ISO → Timestamptz |
| publishedAt | published_at | ISO → Timestamptz |
| status | status | PUBLISHED→published, DRAFT→draft |
| space.id | category_id | Space → Category 매핑 |
| owner.member.id | user_id | BM Member ID → users.bettermode_user_id 조인 |
| tags[].title | tags | String[] |
| reactionsCount | reactions_count | Int (denormalized) |
| repliesCount | replies_count | Int (denormalized) |

#### community_comments

| BM 필드 | RDS 필드 | 변환 규칙 |
|---------|----------|---------|
| id | bettermode_id | String |
| body (HTML) | content | DOMPurify sanitize |
| post.id | post_id | BM Post ID → community_posts.bettermode_id 조인 |
| createdAt | created_at | ISO → Timestamptz |
| owner.member.id | user_id | BM Member ID → users 조인 |

### 6.4 중복 처리 (CommunityPost vs Bettermode Posts)

CommunityPost 테이블과 Bettermode API에서 추출한 데이터는 `bettermodeId`로 교차 참조된다.

```typescript
// CommunityPost.bettermodeId 와 Bettermode Post.id 매칭
async function deduplicatePosts(
  neonPosts: NeonCommunityPost[],
  bmPosts: BettermodePost[],
) {
  const bmMap = new Map(bmPosts.map(p => [p.id, p]))

  for (const neonPost of neonPosts) {
    if (neonPost.bettermodeId && bmMap.has(neonPost.bettermodeId)) {
      // Neon 데이터가 SoR → Neon 우선, BM에서 누락된 필드만 보완
      const bmPost = bmMap.get(neonPost.bettermodeId)!
      bmMap.delete(neonPost.bettermodeId)

      // BM에만 있는 reactions_count, replies_count 보완
      neonPost._reactionsCount = bmPost.reactionsCount
      neonPost._repliesCount = bmPost.repliesCount
    }
  }

  // bmMap에 남은 것 = BM에만 존재 (Neon에 없는 게시글)
  const bmOnlyPosts = Array.from(bmMap.values())
  console.log(`[중복 처리] Neon: ${neonPosts.length}, BM Only: ${bmOnlyPosts.length}`)

  return { neonPosts, bmOnlyPosts }
}
```

---

## 7. R2 → S3 파일 마이그레이션

### 7.1 개요

Cloudflare R2에 저장된 파일을 AWS S3로 이관한다.

| 항목 | R2 (현재) | S3 (타겟) |
|------|----------|----------|
| 버킷명 | gpters-assets | gpters-assets-prod |
| 리전 | auto | ap-northeast-2 |
| 예상 용량 | ~5GB | 동일 |
| 접근 URL | r2.gpters.org | cdn.gpters.org (CloudFront) |

### 7.2 rclone 기반 마이그레이션

```bash
# rclone 설정
# ~/.config/rclone/rclone.conf
[r2]
type = s3
provider = Cloudflare
access_key_id = ${R2_ACCESS_KEY}
secret_access_key = ${R2_SECRET_KEY}
endpoint = https://${CF_ACCOUNT_ID}.r2.cloudflarestorage.com
acl = private

[s3]
type = s3
provider = AWS
access_key_id = ${AWS_ACCESS_KEY}
secret_access_key = ${AWS_SECRET_KEY}
region = ap-northeast-2

# Dry run (파일 목록 확인)
rclone ls r2:gpters-assets --dry-run

# 동기화 실행
rclone sync r2:gpters-assets s3:gpters-assets-prod \
  --progress \
  --transfers 32 \
  --checkers 16 \
  --log-file migration-r2-to-s3.log \
  --log-level INFO

# 검증 (파일 수 + 총 용량 비교)
rclone size r2:gpters-assets
rclone size s3:gpters-assets-prod
```

### 7.3 URL 리매핑

ETL 스크립트에서 모든 R2 URL을 S3/CloudFront URL로 변환한다.

```typescript
// scripts/migration/utils/url-rewriter.ts
const URL_MAPPINGS = [
  { from: 'r2.gpters.org', to: 'cdn.gpters.org' },
  { from: 'pub-xxx.r2.dev', to: 'cdn.gpters.org' },
] as const

export function rewriteUrl(url: string | null): string | null {
  if (!url) return null
  for (const { from, to } of URL_MAPPINGS) {
    if (url.includes(from)) {
      return url.replace(from, to)
    }
  }
  return url
}

// 적용 대상 필드:
// - users.avatar_url
// - posts.content (HTML 내 이미지 URL)
// - vod_recordings.thumbnail_url
```

### 7.4 CloudFront 배포 설정

```
Distribution:
  Origin: s3:gpters-assets-prod.s3.ap-northeast-2.amazonaws.com
  Domain: cdn.gpters.org
  Cache Policy: CachingOptimized (TTL 86400s)
  Price Class: PriceClass_200 (아시아 + 북미)
  Origin Access Control: OAC (S3 직접 접근 차단)
```

---

## 8. Upstash → ElastiCache 전환

### 8.1 전환 전략

Upstash Redis에 저장된 데이터는 대부분 **휘발성**(세션, 캐시, Rate Limit 카운터)이므로 데이터 마이그레이션은 불필요하다. 연결 설정만 변경한다.

| 데이터 유형 | 마이그레이션 필요 | 처리 방법 |
|------------|---------------|---------|
| 세션 (Lucia) | 불필요 | 사용자 재로그인 |
| ISR 캐시 | 불필요 | 자동 재생성 |
| Rate Limit 카운터 | 불필요 | 리셋 |
| 크론 잠금 키 | 불필요 | 리셋 |

### 8.2 ElastiCache 설정

| 항목 | 값 |
|------|-----|
| Engine | Redis 7.x |
| Node Type | cache.t4g.micro (초기) |
| Cluster Mode | Disabled (단일 노드) |
| Subnet Group | gpters-redis-subnet (Private) |
| Security Group | sg-elasticache |
| Parameter Group | default.redis7 |

### 8.3 연결 설정 변경

```typescript
// Before (Upstash)
import { Redis } from '@upstash/redis'
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

// After (ElastiCache - ioredis)
import Redis from 'ioredis'
const redis = new Redis({
  host: process.env.REDIS_HOST!, // gpters-redis.xxx.cache.amazonaws.com
  port: 6379,
  tls: { rejectUnauthorized: true },
  maxRetriesPerRequest: 3,
})
```

### 8.4 전환 타이밍

ElastiCache 전환은 RDS 마이그레이션과 동시에 수행한다. 사용자는 전환 시 재로그인이 필요하다.

```
전환 순서:
1. ElastiCache 인스턴스 생성 (Private Subnet)
2. 환경변수 REDIS_HOST 설정
3. Upstash SDK → ioredis 코드 변경 배포
4. Upstash 연결 해제
5. 사용자 세션 만료 → 재로그인 안내
```

---

## 9. 검증 쿼리

### 9.1 레코드 수 비교 (source vs target)

```sql
-- [V-01] 핵심 테이블 레코드 수 비교
-- 레거시 DB에서 실행
SELECT
  'users' as tbl, COUNT(*) as legacy_cnt FROM "User"
UNION ALL SELECT 'orders', COUNT(*) FROM "Order"
UNION ALL SELECT 'payments', COUNT(*) FROM "Payment"
UNION ALL SELECT 'enrollments', COUNT(*) FROM "UserEnrollment"
UNION ALL SELECT 'cohorts', COUNT(*) FROM "Cohort"
UNION ALL SELECT 'studies', COUNT(*) FROM "Study"
UNION ALL SELECT 'study_users', COUNT(*) FROM "StudyUser"
UNION ALL SELECT 'posts', COUNT(*) FROM "CommunityPost"
UNION ALL SELECT 'refunds', COUNT(*) FROM "Refund"
ORDER BY tbl;

-- RDS에서 실행 (동일 쿼리, 동일 결과 기대)
SELECT
  'users' as tbl, COUNT(*) as rds_cnt FROM users
UNION ALL SELECT 'orders', COUNT(*) FROM orders
UNION ALL SELECT 'payments', COUNT(*) FROM payments
UNION ALL SELECT 'enrollments', COUNT(*) FROM enrollments
UNION ALL SELECT 'cohorts', COUNT(*) FROM cohorts
UNION ALL SELECT 'studies', COUNT(*) FROM studies
UNION ALL SELECT 'study_users', COUNT(*) FROM study_users
UNION ALL SELECT 'posts', COUNT(*) FROM posts
UNION ALL SELECT 'refunds', COUNT(*) FROM refunds
ORDER BY tbl;
```

### 9.2 Soft Delete 데이터 보존 확인

```sql
-- [V-02] Soft Delete 레코드 보존 확인 (레거시)
SELECT
  'Order' as tbl, COUNT(*) as total, COUNT("deletedAt") as soft_deleted
FROM "Order"
UNION ALL SELECT 'Payment', COUNT(*), COUNT("deletedAt") FROM "Payment"
UNION ALL SELECT 'UserEnrollment', COUNT(*), COUNT("deletedAt") FROM "UserEnrollment"
UNION ALL SELECT 'CommunityPost', COUNT(*), COUNT("deletedAt") FROM "CommunityPost";

-- RDS에서도 동일 비율이어야 함
SELECT
  'orders' as tbl, COUNT(*) as total, COUNT(deleted_at) as soft_deleted
FROM orders
UNION ALL SELECT 'payments', COUNT(*), COUNT(deleted_at) FROM payments
UNION ALL SELECT 'enrollments', COUNT(*), COUNT(deleted_at) FROM enrollments
UNION ALL SELECT 'posts', COUNT(*), COUNT(deleted_at) FROM posts;
```

### 9.3 결제 금액 합계 비교 (가장 중요)

```sql
-- [V-03] 결제 금액 합계 비교 (레거시)
SELECT
  COUNT(*) as payment_count,
  SUM("actualPrice")::bigint as total_amount,
  SUM(CASE WHEN status = 'Success' THEN "actualPrice" ELSE 0 END)::bigint as success_amount,
  SUM(CASE WHEN status = 'Cancel' THEN "actualPrice" ELSE 0 END)::bigint as cancel_amount,
  COUNT(CASE WHEN "impUid" LIKE 'X-%' THEN 1 END) as zero_payment_count
FROM "Payment"
WHERE "deletedAt" IS NULL;

-- RDS에서도 동일 결과 기대
SELECT
  COUNT(*) as payment_count,
  SUM(actual_price) as total_amount,
  SUM(CASE WHEN status = 'success' THEN actual_price ELSE 0 END) as success_amount,
  SUM(CASE WHEN status = 'cancel' THEN actual_price ELSE 0 END) as cancel_amount,
  COUNT(CASE WHEN is_zero_payment = true THEN 1 END) as zero_payment_count
FROM payments
WHERE deleted_at IS NULL;
```

### 9.4 FK 정합성 확인

```sql
-- [V-04] Enrollment → User FK 정합성 (RDS)
SELECT COUNT(*) as orphan_enrollments
FROM enrollments e
WHERE NOT EXISTS (
  SELECT 1 FROM users u WHERE u.id = e.user_id
);

-- [V-05] Enrollment → Product FK 정합성 (RDS)
SELECT COUNT(*) as orphan_enrollments
FROM enrollments e
WHERE NOT EXISTS (
  SELECT 1 FROM products p WHERE p.id = e.product_id
);

-- [V-06] StudyUser → Study FK 정합성 (RDS)
SELECT COUNT(*) as orphan_study_users
FROM study_users su
WHERE NOT EXISTS (
  SELECT 1 FROM studies s WHERE s.id = su.study_id
);

-- [V-07] StudyUser → User FK 정합성 (RDS)
SELECT COUNT(*) as orphan_study_users
FROM study_users su
WHERE su.user_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM users u WHERE u.id = su.user_id
  );

-- [V-08] Order → User FK 정합성 (RDS)
SELECT COUNT(*) as orphan_orders
FROM orders o
WHERE o.user_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM users u WHERE u.id = o.user_id
  );
```

### 9.5 중복 데이터 확인

```sql
-- [V-09] 사용자 이메일 중복 확인 (RDS)
SELECT email, COUNT(*) as cnt
FROM users
GROUP BY email
HAVING COUNT(*) > 1;

-- [V-10] 결제 merchant_uid 중복 확인 (RDS)
SELECT merchant_uid, COUNT(*) as cnt
FROM payments
GROUP BY merchant_uid
HAVING COUNT(*) > 1;

-- [V-11] 게시글 slug 중복 확인 (RDS)
SELECT slug, COUNT(*) as cnt
FROM posts
GROUP BY slug
HAVING COUNT(*) > 1;
```

### 9.6 0원 결제 보존 확인

```sql
-- [V-12] 0원 결제 패턴 보존 확인 (RDS)
SELECT
  COUNT(*) as zero_payment_count,
  SUM(actual_price) as total_zero_amount, -- 반드시 0이어야 함
  COUNT(CASE WHEN status != 'cancel' THEN 1 END) as wrong_status_count -- 반드시 0이어야 함
FROM payments
WHERE imp_uid LIKE 'X-%';

-- wrong_status_count > 0 이면 마이그레이션 오류
```

### 9.7 날짜 범위 유효성

```sql
-- [V-13] Study startDate <= endDate 검증 (RDS)
SELECT id, name, start_date, end_date
FROM studies
WHERE start_date IS NOT NULL
  AND end_date IS NOT NULL
  AND start_date > end_date;

-- [V-14] Cohort 날짜 순서 검증 (RDS)
SELECT id, cohort_number,
  pre_sale_start_date, pre_sale_end_date,
  sale_start_date, sale_end_date,
  start_date, end_date
FROM cohorts
WHERE (pre_sale_start_date > pre_sale_end_date)
   OR (sale_start_date > sale_end_date)
   OR (start_date > end_date);
```

### 9.8 Enum 값 유효성

```sql
-- [V-15] Payment status Enum 유효성 (RDS)
SELECT DISTINCT status, COUNT(*) as cnt
FROM payments
GROUP BY status
ORDER BY cnt DESC;
-- 허용값: success, cancel, vbank_issued, vbank_expired, invalid, error, partial_cancel

-- [V-16] Enrollment accessRole Enum 유효성 (RDS)
SELECT DISTINCT access_role, COUNT(*) as cnt
FROM enrollments
GROUP BY access_role
ORDER BY cnt DESC;
-- 허용값: student, auditor, staff
```

### 9.9 Airtable 데이터 검증

```sql
-- [V-17] week_schedules 레코드 수 확인 (RDS)
SELECT COUNT(*) as week_schedule_count FROM week_schedules;
-- 기대값: ~100

-- [V-18] vod_recordings 레코드 수 확인 (RDS)
SELECT COUNT(*) as vod_count FROM vod_recordings;
-- 기대값: ~500

-- [V-19] week_schedule → study FK 정합성 (RDS)
SELECT COUNT(*) as orphan_schedules
FROM week_schedules ws
WHERE NOT EXISTS (
  SELECT 1 FROM studies s WHERE s.id = ws.study_id
);

-- [V-20] vod_recordings → week_schedules FK 정합성 (RDS)
SELECT COUNT(*) as orphan_vods
FROM vod_recordings vr
WHERE NOT EXISTS (
  SELECT 1 FROM week_schedules ws WHERE ws.id = vr.week_schedule_id
);
```

### 9.10 OAuth Provider ID 검증

```sql
-- [V-21] OAuth Provider ID 매핑 검증 (RDS)
SELECT
  COUNT(*) as total_users,
  COUNT(kakao_id) as kakao_linked,
  COUNT(naver_id) as naver_linked,
  COUNT(CASE WHEN kakao_id IS NULL AND naver_id IS NULL THEN 1 END) as no_oauth
FROM users
WHERE deleted_at IS NULL;

-- 레거시 Account 테이블과 비교
SELECT
  COUNT(DISTINCT "userId") as total,
  COUNT(DISTINCT CASE WHEN "providerId" = 'kakao' THEN "userId" END) as kakao,
  COUNT(DISTINCT CASE WHEN "providerId" = 'naver' THEN "userId" END) as naver
FROM "Account";
```

### 9.11 Bettermode 데이터 검증

```sql
-- [V-22] community_posts 레코드 수 (RDS)
SELECT COUNT(*) as community_post_count FROM community_posts;

-- [V-23] community_comments 레코드 수 (RDS)
SELECT COUNT(*) as comment_count FROM community_comments;

-- [V-24] community_posts → users FK 정합성
SELECT COUNT(*) as orphan_posts
FROM community_posts cp
WHERE cp.user_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM users u WHERE u.id = cp.user_id
  );
```

### 9.12 R2 → S3 파일 검증

```sql
-- [V-25] 이관 후 R2 URL 잔존 확인 (RDS)
SELECT 'users' as tbl, COUNT(*) as cnt FROM users WHERE avatar_url LIKE '%r2.gpters.org%'
UNION ALL SELECT 'posts', COUNT(*) FROM posts WHERE content LIKE '%r2.gpters.org%'
UNION ALL SELECT 'community_posts', COUNT(*) FROM community_posts WHERE content LIKE '%r2.gpters.org%';
-- 모든 값이 0이어야 함
```

---

## 10. 롤백 스크립트

### 10.1 Phase 0 롤백 (Dual Read 단계)

Phase 0에서는 RDS에 데이터를 적재하되 레거시 시스템을 그대로 유지한다. 롤백은 RDS 테이블을 TRUNCATE하는 것으로 충분하다.

```sql
-- Phase 0 롤백: RDS 데이터 전체 삭제 (FK 순서 역순)
-- psql 또는 RDS Query Editor에서 실행

BEGIN;

-- 의존성이 있는 테이블 먼저 삭제 (역순)
TRUNCATE TABLE community_reactions CASCADE;
TRUNCATE TABLE community_comments CASCADE;
TRUNCATE TABLE community_posts CASCADE;
TRUNCATE TABLE vod_recordings CASCADE;
TRUNCATE TABLE week_schedules CASCADE;
TRUNCATE TABLE notices CASCADE;
TRUNCATE TABLE study_users CASCADE;
TRUNCATE TABLE enrollments CASCADE;
TRUNCATE TABLE refunds CASCADE;
TRUNCATE TABLE payments CASCADE;
TRUNCATE TABLE orders CASCADE;
TRUNCATE TABLE user_coupons CASCADE;
TRUNCATE TABLE coupons CASCADE;
TRUNCATE TABLE posts CASCADE;
TRUNCATE TABLE studies CASCADE;
TRUNCATE TABLE cohorts CASCADE;
TRUNCATE TABLE products CASCADE;
TRUNCATE TABLE users CASCADE;

COMMIT;
```

### 10.2 Phase 1 롤백 (Dual Write 단계)

Phase 1에서는 신규 데이터가 RDS에 직접 기록된다. 레거시로 돌아가려면 RDS의 신규 레코드만 삭제한다.

```typescript
// scripts/migration/rollback/rollback-phase1.ts
import { rds } from '../config'
import { sql } from 'drizzle-orm'

const PHASE1_START = new Date('2026-05-15T00:00:00Z') // 실제 시작 시각으로 변경

async function rollbackPhase1() {
  await rds.execute(sql`SELECT rollback_phase1_data(${PHASE1_START.toISOString()})`)
  console.log('Phase 1 롤백 완료')
}
```

```sql
-- RDS Function: rollback_phase1_data
CREATE OR REPLACE FUNCTION rollback_phase1_data(cutoff_date TIMESTAMPTZ)
RETURNS void AS $$
BEGIN
  DELETE FROM community_comments WHERE created_at >= cutoff_date;
  DELETE FROM community_posts WHERE created_at >= cutoff_date;
  DELETE FROM vod_recordings WHERE created_at >= cutoff_date;
  DELETE FROM week_schedules WHERE created_at >= cutoff_date;
  DELETE FROM study_users WHERE created_at >= cutoff_date;
  DELETE FROM enrollments WHERE created_at >= cutoff_date;
  DELETE FROM payments WHERE created_at >= cutoff_date;
  DELETE FROM orders WHERE created_at >= cutoff_date;
  DELETE FROM posts WHERE created_at >= cutoff_date;
  DELETE FROM studies WHERE created_at >= cutoff_date;
  -- users: 별도 처리 (OAuth 연결 해제 필요)
END;
$$ LANGUAGE plpgsql;
```

### 10.3 Phase 2 롤백 (Primary Switch 단계)

Phase 2에서 문제가 발생하면 환경변수 기반으로 데이터소스를 레거시로 되돌린다.

```typescript
// 환경변수 기반 데이터소스 전환
// .env.production
DATA_SOURCE=rds  // → legacy 로 변경 시 레거시로 롤백

// apps/web/middleware.ts
const dataSource = process.env.DATA_SOURCE ?? 'legacy'
if (dataSource === 'rds') {
  // RDS API 사용
} else {
  // 레거시 tRPC API 사용
}
```

### 10.4 autoincrement 시퀀스 재설정

```sql
-- RDS에서 INT ID 시퀀스를 레거시 최대값 이후로 설정
-- 각 테이블에 대해 실행 필요

SELECT setval('cohorts_id_seq', (SELECT MAX(id) FROM cohorts) + 1);
SELECT setval('studies_id_seq', (SELECT MAX(id) FROM studies) + 1);
SELECT setval('orders_id_seq', (SELECT MAX(id) FROM orders) + 1);
SELECT setval('payments_id_seq', (SELECT MAX(id) FROM payments) + 1);
SELECT setval('enrollments_id_seq', (SELECT MAX(id) FROM enrollments) + 1);
SELECT setval('products_id_seq', (SELECT MAX(id) FROM products) + 1);
SELECT setval('posts_id_seq', (SELECT MAX(id) FROM posts) + 1);
```

---

## 11. 4단계 마이그레이션 실행 계획

### Phase 0: Dual Read (2주, Week 19-20)

**목표**: RDS에 초기 데이터를 이관하되 레거시 시스템 유지. 검증 완료.

```mermaid
flowchart TD
    subgraph W19["Week 19"]
        W19D1["Day 1-2: AWS RDS 생성 + VPC 구성 + Drizzle 스키마 적용"]
        W19D3["Day 3-4: ETL 스크립트 개발 + 단위 테스트"]
        W19D4["Day 4: R2 → S3 파일 마이그레이션 (rclone)"]
        W19D5["Day 5: 스테이징 환경에서 ETL 시험 실행"]
        W19D1 --> W19D3 --> W19D4 --> W19D5
    end
    subgraph W20["Week 20"]
        W20D1["Day 1: 프로덕션 ETL 실행 (Bastion Host 경유)"]
        W20D1O["실행 순서: Cohort → Product → Coupon → User(+OAuth) → Order → Payment → Enrollment → Study → Post → BM → Airtable"]
        W20D2["Day 2-3: 검증 쿼리 V-01 ~ V-25 전체 실행"]
        W20D4["Day 4: 불일치 데이터 수동 보정"]
        W20D5["Day 5: Dual Read 모드로 신규 사이트 배포 (읽기만)"]
        W20D1 --> W20D1O
        W20D1 --> W20D2 --> W20D4 --> W20D5
    end
    W19 --> W20
```

**Go/No-Go 기준**:
- 레코드 수 불일치 0건 (+-0.1% 허용)
- 결제 금액 합계 불일치 0원
- FK 고아 레코드 0건
- 0원 결제 wrong_status_count = 0
- OAuth Provider ID 매핑률 > 95%
- R2 URL 잔존 0건

### Phase 1: Dual Write (1기수, ~4주, Week 21-24)

**목표**: 신규 데이터는 RDS에 직접 기록. Airtable 동기화는 유지.

```mermaid
flowchart TD
    subgraph W21["Week 21"]
        W21A["신규 결제 → RDS에 직접 기록 시작"]
        W21B["레거시 DB는 참조용으로만 유지"]
        W21C["n8n: Airtable → RDS 동기화 유지 (기존 데이터)"]
        W21D["데이터 정합성 크론 매일 1회 실행"]
        W21E["ElastiCache 전환 + Upstash 연결 해제"]
    end
    subgraph W22["Week 22-24 (1기수 운영 기간)"]
        W22A["매주 정합성 크론 결과 확인"]
        W22B["불일치 발생 시 즉시 수동 보정"]
        W22C["운영팀 어드민 UI로 RDS 데이터 직접 관리 시작"]
        W22A --> W22B --> W22C
    end
    W21 --> W22
```

**n8n 동기화 플로우 (Phase 1 한정)**:
```mermaid
flowchart LR
    A["Airtable 기수관리 변경"] --> B["n8n Webhook 수신"] --> C["RDS cohorts UPDATE"]
    C -.- D["Phase 2 이후 단방향 종료"]
    style D fill:none,stroke:none
```

### Phase 2: Primary Switch (1기수 운영 후, Week 25-28)

**목표**: RDS를 단일 데이터 소스로 전환. Airtable은 읽기 전용 백업.

```mermaid
flowchart TD
    subgraph W25["Week 25"]
        W25A["1기수 운영 완료 후 데이터 정합성 최종 검증"]
        W25B["Airtable 쓰기 권한 비활성화 (읽기 전용 전환)"]
        W25C["HighTouch 양방향 sync 완전 중단"]
        W25D["운영팀 Airtable 직접 편집 중단 공지"]
        W25E["Bettermode Webhook 비활성화"]
        W25A --> W25B --> W25C --> W25D --> W25E
    end
    subgraph W26["Week 26-28"]
        W26A["모든 어드민 기능이 자체 어드민 UI에서 처리"]
        W26B["Airtable은 백업 목적으로만 유지"]
        W26C["레거시 gpters-study 사이트 읽기 전용 전환"]
        W26D["Neon PostgreSQL 읽기 전용 전환"]
    end
    W25 --> W26
```

### Phase 3: Legacy Sunset (Week 29-30)

**목표**: Airtable + Bettermode + Neon 연동 완전 제거. 레거시 사이트 종료.

```mermaid
flowchart TD
    subgraph W29["Week 29"]
        W29A["레거시 코드의 Airtable + Bettermode 연동 코드 제거"]
        W29B["최종 데이터 정합성 검증 (V-01 ~ V-25 재실행)"]
        W29C["Airtable 테이블 아카이브 (CSV 내보내기)"]
        W29D["n8n Airtable + BM 연결 비활성화"]
        W29E["Neon PostgreSQL 최종 백업 + 스냅샷"]
        W29A --> W29B --> W29C --> W29D --> W29E
    end
    subgraph W30["Week 30"]
        W30A["Airtable 계정 해지 준비 (30일 대기)"]
        W30B["Bettermode 계정 해지 준비"]
        W30C["Neon 계정 해지 준비"]
        W30D["Upstash 계정 해지"]
        W30E["Cloudflare R2 버킷 삭제"]
        W30F["레거시 gpters-study 사이트 종료 (리다이렉트)"]
        W30G["마이그레이션 완료 선언"]
        W30A --> W30B --> W30C --> W30D --> W30E --> W30F --> W30G
    end
    W29 --> W30
```

---

## 12. 데이터 정합성 크론 검사 로직

### 12.1 크론 실행 계획

Phase 1~2 기간 동안 매일 00:00 KST에 정합성 검사를 실행한다.

```typescript
// API Route: /api/cron/integrity-check
// 스케줄: Vercel Cron '0 15 * * *' (UTC 15:00 = KST 00:00)

import { rds } from '@/lib/db'

export async function GET(request: Request) {
  // Vercel Cron 인증
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 })
  }

  const results = await runIntegrityChecks(rds)
  await sendSlackAlert(results)
  await logResults(rds, results)

  return Response.json({ ok: true, results })
}
```

### 12.2 정합성 검사 항목

```typescript
// scripts/integrity/checks.ts

interface IntegrityCheck {
  name: string
  query: string
  threshold: number  // 허용 최대 불일치 건수
  severity: 'critical' | 'warning' | 'info'
}

export const integrityChecks: IntegrityCheck[] = [
  {
    name: '결제 금액 불일치',
    query: `
      SELECT ABS(
        (SELECT SUM(actual_price) FROM payments WHERE deleted_at IS NULL AND status = 'success') -
        -- 레거시 합계는 별도 외부 파라미터로 비교
        $1
      ) as diff
    `,
    threshold: 0,
    severity: 'critical',
  },
  {
    name: 'Enrollment FK 고아 레코드',
    query: `
      SELECT COUNT(*) as cnt
      FROM enrollments e
      WHERE NOT EXISTS (SELECT 1 FROM users u WHERE u.id = e.user_id)
        AND e.deleted_at IS NULL
    `,
    threshold: 0,
    severity: 'critical',
  },
  {
    name: '0원 결제 상태 오류',
    query: `
      SELECT COUNT(*) as cnt
      FROM payments
      WHERE imp_uid LIKE 'X-%' AND status != 'cancel'
    `,
    threshold: 0,
    severity: 'critical',
  },
  {
    name: 'Study-Cohort 매핑 누락',
    query: `
      SELECT COUNT(*) as cnt
      FROM studies s
      WHERE NOT EXISTS (SELECT 1 FROM cohorts c WHERE c.cohort_number::text = s.cohort_number::text)
    `,
    threshold: 0,
    severity: 'warning',
  },
  {
    name: '게시글 slug 중복',
    query: `
      SELECT COUNT(*) as cnt
      FROM (
        SELECT slug FROM posts GROUP BY slug HAVING COUNT(*) > 1
      ) dupes
    `,
    threshold: 0,
    severity: 'warning',
  },
  {
    name: 'OAuth Provider ID 누락 (활성 사용자)',
    query: `
      SELECT COUNT(*) as cnt
      FROM users
      WHERE deleted_at IS NULL
        AND kakao_id IS NULL
        AND naver_id IS NULL
    `,
    threshold: 100, // 이메일 전용 가입자 허용
    severity: 'info',
  },
]
```

### 12.3 알림 로직

```typescript
// scripts/integrity/alert.ts

interface IntegrityResult {
  checkName: string
  passed: boolean
  value: number
  threshold: number
  severity: 'critical' | 'warning' | 'info'
}

export async function sendSlackAlert(results: IntegrityResult[]) {
  const failures = results.filter((r) => !r.passed)
  if (failures.length === 0) return

  const criticals = failures.filter((r) => r.severity === 'critical')

  const message = {
    text: criticals.length > 0
      ? '[CRITICAL] 데이터 정합성 오류 감지'
      : '[WARNING] 데이터 정합성 경고',
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: failures.map((f) =>
            `${f.severity === 'critical' ? '[CRITICAL]' : '[WARNING]'} *${f.checkName}*: ${f.value}건 (허용: ${f.threshold}건)`
          ).join('\n'),
        },
      },
    ],
  }

  await fetch(process.env.SLACK_WEBHOOK_URL!, {
    method: 'POST',
    body: JSON.stringify(message),
  })
}
```

### 12.4 정합성 로그 저장

```sql
-- RDS: integrity_check_logs 테이블
CREATE TABLE integrity_check_logs (
  id BIGSERIAL PRIMARY KEY,
  checked_at TIMESTAMPTZ DEFAULT NOW(),
  check_name TEXT NOT NULL,
  passed BOOLEAN NOT NULL,
  value BIGINT,
  threshold BIGINT,
  severity TEXT,
  details JSONB
);

-- 30일 이후 자동 삭제 (pg_cron 또는 Vercel Cron으로 처리)
CREATE INDEX idx_integrity_checked_at ON integrity_check_logs(checked_at);

-- 오래된 로그 정리 함수
CREATE OR REPLACE FUNCTION cleanup_integrity_logs()
RETURNS void AS $$
BEGIN
  DELETE FROM integrity_check_logs WHERE checked_at < NOW() - INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql;
```

---

## 13. 위험 요소 및 대응

### 13.1 전화번호 기반 매칭 → userId 기반 전환

**위험**: LMS의 과제 권한 체크가 `phone` 필드 기반으로 동작한다. RDS 전환 후 `userId` 기반으로 변경해야 한다.

**현재 레거시 로직** (`lms-migration-reference.md` 기반):
```mermaid
flowchart LR
    A["게시글(Sync) 테이블에서 사용자 전화번호 + 주차 매칭"] --> B["삭제되지 않은 게시글만 유효"] --> C["스터디 태그 매칭"] --> D["주차별 replayUnlocked 플래그로 반환"]
```

**RDS 전환 후 로직**:
```sql
-- posts 테이블에서 user_id + week 기반 매칭
-- posts.user_id = 세션의 현재 사용자 ID로 직접 매핑
-- 전화번호 매칭 제거
```

**대응**:
1. ETL 시 `CommunityPost.bettermodeAuthorId` → `User.bettermodeUserId` → `User.id` → `users.id` 순으로 역추적하여 `user_id` 매핑
2. 매핑 불가한 게시글은 `user_id = NULL` (익명 처리)
3. VOD 권한 체크 로직을 `user_id` 기반으로 재작성

**매핑 불가 케이스 처리**:
```sql
-- 매핑 불가 게시글 확인 (레거시에서 실행)
SELECT COUNT(*) as unmappable_posts
FROM "CommunityPost" cp
WHERE cp."bettermodeAuthorId" IS NOT NULL
  AND cp."deletedAt" IS NULL
  AND NOT EXISTS (
    SELECT 1 FROM "User" u WHERE u."bettermodeUserId" = cp."bettermodeAuthorId"
  );
-- 이 건수가 VOD 권한 영향 범위
```

### 13.2 Airtable Record ID → RDS UUID/Int 매핑

**위험**: Airtable Record ID (`recXXXXXXXXXX` 형식)가 레거시 코드 곳곳에서 참조된다. 이관 후 참조가 끊길 수 있다.

**대응**:
- 모든 Airtable 이관 레코드에 `airtable_id` 컬럼을 추가하고 원본 Record ID를 보존
- ETL 완료 후 아래 매핑 테이블을 생성하여 구 URL 리다이렉트에 활용

```sql
-- RDS: airtable_id_mapping 테이블
CREATE TABLE airtable_id_mapping (
  airtable_id TEXT PRIMARY KEY,       -- recXXXXXXXXXX
  table_name TEXT NOT NULL,            -- 'cohorts', 'studies', 'week_schedules' 등
  new_id BIGINT,                       -- 새 ID (Int인 경우)
  new_uuid UUID,                       -- 새 UUID인 경우
  migrated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 13.3 HighTouch 양방향 sync 중단 계획

**위험**: HighTouch가 PostgreSQL → Airtable 양방향 동기화를 하고 있어, 마이그레이션 중 충돌이 발생할 수 있다.

**대응 순서**:
1. **Phase 0 시작 전**: HighTouch sync 일시 중지 (Airtable 기준 스냅샷 고정)
2. **Phase 0 중**: ETL 스크립트는 레거시 PostgreSQL에서만 읽기
3. **Phase 1**: HighTouch를 단방향(Airtable → RDS)으로 변경 후 재시작
4. **Phase 2**: HighTouch 완전 중단
5. **Phase 3**: HighTouch 계정 해지

```
HighTouch 중단 체크리스트:
[ ] HighTouch 대시보드에서 모든 sync 일시 중지
[ ] 마지막 sync 시각 기록 (스냅샷 기준점)
[ ] ETL 완료 후 sync 재개 여부 결정
[ ] Phase 2 이후 HighTouch 영구 중단
```

### 13.4 Study-Cohort 소프트 FK 정식 FK 전환

**위험**: 레거시에서 `Study.cohort` (String)이 `Cohort.cohort` (Int)를 문자열-숫자 매칭으로 연결하고 있다. RDS에서는 정식 FK로 전환이 필요하다.

**검증**:
```sql
-- 레거시: 매핑 불가 Study 확인
SELECT s.id, s.name, s.cohort
FROM "Study" s
LEFT JOIN "Cohort" c ON c.cohort = CAST(s.cohort AS INTEGER)
WHERE c.id IS NULL;
```

**대응**: 매핑 불가 Study가 있으면 수동으로 cohort_id를 지정 후 이관

### 13.5 Self-managed Auth 사용자 마이그레이션 전략

**위험**: 4,000명의 기존 사용자를 새 인증 시스템으로 전환할 때, 비밀번호 해시 방식 차이로 인한 문제가 발생한다. 기존 인증은 Lucia 기반이었다.

**대응: OAuth Provider ID 기반 자동 연결**:

```mermaid
flowchart TD
    subgraph Strategy["전략"]
        S1["1. ETL 시 users 테이블에 직접 INSERT (kakao_id, naver_id 포함)"]
        S2["2. 사용자가 카카오/네이버 소셜 로그인 시 kakao_id/naver_id로 자동 매칭"]
        S3["3. 매칭 성공 → 세션 발급 + 로그인 완료"]
        S4["4. 매칭 실패 → 신규 가입 플로우"]
        S1 --> S2 --> S3
        S2 --> S4
    end
    subgraph Login["구현: /login 페이지"]
        L1["카카오/네이버 로그인 클릭"]
        L2["OAuth 콜백에서 Provider User ID 수신"]
        L3["users.kakao_id 또는 users.naver_id 검색"]
        L4A["있으면 → 기존 사용자 세션 생성"]
        L4B["없으면 → 이메일 매칭 시도 → 신규 가입"]
        L1 --> L2 --> L3
        L3 --> L4A
        L3 --> L4B
    end
    Strategy --> Login
```

**Supabase Auth 불필요 이유**:
- `supabaseAdmin.auth.admin.createUser()` 호출 제거
- `auth.users` 테이블 불필요 → self-managed `users` 테이블
- OAuth Provider ID를 직접 컬럼으로 관리 (kakao_id, naver_id)
- 세션 관리는 iron-session 또는 JWT 직접 발급

### 13.6 마이그레이션 중단 시 재개 가능성

**위험**: 50,000건 이관 중 오류로 중단되면 처음부터 다시 해야 할 수 있다.

**대응**:
- ETL 스크립트에 체크포인트 파일 저장 (`migration-checkpoint.json`)
- 이미 이관된 레코드는 `INSERT ... ON CONFLICT DO NOTHING`으로 중복 삽입 방지
- 재실행 시 체크포인트 이후부터 재개

```typescript
// scripts/migration/checkpoint.ts
interface Checkpoint {
  lastCompletedTable: string
  lastProcessedId: number
  startedAt: string
  totalProcessed: number
}

export async function saveCheckpoint(cp: Checkpoint) {
  await fs.writeFile(
    'migration-checkpoint.json',
    JSON.stringify(cp, null, 2),
  )
}

export async function loadCheckpoint(): Promise<Checkpoint | null> {
  try {
    const data = await fs.readFile('migration-checkpoint.json', 'utf-8')
    return JSON.parse(data)
  } catch {
    return null
  }
}
```

### 13.7 AWS RDS 접근 보안

**위험**: 마이그레이션 작업 중 RDS 인스턴스가 외부에 노출될 수 있다.

**대응**:
1. RDS는 반드시 Private Subnet에 배치 (Publicly Accessible = No)
2. 마이그레이션 작업은 Bastion Host 경유 SSH 터널만 허용
3. Bastion Host SG는 개발자 IP만 허용 (CIDR /32)
4. 작업 완료 후 Bastion Host 중지 또는 종료
5. RDS 연결 로그 CloudWatch 모니터링

### 13.8 Bettermode API Rate Limit

**위험**: Bettermode GraphQL API에서 대량 데이터 추출 시 Rate Limit에 걸릴 수 있다.

**대응**:
- 요청 간 500ms 딜레이 적용
- 429 응답 시 Exponential Backoff (1s, 2s, 4s, 8s)
- 페이지당 50건 제한 (API 최대값)
- 전체 추출은 야간(KST 02:00~06:00)에 실행

### 13.9 위험도 매트릭스 종합

| 위험 | 영향도 | 발생 확률 | 대응 전략 |
|------|--------|---------|---------|
| 전화번호 기반 VOD 권한 깨짐 | Critical | High | userId 기반 재구현 필수 |
| 결제 금액 불일치 | Critical | Low | V-03 검증 쿼리 필수 실행 |
| 0원 결제 상태 오류 | Critical | Low | V-12 검증 후 이관 |
| Airtable sync 충돌 | High | Medium | Phase 0 전 HighTouch 중단 |
| OAuth Provider ID 매핑 누락 | High | Medium | Account 테이블 사전 검증 |
| Study-Cohort 매핑 실패 | Medium | Low | 사전 검증 쿼리 |
| 이메일 중복 사용자 | Medium | Low | V-09 검증 + 수동 병합 |
| BM ID 매핑 불가 | Medium | Medium | NULL 처리 + 익명 게시글 |
| BM API Rate Limit | Medium | High | Backoff + 야간 실행 |
| R2 → S3 URL 미변환 | Low | Low | V-25 잔존 URL 검증 |
| ETL 중단 후 재개 | Low | Medium | 체크포인트 + ON CONFLICT |
| RDS 외부 노출 | Critical | Low | Private Subnet + Bastion |

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | 2026-03-06 | 초기 작성 - Airtable 9테이블 + PostgreSQL 전체 마이그레이션 설계 (Supabase 타겟) | Migration Planner (Claude) |
| 2.0 | 2026-03-07 | Supabase → AWS RDS PostgreSQL 타겟 변경, Bettermode/R2/Upstash 마이그레이션 추가, OAuth Provider ID 매핑, Drizzle Kit ORM, VPC/SG 구성 | Migration Planner (Claude) |
