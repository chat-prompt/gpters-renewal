# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AI Study LMS (Learning Management System) - An integrated platform for managing AI study participants, including notices, video replays, and assignment tracking. This platform will be embedded as an iframe in BetterMode community boards.

**Key Problem Solved**: Consolidates scattered announcements, automates weekly replay permissions, and reduces CS inquiries by 50%+ (saving 16-24 hours/month).

**현재 기수**: 20기 (2026-01-12 ~ 2026-02-09)
- API 테스트 시 `cohort=20` 사용
- `/api/cohorts`에서 `currentCohort` 값으로 확인 가능

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript 5.9, Tailwind CSS 3.4
- **UI Libraries**: `@tailwindcss/typography`, `react-markdown` + `remark-gfm`, `@dnd-kit/*` (drag-and-drop)
- **Icon Libraries**: `react-feather` (primary), `lucide-react` (supplementary)
- **Backend/Database**: Airtable (VOD recordings, cohort management, payments, notices, assignments)
- **Cache/Storage**: `@upstash/redis` (server-side caching), localStorage (client-side caching)
- **Testing**: Vitest (unit tests), Playwright (E2E tests)
- **Deployment**: Vercel (auto-deploy from GitHub)
- **Automation**: n8n (KakaoTalk notices → Airtable auto-registration)

## Development Commands

```bash
# Development
npm install              # Initial setup
npm run dev             # Start dev server (http://localhost:3000)
npm run build           # Production build
npm start               # Run production build locally
npm run lint            # Lint code

# Testing
npm test                # Run unit tests (Vitest watch mode)
npm run test:run        # Run unit tests once

# Critical: Clear cache after code changes
rm -rf .next && npm run dev

# Deployment
git add . && git commit -m "feat: description" && git push  # Auto-deploys to Vercel
npx vercel              # Manual Vercel deployment
```

## Core Architecture

### Data Sources - Airtable Tables

1. **`줌기록 VOD`** (tblLeSdOWr22vtaI4) - Video on demand recordings
2. **`기수관리`** (tblJ2uV2TyAtRV06Q) - Cohort management
3. **`확정된 스터디(건들지X)`** (tblP0bMmo1xuLnX2v) - Confirmed studies (read-only)
4. **`스터디 신청`** (tblHtC3jZO0Oscrrt) - Study applications
5. **`결제(Sync)`** (tblQNIOB0C8CXvgis) - Payment records (synced from payment provider)
6. **`게시글(Sync)`** (tbl0MRlu5YU6ALd5L) - Post records for assignment tracking
7. **`N주차관리`** (tblu1mkrh8KYX7SuU) - Week management for assignment deadlines
8. **`멤버(Sync)`** (tblAV1fM6DdHEMfWR) - Member records (synced from payment provider)
9. **`북마크`** (tbl81Y8V4LoGGyasG) - User bookmarks for posts

### API Architecture

**Unified Dashboard API Pattern (Optimized)**:
- `/api/user/dashboard` - Single endpoint combining studies + assignments data
- Eliminates duplicate payment queries (2 → 1)
- Uses parallel Airtable fetching with `Promise.all()`
- Map-based O(1) lookups instead of array.find()
- Returns combined `DashboardData` type

**Legacy APIs (Deprecated but maintained)**:
- `/api/user/studies` - User's enrolled studies
- `/api/user/assignments` - User's assignment submissions
- Kept for backward compatibility and rollback safety

**Other APIs**:
- `/api/vod?cohort=19` - VOD records by cohort
- `/api/cohorts` - Cohort information
- `/api/studies?cohort=19` - Confirmed studies
- `/api/auth/login` - Phone-based authentication
- `/api/bookmarks` - User bookmark management (GET, POST, DELETE)
- `/api/debug/payments?phone=XXX` - Payment data inspection (dev only)
- `/api/debug/bookmarks?phone=XXX` - Bookmark debugging (dev only)

### Caching System

**CacheManager** (`lib/cache.ts`):
- localStorage-based with 5-minute TTL
- Automatic expiration and cleanup
- Quota overflow handling (graceful degradation)
- 92% loading time reduction on cache hits (1800ms → 150ms)

