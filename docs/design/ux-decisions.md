# UX Decision Log

디자인/UX 변경 시 "왜 이렇게 했는지"를 기록하는 의사결정 로그.

---

## 2026-02-26 | 카테고리 30개 → 8개 + 태그 이원화

- **문제**: Bettermode 시절 카테고리가 30개로, 도구별(ChatGPT, Claude), 분야별(마케팅, 코딩), 시간별(이번주 인기) 기준이 혼재되어 사용자가 어디에 글을 써야 할지 모름
- **결정**: 주제별 카테고리 8개(AI활용법, 프롬프트, 자동화, 개발/코딩, 디자인, 미디어, 비즈니스, 트렌드) + 도구/난이도는 태그로 분리
- **이유**: 분류 기준이 하나여야 사용자가 혼란 없이 탐색 가능. 도구명(ChatGPT 등)은 여러 카테고리에 걸치므로 태그가 적합
- **영향**: 탐색 카테고리 탭, 사이드바, 글쓰기 카테고리 선택 전체

## 2026-02-26 | 콘텐츠 2트랙 — 피드 포스트 + 사례 게시글

- **문제**: 기존에는 사례 게시글(긴 글) 하나만 존재하고, 스터디 참여자만 작성 가능. 가벼운 질문이나 짧은 공유를 할 곳이 없어 참여 장벽이 높음
- **결정**: 커뮤니티 피드(짧은 포스트, 트위터/Reddit 스타일) + 탐색(사례 게시글, Medium 스타일) 2트랙 운영. 모든 회원 작성 가능
- **이유**: 글쓰기 진입장벽을 낮춰야 커뮤니티가 활성화됨. 짧은 글 → 긴 글로 자연스럽게 전환되는 구조
- **영향**: `/community/feed` 신설, `/explore/feed` (사례 게시글 전용)

## 2026-02-26 | 스터디 상세: 전용 랜딩 (몰입형 레이아웃)

- **문제**: 기존 스터디 상세 페이지에서 GNB/사이드바가 그대로 유지되어 구매 몰입감이 없음. 전환율 저조 (P11)
- **결정**: GNB/사이드바 제거한 전용 랜딩 레이아웃. 히어로 + 5개 탭(소개/커리큘럼/스터디장/후기/FAQ) + 스티키 CTA 사이드바(가격, 모집 진행바)
- **이유**: 결제 전환 페이지는 이탈 요소를 최소화해야 함. 쿠팡/클래스101 등 커머스 랜딩 패턴 참고
- **영향**: `app/study/[slug]/page.tsx` (전용 레이아웃), 모바일 고정 하단 CTA

## 2026-03-04 | PostCard: Reddit compact → Medium 리스트형

- **문제**: Reddit-inspired compact 카드(투표 숫자+화살표, 한 줄 제목)로 만들었으나, 게시글이 "글"처럼 느껴지지 않음. 본문 미리보기가 없어 클릭 전까지 내용 파악 불가
- **결정**: Medium/요즘IT 스타일 리스트형으로 전환. excerpt 2줄 미리보기, 투표 UI 제거 → 좋아요(하트) 아이콘, border 카드 → divide-y 디바이더
- **이유**: GPTers는 "사례 공유" 중심 커뮤니티라 글 내용이 핵심. Reddit처럼 제목만으로 판단하는 구조보다 본문 일부를 보여주는 게 탐색에 유리. 투표 UI도 비개발자에겐 직관적이지 않음
- **영향**: `components/site/post-card.tsx`, 탐색/검색/태그/홈 전체 피드

## 2026-03-04 | 정렬 옵션 3개 → 2개 (인기/추천 차이 모호)

- **문제**: 정렬 옵션이 인기/최신/추천 3개인데, "인기"와 "추천"의 차이를 사용자에게 설명할 수 없음. 인기=투표 수 기반, 추천=알고리즘 기반이라면 프로토타입 단계에서 알고리즘이 없으므로 의미 없음
- **결정**: 인기/최신 2개로 축소. ghost 스타일 드롭다운으로 변경
- **이유**: 차이를 설명할 수 없는 옵션은 사용자를 혼란시킬 뿐. 추천 알고리즘은 데이터가 쌓인 후 추가해도 늦지 않음
- **영향**: `components/site/sort-tabs.tsx`, 탐색/태그 페이지

## 2026-03-05 | GNB: 검색바 상시 노출 + 글쓰기 전역화

