"use client";

import { useState } from "react";
import Link from "next/link";
import { Award, GraduationCap as GradCap } from "lucide-react";
import { ProfileHeader, BADGE_COLORS } from "@/components/site/profile-header";
import { PostCard } from "@/components/site/post-card";
import { EventCard } from "@/components/site/event-card";
import { UserRow } from "@/components/site/user-row";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Medal,
  GraduationCap,
  Star,
  Handshake,
  Crown,
  PenLine,
  Rocket,
  MessageCircle,
} from "lucide-react";

/* ─── Mock Data ─── */

const stats = [
  { label: "스터디 수료", value: 3 },
  { label: "작성 글", value: 27 },
  { label: "받은 투표", value: "1,234" },
  { label: "댓글", value: 156 },
  { label: "포인트", value: "2,450" },
];

const skills = [
  { name: "자동화/노코드", level: 100, note: "스터디 2회 수료" },
  { name: "프롬프트", level: 80, note: "스터디 1회 수료" },
  { name: "마케팅 AI", level: 60, note: "게시글 12건" },
  { name: "개발/코딩", level: 40, note: "게시글 5건" },
];

const studyHistory = [
  {
    title: "21기 AI 자동화 스터디",
    period: "2026.01.15 ~ 2026.02.26",
    leader: "김영호",
    posts: 3,
    project: "마케팅 이메일 자동화 파이프라인",
    badge: "AI 자동화 전문가",
  },
  {
    title: "20기 프롬프트 엔지니어링",
    period: "2025.11.01 ~ 2025.12.13",
    leader: "이수진",
    posts: 2,
    project: "고급 프롬프트 체이닝 가이드",
    badge: "프롬프트 마스터",
  },
  {
    title: "19기 AI 기초",
    period: "2025.09.01 ~ 2025.10.12",
    leader: "박민수",
    posts: 1,
    project: "AI 도구 활용 실습 포트폴리오",
    badge: "AI 입문자",
  },
];

const interestTags = [
  "AI 자동화",
  "프롬프트 엔지니어링",
  "마케팅 AI",
  "n8n",
  "Claude",
];

const featuredBadges = [
  { icon: Medal, label: "AI 자동화 전문가" },
  { icon: Star, label: "베스트 사례 3회" },
  { icon: Crown, label: "기여왕" },
];

const allBadges = [
  {
    icon: Medal,
    name: "AI 자동화 전문가",
    earnedDate: "2026.02.26",
    description: "AI 자동화 스터디를 수료하고 최종 프로젝트를 완성하여 획득",
  },
  {
    icon: GraduationCap,
    name: "3기 수료",
    earnedDate: "2026.02.26",
    description: "3개 기수 연속으로 스터디를 수료하여 획득",
  },
  {
    icon: Star,
    name: "베스트 사례 3회",
    earnedDate: "2026.01.20",
    description: "작성한 AI 활용 사례가 3회 베스트로 선정되어 획득",
  },
  {
    icon: Handshake,
    name: "모각AI 리더",
    earnedDate: "2025.12.15",
    description: "모각AI 세션을 5회 이상 리드하여 획득",
  },
  {
    icon: Crown,
    name: "기여왕",
    earnedDate: "2025.11.30",
    description: "월간 기여 포인트 Top 3에 진입하여 획득",
  },
  {
    icon: PenLine,
    name: "프롬프트 마스터",
    earnedDate: "2025.12.13",
    description: "프롬프트 엔지니어링 스터디를 수료하여 획득",
  },
  {
    icon: Rocket,
    name: "AI 입문자",
    earnedDate: "2025.10.12",
    description: "첫 번째 AI 스터디를 성공적으로 수료하여 획득",
  },
  {
    icon: MessageCircle,
    name: "소통왕",
    earnedDate: "2025.10.01",
    description: "댓글 100개 이상 작성하여 획득",
  },
];

const userSeries = [
  {
    id: "1",
    title: "맘스만 개발기",
    description: "육아와 개발을 병행하는 엄마 개발자의 AI 활용 여정",
    category: "AI활용법",
    status: "진행중" as const,
    postCount: 3,
    totalVotes: 89,
  },
  {
    id: "2",
    title: "자동화 마스터 클래스",
    description: "업무 자동화의 A to Z, n8n과 Claude API를 활용한 실전 가이드",
    category: "자동화",
    status: "완결" as const,
    postCount: 4,
    totalVotes: 156,
  },
];