```typescript
import { CacheManager } from '@/lib/cache'

// Generate cache key
const cacheKey = CacheManager.getCacheKey('dashboard', { phone, cohort })

// Check cache
const cached = CacheManager.get<DashboardData>(cacheKey)
if (cached) {
  // Use cached data
}

// Store in cache
CacheManager.set(cacheKey, data)

// Invalidate cache
CacheManager.remove(cacheKey)
```

### Permission Logic (Critical)

**Weekly Replay Access Rules**:
- Week 1: Public access for all users
- **User's own study**: Full access regardless of assignment submission
- **Other studies (Weeks 2-4)**: Access granted ONLY if assignment submitted for that week
- Check: Query `게시글(Sync)` table for user's phone + week match
- Non-authenticated users: Week 1 only

**Assignment Tracking**:
- Tracked via `게시글(Sync)` table with `주차인정` field ('2주차', '3주차', '4주차')
- Filter: `전화번호` match, `삭제일` empty, `bettermodePostTypeId = 'KLxSodedLeDUiTj'`, `스터디_태그명` match
- Deadlines: Calculated from `N주차관리.주차시작일` + user's `스터디_요일`
- Multiple assignments per week supported

### Authentication Flow

Phone-based simple authentication (avoids BetterMode iframe double-login):
1. User enters phone at `/login`
2. Lookup in `결제(Sync)` table (`전화번호` + `기수`)
3. Store user info in localStorage
4. Redirect to `/notice` page
5. Session persists across navigation

### Helper Libraries

**Assignment Helpers** (`lib/assignment-helpers.ts`):
- `calculateDday(deadline)` - D-day countdown calculation
- `determineCurrentWeek(weeklyAssignments)` - Current week detection
- `getWeekStatus(weekData)` - Week status and styling
- `extractWeekNumber(weekField)` - Parse week numbers
- `normalizePhone(phone)` - Phone number normalization
- `isCurrentWeek(weekData, allWeeks)` - Current week check

**Airtable Helpers** (`lib/airtable.ts`):
- `convertVodToReplay(record)` - VOD to Replay conversion
- `calculateWeekDeadline(weekStartDate, studyDay)` - Deadline calculation
- `isLateSubmission(submittedAt, deadline)` - Late submission check

## Project Structure

```
app/
├── api/
│   ├── user/
│   │   ├── dashboard/route.ts    # ⭐ Unified API (studies + assignments)
│   │   ├── studies/route.ts      # Deprecated (use dashboard)
│   │   └── assignments/route.ts  # Deprecated (use dashboard)
│   ├── posts/
│   │   └── all/route.ts          # Community posts API with filters
│   ├── vod/route.ts
│   ├── cohorts/route.ts
│   ├── studies/route.ts
│   └── auth/login/route.ts
├── assignment/page.tsx           # ⭐ Uses caching + unified API
├── posts/page.tsx                # ⭐ Community posts with study/week filters + grouping
├── replay/page.tsx
├── notice/page.tsx
├── login/page.tsx
├── page.tsx                      # Home with study list + filters
└── layout.tsx                    # Root layout with Navigation/Footer

components/
├── Navigation.tsx                # Main nav with active link highlighting
├── Header.tsx                    # Reusable page header
├── Footer.tsx
├── AuthGuard.tsx                 # Authentication wrapper
└── SummaryModal.tsx              # ⭐ Reusable slide panel for post summary (used by assignment & posts)

lib/
├── airtable.ts                   # Airtable client + helpers
├── airtable.types.ts             # TypeScript types (separate for Type Stripping)
├── cache.ts                      # ⭐ CacheManager for localStorage caching
└── assignment-helpers.ts         # ⭐ Extracted helper functions
```

## Critical Implementation Rules

### Airtable Query Pattern (CRITICAL)

**NEVER use Airtable Views** - they have hidden filters that can exclude records:

```typescript
// ❌ BAD: View may have hidden filters
const records = await base(TABLES.VOD).select({
  view: VIEWS.VOD_DEFAULT,  // This view might only show 19기!
  filterByFormula: `{기수} = "18기"`,
}).all()

// ✅ GOOD: Query full table directly
const records = await base(TABLES.VOD).select({
  filterByFormula: `{기수} = "${cohort}기"`,
  sort: [{ field: '주차', direction: 'asc' }],
}).all()
```

### Airtable Field Type Gotchas