- **문제**: (1) 검색이 아이콘 하나만 있어 검색바로 인식되지 않음 (2) 글쓰기 버튼이 페이지별로 분산되어 있거나 아예 없음 (3) GNB가 max-width로 제한되어 좌우 여백 낭비
- **결정**: 3-column 풀 와이드 GNB — 좌(로고+검색바 rounded-full) / 중앙(메뉴 4개) / 우(글쓰기 CTA+알림+프로필)
- **이유**: 검색과 글쓰기는 사이트 전역에서 접근 가능해야 하는 핵심 액션. Medium/Reddit 모두 GNB에 검색바를 상시 노출함. 글쓰기를 각 페이지에 두면 일관성이 없고 발견성이 떨어짐
- **영향**: `components/navbar.tsx` (전체 재구성)

## 2026-03-06 | Badge와 Tag 시각적 분리

- **문제**: Badge와 Tag가 동일한 `rounded-sm` 스타일을 사용하여 역할 구분 불가
- **결정**: Badge는 각진 형태 (cornerRadius: 0), Tag는 알약 형태 (cornerRadius: full)로 분리
- **이유**: 역할이 다른 컴포넌트는 시각적으로 즉시 구분 가능해야 함. Badge는 상태/카테고리 표시용, Tag는 콘텐츠 토픽 태그용
- **영향**: `component-library.pen`의 Badge/Tag 컴포넌트, 코드(`badge.tsx`)는 아직 미반영

## 2026-03-06 | 전체 페이지 max-width 1080px 통일

- **문제**: 페이지별로 `max-w-7xl`(1280px), `max-w-6xl`(1152px) 혼용되어 일관성 없음
- **결정**: 모든 메인 페이지 컨테이너를 `max-w-[1080px]`로 통일
- **이유**: 콘텐츠 가독성 최적화. 1280px는 사이드바 포함 시 본문이 너무 넓어짐. 1080px가 2컬럼 레이아웃에서 적절한 밀도
- **예외**: 글쓰기(`max-w-3xl`), 체크아웃(`max-w-2xl`) 등 의도적으로 좁은 페이지는 유지
- **영향**: 22개 page.tsx 파일, 23곳 변경

## 2026-03-06 | 컴포넌트 라이브러리 구조 (Source = Showcase)

- **문제**: 쇼케이스(인스턴스)와 소스 컴포넌트(원본)가 중복 표시되어 혼란
- **결정**: 소스 컴포넌트 자체를 카테고리별 쇼케이스로 사용. 인스턴스 레이어 제거
- **이유**: 중복 없이 원본 하나가 쇼케이스 역할까지 수행. 유지보수 부담 절반
- **영향**: `component-library.pen` 구조 단순화

## 2026-03-06 | 태그 페이지 간소화 — 토픽 팔로우 미구현

- **문제**: 토픽 통계에 '팔로워' 수가 표시되지만 팔로우 버튼이 없음. 팔로우 기능을 추가하면 topic_follows 테이블, 피드 필터링, 알림 등 백엔드 복잡도가 급증
- **결정**: 사이드바 전체 제거, 1컬럼으로 간소화, 통계는 게시글 수 + 이번 주 신규만 인라인 표시
- **이유**: 프로토타입 단계에서 구현 불가능한 소셜 기능을 UI에 노출하면 사용자 혼란. 팔로우는 MVP 이후 검토
- **영향**: `app/tag/[slug]/page.tsx` (사이드바 제거, Hash 아이콘 제거)

## 2026-03-09 | 내 스터디 단일 페이지 → 사이드바 + 대시보드 구조

- **문제**: `/study/my`가 8개 섹션이 수직 나열된 단일 페이지였으나, 실제 LMS(ai-study.gpters.org) 스크린샷과 비교 시 좌측 사이드바 메뉴 + 2x2 대시보드 구조를 사용함. 학습 페이지 간 이동 경로도 없음
- **결정**: admin layout.tsx 패턴 그대로 적용 — 200px 사이드바(5개 메뉴) + flex-1 콘텐츠 영역. 홈을 2x2 대시보드로 리라이트, 서브페이지(audit/history/certificates/posts)는 사이드바 하위로 이동
- **이유**: 사이드바 없는 단일 페이지는 수강생이 "이번엔 VOD 보러 가야지"처럼 목적형 진입을 못함. admin layout과 동일 패턴 재사용이 구현 비용이 낮고 일관성을 유지함
- **영향**: `app/study/my/layout.tsx` (신규), `page.tsx` (리라이트), `posts/page.tsx` (신규), `history/audit/certificates` (래퍼 제거)