const followers = [
  { username: "leeyounghee", name: "이영희", bio: "프롬프트 엔지니어링 강사" },
  { username: "parkchulsoo", name: "박철수", bio: "바이브 코딩으로 10개 서비스 런칭" },
  { username: "kimyoungho", name: "김영호", bio: "n8n 자동화 전문가" },
  { username: "jungdaeun", name: "정다은", bio: "AI 영상 크리에이터" },
  { username: "choijunhyuk", name: "최준혁", bio: "AI 트렌드 분석가" },
];

const followings = [
  { username: "kimminji", name: "김민지", bio: "AI 비즈니스 컨설턴트" },
  { username: "leesuhyun", name: "이수현", bio: "Midjourney 디자인 전문가" },
  { username: "parkminsu", name: "박민수", bio: "n8n + Claude 자동화" },
];

const bookmarkedPosts = [
  {
    slug: "cursor-fullstack",
    title: "Cursor로 풀스택 앱 3일 만에 만들기",
    excerpt:
      "프론트엔드부터 백엔드, 배포까지 Cursor AI를 활용해 혼자서 3일 만에 완성한 실전 후기입니다.",
    author: "박철수",
    username: "parkchulsoo",
    category: "바이브코딩",
    time: "2026.03.10",
    votes: 234,
    comments: 45,
    tags: ["Cursor", "바이브코딩"],
  },
  {
    slug: "n8n-slack-automation",
    title: "n8n으로 슬랙 알림 자동화 구축하기",
    excerpt:
      "매일 반복되는 슬랙 알림을 n8n 웹훅으로 자동화한 과정. 트리거 설정부터 에러 핸들링까지 정리했습니다.",
    author: "김영호",
    username: "kimyoungho",
    category: "자동화",
    time: "2026.03.08",
    votes: 156,
    comments: 28,
    tags: ["n8n", "자동화", "Slack"],
  },
  {
    slug: "claude-api-tips",
    title: "Claude API 실전 활용 팁 모음",
    excerpt:
      "Claude API를 프로덕션에서 6개월간 사용하며 얻은 실전 노하우. 토큰 최적화, 에러 핸들링, 프롬프트 캐싱 전략을 공유합니다.",
    author: "이수현",
    username: "leesuhyun",
    category: "AI활용법",
    time: "2026.03.03",
    votes: 198,
    comments: 34,
    tags: ["Claude", "API"],
  },
  {
    slug: "midjourney-brand",
    title: "Midjourney로 브랜드 아이덴티티 만들기",
    excerpt:
      "AI 이미지 생성 도구를 활용해 스타트업 브랜드 로고, 컬러팔레트, 소셜 미디어 에셋을 제작한 경험을 공유합니다.",
    author: "정다은",
    username: "jungdaeun",
    category: "AI디자인",
    time: "2026.02.25",
    votes: 112,
    comments: 19,
    tags: ["Midjourney", "디자인"],
  },
];

const userEvents = [
  {
    id: 5,
    title: "AI 프롬프트 워크숍",
    category: "워크숍",
    type: "online" as const,
    date: "4월 12일 (토)",
    time: "14:00",
    location: "온라인 (Zoom)",
    description: "실전에서 바로 쓸 수 있는 프롬프트 작성법을 배우는 핸즈온 워크숍입니다.",
    host: "홍길동",
    hostType: "user" as const,
    status: "published" as const,
    attendees: 24,
    capacity: 50,
    free: true,
  },
  {
    id: 6,
    title: "Claude API 활용 세미나",
    category: "웨비나",
    type: "online" as const,
    date: "3월 8일 (토)",
    time: "20:00",
    location: "온라인 (Zoom)",
    description: "Claude API를 활용한 프로덕션 서비스 구축 경험을 공유합니다.",
    host: "홍길동",
    hostType: "user" as const,
    status: "completed" as const,
    attendees: 87,
    capacity: 100,
    free: true,
  },
  {
    id: 7,
    title: "AI 마케팅 모임",
    category: "모임",
    type: "offline" as const,
    date: "3월 25일 (화)",
    time: "19:00",
    location: "강남역 스타벅스",
    description: "AI를 활용한 마케팅 전략을 공유하는 소규모 모임입니다.",
    host: "홍길동",
    hostType: "user" as const,
    status: "rejected" as const,
    attendees: 0,
    capacity: 20,
    free: true,
    reviewNote: "이벤트 장소가 불명확합니다. 정확한 주소를 기재해주세요.",
  },
];

