# 마이그레이션 변경 기록

작업 과정에서의 변경사항을 누적 기록합니다. `comparison.md` 정리 시 원본으로 사용됩니다.

---

## 2026-02-26 | 프로토타입 초기 구축

### 전체 구조
- AS-IS: Bettermode SaaS 위젯 기반, 카테고리 30개, 관리자 7~9단계 네비게이션
- TO-BE: Next.js 16 App Router, 6개 카테고리 + 태그, Flat 어드민 1~2단계
- 변경: 정적 목업 11개 페이지 + 2개 부가 페이지 구현 완료

### 홈 (app/page.tsx)
- AS-IS: 띠배너 + 웨비나 + 최신/인기/베스트 + 사이드바 30개 카테고리 동시 노출
- TO-BE: 공지 배너 + 인라인 글쓰기 + 투표 기반 피드 + 사이드바(커뮤니티 정보, 6개 카테고리, 모집 스터디, 규칙)
- 개선: 정보 계층 재설계, Reddit-inspired Compact 카드 도입

### 콘텐츠 탐색 (app/explore/feed)
- AS-IS: 30개 카테고리 목록, 페이지 이동, 검색 부정확, 정렬 기준 불명확
- TO-BE: 7개 탭 + 태그 필터 + 정렬(인기/최신/추천) + 난이도 필터, SPA 전환
- 개선: 탐색 뎁스 축소, 다중 필터 조합 가능

### 커뮤니티 피드 (app/community/feed)
- AS-IS: 없음 (게시판에 통합, 스터디원만 작성 가능)
- TO-BE: 독립 피드 4개 탭(피드/자유/Q&A/이벤트), 짧은 포스트 형식, 모든 회원 작성 가능
- 개선: 콘텐츠 참여 2트랙 (피드 포스트 + 사례 게시글)

### 게시글 상세 (app/posts/[slug])
- AS-IS: 가독성 나쁨, 댓글 하나씩 펼쳐야 함, 전환 유도 약함
- TO-BE: 디자인 토큰 기반 타이포, 계층형 댓글(Reddit), 스티키 투표 사이드바, CTA 박스 + 관련 스터디/글
- 개선: 가독성, 상호작용, 전환 퍼널 전면 개선

### 스터디 상세 (app/study/[slug])
- AS-IS: GNB/사이드바 유지로 구매 몰입감 없음, CTA 부족
- TO-BE: 전용 랜딩(히어로 + 5개 탭), 스티키 CTA 사이드바(가격/진행바), 모바일 고정 CTA
- 개선: 전환율 향상 위한 몰입형 레이아웃

### AI 이력서 (app/profile/[username])
- AS-IS: 이름, 사진만 있는 단순 프로필
- TO-BE: 프로필 헤더 + 관심 태그 + 외부 링크 + 뱃지 + 스탯 그리드 + 4개 탭(개요/스터디이력/작성글/뱃지) + AI 스킬맵 + 자동 요약
- 개선: "AI계의 LinkedIn" 비전 실현, 외부 공유 가능

### 검색 (app/search)
- AS-IS: 게시글만 검색, 부정확
- TO-BE: 통합 검색(게시글/스터디/사용자), 타입 필터, 섹션별 전체보기
- 개선: 검색 범위 확대 + 정확도 개선

### 어드민 대시보드 (app/admin)
- AS-IS: 7~9단계 네비게이션, 프론트 매핑 불명확, 외부 도구 의존
- TO-BE: Flat 구조 + 오늘의 요약(5개 지표) + 빠른 작업(8개) + 최근 활동 피드
- 개선: 운영 효율 극대화, 핵심 작업 1~2클릭 도달

### 게시글 관리 (app/admin/posts)
- AS-IS: 카테고리 이동 불가(삭제→재게시 필요, n8n 중복 발동)
- TO-BE: 필터(검색/카테고리/상태) + 테이블 + 체크박스 다중 선택 + 일괄 이동/삭제
- 개선: 게시글 이동 가능, 일괄 작업 지원

### 스터디 관리 (app/admin/studies)
- AS-IS: 최종제출 토글이 긴 스크롤 속에 숨어있음
- TO-BE: 테이블에서 직접 상태 드롭다운 변경 + 최종제출 토글 + 기수/상태 필터
- 개선: 인라인 편집으로 관리 효율 향상

### 내 스터디 (app/study/my)
- AS-IS: 프로필→내AI스터디→로그인→LMS 이동 = 4단계
- TO-BE: GNB 1클릭 → 이번 주 할 일 + 진행 중 스터디(주차별 진행도) + 청강 VOD + 수강 이력
- 개선: LMS 내재화, 진입 4단계→1클릭

### GNB (components/navbar.tsx)
- AS-IS: 30개 카테고리 + 기타 메뉴 동시 노출, 이모지 노이즈
- TO-BE: 4개 메뉴(탐색/스터디/커뮤니티/AI이력서) + 검색/메시지(배지)/프로필, h-14 sticky
- 개선: 네비게이션 단순화, pathname 기반 활성 표시