## 2026-03-09 | 수강생 대시보드 2x2 그리드 — 중요도 기반 배치

- **문제**: 이번 주 할 일(ActionItemCard), 청강 VOD, 수강 이력, 리더보드, 세션, 찐친챌린지 등이 동등한 비중으로 나열되어 "오늘 뭘 해야 하나"를 파악하기 어려움
- **결정**: 시간 민감 정보를 2x2 상단에 배치 — 이번 주 세션(일정 확인) / 찐친챌린지(진행 상태) / 내 스터디 바로가기(과제/출석 stat + 퀵링크) / 활동왕 TOP10(동기부여)
- **이유**: 대시보드는 "지금 무엇이 중요한가"를 즉시 전달해야 함. 4개 카드가 2x2로 배치되면 눈이 Z패턴으로 자연스럽게 스캔됨. 수강 이력/청강 VOD 같은 아카이브성 정보는 사이드바 메뉴로 분리
- **영향**: `app/study/my/page.tsx` (grid grid-cols-1 md:grid-cols-2 gap-4 구조)

## 2026-03-10 | 배너 CRUD — Dialog 없이 인라인 편집 패턴 선택

- **문제**: 배너 추가/수정 시 Dialog(Modal)가 필요하지만, 프로젝트에 Dialog 컴포넌트가 없음. 추가 설치 vs 인라인 편집 방식 선택 필요
- **결정**: `texts/page.tsx`에서 이미 사용 중인 인라인 편집 패턴 그대로 적용 — 수정 클릭 시 해당 행의 텍스트를 Input으로 교체, 추가 폼은 목록 하단에 빈 Input 행으로 노출
- **이유**: (1) Dialog를 새로 설치하면 radix-ui/dialog 의존성 추가 + 복잡도 증가, (2) 인라인 편집은 이미 texts.tsx에서 검증된 패턴으로 일관성 유지, (3) 배너 항목 수가 적어(탭당 2~5개) 모달이 없어도 충분히 사용 가능
- **영향**: `app/admin/banners/page.tsx` (editingId/editForm/showAddForm/addForm state 패턴)

## 2026-03-11 | GNB에서 AI이력서·내스터디 제거, 이벤트 탭 추가

- **문제**: GNB에 AI이력서, 내스터디 버튼이 있어 메뉴가 복잡. 두 기능 모두 프로필 드롭다운에 이미 존재하므로 중복
- **결정**: AI이력서 탭 제거, 내스터디 primary 버튼 제거, 이벤트 탭 신규 추가
- **이유**: (1) 프로필 드롭다운에 "내 프로필"과 "내 스터디" 메뉴가 이미 있어 중복, (2) 이벤트 페이지가 신설되어 직접 접근 경로 필요, (3) GNB 4개 메뉴가 균형 있는 구조
- **영향**: `components/navbar.tsx` (navItems 변경, 내스터디 버튼 제거)

## 2026-03-11 | 홈 화이트보드 — 운영자 자유 편집 섹션

- **문제**: 홈에 운영자가 자유롭게 바꿀 수 있는 공간이 없음. 배너는 슬라이드 구조라 텍스트+이미지 조합의 자유로운 홍보가 어려움
- **결정**: HeroCarousel 아래에 화이트보드 섹션 추가 (이미지+제목+본문+CTA). 어드민에서 인라인 편집으로 관리
- **이유**: 운영자가 시즌별 캠페인, 공지, 프로모션 등을 코드 변경 없이 즉시 수정 가능해야 함. 배너와 화이트보드를 분리하면 각각 역할이 명확 (배너=슬라이드 프로모, 화이트보드=메인 메시지)
- **영향**: `app/page.tsx` (화이트보드 섹션), `app/admin/whiteboard/page.tsx` (신규 관리 페이지)

## 2026-03-11 | 커뮤니티 4탭→2탭 — 자유게시판·이벤트 제거

- **문제**: 커뮤니티에 피드/자유게시판/Q&A/이벤트 4개 탭이 있으나, (1) 자유게시판과 피드의 차이점을 설명할 수 없음, (2) 이벤트 탭은 /events 페이지와 완전히 중복
- **결정**: 피드/Q&A 2개 탭만 유지. 자유게시판 콘텐츠는 피드에 병합
- **이유**: 구분할 수 없는 탭은 사용자를 혼란시킴. "어디에 글을 써야 하지?"라는 의문이 생기면 글쓰기 자체를 포기할 수 있음. 탭이 적을수록 각 탭의 활성도가 높아짐
- **영향**: `app/community/feed/page.tsx` (탭 구조, mock data 병합)