- `기수` field: String format "19기", NOT number
- `주차인정` field: String "2주차", "3주차", "4주차" - extract with `parseInt(str.replace(/[^0-9]/g, ''), 10)`
- Lookup fields return arrays (e.g., `전화번호?: string[]`, `스터디_태그명?: string | string[]`)
- Single select fields can be arrays when linked - always handle both string and array cases
- ALWAYS verify field type in Airtable before filtering

### Airtable Link Field Filtering (CRITICAL)

**⚠️ ISSUE: Link 필드는 `FIND()` + `ARRAYJOIN()` 필터링이 작동하지 않음**

Link to another record 필드로 필터링할 때는 **클라이언트 사이드 필터링**을 사용해야 합니다:

```typescript
// ❌ BAD: filterByFormula with ARRAYJOIN - 작동하지 않음
const records = await base(TABLES.BOOKMARKS).select({
  filterByFormula: `FIND("${memberId}", ARRAYJOIN({북마크 한 사람}, ","))`,
}).all()

// ✅ GOOD: Client-side filtering - 작동함
const allRecords = await base(TABLES.BOOKMARKS).select({
  sort: [{ field: 'Created', direction: 'desc' }],
  maxRecords: 100,
}).all()

const filtered = allRecords.filter((r) => {
  const fields = r.fields as any
  const memberIds = fields['북마크 한 사람'] || []
  return memberIds.includes(memberId)  // 배열에서 직접 검색
})
```

**Why?**
- Link 필드는 배열(`["recXXXX"]`)로 저장됨
- `ARRAYJOIN()`이 예상대로 문자열을 생성하지 않음
- `FIND()`가 배열에서 제대로 검색하지 못함

**Alternative for Simple Cases:**
- Single Link 필드는 `{필드명} = "recXXXX"` 직접 비교 가능
- Multiple records Link 필드는 클라이언트 필터링 권장

### TypeScript Type Separation (CRITICAL)

Node.js Type Stripping cannot parse complex type definitions. Always separate types:

```typescript
// ❌ BAD: Types and implementation together
// lib/airtable.ts
export interface MyType { ... }
export const myFunction = () => { ... }

// ✅ GOOD: Types in separate file
// lib/airtable.types.ts
export interface MyType { ... }

// lib/airtable.ts
import type { MyType } from './airtable.types'
export type { MyType }
export const myFunction = () => { ... }
```

### Next.js Build Cache (CRITICAL)

**🚨 ALWAYS clear .next cache after code changes:**

```bash
rm -rf .next && npm run dev
```

**When cache becomes corrupted:**
- After editing files in app/ or components/
- After git operations (checkout, merge, rebase, pull)
- After npm install or package updates
- When seeing module not found errors
- When code changes don't appear in browser
- Before production builds

**Debugging strategy:**
1. See an error? → Clear `.next` first
2. Still broken? → Clear `node_modules` too
3. Still broken? → Then investigate the code

### Performance Optimization Patterns

**Use useMemo for expensive calculations:**
```typescript
const calculateDday = useMemo(() => {
  return (deadline: Date): string | null => {
    // Calculation logic
  }
}, [])

const currentWeekNumber = useMemo(() => {
  // Complex filtering logic
}, [weeklyAssignments])
```

**Cache API responses with CacheManager:**
```typescript
const cacheKey = CacheManager.getCacheKey('dashboard', { phone, cohort })
const cached = CacheManager.get(cacheKey)
if (cached) {
  // Use cached data immediately
  return
}
// Fetch from API and cache
const result = await fetch('/api/user/dashboard')
CacheManager.set(cacheKey, result.data)
```

**Page-level caching pattern (CRITICAL - 모든 데이터 로딩 페이지에 적용):**

⚠️ **IMPORTANT**: 모든 페이지에서 데이터를 불러올 때는 **반드시 CacheManager를 사용**해야 합니다. 캐싱이 없으면 탭 전환 시마다 매번 API를 호출하여 사용자 경험이 나빠집니다.