---

## 2026-02-27 | 디자인 시스템 정리 & Reddit 스타일 리디자인

### 색상 토큰 아키텍처
- AS-IS: 3-layer 구조 (tokens.css → palettes/gpters.css → globals.css @theme inline) — var() 참조 체인, 디버깅 어려움
- TO-BE: 1-layer 구조 (globals.css @theme에 직접 hex 값) — background(#ffffff), primary(#EF6020), muted(#f5f5f5), accent(#fff5ed), border(#e5e5e5)
- 개선: @gpters-internal/ui 임포트 제거, 색상 토큰 단순화, muted/accent 색상 오류 수정

### 홈 (app/page.tsx)
- AS-IS: 제네릭 스타트업 랜딩 (히어로 섹션 + 카드 나열)
- TO-BE: Reddit 2컬럼 피드 (공지바 + 인라인 글쓰기 + 정렬 탭 + PostCard 목록 + 사이드바)
- 개선: Reddit-inspired 레이아웃 전면 적용

### 탐색 (app/explore/feed/page.tsx)
- AS-IS: 1컬럼 레이아웃, 하드코딩 정렬 버튼
- TO-BE: 2컬럼 (피드 + CategoryList/SidebarStudyList/CommunityRules 사이드바), SortTabs 컴포넌트
- 개선: 홈과 일관된 레이아웃 패턴

### 커뮤니티 (app/community/feed/page.tsx)
- AS-IS: 1컬럼 레이아웃
- TO-BE: 2컬럼 (피드 + CommunityInfoCard/CommunityRules 사이드바)
- 개선: 홈/탐색과 일관된 레이아웃 패턴

### Navbar (components/navbar.tsx)
- AS-IS: 아이콘 클릭 시 페이지 이동만 (프로필 → /admin)
- TO-BE: 알림 드롭다운 (3개 알림 + 전체보기) + 프로필 드롭다운 (6개 메뉴 + 로그아웃) + useClickOutside
- 개선: 드롭다운으로 빠른 접근, 프로필 링크 /admin → /profile/me 수정

### Footer (components/footer.tsx)
- AS-IS: 별도 배경색 영역 + 여러 줄
- TO-BE: 배경 분리 없음, 단일 라인 중앙 정렬 (Reddit 스타일)
- 개선: 미니멀 푸터

### 공용 컴포넌트 추출 (7개 신규)
- AS-IS: 각 페이지에 하드코딩된 UI 블록
- TO-BE: components/site/에 추출 — announcement-bar, sort-tabs, community-info-card, category-list, sidebar-study-list, community-rules, feed-post
- 개선: 3개 페이지에서 재사용

### bg-background 정리
- AS-IS: ~40개 파일에 불필요한 bg-background 클래스
- TO-BE: body에만 bg-background, 나머지 제거 (input/select/sticky 등 필요한 곳만 유지)
- 개선: 중복 클래스 제거

### hero-banner.tsx 삭제
- AS-IS: 미사용 dead code
- TO-BE: 삭제
- 개선: 파일 정리

---

## 2026-02-27 | 나머지 4개 페이지 컴포넌트 추출

### 게시글 상세 (app/posts/[slug]/page.tsx)
- AS-IS: 인라인 태그, 사이드바(투표/북마크/공유), 댓글 입력, 관련 글 모두 하드코딩
- TO-BE: TagList, PostActionsSidebar, CommentInput, RelatedPostCard 4개 컴포넌트 추출
- 개선: 재사용 가능한 컴포넌트 분리

### 프로필 (app/profile/[username]/page.tsx)
- AS-IS: 탭 네비게이션, 태그, 스탯, 스킬바, 활동 피드 모두 하드코딩
- TO-BE: ui/Tabs 재사용 + TagList(pill), StatGrid, SkillBarList, ActivityList 추출
- 개선: 9개 섹션 → 5개 컴포넌트로 정리

### 검색 (app/search/page.tsx)
- AS-IS: 검색 입력, 섹션 헤더, 사용자 결과 행, 페이지네이션 하드코딩
- TO-BE: ui/Input + ui/Pagination 재사용 + SectionHeader, UserRow 추출
- 개선: 기존 UI 컴포넌트 재사용 극대화

### 메시지 (app/messages/page.tsx)
- AS-IS: 탭, 메시지/알림 리스트 아이템 하드코딩
- TO-BE: ui/Tabs + ui/Avatar 재사용 + MessageRow, NotificationRow 추출
- 개선: 11개 신규 컴포넌트 생성, 기존 5개 재사용

---

<!-- 아래에 새 변경사항을 추가합니다 -->
<!-- 형식:
## YYYY-MM-DD | 작업 제목

### 페이지/컴포넌트명
- AS-IS: 기존 상태
- TO-BE: 변경 후 상태
- 개선: 핵심 개선 포인트
-->