## 2026-03-11 | 커뮤니티 Vote→Heart, 사이드바 제거 → Threads 1컬럼

- **문제**: (1) Vote(숫자+화살표) UI가 Reddit에서 온 것인데 비개발자 중심 GPTers에선 직관적이지 않음, (2) 사이드바에 CommunityInfoCard/CommunityRules 등 의미 없는 정보가 채워져 있음
- **결정**: Vote → Heart(좋아요)로 교체, 사이드바 완전 제거 → 1컬럼 max-w-[680px] Threads 스타일
- **이유**: (1) 좋아요(Heart)가 훨씬 직관적이고 보편적, (2) 사이드바에 넣을 만한 유의미한 정보가 없다면 차라리 없는 게 나음 — "왜 의미없는 정보들을 사이드바에 채우려는 거야?" (리뷰 피드백). Threads/X가 사이드바 없이 1컬럼으로 성공한 사례
- **영향**: `components/site/feed-post.tsx` (Vote→Heart, Link 래퍼), `app/community/feed/page.tsx` (사이드바 제거, 1컬럼)

## 2026-03-11 | 커뮤니티 포스트 별도 URL — SEO/공유 대응

- **문제**: 커뮤니티 글이 클릭해도 상세 페이지가 없고, 인라인 확장만 가능하면 검색엔진 인덱싱과 링크 공유가 불가
- **결정**: /community/[id] 별도 상세 페이지 생성. 스레드 스타일 (원글 + 계층형 댓글)
- **이유**: SEO와 소셜 공유는 커뮤니티 성장의 핵심 채널. 고유 URL이 없으면 외부 유입이 차단됨. Threads/X처럼 피드에서 클릭 → 상세 → 댓글 흐름이 자연스러움
- **영향**: `app/community/[id]/page.tsx` (신규), `components/site/feed-post.tsx` (Link 래퍼)

## 2026-03-11 | 이벤트 페이지 — Luma 참고 2컬럼 카드 + 상세

- **문제**: 이벤트 페이지를 새로 만들어야 하는데, 첫 버전이 너무 단순해서 "이벤트창 좀 너무 한 거 아니냐" 피드백
- **결정**: Luma/Festa.io 참고하여 리디자인 — (1) 목록: 2컬럼 카드 그리드 + 필터 탭 + 소셜 프루프 (2) 상세: 커버 이미지 + 좌측 콘텐츠 + 우측 sticky 신청 카드
- **이유**: 이벤트는 "참여"를 유도하는 페이지이므로 소셜 프루프(참여자 수, 아바타)와 명확한 CTA가 핵심. Luma가 이 패턴을 잘 구현하고 있어 참고
- **영향**: `app/events/page.tsx` (카드 그리드), `app/events/[id]/page.tsx` (Luma 스타일 상세)

## 2026-03-12 | 탐색 → 인사이트 탭 리네이밍

- **문제**: GNB의 "탐색"이라는 탭 이름이 사이트 기능(AI 활용 사례/지식 공유)을 제대로 전달하지 못함. "탐색"은 너무 일반적
- **결정**: "인사이트"로 변경 — AI 활용 노하우·사례·인사이트를 공유하는 허브 성격 반영
- **이유**: "탐색"은 기능(navigate)을 설명할 뿐 콘텐츠 성격을 전달하지 않음. "인사이트"는 실전 경험 기반 지식 공유라는 GPTers의 핵심 가치에 부합. Product Hunt의 "Discussions" → 실제 가치를 이름에 녹이는 패턴
- **영향**: `components/navbar.tsx` (탭 라벨), 내부 문서에서 "탐색" 용어 전반

## 2026-03-12 | 인사이트 페이지 — 콘텐츠 중앙 정렬 + 사이드바 남은 공간

- **문제**: 기존 max-w-[1080px] 안에 메인+사이드바를 flex row로 배치하면 게시글 영역이 좌측으로 치우침. 콘텐츠가 시각적 중심에 오지 않음
- **결정**: max-w-[640px] 게시글 영역을 뷰포트 중앙에 배치, 사이드바는 `absolute left-full`로 남은 공간에 위치
- **이유**: Medium/Substack처럼 읽기 경험이 핵심인 페이지는 본문이 시각적 중심이어야 함. 사이드바가 레이아웃을 밀어내면 안 됨. xl 이상에서만 사이드바 표시하여 좁은 화면에서도 깨지지 않음
- **영향**: `app/explore/feed/page.tsx` (overflow-x-clip + relative + absolute left-full 패턴)