const EVENT_STATUS_LABELS: Record<string, { label: string; className: string }> = {
  draft: { label: "임시저장", className: "bg-muted text-sub-foreground" },
  pending_review: { label: "심사대기", className: "bg-accent text-primary" },
  rejected: { label: "반려", className: "bg-destructive/10 text-destructive" },
  published: { label: "공개", className: "bg-muted text-sub-foreground" },
  closed: { label: "마감", className: "bg-muted text-sub-foreground" },
  completed: { label: "완료", className: "bg-muted text-sub-foreground" },
  cancelled: { label: "취소", className: "bg-muted text-sub-foreground" },
};

const userPosts = [
  {
    slug: "moms-dev-3",
    title: "런칭 후기 — 첫 사용자 100명 달성",
    excerpt:
      "드디어 맘스만 서비스를 런칭했습니다. 첫 달 100명의 사용자를 달성하기까지의 마케팅 전략과 AI 활용 경험을 공유합니다.",
    category: "AI활용법",
    time: "2026.03.01",
    votes: 45,
    comments: 12,
    tags: ["ChatGPT", "육아"],
    seriesId: "1",
    seriesTitle: "맘스만 개발기",
    positionInSeries: 3,
  },
  {
    slug: "ai-tools-review",
    title: "2026년 AI 도구 비교 리뷰",
    excerpt:
      "ChatGPT, Claude, Gemini를 실무에서 3개월간 사용한 비교 리뷰. 각 도구의 장단점과 최적 사용 시나리오를 정리했습니다.",
    category: "AI활용법",
    time: "2026.03.05",
    votes: 89,
    comments: 23,
    tags: ["ChatGPT", "Claude", "Gemini"],
  },
  {
    slug: "prompt-tips",
    title: "프롬프트 엔지니어링 실전 팁 10가지",
    excerpt:
      "현업에서 바로 활용할 수 있는 프롬프트 작성 노하우. 역할 부여, 체이닝, Few-shot 등 실전에서 검증된 기법들을 소개합니다.",
    category: "프롬프트",
    time: "2026.02.28",
    votes: 67,
    comments: 18,
    tags: ["프롬프트", "ChatGPT"],
  },
  {
    slug: "claude-marketing",
    title: "Claude로 마케팅 자동화 구축기",
    excerpt:
      "마케팅 팀에서 매주 반복적으로 보내는 이메일 캠페인을 Claude API를 활용해 자동화한 경험을 공유합니다.",
    category: "AI활용법",
    time: "2026.02.22",
    votes: 142,
    comments: 23,
    tags: ["Claude", "마케팅", "자동화"],
    seriesId: "1",
    seriesTitle: "맘스만 개발기",
    positionInSeries: 2,
  },
  {
    slug: "no-code-automation",
    title: "비개발자를 위한 노코드 자동화 입문",
    excerpt:
      "n8n, Zapier, Make를 활용한 업무 자동화 시작하기. 코딩 없이 이메일 알림부터 데이터 수집까지 자동화하는 방법을 안내합니다.",
    category: "자동화",
    time: "2026.02.20",
    votes: 56,
    comments: 15,
    tags: ["n8n", "노코드", "자동화"],
  },
  {
    slug: "moms-dev-1",
    title: "아이디어 구상기 — AI로 육아 도우미 만들기",
    excerpt:
      "육아와 개발을 병행하면서 느낀 불편함을 AI로 해결하려는 첫 시도. 아이디어 구상부터 기술 스택 선정까지의 과정을 기록합니다.",
    category: "AI활용법",
    time: "2026.02.15",
    votes: 34,
    comments: 8,
    tags: ["AI", "육아"],
    seriesId: "1",
    seriesTitle: "맘스만 개발기",
    positionInSeries: 1,
  },
  {
    slug: "ai-email-newsletter",
    title: "AI로 뉴스레터 자동 작성하기",
    excerpt:
      "매주 보내는 뉴스레터 작성에 Claude를 활용한 워크플로우. 주제 선정부터 발송까지 반자동화한 경험을 공유합니다.",
    category: "자동화",
    time: "2026.02.10",
    votes: 41,
    comments: 9,
    tags: ["Claude", "뉴스레터"],
  },
  {
    slug: "n8n-webhook-guide",
    title: "n8n 웹훅 활용 완전 가이드",
    excerpt:
      "n8n의 웹훅 노드를 활용해 슬랙 알림, 구글 시트 연동, API 자동 호출 등 실전 워크플로우를 구축하는 방법을 정리했습니다.",
    category: "자동화",
    time: "2026.01.28",
    votes: 78,
    comments: 21,
    tags: ["n8n", "자동화", "웹훅"],
  },
];

