# Renewal-10: 인프라/배포 설계서

> Vercel + AWS 기반 GPTers 리뉴얼 인프라 전체 설계

| 항목 | 내용 |
|------|------|
| Feature | GPTers Portal Renewal Infrastructure |
| Version | v2.0 |
| Date | 2026-03-07 |
| Status | Design |
| Author | DevOps Architect Agent |
| 선행 문서 | [Plan Plus](../01-plan/gpters-renewal-plan-plus.md), [RE-05 인프라 역설계](./04-RE-05-infrastructure.design.md) |
| 변경 사유 | Plan Plus v1.0에서는 Supabase를 권장했으나, 확장성/운영 통제/Vendor Lock-in 탈피를 위해 AWS Self-Build로 최종 결정 |

---

## 목차

1. [Vercel 배포 구성](#1-vercel-배포-구성)
2. [AWS 인프라 구성](#2-aws-인프라-구성)
3. [VPC 네트워크 설계](#3-vpc-네트워크-설계)
4. [CI/CD 파이프라인](#4-cicd-파이프라인)
5. [환경 구성](#5-환경-구성)
6. [도메인 전략](#6-도메인-전략)
7. [Blue/Green + Canary 배포](#7-bluegreen--canary-배포)
8. [모니터링 스택](#8-모니터링-스택)
9. [CF Workers 8개 흡수 계획](#9-cf-workers-8개-흡수-계획)
10. [비용 산정](#10-비용-산정)
11. [백업 전략](#11-백업-전략)
12. [로컬 개발 환경](#12-로컬-개발-환경)

---

## 1. Vercel 배포 구성

### 1.1 프로젝트 설정

| 항목 | 값 |
|------|-----|
| **Framework** | Next.js |
| **Build Command** | `next build` |
| **Output Directory** | `.next` |
| **Install Command** | `pnpm install` |
| **Node.js Version** | 20.x |
| **Plan** | Pro ($20/월) |
| **Region** | `icn1` (서울) |
| **Root Directory** | `./` (monorepo root) |
| **Secure Compute** | 활성화 (VPC Peering with AWS) |

### 1.2 빌드 구성

레거시는 Turborepo 기반 monorepo이나, 리뉴얼은 단일 Next.js 앱으로 간소화합니다.

```
gpters-renewal/
├── app/                    # Next.js App Router
├── components/             # UI 컴포넌트
├── lib/
│   ├── db/                 # Drizzle ORM 클라이언트
│   ├── redis/              # Redis 클라이언트 (ioredis)
│   ├── s3/                 # AWS S3 클라이언트
│   ├── queries/            # Server Component 쿼리
│   └── hooks/              # Client Component 훅
├── drizzle/
│   ├── schema/             # Drizzle 스키마 정의
│   └── migrations/         # 마이그레이션 파일
├── public/
├── next.config.ts
├── drizzle.config.ts
├── package.json
└── vercel.json
```

**vercel.json 설정:**

```json
{
  "framework": "nextjs",
  "buildCommand": "next build",
  "crons": [
    { "path": "/api/cron/vbank-expired", "schedule": "* * * * *" },
    { "path": "/api/cron/update-status", "schedule": "0 * * * *" },
    { "path": "/api/cron/sync-newsletter", "schedule": "0 3 * * *" },
    { "path": "/api/cron/sitemap-generate", "schedule": "0 9 * * *" },
    { "path": "/api/cron/payment-consistency", "schedule": "0 0 * * *" },
    { "path": "/api/cron/integrity-check", "schedule": "0 18 * * 0" },
    { "path": "/api/cron/auto-reject-posts", "schedule": "0 * * * *" }
  ],
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        { "key": "Access-Control-Allow-Origin", "value": "https://gpters.org" },
        { "key": "Access-Control-Allow-Methods", "value": "GET,POST,PUT,DELETE,OPTIONS" },
        { "key": "Access-Control-Allow-Headers", "value": "Content-Type, Authorization" },
        { "key": "Access-Control-Allow-Credentials", "value": "true" }
      ]
    },
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
        { "key": "Strict-Transport-Security", "value": "max-age=63072000; includeSubDomains; preload" },
        { "key": "Content-Security-Policy", "value": "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.channel.io https://t1.kakaocdn.net; style-src 'self' 'unsafe-inline'; img-src 'self' data: https: blob:; connect-src 'self' https://*.amazonaws.com https://*.portone.io https://api.stibee.com; frame-src https://www.youtube.com https://*.portone.io;" }
      ]
    }
  ]
}
```

### 1.3 환경 변수 목록

#### 서버 환경 변수 (Vercel Environment Variables)

| # | 변수명 | 카테고리 | 환경 |
|---|--------|---------|------|
| **AWS Database** | | | |
| 1 | `DATABASE_URL` | DB (Pooled) | All |
| 2 | `DATABASE_URL_DIRECT` | DB (Direct, 마이그레이션) | All |
| 3 | `AWS_REGION` | AWS | All |
| **AWS Redis** | | | |
| 4 | `REDIS_URL` | Cache | All |
| **AWS S3** | | | |
| 5 | `AWS_S3_BUCKET_UPLOADS` | Storage | All |
| 6 | `AWS_S3_BUCKET_CERTIFICATES` | Storage | All |
| 7 | `AWS_S3_BUCKET_VOD_THUMBNAILS` | Storage | All |
| 8 | `AWS_CLOUDFRONT_DOMAIN` | CDN | All |
| **인증** | | | |
| 9 | `KAKAO_CLIENT_ID` | Auth | All |
| 10 | `KAKAO_CLIENT_SECRET` | Auth | All |
| 11 | `NAVER_CLIENT_ID` | Auth | All |
| 12 | `NAVER_CLIENT_SECRET` | Auth | All |
| 13 | `AUTH_SECRET` | Auth (NextAuth.js) | All |
| **결제 (PortOne)** | | | |
| 14 | `PAYMENT_REST_KEY` | Payment | All |
| 15 | `PAYMENT_SECRET_KEY` | Payment | All |
| 16 | `EXCHANGE_RATE_API_KEY` | Payment | All |
| **알림** | | | |
| 17 | `SOLAPI_API_KEY` | Notification | Production |
| 18 | `SOLAPI_API_SECRET` | Notification | Production |
| 19 | `SOLAPI_FROM` | Notification | Production |
| 20 | `SMTP_HOST` | Notification | All |
| 21 | `SMTP_PORT` | Notification | All |
| 22 | `SMTP_USER` | Notification | All |
| 23 | `SMTP_PASSWORD` | Notification | All |
| 24 | `SMTP_FROM` | Notification | All |
| 25 | `STIBEE_API_KEY` | Notification | Production |
| **분석** | | | |
| 26 | `SENTRY_DSN` | Monitoring | All |
| 27 | `SENTRY_AUTH_TOKEN` | Monitoring | All |
| **내부** | | | |
| 28 | `CRON_SECRET` | Internal | All |
| 29 | `API_ADMIN_KEY` | Internal | All |
| **n8n** | | | |
| 30 | `N8N_WEBHOOK_BASE_URL` | Automation | Production |
| 31 | `N8N_WEBHOOK_SECRET` | Automation | Production |
| **Slack 알림** | | | |
| 32 | `SPAM_SLACK_WEBHOOK_URL` | Slack | Production |
| 33 | `INTEGRITY_SLACK_WEBHOOK_URL` | Slack | Production |

#### 클라이언트 환경 변수 (NEXT_PUBLIC_)

| # | 변수명 | 카테고리 |
|---|--------|---------|
| 1 | `NEXT_PUBLIC_SITE_URL` | Config |
| 2 | `NEXT_PUBLIC_CDN_URL` | CDN (CloudFront) |
| 3 | `NEXT_PUBLIC_PAYMENT_IDENTITY` | Payment |
| 4 | `NEXT_PUBLIC_PAYMENT_TOSS_ID` | Payment |
| 5 | `NEXT_PUBLIC_PAYMENT_KAKAO_ID` | Payment |
| 6 | `NEXT_PUBLIC_PAYMENT_PAYPAL_ID` | Payment |
| 7 | `NEXT_PUBLIC_CHANNEL_IO_PLUGIN` | SaaS |

#### 제거 대상 (레거시 전용, 리뉴얼 불필요)

| 변수명 | 사유 |
|--------|------|
| `BETTERMODE_CLIENT_ID` | BM 제거 |
| `BETTERMODE_CLIENT_SECRET` | BM 제거 |
| `BETTERMODE_SIGNING_SECRET` | BM 제거 |
| `UPSTASH_REDIS_REST_URL` | AWS ElastiCache로 대체 |
| `UPSTASH_REDIS_REST_TOKEN` | AWS ElastiCache로 대체 |
| `QSTASH_TOKEN` | Next.js API Routes로 대체 |
| `QSTASH_CURRENT_SIGNING_KEY` | Next.js API Routes로 대체 |
| `QSTASH_NEXT_SIGNING_KEY` | Next.js API Routes로 대체 |
| `NEXT_PUBLIC_MIXPANEL_TOKEN` | Vercel Analytics로 대체 |
| `MIXPANEL_SECRET` | Vercel Analytics로 대체 |
| `STATSIG_SERVER_SECRET_KEY` | Vercel Edge Config로 대체 |
| `NEXT_PUBLIC_STATSIG_CLIENT_KEY` | Vercel Edge Config로 대체 |
| `CLOUDFLARE_R2_*` (5개) | AWS S3로 대체 |
| `OAUTH_JWT_*` (3개) | NextAuth.js로 대체 |
| `NEXTAUTH_SECRET` | `AUTH_SECRET`으로 변경 (NextAuth v5) |
| `DATABASE_URL` (Neon) | AWS RDS로 대체 |

### 1.4 Edge Runtime 활용 범위

| 대상 | Runtime | 이유 |
|------|---------|------|
| `middleware.ts` | Edge | NextAuth.js 세션 검증, 인증 라우트 보호 |
| ISR 페이지 (홈, 게시글, 스터디) | Edge + ISR | CDN 캐시 + 서울 Edge 서빙 |
| `/api/cron/*` | Node.js | DB 직접 접근, 긴 실행 시간 |
| `/api/webhook/*` | Node.js | PortOne 서명 검증, DB 트랜잭션 |
| `/api/og/*` | Edge | OG Image 동적 생성 (서울 Edge) |

### 1.5 Vercel 기능 활용

| 기능 | 용도 | 비고 |
|------|------|------|
| **Preview Deployments** | PR별 프리뷰 환경 | 자동 생성 |
| **Vercel Cron** | 정기 작업 (7개) | vercel.json에 정의 |
| **Edge Config** | Feature Flag | Statsig 대체 |
| **Web Analytics** | Core Web Vitals | Mixpanel 대체 |
| **Speed Insights** | 성능 모니터링 | 무료 포함 |
| **Instant Rollback** | 즉시 롤백 | 1클릭 이전 배포 복원 |
| **Skew Protection** | 배포 간 불일치 방지 | 클라이언트/서버 버전 동기화 |
| **Secure Compute** | AWS VPC 피어링 | Private Subnet 내 RDS/ElastiCache 접근 |

### 1.6 Vercel Secure Compute (VPC Peering)

Vercel의 Serverless Functions가 AWS VPC 내부 리소스(RDS, ElastiCache)에 안전하게 접근하기 위해 Secure Compute를 활성화합니다.

| 항목 | 값 |
|------|-----|
| **Vercel Region** | `icn1` (서울) |
| **AWS VPC Region** | `ap-northeast-2` (서울) |
| **Peering 방식** | Vercel Secure Compute VPC Peering |
| **접근 대상** | RDS PostgreSQL, ElastiCache Redis |
| **네트워크 경로** | Vercel Function -> VPC Peering -> Private Subnet |

```mermaid
flowchart LR
    V["Vercel Serverless\n(icn1)"] -->|"VPC Peering"| VPC["AWS VPC\n10.0.0.0/16"]
    VPC --> PS["Private Subnet\n10.0.10.0/24"]
    PS --> RDS["RDS PostgreSQL\ndb.t4g.medium"]
    PS --> EC["ElastiCache Redis\ncache.t4g.micro"]
```

---

## 2. AWS 인프라 구성

### 2.1 전체 아키텍처

```mermaid
flowchart TD
    subgraph Users["사용자"]
        U["Browser / Mobile"]
    end

    subgraph Vercel["Vercel (Next.js Hosting)"]
        VF["Serverless Functions"]
        VE["Edge Network (CDN)"]
        VC["Vercel Cron Jobs"]
    end

    subgraph AWS["AWS ap-northeast-2 (Seoul)"]
        subgraph VPC["VPC 10.0.0.0/16"]
            subgraph PubSub["Public Subnets"]
                NAT["NAT Gateway"]
            end
            subgraph PrivSub["Private Subnets"]
                RDS["RDS PostgreSQL\ndb.t4g.medium\nMulti-AZ"]
                PROXY["RDS Proxy\nConnection Pooling"]
                REDIS["ElastiCache Redis\ncache.t4g.micro\nCluster Mode"]
            end
        end
        S3["S3 Buckets\nuploads / certificates\nvod-thumbnails"]
        CF["CloudFront CDN"]
        CW["CloudWatch\nMonitoring & Alarms"]
    end

    U --> VE
    VE --> VF
    VF -->|"VPC Peering"| PROXY
    PROXY --> RDS
    VF -->|"VPC Peering"| REDIS
    VF --> S3
    S3 --> CF --> U
    VC --> VF
    RDS --> CW
    REDIS --> CW
```

### 2.2 AWS RDS PostgreSQL

| 항목 | 값 |
|------|-----|
| **Engine** | PostgreSQL 16 |
| **Instance Class** | `db.t4g.medium` (2 vCPU, 4 GiB RAM) |
| **Storage** | gp3, 20 GiB (자동 확장 활성화, 최대 100 GiB) |
| **Multi-AZ** | 활성화 (고가용성) |
| **Region** | `ap-northeast-2` (서울) |
| **AZ** | `ap-northeast-2a` (Primary), `ap-northeast-2c` (Standby) |
| **Encryption** | AES-256 (AWS KMS 관리형 키) |
| **Performance Insights** | 활성화 (7일 무료 보관) |
| **Enhanced Monitoring** | 활성화 (60초 간격) |
| **Parameter Group** | 커스텀 (`gpters-pg16-params`) |
| **Auto Minor Version Upgrade** | 활성화 |
| **Maintenance Window** | 일요일 19:00-20:00 KST (10:00-11:00 UTC) |
| **Deletion Protection** | 활성화 |

**커스텀 Parameter Group:**

```
shared_buffers = {DBInstanceClassMemory/4}  # 1 GiB
effective_cache_size = {DBInstanceClassMemory*3/4}  # 3 GiB
work_mem = 16MB
maintenance_work_mem = 256MB
max_connections = 200
log_min_duration_statement = 1000  # 1초 이상 쿼리 로깅
timezone = 'Asia/Seoul'
```

### 2.3 RDS Proxy (Connection Pooling)

Vercel Serverless Functions는 요청마다 새로운 연결을 생성하므로, RDS Proxy로 연결 풀링을 처리합니다.

| 항목 | 값 |
|------|-----|
| **Engine Compatibility** | PostgreSQL |
| **Target** | RDS PostgreSQL 인스턴스 |
| **IAM Authentication** | 활성화 |
| **Idle Client Timeout** | 1800초 (30분) |
| **Max Connections (%)** | 80% (RDS max_connections의 80%) |
| **Connection Borrow Timeout** | 120초 |
| **Endpoint** | `gpters-proxy.proxy-xxxx.ap-northeast-2.rds.amazonaws.com` |

**Drizzle ORM 연결 설정:**

```typescript
// lib/db/index.ts
import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from '@/drizzle/schema'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // RDS Proxy endpoint
  max: 1,         // Serverless: 함수당 1개 연결
  idleTimeoutMillis: 10000,
  connectionTimeoutMillis: 5000,
  ssl: { rejectUnauthorized: true },
})

export const db = drizzle(pool, { schema })
```

**마이그레이션용 직접 연결:**

```typescript
// drizzle.config.ts
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './drizzle/schema/index.ts',
  out: './drizzle/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL_DIRECT!, // RDS 직접 endpoint (Proxy 우회)
  },
})
```

### 2.4 AWS ElastiCache Redis

| 항목 | 값 |
|------|-----|
| **Engine** | Redis 7.x (OSS) |
| **Node Type** | `cache.t4g.micro` (2 vCPU, 0.5 GiB) |
| **Cluster Mode** | 비활성화 (단일 노드, 초기) |
| **Replicas** | 0 (초기, 확장 시 1 추가) |
| **Encryption at Rest** | 활성화 (AWS KMS) |
| **Encryption in Transit** | 활성화 (TLS) |
| **Auth Token** | 활성화 |
| **Subnet Group** | `gpters-redis-subnet` (Private Subnets) |
| **Parameter Group** | 기본 `default.redis7` |
| **Maintenance Window** | 일요일 20:00-21:00 KST (11:00-12:00 UTC) |
| **Snapshot Retention** | 3일 |
| **Snapshot Window** | 18:00-19:00 KST (09:00-10:00 UTC) |

**Redis 용도:**

| 용도 | Key Pattern | TTL | 설명 |
|------|-------------|-----|------|
| **세션 스토어** | `session:{sessionId}` | 7일 | NextAuth.js 세션 저장 |
| **페이지 캐시** | `cache:page:{path}` | 5분~1시간 | ISR 보조 캐시 |
| **DB 쿼리 캐시** | `cache:query:{hash}` | 1분~10분 | 자주 조회되는 데이터 |
| **Rate Limiting** | `ratelimit:{ip}:{endpoint}` | 1분 | API 속도 제한 |
| **임시 데이터** | `temp:{purpose}:{id}` | 가변 | 결제 상태, OTP 등 |

**Redis 클라이언트 설정:**

```typescript
// lib/redis/index.ts
import Redis from 'ioredis'

export const redis = new Redis(process.env.REDIS_URL!, {
  tls: { rejectUnauthorized: true },
  maxRetriesPerRequest: 3,
  retryStrategy(times) {
    const delay = Math.min(times * 50, 2000)
    return delay
  },
  lazyConnect: true, // Serverless 최적화
})

// 캐시 헬퍼
export async function cached<T>(
  key: string,
  ttlSeconds: number,
  fetcher: () => Promise<T>
): Promise<T> {
  const cached = await redis.get(key)
  if (cached) return JSON.parse(cached)

  const data = await fetcher()
  await redis.setex(key, ttlSeconds, JSON.stringify(data))
  return data
}
```

### 2.5 AWS S3 + CloudFront

#### S3 Buckets

| Bucket | 접근 | 용도 | 파일 크기 제한 | Lifecycle |
|--------|------|------|---------------|-----------|
| `gpters-uploads` | CloudFront OAC | 게시글/프로필 이미지 | 10MB | 임시 파일 7일 후 삭제 |
| `gpters-certificates` | CloudFront OAC | 수료증 PDF | 5MB | 없음 (영구 보관) |
| `gpters-vod-thumbnails` | CloudFront OAC | VOD 썸네일 | 2MB | 없음 |

**S3 Bucket 정책 (OAC):**

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowCloudFrontOAC",
      "Effect": "Allow",
      "Principal": {
        "Service": "cloudfront.amazonaws.com"
      },
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::gpters-uploads/*",
      "Condition": {
        "StringEquals": {
          "AWS:SourceArn": "arn:aws:cloudfront::ACCOUNT_ID:distribution/DISTRIBUTION_ID"
        }
      }
    }
  ]
}
```

**S3 업로드 (Presigned URL):**

```typescript
// lib/s3/upload.ts
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const s3 = new S3Client({ region: process.env.AWS_REGION })

export async function createPresignedUploadUrl(
  bucket: string,
  key: string,
  contentType: string,
  maxSizeBytes: number = 10 * 1024 * 1024
) {
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    ContentType: contentType,
    ContentLength: maxSizeBytes,
  })

  return getSignedUrl(s3, command, { expiresIn: 600 }) // 10분
}
```

#### CloudFront Distribution

| 항목 | 값 |
|------|-----|
| **Distribution** | 1개 (멀티 Origin) |
| **Price Class** | `PriceClass_200` (아시아/북미/유럽) |
| **Origin Access** | OAC (Origin Access Control) |
| **Cache Policy** | `CachingOptimized` (이미지/정적 파일) |
| **Response Headers** | CORS 허용, Security Headers |
| **WAF** | 비활성화 (초기, 필요 시 추가) |
| **도메인** | `cdn.gpters.org` (Custom CNAME) |
| **인증서** | ACM (us-east-1) 발급 |

**CloudFront Origins:**

| Origin | Path Pattern | S3 Bucket | Cache |
|--------|-------------|-----------|-------|
| `uploads` | `/uploads/*` | `gpters-uploads` | 30일 |
| `certificates` | `/certificates/*` | `gpters-certificates` | 30일 |
| `thumbnails` | `/thumbnails/*` | `gpters-vod-thumbnails` | 30일 |

### 2.6 비동기 작업 처리 (API Routes 대체)

레거시의 QStash 비동기 작업은 Next.js API Routes + `after()` API로 대체합니다.

| # | 작업 | 트리거 | 리뉴얼 구현 | 레거시 대응 |
|---|------|--------|------------|------------|
| 1 | 게시글 스팸 분석 | 게시글 생성 후 | API Route `/api/internal/analyze-post` | QStash `analyze-post` |
| 2 | 알림 발송 | 게시글 승인 후 | API Route `/api/internal/send-notification` | slack-app sendMessages() |
| 3 | 결제 후처리 | n8n 호출 | API Route `/api/internal/payment-callback` | n8n `afterPaymentCheckEmail` |
| 4 | 수료증 생성 | Admin 호출 | API Route `/api/internal/generate-certificate` | 신규 |
| 5 | 뉴스레터 동기화 | Cron (매일 03:00) | Vercel Cron `/api/cron/sync-newsletter` | Vercel Cron |

**비동기 호출 패턴 (fire-and-forget):**

```typescript
// lib/queue/enqueue.ts
export async function enqueueTask(endpoint: string, payload: Record<string, unknown>) {
  const url = `${process.env.NEXT_PUBLIC_SITE_URL}${endpoint}`

  await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.CRON_SECRET}`,
    },
    body: JSON.stringify(payload),
  })
}

// 사용 예시 (게시글 생성 후)
import { after } from 'next/server'

export async function POST(request: Request) {
  const post = await createPost(data)

  // 응답 후 비동기 실행 (Next.js 15 after API)
  after(async () => {
    await enqueueTask('/api/internal/analyze-post', { postId: post.id })
  })

  return Response.json(post)
}
```

---

## 3. VPC 네트워크 설계

### 3.1 VPC 구조

```mermaid
flowchart TD
    subgraph VPC["VPC: 10.0.0.0/16 (gpters-vpc)"]
        subgraph AZ_A["AZ: ap-northeast-2a"]
            PUB_A["Public Subnet\n10.0.1.0/24"]
            PRIV_A["Private Subnet\n10.0.10.0/24"]
        end
        subgraph AZ_C["AZ: ap-northeast-2c"]
            PUB_C["Public Subnet\n10.0.2.0/24"]
            PRIV_C["Private Subnet\n10.0.20.0/24"]
        end

        IGW["Internet Gateway"]
        NAT["NAT Gateway\n(AZ-A에 배치)"]
        VPCE["VPC Endpoint\n(S3 Gateway)"]

        IGW --> PUB_A
        IGW --> PUB_C
        PUB_A --> NAT
        NAT --> PRIV_A
        NAT --> PRIV_C
        VPCE --> PRIV_A
        VPCE --> PRIV_C
    end
```

### 3.2 서브넷 설계

| Subnet | CIDR | AZ | 용도 | Route Table |
|--------|------|----|----|-------------|
| `gpters-pub-2a` | `10.0.1.0/24` | ap-northeast-2a | NAT Gateway | IGW |
| `gpters-pub-2c` | `10.0.2.0/24` | ap-northeast-2c | (예비) | IGW |
| `gpters-priv-2a` | `10.0.10.0/24` | ap-northeast-2a | RDS Primary, ElastiCache | NAT GW |
| `gpters-priv-2c` | `10.0.20.0/24` | ap-northeast-2c | RDS Standby (Multi-AZ) | NAT GW |

### 3.3 Security Groups

| SG Name | Inbound | Source | Port | 용도 |
|---------|---------|--------|------|------|
| `gpters-rds-sg` | PostgreSQL | `gpters-proxy-sg` | 5432 | RDS Proxy -> RDS |
| `gpters-proxy-sg` | PostgreSQL | Vercel CIDR | 5432 | Vercel -> RDS Proxy |
| `gpters-redis-sg` | Redis | Vercel CIDR | 6379 | Vercel -> ElastiCache |
| `gpters-bastion-sg` | SSH | Admin IP | 22 | 긴급 접근 (선택) |

**보안 원칙:**

- RDS, ElastiCache는 Private Subnet에만 배치 (Public 접근 불가)
- Vercel은 VPC Peering을 통해서만 접근
- 직접 DB 접근은 Bastion Host 또는 AWS Session Manager 경유
- 모든 통신은 TLS 암호화

### 3.4 VPC Endpoints

| Endpoint | Type | 서비스 | 용도 |
|----------|------|--------|------|
| `gpters-s3-endpoint` | Gateway | `com.amazonaws.ap-northeast-2.s3` | S3 접근 (NAT 우회, 비용 절감) |

### 3.5 네트워크 ACL

기본 VPC NACL을 사용하되, 추가 제한 규칙:

| Rule # | Direction | Protocol | Port | Source/Dest | Action |
|--------|-----------|----------|------|-------------|--------|
| 100 | Inbound | TCP | 5432 | 10.0.0.0/16 | Allow |
| 110 | Inbound | TCP | 6379 | 10.0.0.0/16 | Allow |
| 200 | Inbound | TCP | 443 | 0.0.0.0/0 | Allow |
| * | Inbound | All | All | 0.0.0.0/0 | Deny |
| 100 | Outbound | TCP | 443 | 0.0.0.0/0 | Allow |
| 110 | Outbound | TCP | 1024-65535 | 0.0.0.0/0 | Allow |
| * | Outbound | All | All | 0.0.0.0/0 | Deny |

---

## 4. CI/CD 파이프라인

### 4.1 전체 파이프라인

```mermaid
flowchart TD
    A["Developer Push (feature/*)"] --> B["GitHub Actions (CI)"]
    B --> B1["Lint (ESLint + Prettier)"]
    B --> B2["Type Check (tsc --noEmit)"]
    B --> B3["Unit Test (Vitest)"]
    B --> B4["Build Check (next build)"]
    B1 & B2 & B3 & B4 --> C["Pull Request"]
    C --> C1["Vercel Preview Deployment (자동)"]
    C --> C2["E2E Test (Playwright on Preview URL)"]
    C --> C3["Code Review (CodeRabbit + Human)"]
    C1 & C2 & C3 --> D["Merge to staging"]
    D --> D1["Vercel Staging Deployment (자동)"]
    D --> D2["DB Migration (Drizzle Kit -> Staging RDS)"]
    D --> D3["Smoke Test"]
    D1 & D2 & D3 --> E["Merge to main"]
    E --> E1["Vercel Production Deployment (자동)"]
    E --> E2["DB Migration (Drizzle Kit -> Prod RDS, 수동 승인)"]
    E --> E3["Post-deploy Smoke Test"]
    E --> E4["Sentry Release"]
```

### 4.2 GitHub Actions 워크플로우

#### CI 워크플로우 (`ci.yml`)

```yaml
name: CI

on:
  pull_request:
    branches: [main, staging]
  push:
    branches: [main, staging]

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

jobs:
  lint-and-typecheck:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v4
        with:
          version: 9

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'

      - run: pnpm install --frozen-lockfile

      - name: Lint
        run: pnpm lint

      - name: Type Check
        run: pnpm typecheck

  unit-test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_DB: gpters_test
          POSTGRES_USER: postgres
          POSTGRES_PASSWORD: postgres
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

      redis:
        image: redis:7-alpine
        ports:
          - 6379:6379
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v4
        with:
          version: 9

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'

      - run: pnpm install --frozen-lockfile

      - name: Run Migrations (Test DB)
        run: pnpm drizzle-kit push
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/gpters_test

      - name: Run Unit Tests
        run: pnpm vitest run --coverage
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/gpters_test
          REDIS_URL: redis://localhost:6379

      - name: Upload Coverage
        uses: actions/upload-artifact@v4
        with:
          name: coverage
          path: coverage/

  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v4
        with:
          version: 9

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'

      - run: pnpm install --frozen-lockfile

      - name: Build
        run: pnpm build
        env:
          DATABASE_URL: postgresql://placeholder:placeholder@localhost:5432/placeholder
          REDIS_URL: redis://localhost:6379
```

#### E2E 테스트 워크플로우 (`e2e.yml`)

```yaml
name: E2E Tests

on:
  deployment_status:

jobs:
  e2e:
    if: github.event.deployment_status.state == 'success'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v4
        with:
          version: 9

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'

      - run: pnpm install --frozen-lockfile

      - name: Install Playwright
        run: pnpm exec playwright install --with-deps chromium

      - name: Run E2E Tests
        run: pnpm exec playwright test
        env:
          BASE_URL: ${{ github.event.deployment_status.target_url }}
          TEST_USER_EMAIL: ${{ secrets.TEST_USER_EMAIL }}
          TEST_USER_PASSWORD: ${{ secrets.TEST_USER_PASSWORD }}

      - name: Upload Test Results
        if: failure()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: playwright-report/
```

#### DB 마이그레이션 워크플로우 (`db-migration.yml`)

```yaml
name: DB Migration

on:
  push:
    branches: [staging, main]
    paths:
      - 'drizzle/migrations/**'

jobs:
  migrate-staging:
    if: github.ref == 'refs/heads/staging'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v4
        with:
          version: 9

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'

      - run: pnpm install --frozen-lockfile

      - name: Run Drizzle Migrations (Staging)
        run: pnpm drizzle-kit migrate
        env:
          DATABASE_URL_DIRECT: ${{ secrets.STAGING_DATABASE_URL_DIRECT }}

      - name: Verify Migration
        run: pnpm drizzle-kit check
        env:
          DATABASE_URL_DIRECT: ${{ secrets.STAGING_DATABASE_URL_DIRECT }}

  migrate-production:
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    environment: production  # 수동 승인 필요
    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v4
        with:
          version: 9

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'

      - run: pnpm install --frozen-lockfile

      - name: Configure AWS Credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ap-northeast-2

      - name: Snapshot RDS Before Migration
        run: |
          TIMESTAMP=$(date +%Y%m%d-%H%M%S)
          aws rds create-db-snapshot \
            --db-instance-identifier gpters-prod \
            --db-snapshot-identifier "pre-migration-${TIMESTAMP}"
          aws rds wait db-snapshot-available \
            --db-snapshot-identifier "pre-migration-${TIMESTAMP}"

      - name: Run Drizzle Migrations (Production)
        run: pnpm drizzle-kit migrate
        env:
          DATABASE_URL_DIRECT: ${{ secrets.PROD_DATABASE_URL_DIRECT }}

      - name: Verify Migration
        run: pnpm drizzle-kit check
        env:
          DATABASE_URL_DIRECT: ${{ secrets.PROD_DATABASE_URL_DIRECT }}

      - name: Notify Slack
        if: always()
        run: |
          STATUS="${{ job.status }}"
          curl -X POST ${{ secrets.INTEGRITY_SLACK_WEBHOOK_URL }} \
            -H 'Content-Type: application/json' \
            -d "{\"text\":\"DB Migration (Prod): ${STATUS}\"}"
```

### 4.3 브랜치 전략

```mermaid
flowchart LR
    main["main"] -->|"Production"| prod["gpters.org"]
    main --> staging["staging"]
    staging -->|"Staging"| stg["staging.gpters.org"]
    staging --> f1["feature/auth-kakao"]
    staging --> f2["feature/payment-flow"]
    staging --> f3["fix/post-voting"]
    f1 -->|"Preview (자동)"| p1["Preview URL"]
    f2 -->|"Preview (자동)"| p2["Preview URL"]
    f3 -->|"Preview (자동)"| p3["Preview URL"]
```

| 브랜치 | 배포 대상 | AWS 환경 | 자동/수동 |
|--------|----------|----------|----------|
| `main` | Production | gpters-prod RDS/Redis | 자동 (merge 시), DB 마이그레이션은 수동 승인 |
| `staging` | Staging | gpters-staging RDS/Redis | 자동 (merge 시) |
| `feature/*` | Preview | Staging DB (읽기 전용 or 테스트 DB) | 자동 (PR 시) |

### 4.4 GitHub Actions Secrets

| Secret | 용도 |
|--------|------|
| `AWS_ACCESS_KEY_ID` | AWS CLI 인증 (CI/CD용 IAM User) |
| `AWS_SECRET_ACCESS_KEY` | AWS CLI 인증 |
| `STAGING_DATABASE_URL_DIRECT` | Staging RDS 직접 연결 (마이그레이션) |
| `PROD_DATABASE_URL_DIRECT` | Production RDS 직접 연결 (마이그레이션) |
| `TEST_USER_EMAIL` | E2E 테스트 사용자 |
| `TEST_USER_PASSWORD` | E2E 테스트 비밀번호 |
| `VERCEL_TOKEN` | Vercel API (선택, CLI 사용 시) |
| `SENTRY_AUTH_TOKEN` | Sentry 릴리스 |

---

## 5. 환경 구성

### 5.1 환경별 구성 매트릭스

| 항목 | dev (로컬) | staging | production |
|------|-----------|---------|------------|
| **URL** | `localhost:3000` | `staging.gpters.org` | `gpters.org` |
| **DB** | Docker PostgreSQL 16 | AWS RDS (Staging, db.t4g.micro) | AWS RDS (Production, db.t4g.medium, Multi-AZ) |
| **Connection Pool** | 직접 연결 | RDS Proxy (Staging) | RDS Proxy (Production) |
| **Cache** | Docker Redis 7 | AWS ElastiCache (Staging) | AWS ElastiCache (Production) |
| **Storage** | MinIO (S3 호환) | AWS S3 (Staging Buckets) | AWS S3 (Production Buckets) |
| **Auth** | NextAuth.js (로컬) | NextAuth.js (Staging OAuth) | NextAuth.js (Production OAuth) |
| **결제** | PortOne Sandbox | PortOne Sandbox | PortOne Production |
| **알림** | 콘솔 출력 (Mock) | 테스트 채널 | 실제 발송 |
| **Sentry** | 비활성화 | 활성화 (별도 프로젝트) | 활성화 |
| **Analytics** | 비활성화 | 비활성화 | Vercel Analytics |

### 5.2 Staging 환경

| 항목 | 설정 |
|------|------|
| **AWS RDS** | `db.t4g.micro` (비용 절감, Single-AZ) |
| **AWS ElastiCache** | `cache.t4g.micro` (단일 노드) |
| **Vercel 배포** | `staging` 브랜치 -> 자동 배포 |
| **도메인** | `staging.gpters.org` |
| **데이터** | Production 익명화 스냅샷 (주 1회 동기화) |
| **결제** | PortOne Sandbox 모드 |
| **알림** | Slack 테스트 채널로 전송 |

### 5.3 Production 환경

| 항목 | 설정 |
|------|------|
| **AWS RDS** | `db.t4g.medium` (Multi-AZ, 자동 백업 35일) |
| **AWS ElastiCache** | `cache.t4g.micro` (스냅샷 3일 보관) |
| **RDS Proxy** | 활성화 (연결 풀링 최적화) |
| **Vercel 배포** | `main` 브랜치 -> 자동 배포 |
| **도메인** | `gpters.org` |
| **결제** | PortOne Production |
| **알림** | 실제 발송 |
| **모니터링** | CloudWatch + Sentry + Vercel Analytics 전체 활성화 |

---

## 6. 도메인 전략

### 6.1 DNS 구성 (Cloudflare)

현재 DNS는 Cloudflare에서 관리됩니다. 리뉴얼 시 단계적으로 전환합니다.

**Phase 1: Shadow Mode (병렬 운영)**

| Record | Type | Value | Proxy | 비고 |
|--------|------|-------|-------|------|
| `gpters.org` | CNAME | `cname.vercel-dns.com` | OFF | 레거시 유지 |
| `www.gpters.org` | CNAME | `cname.vercel-dns.com` | ON | 레거시 (Workers 경유) |
| `renewal.gpters.org` | CNAME | `cname.vercel-dns.com` | OFF | 리뉴얼 프리뷰 |
| `staging.gpters.org` | CNAME | `cname.vercel-dns.com` | OFF | Staging |
| `cdn.gpters.org` | CNAME | `dxxxxxxx.cloudfront.net` | OFF | CloudFront CDN |

**Phase 3: 전환 완료 후**

| Record | Type | Value | Proxy | 비고 |
|--------|------|-------|-------|------|
| `gpters.org` | CNAME | `cname.vercel-dns.com` | OFF | 리뉴얼 직접 서빙 |
| `www.gpters.org` | CNAME | `cname.vercel-dns.com` | OFF | Workers 제거, Vercel 직접 |
| `cdn.gpters.org` | CNAME | `dxxxxxxx.cloudfront.net` | OFF | CloudFront CDN |
| `legacy.gpters.org` | CNAME | `cname.vercel-dns.com` | OFF | 레거시 읽기 전용 (선택) |

### 6.2 SSL/TLS 설정

| 항목 | 값 |
|------|-----|
| **인증서 (Vercel)** | Vercel 자동 발급 (Let's Encrypt) |
| **인증서 (CloudFront)** | ACM (us-east-1) 발급, `cdn.gpters.org` |
| **TLS Version** | TLS 1.2 이상 |
| **HSTS** | `max-age=63072000; includeSubDomains; preload` |
| **Redirect** | HTTP -> HTTPS (Vercel 자동) |

### 6.3 301 리다이렉트 계획

레거시 URL 구조에서 리뉴얼 URL로의 영구 리다이렉트:

```typescript
// next.config.ts - redirects
async redirects() {
  return [
    // BM 커뮤니티 게시글 -> 리뉴얼 게시글
    {
      source: '/:category/post/:slug',
      destination: '/posts/:slug',
      permanent: true,
    },
    // BM 스터디 목록
    {
      source: '/ai-study-list',
      destination: '/studies',
      permanent: true,
    },
    // BM 스터디 상세 (study_id로 리다이렉트)
    {
      source: '/study/:id',
      destination: '/studies/:id',
      permanent: true,
    },
    // BM 회원 프로필
    {
      source: '/member/:id',
      destination: '/profiles/:id',
      permanent: true,
    },
    // 레거시 카테고리 매핑 (gpters-redirect Worker 흡수)
    { source: '/language', destination: '/posts?category=research', permanent: true },
    { source: '/ai-image', destination: '/posts?category=media', permanent: true },
    { source: '/huggingface', destination: '/posts?category=research', permanent: true },
    { source: '/3rdbrain', destination: '/posts?category=ai-writing', permanent: true },
    { source: '/aimusic', destination: '/posts?category=media', permanent: true },
    { source: '/sns', destination: '/posts?category=media', permanent: true },
    // 레거시 인증 경로
    { source: '/auth/login', destination: '/login', permanent: true },
    { source: '/auth/signup', destination: '/signup', permanent: true },
  ]
}
```

### 6.4 Search Console 전환

| 단계 | 작업 | 시기 |
|------|------|------|
| 1 | `renewal.gpters.org`를 Search Console에 등록 | Shadow Mode 시작 |
| 2 | 301 리다이렉트 설정 후 Search Console URL 검사 | Canary 시작 |
| 3 | sitemap.xml 업데이트 (`/sitemap.xml` 동적 생성) | 100% 전환 시 |
| 4 | Search Console "사이트 이전" 알림 | 100% 전환 후 |
| 5 | 2주간 Google 인덱싱 모니터링 | 전환 후 |

---

## 7. Blue/Green + Canary 배포

### 7.1 전체 배포 타임라인

```mermaid
flowchart TD
    P1["Week 19: Phase 1 - Shadow Mode"]
    P1 --> P1a["renewal.gpters.org 배포"]
    P1 --> P1b["내부 테스트 (운영팀 5명 + 스터디장 10명)"]
    P1 --> P1c["기능 체크리스트 검증"]
    P1 --> P1d["성능 베이스라인 측정"]

    P1 --> P2["Week 20: Phase 2 - Canary 10%"]
    P2 --> P2a["CF Worker에서 신규 가입자 10% 라우팅"]
    P2 --> P2b["전환율, 에러율 실시간 모니터링"]
    P2 --> P2c["A/B 테스트 결과 수집"]
    P2 --> P2d["Go/No-Go 결정 (1주 후)"]

    P2 --> P3["Week 20.5: Phase 3a - Rollout 50%"]
    P3 --> P3a["트래픽 50% 전환"]
    P3 --> P3b["결제 플로우 집중 모니터링"]
    P3 --> P3c["DB 부하 확인 (CloudWatch RDS 메트릭)"]
    P3 --> P3d["3일간 관찰"]

    P3 --> P4["Week 21: Phase 3b - Rollout 100%"]
    P4 --> P4a["gpters.org DNS -> 리뉴얼 서버"]
    P4 --> P4b["레거시 -> legacy.gpters.org (읽기 전용)"]
    P4 --> P4c["Workers 순차 비활성화"]
    P4 --> P4d["CF Workers DNS 레코드 제거"]
```

### 7.2 Phase 1: Shadow Mode 상세

**배포 구성:**

```mermaid
flowchart LR
    U["사용자"] --> CF["Cloudflare DNS"] --> L["gpters.org (레거시)"]
    T["운영팀"] --> R["renewal.gpters.org (리뉴얼 / Vercel)"]
    R -->|"VPC Peering"| AWS["AWS VPC\n(RDS + Redis)"]
```

**체크리스트:**

- [ ] 모든 MVP 기능 동작 확인
- [ ] 결제 플로우 (카드/카카오페이/가상계좌) 테스트
- [ ] 로그인 (카카오/네이버/이메일) 테스트
- [ ] 게시글 CRUD + 투표 테스트
- [ ] 스터디 목록/상세/수강신청 테스트
- [ ] LMS 대시보드 테스트
- [ ] 어드민 페이지 전체 테스트
- [ ] 모바일 반응형 확인 (375px~1440px)
- [ ] Core Web Vitals: LCP < 2.5s, FID < 100ms, CLS < 0.1
- [ ] Sentry 에러 0건 (24시간)
- [ ] RDS 연결 수 안정 (CloudWatch 확인)
- [ ] Redis 캐시 히트율 > 80%

### 7.3 Phase 2: Canary 라우팅

Cloudflare Worker를 활용한 트래픽 분할:

```typescript
// workers/gpters-canary/index.ts (임시 Worker)
export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url)
    const cookie = request.headers.get('cookie') || ''

    // 이미 라우팅 결정된 사용자
    if (cookie.includes('gpters-version=renewal')) {
      return fetch(`https://renewal.gpters.org${url.pathname}${url.search}`, request)
    }
    if (cookie.includes('gpters-version=legacy')) {
      return fetch(request) // 원본으로 통과
    }

    // 신규 사용자: 10% -> 리뉴얼
    const isCanary = Math.random() < 0.10
    const response = isCanary
      ? await fetch(`https://renewal.gpters.org${url.pathname}${url.search}`, request)
      : await fetch(request)

    // 쿠키로 고정 (세션 유지)
    const newResponse = new Response(response.body, response)
    newResponse.headers.append(
      'Set-Cookie',
      `gpters-version=${isCanary ? 'renewal' : 'legacy'}; Path=/; Max-Age=604800; Secure; HttpOnly`
    )
    return newResponse
  }
}
```

**모니터링 지표:**

| 지표 | 기준 | Rollback 조건 |
|------|------|--------------|
| Error Rate | < 0.1% | > 1% |
| LCP (p75) | < 2.5s | > 4s |
| 결제 성공률 | > 99% | < 95% |
| 가입 전환율 | 기존 대비 -10% 이내 | -30% 이하 |
| API 응답 시간 (p95) | < 500ms | > 2s |
| RDS CPU 사용률 | < 60% | > 85% |
| Redis 메모리 사용률 | < 70% | > 90% |

### 7.4 Rollback 전략

| 수준 | 방법 | 소요 시간 |
|------|------|----------|
| **Level 1: 코드 롤백** | Vercel Instant Rollback (이전 배포) | 즉시 (< 30초) |
| **Level 2: 트래픽 롤백** | Canary Worker에서 리뉴얼 비율 0%로 | 즉시 (< 1분) |
| **Level 3: DNS 롤백** | Cloudflare DNS에서 레거시 서버로 전환 | 5분 이내 (TTL=300) |
| **Level 4: DB 롤백** | RDS 스냅샷 복원 (마이그레이션 전 자동 스냅샷) | 30분 ~ 1시간 |

**Rollback 판단 기준 (자동):**

```yaml
# CloudWatch Alarms + Slack 알림
- 연속 3회 헬스체크 실패 -> Level 1 롤백 알림
- 결제 에러율 1% 초과 (10분 window) -> Level 2 즉시 실행
- Sentry 동일 에러 50건/분 -> Level 1 롤백 알림
- RDS CPU > 90% (5분 지속) -> Level 2 트래픽 감소
```

---

## 8. 모니터링 스택

### 8.1 모니터링 아키텍처

```mermaid
flowchart TD
    subgraph Stack["모니터링 스택"]
        direction LR
        subgraph WV["Web Vitals"]
            WV1["Vercel Analytics (Pro 포함)"]
            WV2["LCP, FID, CLS, TTFB"]
            WV3["페이지별 / 실시간"]
        end
        subgraph ET["Error Tracking"]
            ET1["Sentry Free (5K/월)"]
            ET2["Exception, Stack Trace"]
            ET3["Source Map / 릴리스별"]
        end
        subgraph LG["Logging"]
            LG1["Axiom Free (500MB/월)"]
            LG2["API Logs, Cron Logs"]
            LG3["구조화 JSON 로그"]
        end
        subgraph UP["Uptime"]
            UP1["UptimeRobot Free (50개 모니터)"]
            UP2["HTTP 200, SSL Cert"]
            UP3["5분 간격 / Slack 알림"]
        end
    end

    Stack --> CW["AWS CloudWatch\n(RDS 메트릭, Redis 메트릭,\nS3 사용량, VPC Flow Logs)"]
```

### 8.2 AWS CloudWatch 구성

#### CloudWatch Dashboards

**Dashboard: `gpters-infra-overview`**

| Widget | 메트릭 | 기간 |
|--------|--------|------|
| RDS CPU Utilization | `AWS/RDS CPUUtilization` | 실시간 |
| RDS DB Connections | `AWS/RDS DatabaseConnections` | 실시간 |
| RDS Free Storage | `AWS/RDS FreeStorageSpace` | 일간 |
| RDS Read/Write IOPS | `AWS/RDS ReadIOPS, WriteIOPS` | 실시간 |
| RDS Read/Write Latency | `AWS/RDS ReadLatency, WriteLatency` | 실시간 |
| Redis CPU | `AWS/ElastiCache CPUUtilization` | 실시간 |
| Redis Memory | `AWS/ElastiCache DatabaseMemoryUsagePercentage` | 실시간 |
| Redis Cache Hits/Misses | `AWS/ElastiCache CacheHits, CacheMisses` | 실시간 |
| S3 Bucket Size | `AWS/S3 BucketSizeBytes` | 일간 |
| S3 Number of Objects | `AWS/S3 NumberOfObjects` | 일간 |
| CloudFront Requests | `AWS/CloudFront Requests` | 실시간 |
| CloudFront Error Rate | `AWS/CloudFront 4xxErrorRate, 5xxErrorRate` | 실시간 |

#### CloudWatch Alarms

| Alarm | 메트릭 | 조건 | 액션 |
|-------|--------|------|------|
| `rds-cpu-high` | CPUUtilization | > 80% (5분) | SNS -> Slack |
| `rds-connections-high` | DatabaseConnections | > 150 (5분) | SNS -> Slack |
| `rds-storage-low` | FreeStorageSpace | < 5 GiB | SNS -> Slack + Email |
| `rds-read-latency` | ReadLatency | > 20ms (5분) | SNS -> Slack |
| `redis-cpu-high` | CPUUtilization | > 70% (5분) | SNS -> Slack |
| `redis-memory-high` | DatabaseMemoryUsagePercentage | > 80% | SNS -> Slack |
| `redis-evictions` | Evictions | > 0 (5분) | SNS -> Slack |
| `cloudfront-5xx` | 5xxErrorRate | > 1% (5분) | SNS -> Slack |

**SNS Topic 설정:**

```
Topic: gpters-alerts
Subscriptions:
  - Slack Webhook (Lambda -> Slack #gpters-alerts)
  - Email (ops@gpters.org) - Critical만
```

### 8.3 Vercel Analytics (Web Vitals)

| 항목 | 값 |
|------|-----|
| **Plan** | Pro 포함 (추가 비용 없음) |
| **측정 항목** | LCP, FID, CLS, TTFB, INP |
| **기능** | 페이지별 성능, 실시간 대시보드, 경험 점수 |
| **데이터 보관** | 30일 |

**Speed Insights 설정:**

```typescript
// app/layout.tsx
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
```

### 8.4 Sentry Free (에러 추적)

| 항목 | 값 |
|------|-----|
| **Plan** | Developer (무료) |
| **이벤트** | 5,000건/월 |
| **릴리스 추적** | Git commit SHA 기반 |
| **Source Map** | Vercel 빌드 시 자동 업로드 |
| **터널** | `/monitoring` 경로 (광고 차단기 우회) |

**설정:**

```typescript
// sentry.client.config.ts
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.VERCEL_ENV || 'development',
  enabled: process.env.NODE_ENV === 'production',
  tracesSampleRate: 0, // 성능 모니터링 비활성화 (비용 절약)
  replaysOnErrorSampleRate: 0,
})
```

**next.config.ts Sentry 래핑:**

```typescript
import { withSentryConfig } from '@sentry/nextjs'

export default withSentryConfig(nextConfig, {
  org: 'gpters',
  project: 'gpters-renewal',
  silent: true,
  widenClientFileUpload: true,
  tunnelRoute: '/monitoring',
  hideSourceMaps: true,
  disableLogger: true,
  automaticVercelMonitors: true,
})
```

### 8.5 Axiom Free (로그)

| 항목 | 값 |
|------|-----|
| **Plan** | Free |
| **용량** | 500MB/월 |
| **보관** | 30일 |
| **연동** | Vercel Integration (Log Drain) |

**구조화 로그 포맷:**

```typescript
// lib/logger.ts
export function log(level: string, module: string, message: string, data?: Record<string, unknown>) {
  const entry = {
    level,
    module,
    message,
    timestamp: new Date().toISOString(),
    env: process.env.VERCEL_ENV,
    ...data,
  }
  console.log(JSON.stringify(entry))
}

// 사용
log('info', 'payment', 'Payment completed', { orderId, amount, userId })
log('error', 'auth', 'Login failed', { provider: 'kakao', err: error.message })
```

### 8.6 UptimeRobot Free (업타임 모니터링)

| 항목 | 값 |
|------|-----|
| **Plan** | Free |
| **모니터 수** | 최대 50개 |
| **체크 간격** | 5분 |
| **알림** | Slack Webhook |

**모니터 목록:**

| # | URL | Type | 알림 |
|---|-----|------|------|
| 1 | `https://gpters.org` | HTTP(s) | Slack |
| 2 | `https://gpters.org/api/health` | HTTP(s) | Slack |
| 3 | `https://gpters.org/studies` | Keyword ("스터디") | Slack |
| 4 | `https://staging.gpters.org` | HTTP(s) | Slack |
| 5 | `https://gpters.org/api/cron/health` | HTTP(s) | Slack |

### 8.7 알림 채널

| 심각도 | 채널 | 조건 |
|--------|------|------|
| **Critical** | Slack #gpters-alerts + SNS Email | 서비스 다운, 결제 장애, RDS 장애 |
| **Warning** | Slack #gpters-alerts | 에러율 상승, 성능 저하, DB 용량 경고 |
| **Info** | Slack #gpters-deploy | 배포 완료, Cron 실행 결과, 마이그레이션 완료 |

---

## 9. CF Workers 8개 흡수 계획

### 9.1 흡수 매트릭스

| # | Worker | 현재 역할 | 리뉴얼 대체 방안 | 시기 |
|---|--------|----------|-----------------|------|
| 1 | **gpters-speed** | BM 페이지 캐시 + URL 리라이트 (44 routes) | Next.js ISR + Vercel Edge CDN이 대체. URL 리라이트는 `next.config.ts` redirects/rewrites로 흡수. | Phase 3b (100% 전환) |
| 2 | **gpters-auth-proxy** | BM OAuth 로그인/회원가입 프록시 | NextAuth.js로 완전 대체. BM OAuth 불필요. | Phase 1 (즉시 불필요) |
| 3 | **gpters-redirect** | 카테고리 301 리다이렉트 (5개 패턴 + 정적 매핑) | `next.config.ts` redirects로 흡수. 정적 매핑은 JSON import. | Phase 3a (50% 전환) |
| 4 | **gpters-study-redirect** | `/study/{id}` -> BM 스터디 게시글 리다이렉트 | Drizzle ORM DB 직접 조회 + Next.js API Route. ISR 캐시로 대체. | Phase 3a |
| 5 | **bm-interaction-env** | BM Interaction 환경 라우팅 (KV 설정) | BM 제거로 완전 불필요. | Phase 1 (즉시 삭제) |
| 6 | **clear-auth-tokens** | BM c_access_token 쿠키 삭제 | BM 토큰 불필요. NextAuth.js signOut()으로 대체. | Phase 1 (즉시 삭제) |
| 7 | **gpters-web-url-rewrite** | `/beta/*` -> Vercel 프록시 | gpters-speed와 중복. 리뉴얼에서는 직접 서빙. | Phase 1 (즉시 삭제) |
| 8 | **mixpanel-proxy** | `pm.gpters.org` -> Mixpanel API 프록시 | Vercel Analytics로 대체. 광고 차단기 우회는 Vercel 자체 지원. | Phase 3b |

### 9.2 Worker별 흡수 상세

#### gpters-speed (핵심, 가장 복잡)

**현재 기능 분해:**

| 기능 | 처리 방식 | 리뉴얼 대체 |
|------|----------|------------|
| HTTP->HTTPS 리다이렉트 | Worker 301 | Vercel 자동 처리 |
| 중복 URL 리다이렉트 | `redirect-map.json` 기반 301 | `next.config.ts` redirects |
| URL 리라이트 (17패턴) | Worker fetch proxy | 불필요 (단일 앱) |
| BM 페이지 KV 캐시 | Cloudflare KV + deflate | 불필요 (자체 페이지) |
| 인증 바이패스 | c_access_token JWT 파싱 | 불필요 (NextAuth.js) |

**전환 계획:**
1. URL 리라이트 17패턴 중 레거시 호환 필요한 것만 redirects로 전환
2. `redirect-map.json`의 정적 매핑을 Next.js redirects로 변환
3. KV Namespace `GPTERS_CACHE` 삭제

#### gpters-redirect (카테고리 매핑)

```typescript
// next.config.ts에 흡수
async redirects() {
  const staticRedirects = await import('./legacy-redirects.json')
  return [
    // 패턴 리다이렉트 (5개)
    { source: '/language', destination: '/posts?category=research', permanent: true },
    { source: '/ai-image', destination: '/posts?category=media', permanent: true },
    { source: '/huggingface', destination: '/posts?category=research', permanent: true },
    { source: '/3rdbrain', destination: '/posts?category=ai-writing', permanent: true },
    { source: '/aimusic', destination: '/posts?category=media', permanent: true },
    { source: '/sns', destination: '/posts?category=media', permanent: true },
    // 정적 리다이렉트 (JSON에서 import)
    ...staticRedirects.map(r => ({
      source: r.from,
      destination: r.to,
      permanent: true,
    })),
  ]
}
```

#### gpters-study-redirect (스터디 리다이렉트)

```typescript
// app/study/[id]/route.ts
import { db } from '@/lib/db'
import { studies } from '@/drizzle/schema'
import { eq } from 'drizzle-orm'
import { redirect } from 'next/navigation'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const study = await db.query.studies.findFirst({
    where: eq(studies.legacyStudyId, params.id),
    columns: { slug: true },
  })

  if (study) {
    redirect(`/studies/${study.slug}`)
  }
  redirect('/studies')
}
```

#### mixpanel-proxy (분석 프록시)

Vercel Analytics가 자체적으로 광고 차단기를 우회하므로 별도 프록시 불필요:
- Vercel Analytics: `/_vercel/insights/script.js` 자체 경로
- Speed Insights: `/_vercel/speed-insights/script.js` 자체 경로

### 9.3 Workers 비활성화 타임라인

```mermaid
flowchart TD
    P1["Phase 1 (Shadow Mode)"]
    P1 -->|"삭제"| P1a["bm-interaction-env"]
    P1 -->|"삭제"| P1b["clear-auth-tokens"]
    P1 -->|"삭제"| P1c["gpters-web-url-rewrite"]

    P3a["Phase 3a (50% 전환)"]
    P3a -->|"삭제"| P3a1["gpters-auth-proxy"]
    P3a -->|"전환"| P3a2["gpters-redirect -> next.config.ts"]
    P3a -->|"전환"| P3a3["gpters-study-redirect -> API Route"]

    P3b["Phase 3b (100% 전환)"]
    P3b -->|"삭제"| P3b1["gpters-speed (DNS Workers 프록시 제거)"]
    P3b -->|"삭제"| P3b2["mixpanel-proxy"]
    P3b -->|"삭제"| P3b3["KV Namespaces (GPTERS_CACHE, BM_CONFIG)"]

    P1 --> P3a --> P3b
```

### 9.4 Cloudflare 잔존 서비스

100% 전환 후에도 Cloudflare에서 유지하는 것:

| 서비스 | 유지 이유 |
|--------|----------|
| **DNS** | 도메인 관리 (Vercel CNAME + CloudFront CNAME 가리킴) |
| **SSL** | Vercel이 자체 인증서 발급하므로 CF SSL 불필요 (Proxy OFF) |

Workers, KV, R2는 전부 제거합니다.

---

## 10. 비용 산정

### 10.1 현재 (레거시) 월 비용

| 서비스 | 항목 | 월 비용 (USD) | 비고 |
|--------|------|:------------:|------|
| Vercel | Pro | $20 | 1 프로젝트 |
| Neon | Pro (추정) | $19 | PostgreSQL 호스팅 |
| Upstash | Redis + QStash | $10 | 세션/캐시/비동기 |
| Cloudflare | Workers + KV + R2 | $5 | Free tier 대부분 |
| Sentry | Developer | $0 | 무료 |
| Mixpanel | Free | $0 | 무료 |
| Statsig | Free | $0 | 무료 |
| n8n | Cloud (추정) | $20 | 자동화 |
| **합계** | | **~$74** | |

### 10.2 리뉴얼 월 비용

| 서비스 | 항목 | 월 비용 (USD) | 비고 |
|--------|------|:------------:|------|
| **Vercel** | Pro | $20 | Next.js 호스팅, Analytics, Secure Compute 포함 |
| **AWS RDS** | db.t4g.medium Multi-AZ | $40~60 | PostgreSQL, 자동 백업 35일 포함 |
| **AWS RDS Proxy** | Proxy 인스턴스 | $10~15 | 연결 풀링 |
| **AWS ElastiCache** | cache.t4g.micro | $15~25 | Redis, 스냅샷 포함 |
| **AWS S3** | 3 Buckets | $3~5 | 스토리지 + 요청 비용 |
| **AWS CloudFront** | CDN Distribution | $5~10 | 데이터 전송 + 요청 |
| **AWS VPC** | NAT Gateway | $15~25 | 시간당 + 데이터 처리 |
| **AWS CloudWatch** | 메트릭 + 알람 | $0~5 | 기본 무료, 커스텀 메트릭 소액 |
| **Sentry** | Developer | $0 | 5K events/월 무료 |
| **Axiom** | Free | $0 | 500MB/월 무료 |
| **UptimeRobot** | Free | $0 | 50 모니터 무료 |
| **Cloudflare** | DNS Only | $0 | Workers/KV/R2 제거 |
| **n8n** | Cloud | $20 | 결제 후처리 자동화 유지 |
| **합계** | | **~$128~185** | |

### 10.3 비용 비교

| 항목 | 현재 | 리뉴얼 | 차이 | 비고 |
|------|:----:|:------:|:----:|------|
| **호스팅** | $20 (Vercel) | $20 (Vercel) | $0 | |
| **DB** | $19 (Neon) | $50~75 (RDS + Proxy) | +$31~56 | Multi-AZ, 자동 백업, Connection Pooling |
| **캐시** | $10 (Upstash) | $15~25 (ElastiCache) | +$5~15 | VPC 내부, 더 낮은 지연 |
| **스토리지/CDN** | $5 (CF R2) | $8~15 (S3 + CloudFront) | +$3~10 | 글로벌 CDN, OAC 보안 |
| **네트워크** | $0 | $15~25 (NAT GW) | +$15~25 | Private Subnet 필수 비용 |
| **모니터링** | $0 | $0~5 (CloudWatch) | +$0~5 | 인프라 수준 모니터링 |
| **분석** | $0 (Mixpanel) | $0 (Vercel Analytics) | $0 | |
| **자동화** | $20 (n8n) | $20 (n8n) | $0 | |
| **합계** | **~$74** | **~$128~185** | **+$54~111** | |

### 10.4 비용 대비 가치 분석

레거시 대비 월 $54~111 추가 비용의 근거:

| 가치 | 설명 |
|------|------|
| **고가용성** | RDS Multi-AZ로 DB 장애 시 자동 페일오버 (SLA 99.95%) |
| **보안** | VPC Private Subnet, 암호화, RDS Proxy IAM 인증 |
| **백업 안정성** | 자동 스냅샷 35일 보관, PITR 지원 |
| **확장성** | Read Replica 추가, 인스턴스 업그레이드 용이 |
| **운영 통제** | CloudWatch 통합 모니터링, 알람 자동화 |
| **Vendor Lock-in 탈피** | Neon/Upstash SaaS 의존에서 AWS 표준 인프라로 |

### 10.5 스케일별 비용 전망

| Phase | 사용자 규모 | AWS 인프라 | Vercel | 기타 | 합계 |
|-------|:---------:|:---------:|:------:|:----:|:----:|
| **MVP** | ~4,000/기수 | ~$88~145 | $20 | $20 | **$128~185** |
| **Growth** | ~8,000 | ~$120~200 | $20 | $20 | **$160~240** |
| **Scale** | ~20,000 | ~$300~500 | $20 | $20 | **$340~540** |

**비용 최적화 전략:**

| 전략 | 절감 효과 | 시기 |
|------|----------|------|
| **Reserved Instance (RDS)** | RDS 비용 30~40% 절감 | 1년 사용 확정 후 |
| **Reserved Node (ElastiCache)** | Redis 비용 30~40% 절감 | 1년 사용 확정 후 |
| **NAT Gateway 최적화** | S3 VPC Endpoint로 S3 트래픽 NAT 우회 | 즉시 적용 |
| **ISR 캐시 극대화** | DB 쿼리 50% 이상 감소 | 설계 단계 |
| **CloudFront 캐시 최적화** | S3 요청 비용 절감 | 초기 설정 |
| **Staging 축소** | Staging은 db.t4g.micro, Single-AZ | 즉시 적용 |

---

## 11. 백업 전략

### 11.1 RDS 자동 백업 (Automated Backups)

| 항목 | 값 |
|------|-----|
| **유형** | Automated Snapshot + PITR |
| **보관 기간** | 35일 |
| **백업 윈도우** | 18:00-19:00 KST (09:00-10:00 UTC) |
| **복구 방법** | 콘솔 또는 CLI에서 특정 시점 선택 -> 새 인스턴스로 복원 |
| **Multi-AZ Failover** | 자동 (Standby에서 백업, Primary 영향 없음) |

**PITR (Point-in-Time Recovery):**

- WAL (Write-Ahead Log) 기반 초 단위 복구
- 최근 35일 이내 임의 시점으로 복원 가능
- 복원 시 새 RDS 인스턴스 생성 (기존 인스턴스 영향 없음)

**사용 시나리오:**
- 잘못된 마이그레이션 실행 후 롤백
- 대량 데이터 삭제 사고 복구
- Canary 배포 실패 시 DB 상태 복원

### 11.2 RDS 수동 스냅샷 (Manual Snapshots)

```bash
# 마이그레이션 전 수동 스냅샷 생성
aws rds create-db-snapshot \
  --db-instance-identifier gpters-prod \
  --db-snapshot-identifier "pre-migration-$(date +%Y%m%d-%H%M%S)"

# 스냅샷 상태 확인
aws rds describe-db-snapshots \
  --db-snapshot-identifier "pre-migration-20260307-120000"

# 스냅샷에서 복원 (새 인스턴스)
aws rds restore-db-instance-from-db-snapshot \
  --db-instance-identifier gpters-restored \
  --db-snapshot-identifier "pre-migration-20260307-120000" \
  --db-instance-class db.t4g.medium
```

### 11.3 일일 논리 백업 (보조)

AWS RDS 자동 백업 외 추가 안전망으로 일일 논리 백업을 S3에 저장합니다.

```yaml
# .github/workflows/db-backup.yml
name: Daily DB Backup

on:
  schedule:
    - cron: '0 18 * * *'  # 매일 03:00 KST (18:00 UTC)
  workflow_dispatch:

jobs:
  backup:
    runs-on: ubuntu-latest
    steps:
      - name: Configure AWS Credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ap-northeast-2

      - name: Install PostgreSQL Client
        run: sudo apt-get install -y postgresql-client

      - name: Create Backup
        run: |
          TIMESTAMP=$(date +%Y%m%d_%H%M%S)
          PGPASSWORD=${{ secrets.RDS_DB_PASSWORD }} pg_dump \
            -h ${{ secrets.RDS_DB_HOST }} \
            -p 5432 \
            -U postgres \
            -d gpters \
            --format=custom \
            --compress=9 \
            -f "gpters_backup_${TIMESTAMP}.dump"
          echo "BACKUP_FILE=gpters_backup_${TIMESTAMP}.dump" >> $GITHUB_ENV

      - name: Upload to S3
        run: |
          aws s3 cp "${{ env.BACKUP_FILE }}" \
            "s3://gpters-backups/daily/${{ env.BACKUP_FILE }}" \
            --storage-class STANDARD_IA

      - name: Cleanup Old Backups (30일 이상)
        run: |
          CUTOFF=$(date -d '-30 days' +%Y%m%d)
          aws s3 ls s3://gpters-backups/daily/ | while read -r line; do
            FILE=$(echo "$line" | awk '{print $4}')
            FILE_DATE=$(echo "$FILE" | grep -oP '\d{8}')
            if [[ "$FILE_DATE" < "$CUTOFF" ]]; then
              aws s3 rm "s3://gpters-backups/daily/$FILE"
            fi
          done

      - name: Notify Slack
        if: failure()
        run: |
          curl -X POST ${{ secrets.INTEGRITY_SLACK_WEBHOOK_URL }} \
            -H 'Content-Type: application/json' \
            -d '{"text":"DB Backup FAILED: ${{ env.BACKUP_FILE }}"}'
```

### 11.4 S3 버전 관리 (파일 백업)

| Bucket | 버전 관리 | Lifecycle |
|--------|----------|-----------|
| `gpters-uploads` | 활성화 | 이전 버전 30일 후 삭제 |
| `gpters-certificates` | 활성화 | 이전 버전 영구 보관 |
| `gpters-vod-thumbnails` | 비활성화 | 불필요 (재생성 가능) |
| `gpters-backups` | 비활성화 | Lifecycle: 90일 후 Glacier 이동, 365일 후 삭제 |

### 11.5 ElastiCache Redis 스냅샷

| 항목 | 값 |
|------|-----|
| **자동 스냅샷** | 활성화 (매일) |
| **보관 기간** | 3일 |
| **스냅샷 윈도우** | 18:00-19:00 KST |

Redis 데이터는 캐시/세션 용도이므로 짧은 보관 기간으로 충분합니다. 데이터 유실 시 DB에서 재구축 가능.

### 11.6 백업 보관 정책 종합

| 유형 | 보관 기간 | 저장소 | 자동화 |
|------|----------|--------|--------|
| **RDS Automated Backup** | 35일 | AWS 내부 | 자동 (RDS 설정) |
| **RDS Manual Snapshot** | 영구 (삭제 전까지) | AWS 내부 | 마이그레이션 전 수동/CI |
| **pg_dump (일일)** | 30일 | S3 (`gpters-backups/daily/`) | GitHub Actions |
| **pg_dump (월간)** | 1년 | S3 (`gpters-backups/monthly/`) | GitHub Actions |
| **S3 파일 버전** | 30일 (이전 버전) | S3 Versioning | 자동 |
| **Redis 스냅샷** | 3일 | ElastiCache 내부 | 자동 |
| **마이그레이션 기록** | 영구 | Git (`drizzle/migrations/`) | 코드 관리 |

### 11.7 복구 테스트

| 테스트 | 주기 | 방법 |
|--------|------|------|
| RDS PITR 복구 | 분기 1회 | Staging에서 특정 시점 새 인스턴스로 복원 |
| RDS 스냅샷 복원 | 분기 1회 | 수동 스냅샷에서 새 인스턴스 생성, 데이터 검증 |
| pg_dump 복원 | 분기 1회 | 로컬 Docker에서 dump 파일 복원, 레코드 수 검증 |
| 마이그레이션 롤백 | 매 마이그레이션 | 롤백 SQL 실행 후 스키마 상태 확인 |

---

## 12. 로컬 개발 환경

### 12.1 Docker Compose

로컬 개발 환경은 Docker Compose로 PostgreSQL과 Redis를 실행합니다.

```yaml
# docker-compose.yml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    container_name: gpters-postgres
    ports:
      - '5432:5432'
    environment:
      POSTGRES_DB: gpters
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -U postgres']
      interval: 5s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    container_name: gpters-redis
    ports:
      - '6379:6379'
    volumes:
      - redis_data:/data
    healthcheck:
      test: ['CMD', 'redis-cli', 'ping']
      interval: 5s
      timeout: 5s
      retries: 5

  minio:
    image: minio/minio:latest
    container_name: gpters-minio
    ports:
      - '9000:9000'    # S3 API
      - '9001:9001'    # Console
    environment:
      MINIO_ROOT_USER: minioadmin
      MINIO_ROOT_PASSWORD: minioadmin
    command: server /data --console-address ":9001"
    volumes:
      - minio_data:/data

volumes:
  postgres_data:
  redis_data:
  minio_data:
```

### 12.2 로컬 개발 시작

```bash
# 1. Docker 서비스 시작
docker compose up -d

# 2. 마이그레이션 적용
pnpm drizzle-kit push

# 3. 시드 데이터 삽입
pnpm db:seed

# 4. MinIO 버킷 생성 (초기 1회)
mc alias set local http://localhost:9000 minioadmin minioadmin
mc mb local/gpters-uploads
mc mb local/gpters-certificates
mc mb local/gpters-vod-thumbnails
mc anonymous set download local/gpters-uploads

# 5. Next.js 개발 서버
pnpm dev
```

**로컬 서비스 포트:**

| 서비스 | URL | 포트 |
|--------|-----|------|
| PostgreSQL | `postgresql://postgres:postgres@localhost:5432/gpters` | 5432 |
| Redis | `redis://localhost:6379` | 6379 |
| MinIO (S3 호환) | `http://localhost:9000` | 9000 |
| MinIO Console | `http://localhost:9001` | 9001 |
| Next.js Dev | `http://localhost:3000` | 3000 |

### 12.3 `.env.local` 예시

```env
# Database (Docker PostgreSQL)
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/gpters
DATABASE_URL_DIRECT=postgresql://postgres:postgres@localhost:5432/gpters

# Redis (Docker Redis)
REDIS_URL=redis://localhost:6379

# S3 (MinIO - S3 호환)
AWS_S3_BUCKET_UPLOADS=gpters-uploads
AWS_S3_BUCKET_CERTIFICATES=gpters-certificates
AWS_S3_BUCKET_VOD_THUMBNAILS=gpters-vod-thumbnails
AWS_REGION=ap-northeast-2
AWS_ACCESS_KEY_ID=minioadmin
AWS_SECRET_ACCESS_KEY=minioadmin
S3_ENDPOINT=http://localhost:9000  # MinIO용 (프로덕션에서는 제거)

# CDN (로컬에서는 MinIO 직접)
NEXT_PUBLIC_CDN_URL=http://localhost:9000

# Auth
AUTH_SECRET=local-auth-secret-at-least-32-characters-long

# Site
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Payment (Sandbox)
NEXT_PUBLIC_PAYMENT_IDENTITY=imp_test_xxxxx
NEXT_PUBLIC_PAYMENT_TOSS_ID=toss_test_xxxxx
NEXT_PUBLIC_PAYMENT_KAKAO_ID=kakao_test_xxxxx

# Internal
CRON_SECRET=local-cron-secret
API_ADMIN_KEY=local-admin-key

# 알림 비활성화
NOTIFICATION_MOCK=true
```

---

## 부록 A: 레거시 Cron -> 리뉴얼 매핑

| 레거시 Cron | 주기 | 리뉴얼 대응 | 유지/제거 |
|-------------|------|------------|----------|
| account-check (매분) | 매분 | 제거 (BM 계정 연결 불필요) | 제거 |
| vbank-expired (매분) | 매분 | Vercel Cron `/api/cron/vbank-expired` | **유지** |
| sync-missing (10분) | 10분 | 제거 (BM 동기화 불필요) | 제거 |
| update-status (매시) | 매시 | Vercel Cron `/api/cron/update-status` | **유지** |
| sync-missing-members (매시) | 매시 | 제거 (Airtable 일몰) | 제거 |
| summarize/cron-deny (매시) | 매시 | Vercel Cron `/api/cron/auto-reject-posts` | **전환** |
| sync-newsletter (매일) | 매일 03:00 | Vercel Cron `/api/cron/sync-newsletter` | **유지** |
| sitemap/member (매일) | 매일 09:00 | Vercel Cron `/api/cron/sitemap-generate` | **전환** |
| payment-consistency (매일) | 매일 00:00 | Vercel Cron `/api/cron/payment-consistency` | **유지** |
| integrity-check (주간) | 일요일 18:00 | Vercel Cron `/api/cron/integrity-check` | **유지** |

**요약:** 10개 중 4개 유지, 3개 전환, 3개 제거 -> 리뉴얼 7개 Cron

---

## 부록 B: 전환 체크리스트

### Phase 0 (Foundation)

- [ ] AWS VPC 생성 (10.0.0.0/16, Public/Private Subnets, NAT GW)
- [ ] AWS RDS PostgreSQL 프로비저닝 (Production + Staging)
- [ ] AWS RDS Proxy 설정
- [ ] AWS ElastiCache Redis 프로비저닝
- [ ] AWS S3 Buckets 생성 (uploads, certificates, vod-thumbnails, backups)
- [ ] AWS CloudFront Distribution 생성 + ACM 인증서
- [ ] Security Groups 설정 (RDS, Redis, Vercel 접근)
- [ ] Vercel Secure Compute 활성화 + VPC Peering 설정
- [ ] CloudWatch Dashboard + Alarms 설정
- [ ] NextAuth.js 설정 (Kakao/Naver/Email)
- [ ] Drizzle ORM 스키마 정의 + 초기 마이그레이션
- [ ] Vercel 프로젝트 연결 + 환경 변수 설정
- [ ] GitHub Actions CI/CD 설정 (CI + DB Migration)
- [ ] Sentry + Axiom + UptimeRobot 연동
- [ ] Docker Compose 로컬 환경 구성

### Phase 1 (Shadow Mode)

- [ ] renewal.gpters.org 배포 확인
- [ ] CF Workers 3개 즉시 삭제 (bm-interaction-env, clear-auth-tokens, gpters-web-url-rewrite)
- [ ] 내부 테스트 체크리스트 통과
- [ ] 성능 베이스라인 측정
- [ ] CloudWatch RDS/Redis 메트릭 안정 확인

### Phase 3b (100% 전환)

- [ ] DNS 전환 (gpters.org -> Vercel 직접)
- [ ] CF Workers 전체 비활성화
- [ ] KV Namespace 삭제
- [ ] Cloudflare R2 데이터 이관 (AWS S3)
- [ ] Upstash 계정 해지
- [ ] Neon 계정 해지 (데이터 이관 완료 후)
- [ ] Mixpanel/Statsig 비활성화
- [ ] 레거시 Vercel 프로젝트 Archive
- [ ] RDS Reserved Instance 검토 (1년 약정)
- [ ] ElastiCache Reserved Node 검토

---

## 부록 C: 레거시 vs 리뉴얼 인프라 비교

| 구성 요소 | 레거시 | 리뉴얼 | 비고 |
|----------|--------|--------|------|
| **DB** | Neon PostgreSQL (SaaS) | AWS RDS PostgreSQL (Self-managed) | Multi-AZ, 35일 백업, PITR |
| **Connection Pool** | Neon Pooler | AWS RDS Proxy | IAM 인증, Serverless 최적화 |
| **캐시/세션** | Upstash Redis (REST) | AWS ElastiCache Redis (TCP) | VPC 내부, 더 낮은 지연 |
| **비동기 작업** | QStash (HTTP Queue) | Next.js API Routes + `after()` | 외부 의존성 제거 |
| **파일 스토리지** | Cloudflare R2 | AWS S3 + CloudFront CDN | OAC 보안, 글로벌 CDN |
| **인증** | Bettermode OAuth + Lucia Auth | NextAuth.js (v5) | 자체 완전 제어 |
| **커뮤니티** | Bettermode SaaS | 자체 구현 (Next.js) | Vendor Lock-in 탈피 |
| **모니터링** | 분산 (Mixpanel/Statsig/Sentry) | 통합 (CloudWatch + Sentry + Vercel) | AWS 인프라 모니터링 추가 |
| **IaC** | 없음 (대시보드 수동) | Terraform (향후) | 인프라 코드화 가능 |
| **호스팅** | Vercel | Vercel | 동일 유지 |

---

## 변경 이력

| 버전 | 날짜 | 변경 내용 |
|------|------|----------|
| v1.0 | 2026-03-06 | 초기 설계: Vercel + Supabase 기반 10개 섹션, CF Workers 8개 흡수 계획, CI/CD YAML, 비용 산정 |
| v2.0 | 2026-03-07 | 전면 개정: Supabase -> AWS 전환. RDS PostgreSQL (Multi-AZ, RDS Proxy), ElastiCache Redis, S3+CloudFront, VPC 설계 추가. Drizzle ORM 마이그레이션, Docker Compose 로컬 환경, CloudWatch 모니터링, 백업 전략 강화. Plan Plus v1.0 대비 인프라 스택 변경 사유 명시 |