## 2026-03-12 | SortTabs 통일 — Select 드롭다운 → 텍스트 토글

- **문제**: 탐색에서는 Select 드롭다운, 커뮤니티에서는 인라인 텍스트 토글(`최신 | 인기`)로 정렬 UI가 달랐음. 같은 기능인데 페이지마다 다른 UI
- **결정**: `최신 | 인기` 텍스트 토글(SortTabs 컴포넌트)로 통일. 선택된 항목은 `font-medium text-foreground`, 비선택은 `text-muted-foreground`
- **이유**: 정렬 옵션이 2개뿐이라 드롭다운은 과도함 — 클릭 한 번이 아닌 두 번(열기+선택) 필요. Velog/Dev.to처럼 즉시 전환 가능한 텍스트 토글이 2개 옵션에 적합
- **영향**: `components/site/sort-tabs.tsx`, 탐색/커뮤니티/태그/홈 4개 페이지

## 2026-03-12 | Spacing 5단계 시맨틱 토큰

- **문제**: 커스텀 spacing 토큰이 없어 동일 맥락에서 다른 간격이 혼재. 카테고리↔게시글 간격이 개발자마다 달라질 수 있음
- **결정**: 5개 시맨틱 토큰 — inline(8px), component(16px), block(24px), section(56px), page(48px). Tailwind rem 스케일에 맞춤
- **이유**: 의도 기반 토큰(`pt-section`)을 사용하면 "이 간격은 왜 56px이지?"라는 질문이 사라짐. 카테고리 섹션↔게시글 섹션 = section, 정렬↔게시글 리스트 = 게시글 자체 패딩으로 해결
- **영향**: `globals.css` @theme 블록, CLAUDE.md 규칙 추가, `app/explore/feed/page.tsx` 적용

## 2026-03-12 | 그레이스케일 3단계 위계 (neutral 800/600/400)