```typescript
// ❌ BAD: 캐싱 없이 매번 API 호출
useEffect(() => {
  if (!user) return

  const fetchData = async () => {
    setLoading(true)
    const response = await fetch('/api/posts/all')
    const result = await response.json()
    setPosts(result.data)
    setLoading(false)
  }

  fetchData()
}, [user])

// ✅ GOOD: CacheManager로 캐싱 (탭 전환 시 즉시 로드)
useEffect(() => {
  if (!user) return

  const fetchData = async () => {
    setLoading(true)

    // 1. 캐시 키 생성
    const cacheKey = CacheManager.getCacheKey('posts', {
      cohort: user.cohort.toString(),
      offset: '0',
      limit: '30',
    })

    // 2. 캐시 확인
    const cached = CacheManager.get<PostsData>(cacheKey)
    if (cached) {
      console.log('✅ 캐시 히트')
      setPosts(cached.data)
      setLoading(false)
      return  // 캐시 히트 시 즉시 반환
    }

    // 3. 캐시 미스 - API 호출
    console.log('📡 API 호출 (캐시 미스)')
    const response = await fetch('/api/posts/all')
    const result = await response.json()

    if (result.success) {
      setPosts(result.data)
      // 4. 캐시 저장 (5분 TTL - 기본값)
      CacheManager.set(cacheKey, result)
    }

    setLoading(false)
  }

  fetchData()
}, [user])
```

**페이지네이션 캐싱 패턴:**
```typescript
// "더보기" 버튼도 캐싱 지원
const handleLoadMore = async () => {
  const offset = posts.length

  // offset별로 별도 캐시 키 생성
  const cacheKey = CacheManager.getCacheKey('posts', {
    cohort: user.cohort.toString(),
    offset: offset.toString(),
    limit: '30',
  })

  const cached = CacheManager.get<PostsData>(cacheKey)
  if (cached) {
    setPosts(prev => [...prev, ...cached.data])
    return
  }

  const response = await fetch(`/api/posts/all?offset=${offset}`)
  const result = await response.json()

  if (result.success) {
    setPosts(prev => [...prev, ...result.data])
    CacheManager.set(cacheKey, result)
  }
}
```

**새로고침 버튼 패턴 (캐시 무효화):**
```typescript
const handleRefresh = () => {
  if (!user) return

  // 캐시 무효화
  const cacheKey = CacheManager.getCacheKey('posts', {
    cohort: user.cohort.toString(),
    offset: '0',
    limit: '30',
  })
  CacheManager.remove(cacheKey)

  // 관련 캐시도 무효화
  const bookmarkCacheKey = CacheManager.getCacheKey('bookmarks', {
    phone: user.phone,
    cohort: user.cohort.toString(),
  })
  CacheManager.remove(bookmarkCacheKey)

  console.log('🔄 캐시 무효화 완료')

  // 강제 리페칭 (user 객체 참조 변경으로 useEffect 트리거)
  setUser({ ...user })
}
```

**캐싱 적용 체크리스트:**
- [ ] 모든 데이터 페칭 useEffect에 CacheManager 적용
- [ ] 캐시 키에 모든 쿼리 파라미터 포함 (cohort, offset, limit 등)
- [ ] 페이지네이션이 있으면 offset별로 별도 캐시 키 사용
- [ ] 새로고침 버튼에 캐시 무효화 로직 추가
- [ ] 콘솔에 "캐시 히트" / "캐시 미스" 로그 출력하여 동작 확인

### Next.js 15 Dynamic Routes

In Next.js 15, dynamic route params are Promises:

```typescript
export default async function Page({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params  // Must await!
  // Use id...
}
```

### Component Architecture

**Client vs Server Components:**
- Client: Pages with useState/useEffect, event handlers, browser APIs, AuthGuard
- Server: Static content, SEO pages, data fetching
- Default to server components, use `'use client'` only when needed

**Page Pattern with AuthGuard:**
```typescript
'use client'
import Header from '@/components/Header'
import AuthGuard from '@/components/AuthGuard'

export default function MyPage() {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        <Header title="페이지 제목" description="설명" />
        <div className="max-w-[1600px] mx-auto px-4 py-8">
          {/* Content */}
        </div>
      </div>
    </AuthGuard>
  )
}
```

**Layout Width Convention (CRITICAL):**
- **ALWAYS use `max-w-[1600px]`** for main content containers
- This is the standardized maximum width across all pages
- Ensures consistent layout and prevents content from stretching too wide on large screens

```typescript
// ✅ GOOD: Standardized max-width
<div className="max-w-[1600px] mx-auto px-4 py-8">

// ❌ BAD: Using old convention
<div className="max-w-7xl mx-auto px-4 py-8">
```