const USER_USERNAME = "honggildong";

/* ─── Page ─── */

export default function ProfilePage() {
  const isOwn = true;
  const [activeTab, setActiveTab] = useState<"posts" | "series" | "events" | "bookmarks" | "followers" | "following">("posts");

  return (
    <div className="mx-auto max-w-[1080px] px-6 py-page">
      {/* ProfileHeader - full width */}
      <ProfileHeader
        user={{
          name: "홍길동",
          username: "honggildong",
          bio: "AI 자동화 전문가 · 마케터",
          joinDate: "2025.03",
          interestTags,
          links: [
            { label: "GitHub", href: "https://github.com/honggildong" },
            { label: "LinkedIn", href: "https://linkedin.com/in/honggildong" },
            { label: "블로그", href: "https://honggildong.tistory.com" },
          ],
        }}
        featuredBadges={featuredBadges}
        followerCount={followers.length}
        followingCount={followings.length}
        isOwn
      />

      {/* 2-column layout */}
      <div className="mt-8 flex gap-12 items-start">

        {/* ── Left: main content ── */}
        <div className="flex-1 min-w-0">

          {/* 탭 */}
          <div className="flex gap-1 border-b border-border mb-6">
            {([
              { key: "posts", label: `작성글 ${userPosts.length}` },
              { key: "series", label: `시리즈 ${userSeries.length}` },
              { key: "events", label: `이벤트 ${userEvents.length}` },
              { key: "bookmarks", label: `북마크 ${bookmarkedPosts.length}` },
              { key: "followers", label: `팔로워 ${followers.length}` },
              { key: "following", label: `팔로잉 ${followings.length}` },
            ] as const).map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
                  activeTab === tab.key
                    ? "border-foreground text-foreground"
                    : "border-transparent text-sub-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* 작성글 탭 */}
          {activeTab === "posts" && (
            <div className="divide-y divide-border">
              {userPosts.map((post) => (
                <PostCard
                  key={post.slug}
                  slug={post.slug}
                  category={post.category}
                  title={post.title}
                  author="홍길동"
                  username={USER_USERNAME}
                  time={post.time}
                  tags={post.tags}
                  excerpt={post.excerpt}
                  votes={post.votes}
                  comments={post.comments}
                  showAuthor={false}
                  seriesId={post.seriesId}
                  seriesTitle={post.seriesTitle}
                  positionInSeries={post.positionInSeries}
                />
              ))}
            </div>
          )}

          {/* 시리즈 탭 */}
          {activeTab === "series" && (
            <div className="space-y-3">
              {userSeries.map((series) => (
                <Link
                  key={series.id}
                  href={`/series/${series.id}`}
                  className="flex items-center gap-4 p-4 rounded-lg border border-border hover:bg-accent transition-colors group"
                >
                  {/* 내용 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <Badge variant={series.status === "완결" ? "active" : "default"}>
                        {series.status}
                      </Badge>
                      <span className="text-xs text-sub-foreground">{series.category}</span>
                    </div>
                    <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors mb-1">
                      {series.title}
                    </h4>
                    <p className="text-sm text-sub-foreground line-clamp-2">{series.description}</p>
                  </div>
                  {/* 편수 — 우측 한 줄 */}
                  <div className="shrink-0">
                    <span className="text-base font-semibold text-sub-foreground">{series.postCount}</span>
                    <span className="text-sm text-sub-foreground ml-0.5">편</span>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* 이벤트 탭 */}
          {activeTab === "events" && (
            <div className="space-y-4">
              {userEvents.map((event) => {
                const statusInfo = EVENT_STATUS_LABELS[event.status];
                return (
                  <div key={event.id}>
                    <div className="relative">
                      {/* Status badge */}
                      {statusInfo && (
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`text-sm font-medium px-2 py-0.5 rounded ${statusInfo.className}`}>
                            {statusInfo.label}
                          </span>
                        </div>
                      )}
                      <EventCard {...event} />
                    </div>
                    {/* Rejection note */}
                    {event.status === "rejected" && "reviewNote" in event && event.reviewNote && (
                      <div className="mt-2 p-3 rounded-lg border border-destructive/30 bg-destructive/5 text-sm text-destructive">
                        <p className="font-medium mb-1">반려 사유</p>
                        <p>{event.reviewNote}</p>
                      </div>
                    )}
                    {/* Owner actions */}
                    {isOwn && (
                      <div className="flex gap-2 mt-2">
                        {event.status === "published" && (
                          <>
                            <Link href={`/events/${event.id}/edit`}>
                              <Button variant="outline" size="sm">수정</Button>
                            </Link>
                            <Button variant="outline" size="sm" onClick={() => alert("이벤트가 마감되었습니다.")}>마감</Button>
                          </>
                        )}
                        {event.status === "rejected" && (
                          <Link href={`/events/${event.id}/edit`}>
                            <Button variant="outline" size="sm">수정</Button>
                          </Link>
                        )}
                        {(event.status === "published" || event.status === "rejected") && (
                          <Button variant="ghost" size="sm" className="text-destructive" onClick={() => alert("이벤트가 취소되었습니다.")}>취소</Button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* 북마크 탭 */}
          {activeTab === "bookmarks" && (
            <div className="divide-y divide-border">
              {bookmarkedPosts.map((post) => (
                <PostCard
                  key={post.slug}
                  slug={post.slug}
                  category={post.category}
                  title={post.title}
                  author={post.author}
                  username={post.username}
                  time={post.time}
                  tags={post.tags}
                  excerpt={post.excerpt}
                  votes={post.votes}
                  comments={post.comments}
                />
              ))}
            </div>
          )}

          {/* 팔로워/팔로잉 탭 */}
          {(activeTab === "followers" || activeTab === "following") && (
            <div className="space-y-1">
              {(activeTab === "followers" ? followers : followings).map((user) => (
                <UserRow
                  key={user.username}
                  name={user.name}
                  username={user.username}
                  description={user.bio}
                  href={`/profile/${user.username}`}
                  showFollowButton
                  initialFollowing={activeTab === "following"}
                />
              ))}
            </div>
          )}
        </div>

        {/* ── Right: sidebar ── */}
        <aside className="w-64 shrink-0 sticky top-20 space-y-6">

          {/* 스터디 이력 */}
          <section>
            <div className="flex items-center gap-1.5 mb-3">
              <GradCap className="w-3.5 h-3.5 text-primary" strokeWidth={1.5} />
              <h4 className="text-sm font-semibold text-foreground">스터디 이력</h4>
            </div>
            <div className="divide-y divide-border">
              {studyHistory.map((study) => (
                <div key={study.title} className="py-3 space-y-0.5">
                  <p className="text-sm font-medium text-foreground line-clamp-1">{study.title}</p>
                  <p className="text-sm text-sub-foreground">{study.period}</p>
                  <p className="text-sm text-sub-foreground flex items-center gap-1">
                    <Award className="w-3 h-3 text-primary shrink-0" strokeWidth={1.5} />
                    {study.badge}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* 뱃지 */}
          <section>
            <div className="flex items-center gap-1.5 mb-3">
              <Medal className="w-3.5 h-3.5 text-primary" strokeWidth={1.5} />
              <h4 className="text-sm font-semibold text-foreground">
                뱃지 <span className="font-normal text-sub-foreground">{allBadges.length}</span>
              </h4>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {allBadges.map((badge, i) => {
                const Icon = badge.icon;
                return (
                  <span
                    key={badge.name}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 text-sm rounded-full font-medium ${BADGE_COLORS[i % BADGE_COLORS.length]}`}
                  >
                    <Icon className="w-3.5 h-3.5" strokeWidth={1.5} />
                    {badge.name}
                  </span>
                );
              })}
            </div>
          </section>

        </aside>
      </div>
    </div>
  );
}