- **문제**: foreground(#171717)와 muted-foreground(#525252) 2단계만 존재. 제목·본문·메타 텍스트의 시각적 위계가 불명확
- **결정**: neutral-800(#262626) 제목 / neutral-600(#525252) 본문 미리보기 / neutral-400(#a3a3a3) 메타·캡션. Tailwind neutral 스케일 값만 사용
- **이유**: 3단계 텍스트 위계는 Medium/Substack 등 읽기 중심 서비스의 표준 패턴. 임의의 hex(#222 등)가 아닌 디자인 시스템 스케일 값을 사용해야 일관성 유지
- **영향**: `globals.css` — foreground, secondary-foreground, muted-foreground 3개 토큰, PostCard/사이드바 등 전역

## 2026-03-12 | PostCard 구조 — 썸네일 분리 + 메타 full width

- **문제**: 썸네일이 있는 카드와 없는 카드에서 메타 영역(시간·태그·좋아요·댓글) 위치가 달라짐. 썸네일이 메타까지 포함하는 flex row 구조 때문
- **결정**: flex-col 구조로 변경 — 프로필 → 제목+excerpt+썸네일(flex row) → 메타(always full width). 썸네일은 제목+excerpt 행에만 묶이고, 메타는 독립
- **이유**: 메타 위치가 썸네일 유무에 따라 달라지면 시선 흐름이 깨짐. 사용자는 카드 하단에서 항상 동일한 위치에 좋아요/댓글/시간을 기대함. Medium이 이 패턴을 사용
- **영향**: `components/site/post-card.tsx` 구조 전면 변경

## 2026-03-12 | 최소 폰트 사이즈 14px — text-xs 전면 금지

- **문제**: 사이드바 섹션 라벨, 작성자 bio, 글 개수 표시 등에 text-xs(12px)가 사용되어 가독성이 떨어짐
- **결정**: 사이트 전체에서 최소 폰트 사이즈를 text-sm(14px)으로 설정. text-xs 전면 교체
- **이유**: GPTers 주 사용자는 비개발자(AI에 관심 있는 일반인)로, 12px은 너무 작음. 14px이 웹 접근성 권장 최소 사이즈이며, 모바일에서도 가독성 유지
- **영향**: `app/explore/feed/page.tsx` (사이드바 전체), 향후 모든 페이지에 적용할 규칙

## 2026-03-12 | EventCard 추출 + 하드코딩 색상 제거

- **문제**: 이벤트 카드가 `app/events/page.tsx`에 하드코딩되어 재사용 불가. `bg-blue-50 text-blue-600` 등 디자인 토큰이 아닌 직접 색상 사용
- **결정**: EventCard 공용 컴포넌트 추출, 색상은 `bg-accent text-primary`(온라인) / `bg-muted text-muted-foreground`(오프라인)로 디자인 토큰 사용
- **이유**: 하드코딩 색상은 테마 변경 시 깨지고, 일관성을 해침. 모든 색상은 globals.css @theme 토큰을 거쳐야 함
- **영향**: `components/site/event-card.tsx` (신규), `app/events/page.tsx` (리팩토링)

## 2026-03-12 | FeedPost 액션 버튼 — Link 밖으로 분리

- **문제**: FeedPost 전체가 `<Link>`로 감싸져 있어, 좋아요·댓글·공유 버튼을 개별 클릭하면 상세 페이지로 이동해버림
- **결정**: 제목+본문만 Link, 액션 바(좋아요/댓글/공유)는 Link 밖에 배치. 태그도 개별 `<Link>`로 분리
- **이유**: 카드 내 인터랙티브 요소가 부모 Link에 중첩되면 접근성(a11y) 위반이고 UX도 나쁨. Threads/X 패턴처럼 콘텐츠 영역 클릭=상세, 액션 영역 클릭=해당 기능
- **영향**: `components/site/feed-post.tsx` (구조 변경)

## 2026-03-06 | 검색 결과 탭 전용 — "전체" 탭 없음

- **문제**: 검색 결과에서 게시글/스터디/사용자를 어떻게 보여줄 것인가? LinkedIn(3개씩 섹션), Reddit(커뮤니티 상단+게시글), Medium(인터리빙) 등 패턴 검토
- **결정**: 탭 3개(게시글/스터디/사용자)만 사용, "전체" 탭 없음, 기본값은 "게시글"
- **이유**: (1) 스터디를 게시글 위에 놓으면 탭과 무관한 요소가 어색, (2) 인터리빙은 광고처럼 보임, (3) 사이드바는 배너 맹시(banner blindness) 문제, (4) GPTers는 게시글이 주 콘텐츠라 단순 탭이 가장 직관적
- **영향**: `app/search/page.tsx` (FilterType에서 "전체" 제거, 기본값 "게시글")

## 2026-03-12 | Vote→Heart — Reddit 투표 패턴 전면 제거

- **문제**: PostActionsSidebar에 ArrowUp/ArrowDown 숫자 투표, 댓글에도 ArrowUp/ArrowDown이 사용되어 Reddit-like 인터랙션이 남아있었음. GPTers 사용자(비개발자)에게 Reddit 투표 UI는 직관적이지 않음
- **결정**: 모든 투표 UI를 Heart(좋아요) 토글로 교체. vote.tsx 컴포넌트 삭제
- **이유**: Medium/Brunch/Threads 등 콘텐츠 플랫폼은 모두 Heart/Like 패턴 사용. 숫자+화살표 투표는 Reddit/HN 특유의 패턴으로 일반 사용자에게 낯섦
- **영향**: `components/site/post-actions-sidebar.tsx`, `components/site/comment.tsx`, `components/site/vote.tsx` (삭제)

## 2026-03-12 | 댓글 UI 재설계 — border-l-2 제거, 아바타 정렬 레이아웃

- **문제**: 댓글에 border-l-2 수직선 인디케이터, @username 멘션 프리픽스, collapse/expand 토글 등 Reddit 스타일 요소가 과도하게 적용되어 있었음
- **결정**: 아바타(w-7) 기반 클린 레이아웃으로 전면 재설계. body는 pl-9(아바타 정렬), 대댓글은 ml-10 인덴트만 사용. 수직선/멘션/접기 모두 제거
- **이유**: Reddit은 깊은 스레딩에 수직선이 필수지만, GPTers는 1-depth 대댓글이면 충분. 과도한 Reddit 요소가 "커뮤니티 게시판" 느낌을 줌. Medium/Threads처럼 아바타 정렬이 더 깔끔
- **영향**: `components/site/comment.tsx` (전면 재작성)

## 2026-03-12 | 관련 글 — 카드 형태 대신 피드 형태(PostCard) 재사용

- **문제**: 관련 글 추천이 RelatedPostCard(border 카드 + placeholder 이미지)로 3컬럼 그리드 표시. 피드의 PostCard와 전혀 다른 형태
- **결정**: RelatedPostCard 삭제, PostCard 재사용. divide-y 리스트 형태로 피드와 동일하게 표현
- **이유**: 같은 "게시글"인데 맥락에 따라 다른 형태로 보이면 사용자가 혼란. Medium도 관련 글을 피드와 동일한 형태로 보여줌
- **영향**: `app/posts/[slug]/page.tsx`, `components/site/related-post-card.tsx` (삭제)

## 2026-03-12 | 인사이트 사이드바 — Medium 비례 참조

- **문제**: 사이드바가 게시글 목록과 너무 가까웠고(ml-12), 섹션 간격/소제목 크기/토픽 pill 크기가 Medium 대비 작고 빡빡했음
- **결정**: ml-16 간격, space-y-10 섹션간격, text-base font-semibold 소제목(text-muted-foreground 유지), 토픽 pill px-4 py-2로 확대, mb-3 통일
- **이유**: Medium 사이드바를 기준으로 비교했을 때 간격과 크기가 현저히 부족. 소제목은 보조 역할이므로 muted-foreground가 적절 (foreground로 바꾸면 게시글 제목과 경쟁)
- **영향**: `app/explore/feed/page.tsx` (사이드바 영역), `components/site/user-row.tsx` (아바타 w-8, py-2)

## 2026-03-13 | 커뮤니티 쓰레드 상세 포스트 박스 border 제거

- **문제**: 커뮤니티 쓰레드 상세(/community/[id])에서 원글 포스트가 border/rounded/padding 박스로 감싸져 있어, Threads/X 스타일과 다른 묵직한 카드 느낌이 남
- **결정**: border, rounded, padding 클래스 전체 제거. 댓글 목록 위의 `<hr>` divider도 제거
- **이유**: Threads/X에서 쓰레드 상세를 열면 원글이 카드가 아니라 배경과 동일한 플랫 레이아웃으로 표시됨. border 박스는 "게시판" 느낌을 주고 Threads 스타일과 충돌. divider 역시 댓글 흐름을 끊는 불필요한 요소
- **영향**: `app/community/[id]/page.tsx` (포스트 래퍼 클래스)

## 2026-03-13 | 이미지 placeholder → Unsplash 실제 이미지 교체

- **문제**: PostCard, FeedPost, VodCard, EventCard 모두 boolean prop(`thumbnail: true`, `hasImage: true`)으로 회색 placeholder 박스만 표시. 프로토타입이 실제 서비스처럼 느껴지지 않아 리뷰/데모에서 설득력이 부족
- **결정**: boolean prop을 string URL prop(`thumbnailUrl: string`, `imageUrl: string`)으로 변경. 10개 페이지의 mock data에 Unsplash 무료 이미지 URL 적용
- **이유**: 프로토타입의 목적은 실제 서비스를 시뮬레이션하는 것. 회색 박스는 레이아웃 확인엔 유용하나, 사용자 리서치·이해관계자 리뷰·포트폴리오 제시 등에서 완성도가 낮아 보임. 이미지 URL을 prop으로 받는 구조는 나중에 API 연결 시 그대로 유지됨
- **영향**: `components/site/post-card.tsx`, `components/site/feed-post.tsx`, `components/lms/vod-card.tsx`, `components/site/event-card.tsx`, 10개 page.tsx mock data

## 2026-03-13 | 폰트 굵기 4단계 재정의 — 전체적으로 더 가벼운 타이포그래피

- **문제**: Tailwind 기본 폰트 굵기(medium=500, semibold=600, bold=700)로는 GPTers의 타이포그래피가 전반적으로 무거운 느낌. Pretendard 폰트 특성상 500~600이면 충분히 두드러지고, 700은 과도하게 굵어 보임. font-bold 위반이 53개로 많아 규칙 우선 수정이 필요했음
- **결정**: globals.css @theme에서 폰트 굵기 전면 재매핑 — regular=300(신규), medium=400, semibold=500, bold=600. `.font-regular { font-weight: 300; }` 명시적 CSS 규칙 추가. excerpt·본문·메타에 font-regular 적용
- **이유**: Pretendard Variable은 100~900 웨이트를 모두 지원. 300(light)은 미리보기 텍스트나 본문의 부드러운 표현에 적합하며, Medium/Brunch 등 콘텐츠 플랫폼이 본문에 light 웨이트를 사용하는 패턴과 일치. 기존 font-bold를 그대로 두면 600이 되어 위반 규칙도 자연스럽게 해소됨
- **영향**: `app/globals.css` (@theme 폰트 굵기 매핑), `components/site/post-card.tsx`, `components/site/feed-post.tsx`, `components/lms/vod-card.tsx`, `components/lms/vod-lock-card.tsx`, `components/site/comment.tsx`, 7개 page.tsx

## 2026-03-13 | 본문과 미리보기의 텍스트 색상 위계 분리

- **문제**: 게시글 상세(/posts/[slug]) 본문 `<p>`, `<ol>` 텍스트가 `text-sub-foreground`(#737373 neutral-500)로 설정되어 있어 실제 글을 읽기에 너무 옅었음. PostCard excerpt가 `text-secondary-foreground`(#525252)인데, 본문이 미리보기보다 옅은 색은 위계 역전
- **결정**: 게시글 상세 본문을 `text-secondary-foreground`(#525252 neutral-600)로 변경. 그레이스케일 위계: 제목=foreground(#262626) > 본문=secondary-foreground(#525252) > 미리보기·설명=secondary-foreground(동일, 본문과 같음) > 메타·타임스탬프=muted-foreground(#a3a3a3)
- **이유**: 본문이 미리보기보다 옅으면 "본문을 읽을 의욕이 사라진다"는 피드백과 일치. 긴 글을 읽는 페이지에서 본문 색상이 너무 연하면 눈의 피로가 증가. neutral-600은 콘텐츠 플랫폼에서 본문 색상으로 널리 사용되는 값
- **영향**: `app/posts/[slug]/page.tsx` (본문 `<p>`, `<ol>` 색상), 향후 긴 글 본문 표준 색상으로 고정

## 2026-03-13 | @username 표시 전면 제거 — 이름이 곧 ID

- **문제**: 사이트 전반에 `@honggildong` 형태로 username이 표시되고 있었는데, GPTers에서 @username은 실제 멘션이나 검색에 활용되지 않음. 이름과 @username이 동시에 표시되면 정보 중복이고 화면이 지저분함
- **결정**: 모든 @username 표시 제거. 이름 하나만 표시하고, 이름 자체가 식별자 역할
- **이유**: Twitter/X는 @handle이 필수이지만, GPTers는 실명 기반 커뮤니티로 @username이 사회적 의미가 없음. Medium, Brunch, 요즘IT 등 콘텐츠 플랫폼은 이름만 표시. 불필요한 정보는 시각적 노이즈
- **영향**: UserRow, ProfileHeader, UserMeta, MessageRow, Navbar 등 6개 컴포넌트 + community/[id], search 등 3개 페이지

## 2026-03-13 | 활성 상태 색상 블랙 → primary 오렌지 통일

- **문제**: CategoryFilter 활성 칩이 `bg-foreground`(블랙), SortTabs 활성 텍스트가 `text-foreground`(블랙), Pagination 현재 페이지가 `bg-foreground`(블랙)로, 브랜드 오렌지를 사용하지 않아 시각적 일관성 부재
- **결정**: 세 컴포넌트 모두 활성 상태를 `bg-primary` / `text-primary` / `bg-primary text-primary-foreground`로 변경
- **이유**: 활성 상태는 사용자의 현재 선택을 나타내는 핵심 시각 피드백. 브랜드 컬러(GPTers Orange #EF6020)를 활용하지 않으면 브랜드 정체성이 희석됨. Medium(초록), Velog(초록) 등 콘텐츠 플랫폼도 브랜드 컬러를 활성 상태에 사용
- **영향**: `components/site/category-filter.tsx`, `components/site/sort-tabs.tsx`, `components/ui/pagination.tsx`

## 2026-03-13 | Spacing 토큰 이름 충돌 — block → group 으로 변경

- **문제**: `--spacing-block: 1.5rem`으로 정의한 시맨틱 토큰이 Tailwind v4에서 `.inline-block { inline-size: var(--spacing-block) }` 유틸리티를 생성하여 기존 `.inline-block { display: inline-block }` 유틸리티와 충돌. 모든 `inline-block` 요소의 width가 24px로 강제되어 HeroCarousel 태그, CTA 버튼, 화이트보드 CTA 등이 글자 단위로 줄바꿈
- **결정**: `--spacing-block` → `--spacing-group`으로 이름 변경. 사용처도 `pt-block` → `pt-group`으로 업데이트
- **이유**: Tailwind v4는 `--spacing-*` 토큰에서 `inline-*`, `max-*` 등 접두사를 자동으로 조합하여 유틸리티를 생성. `block`이라는 이름은 CSS `inline-block`과 충돌할 수밖에 없는 구조. `group`은 Tailwind에서 접두사 조합에 충돌하지 않으면서 "컴포넌트 간 간격"이라는 의미를 유지
- **영향**: `app/globals.css` (@theme), `app/explore/feed/page.tsx` (pt-group), `CLAUDE.md` (spacing 문서)