**Icon Libraries Usage (CRITICAL):**

⚠️ **IMPORTANT**: This project uses TWO icon libraries. You must import from the correct library:

- **Primary Library**: `react-feather` - Use for most icons
- **Supplementary Library**: `lucide-react` - Use ONLY for icons not available in react-feather

**Icons ONLY available in `lucide-react`:**
- `Lightbulb` - NOT available in react-feather
- Other navigation icons used in Sidebar: `Home`, `Bell`, `Video`, `FileText`, `FileEdit`, `Menu`, `ChevronLeft`, `ChevronRight`, `LogOut`

**Correct import pattern:**
```typescript
// ✅ GOOD: Import most icons from react-feather
import { Video, MessageCircle, User, Calendar } from 'react-feather'

// ✅ GOOD: Import Lightbulb from lucide-react (not available in react-feather)
import { Lightbulb } from 'lucide-react'

// ❌ BAD: This will cause runtime error - Lightbulb doesn't exist in react-feather
import { Lightbulb, Video } from 'react-feather'
```

**When adding new icons:**
1. First, try importing from `react-feather`
2. If not available, check `lucide-react`
3. Never mix both libraries in the same import statement
4. Keep imports organized by library

### State Management Pattern

**Clear dependent state immediately to prevent stale data:**
```typescript
const handleCohortChange = (newCohort: string) => {
  setLoading(true)
  setReplays([])            // Clear existing data
  setSelectedVideo(null)    // Reset selection
  setSelectedWeek('all')    // Reset filters
  setCohort(newCohort)      // Trigger useEffect
}
```

## Tailwind CSS Theme

Custom brand colors (use these instead of hex values):
- `brand-main` (#FF6900), `brand-light`, `brand-dark`
- `text-primary`, `text-secondary`, `text-tertiary`
- `brand-50` (lightest), `brand-100` (hover), `brand-200`, `brand-300`
- `border-card`, `border-divider`

**Typography for Markdown:**
```typescript
<div className="prose max-w-none">
  <ReactMarkdown remarkPlugins={[remarkGfm]}>
    {markdownContent}
  </ReactMarkdown>
</div>
```

## YouTube Video Embedding

Extract video ID and create embed URL:

```typescript
const getYouTubeEmbedUrl = (url: string) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
  const match = url.match(regExp)
  if (match && match[2].length === 11) {
    return `https://www.youtube.com/embed/${match[2]}`
  }
  return url
}

// Responsive 16:9 iframe
<div className="relative w-full bg-black" style={{ paddingBottom: '56.25%' }}>
  <iframe
    src={getYouTubeEmbedUrl(videoUrl)}
    className="absolute top-0 left-0 w-full h-full"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowFullScreen
  />
</div>
```

## API Response Pattern

All API routes use consistent error handling:

```typescript
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const param = searchParams.get('param')

    const records = await fetchData(param)

    return NextResponse.json({
      success: true,
      data: records,
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Error description',
        message: error instanceof Error ? error.message : 'Unknown error',
        data: []
      },
      { status: 500 }
    )
  }
}
```

## Assignment Tracking Logic

**Deadline Calculation:**
```typescript
export function calculateWeekDeadline(
  weekStartDate: string,
  studyDay: string  // '화요일', '수요일', etc.
): Date {
  const start = new Date(weekStartDate)
  const dayMap: Record<string, number> = {
    '일요일': 0, '월요일': 1, '화요일': 2, '수요일': 3,
    '목요일': 4, '금요일': 5, '토요일': 6,
  }
  const targetDay = dayMap[studyDay]
  const currentDay = start.getDay()
  let daysToAdd = targetDay - currentDay
  if (daysToAdd < 0) daysToAdd += 7

  const deadline = new Date(start)
  deadline.setDate(deadline.getDate() + daysToAdd)
  deadline.setHours(23, 59, 59, 999)  // End of study day
  return deadline
}
```

**Data Flow:**
1. User logs in → phone + cohort stored in localStorage
2. Assignment page calls `/api/user/dashboard`
3. API fetches payment record → extract `스터디_태그명`, `스터디_요일`
4. API fetches week management → get `주차시작일`
5. API fetches posts → filter by phone, study tag, not deleted
6. API groups by `주차인정` field (extracts number from '2주차', '3주차', '4주차')
7. Frontend displays with deadline status and warnings

## Environment Variables

```bash
# .env.local (NEVER commit)
AIRTABLE_API_KEY=pattXXXXXX...
AIRTABLE_BASE_ID=appXXXXXX...
```

## Coding Style

- Functions: camelCase (`getUserData`)
- Components: PascalCase (`NoticeBoard`)
- Files: kebab-case (`notice-board.tsx`)
- Comments: Korean language
- Use TypeScript strict mode
- Prefer server components over client components

## Documentation Guidelines

**CRITICAL: API 문서는 항상 최신 상태로 유지해야 합니다.**

- API를 새로 추가하거나 변경할 때는 **반드시** `docs/API.md` 파일을 업데이트해야 합니다
- 업데이트 항목:
  - 엔드포인트 경로 및 HTTP 메서드
  - Query/Body 파라미터 (required/optional 명시)
  - 성공/실패 응답 예시
  - 구현 세부사항 (사용하는 Airtable 테이블, 필터 로직 등)
  - 사용처 (어느 페이지/컴포넌트에서 호출하는지)
- API 변경 시 영향받는 다른 API 문서도 함께 검토 및 업데이트
- 예시: `cohort` 파라미터가 optional → required로 변경되면, 실패 응답에 400 에러 케이스 추가 필요

## Planning Guidelines

**CRITICAL: 계획 문서는 프로젝트 하위 plans 폴더에 저장해야 합니다.**

- 새로운 기능이나 큰 변경사항을 구현하기 전 계획을 수립할 때는 **반드시** `plans/` 폴더에 마크다운 파일로 저장합니다
- **계획 문서 파일명 규칙**: `plans/YYYYMMDD-[기능명].md`
  - 날짜 형식: YYYYMMDD (예: 20260107)
  - 기능명: 한글 또는 영문, 간결하게 (예: 다시보기UI개선, replay-ui-improvement)
  - 예시: `plans/20260107-다시보기UI개선.md`
  - 예시: `plans/20260105-API최적화계획.md`
  - 예시: `plans/20260103-게시글페이지기획.md`
- 계획 문서 필수 포함 사항:
  - 요구사항 정리
  - API 설계 (해당되는 경우)
  - 페이지/컴포넌트 구조
  - 데이터 타입 정의
  - 구현 순서 및 체크리스트
  - 예상 문제 및 해결 방안
  - 핵심 구현 파일 목록
- 계획 수립 후 구현 전에 반드시 사용자 승인을 받습니다
- 계획이 변경되면 문서도 함께 업데이트합니다

## Git Workflow

**CRITICAL: Git 커밋과 푸시는 사용자가 명시적으로 요청할 때만 수행합니다.**

- Claude Code는 **절대로** 자동으로 커밋하거나 푸시하지 않습니다
- 사용자가 "커밋해줘", "푸시해줘", "git commit" 등을 명시적으로 요청할 때만 수행
- 코드 변경 완료 후에도 사용자 요청 없이는 커밋하지 않음
- 변경사항이 있어도 커밋을 제안하지 않고, 사용자가 원할 때까지 대기

## Git Commit Convention

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code formatting
- `refactor:` Code refactoring
- `test:` Adding tests
- `chore:` Maintenance tasks

## BetterMode iframe Embedding

Platform will be embedded as iframe in BetterMode community boards:
```html
<iframe src="https://deployed-url.vercel.app" width="100%" height="800px"></iframe>
```

Phone authentication avoids session conflicts with parent frame.

## Performance Metrics

- API response time: 500ms → 300ms (40% improvement with unified API)
- Page load (first): 1800ms → 1100ms (39% improvement)
- Page load (cached): 1800ms → 150ms (92% improvement)
- API calls per page: 2 → 1 (or 0 with cache hit)
- Airtable queries: Payment 2 → 1 (50% reduction)

## Related Documentation

- Full planning: `plans/기획.md`
- API optimization plan: `plans/api 로직 개선.md`
- API reference: `docs/API.md`
- Airtable schema: `docs/airtable-schema.md`
- Environment setup: `docs/닿_환경설정가이드_v3_20251118.md`
- Development checklist: `docs/닿_바이브코딩패키지_v3_20251118.md`
