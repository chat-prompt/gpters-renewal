import Link from "next/link";
import {
  Heart,
  MessageSquare,
  Users,
  FileText,
  GraduationCap,
} from "lucide-react";
import { PostCard } from "@/components/site/post-card";
import { SortTabs } from "@/components/site/sort-tabs";
import { HeroCarousel } from "@/components/site/hero-carousel";

/* ─── Mock Data ─── */

const heroSlides = [
  {
    tag: "스터디 모집",
    title: "21기 AI 스터디 — 얼리버드 할인 중",
    description:
      "AI 자동화, 프롬프트 엔지니어링, 바이브 코딩 등 6개 프로그램. 4주간 실전 학습.",
    href: "/study/ai-study-21",
    cta: "자세히 보기",
    bg: "bg-primary",
  },
  {
    tag: "Editor's Pick",
    title: "2025년 주목할 AI 트렌드 TOP 10",
    description:
      "에이전트, 멀티모달, 온디바이스까지 핵심 흐름을 짚어봅니다.",
    href: "/posts/ai-trend-2025",
    cta: "읽어보기",
    bg: "bg-foreground",
  },
  {
    tag: "이벤트",
    title: "무료 AI 토크: Claude Code 활용법",
    description:
      "3월 15일 온라인. AI 코드 에디터 실전 활용법을 알려드립니다.",
    href: "/events",
    cta: "신청하기",
    bg: "bg-primary/80",
  },
];

const whiteboard = {
  imageUrl: "",
  title: "AI로 일하는 법, GPTers에서 시작하세요",
  body: "12,000명의 AI 실무자 커뮤니티에서 최신 AI 활용법을 배우고, 함께 성장하세요. 초보자도 환영합니다.",
  ctaText: "커뮤니티 둘러보기",
  ctaHref: "/explore/feed",
};

const featuredPost = {
  slug: "ai-trend-2025",
  category: "트렌드",
  title: "2025년 주목할 AI 트렌드 TOP 10 — 에이전트, 멀티모달, 온디바이스까지",
  author: "최준혁",
  time: "5일 전",
  excerpt:
    "올해 하반기부터 주목해야 할 AI 산업 트렌드를 정리했습니다. AI 에이전트의 실전 도입부터 멀티모달 모델의 대중화, 온디바이스 AI의 확산까지 핵심 흐름을 짚어봅니다.",
  votes: 312,
  comments: 47,
};

const trendingTopics = [
  "ChatGPT",
  "Claude",
  "Cursor",
  "프롬프트",
  "자동화",
  "n8n",
  "Midjourney",
  "바이브코딩",
];

const posts = [
  {
    slug: "claude-marketing",
    category: "AI활용법",
    title: "Claude로 마케팅 자동화 구축기",
    author: "홍길동",
    time: "3시간 전",
    tags: ["Claude", "자동화"],
    excerpt:
      "이번에 Claude를 활용해서 마케팅 이메일 자동화 파이프라인을 구축한 경험을 공유합니다. 매주 3시간 걸리던 작업이 30분으로 줄었어요.",
    votes: 142,
    comments: 23,
    thumbnail: true,
  },
  {
    slug: "gpt4o-prompt",
    category: "프롬프트",
    title: "GPT-4o 프롬프트 작성법 완전 가이드",
    author: "이영희",
    time: "5시간 전",
    tags: ["ChatGPT"],
    excerpt:
      "프롬프트 엔지니어링 기초부터 고급 기법까지 체계적으로 정리했습니다. 비개발자도 쉽게 따라할 수 있는 가이드.",
    votes: 98,
    comments: 15,
    thumbnail: false,
  },
  {
    slug: "cursor-fullstack",
    category: "개발/코딩",
    title: "Cursor로 풀스택 앱 만들기 - Part 1",
    author: "박철수",
    time: "1일 전",
    tags: ["Cursor"],
    excerpt:
      "바이브 코딩으로 실제 서비스를 만드는 과정을 처음부터 끝까지 공유합니다. React + Supabase 조합으로 진행.",
    votes: 87,
    comments: 31,
    thumbnail: true,
  },
  {
    slug: "ai-business-plan",
    category: "비즈니스",
    title: "AI로 사업계획서 작성하는 완벽 가이드",
    author: "김민지",
    time: "2일 전",
    tags: ["ChatGPT"],
    excerpt:
      "ChatGPT와 Claude를 활용하여 투자 유치용 사업계획서를 작성하는 방법을 단계별로 안내합니다.",
    votes: 76,
    comments: 19,
    thumbnail: false,
  },
  {
    slug: "n8n-automation",
    category: "자동화",
    title: "n8n으로 업무 자동화 워크플로우 구축하기",
    author: "김영호",
    time: "2일 전",
    tags: ["n8n"],
    excerpt:
      "반복적인 업무를 n8n 워크플로우로 자동화한 실전 사례를 소개합니다. Slack 알림부터 데이터 수집까지.",
    votes: 54,
    comments: 14,
    thumbnail: false,
  },
];

const whoToFollow = [
  {
    username: "honggildong",
    name: "홍길동",
    bio: "AI 마케팅 자동화 전문가",
  },
  {
    username: "leeyounghee",
    name: "이영희",
    bio: "프롬프트 엔지니어링 강사",
  },
  {
    username: "parkchulsoo",
    name: "박철수",
    bio: "바이브 코딩으로 10개 서비스 런칭",
  },
];

/* ─── Page ─── */

export default function Home() {
  return (
    <div className="mx-auto max-w-[1080px] px-6 py-page">
      {/* Hero Carousel */}
      <div className="mb-8">
        <HeroCarousel slides={heroSlides} />
      </div>

      {/* Whiteboard */}
      <div className="mb-8 p-6 border border-border rounded-lg">
        <div className="flex gap-6 items-center">
          <div className="w-48 h-32 bg-muted rounded-lg shrink-0" />
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-foreground mb-2">
              {whiteboard.title}
            </h2>
            <p className="text-sm text-secondary-foreground mb-4">
              {whiteboard.body}
            </p>
            <Link
              href={whiteboard.ctaHref}
              className="inline-block px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              {whiteboard.ctaText}
            </Link>
          </div>
        </div>
      </div>

      {/* Trending Topics */}
      <div className="mb-8">
        <h3 className="text-sm font-semibold text-foreground mb-3">트렌딩 토픽</h3>
        <div className="flex flex-wrap gap-2">
          {trendingTopics.map((topic) => (
            <Link
              key={topic}
              href={`/tag/${encodeURIComponent(topic)}`}
              className="px-3 py-1.5 rounded-full text-sm bg-muted text-sub-foreground hover:bg-accent hover:text-foreground transition-colors"
            >
              {topic}
            </Link>
          ))}
        </div>
      </div>

      <div className="flex gap-10 items-start">
        {/* Main Feed */}
        <div className="flex-1 min-w-0">
          {/* Editor's Pick */}
          <div className="mb-8 pb-8 border-b border-border">
            <p className="text-sm font-semibold text-sub-foreground uppercase tracking-wider mb-4">
              Editor&apos;s Pick
            </p>
            <Link href={`/posts/${featuredPost.slug}`} className="group block">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-full bg-muted shrink-0" />
                <span className="text-sm text-sub-foreground">
                  <span className="font-medium text-foreground">
                    {featuredPost.author}
                  </span>
                  {" in "}
                  <span className="font-medium text-foreground">
                    {featuredPost.category}
                  </span>
                </span>
              </div>
              <h2 className="text-2xl font-semibold text-foreground group-hover:underline leading-snug mb-2">
                {featuredPost.title}
              </h2>
              <p className="text-base text-secondary-foreground line-clamp-3 leading-relaxed mb-3">
                {featuredPost.excerpt}
              </p>
              <div className="flex items-center gap-4 text-sm text-sub-foreground">
                <span>{featuredPost.time}</span>
                <span className="flex items-center gap-1">
                  <Heart className="w-5 h-5" strokeWidth={1.5} /> {featuredPost.votes}
                </span>
                <span className="flex items-center gap-1">
                  <MessageSquare className="w-5 h-5" strokeWidth={1.5} />{" "}
                  {featuredPost.comments}
                </span>
              </div>
            </Link>
          </div>

          <div className="pb-4">
            <SortTabs />
          </div>

          <div className="divide-y divide-border">
            {posts.map((post) => (
              <PostCard key={post.slug} {...post} />
            ))}
          </div>

          <div className="pt-6">
            <Link
              href="/explore/feed"
              className="block text-center py-3 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              탐색 더 보기 →
            </Link>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="w-80 hidden lg:flex flex-col shrink-0 sticky top-20">
          {/* Community Snapshot */}
          <div className="pb-8">
            <h3 className="text-base font-semibold text-foreground mb-4">
              커뮤니티
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <Users className="w-4 h-4 text-sub-foreground mx-auto mb-1" strokeWidth={1.5} />
                <p className="text-lg font-semibold text-foreground">12,400</p>
                <p className="text-sm text-sub-foreground">회원</p>
              </div>
              <div className="text-center">
                <FileText className="w-4 h-4 text-sub-foreground mx-auto mb-1" strokeWidth={1.5} />
                <p className="text-lg font-semibold text-foreground">3,200</p>
                <p className="text-sm text-sub-foreground">게시글</p>
              </div>
              <div className="text-center">
                <GraduationCap className="w-4 h-4 text-sub-foreground mx-auto mb-1" strokeWidth={1.5} />
                <p className="text-lg font-semibold text-foreground">2,100</p>
                <p className="text-sm text-sub-foreground">수료</p>
              </div>
            </div>
          </div>

          {/* Upcoming Event */}
          <div className="pb-8">
            <h3 className="text-base font-semibold text-foreground mb-4">
              다가오는 이벤트
            </h3>
            <Link
              href="/events"
              className="block p-4 border border-border rounded-lg hover:bg-muted transition-colors"
            >
              <p className="text-sm font-medium text-foreground mb-1">
                무료 AI 토크: Claude Code 활용법
              </p>
              <p className="text-sm text-sub-foreground mb-2">
                3월 15일 (토) 19:00 · 온라인
              </p>
              <p className="text-sm text-primary font-medium">신청하기 →</p>
            </Link>
          </div>

          {/* Who to Follow */}
          <div className="pb-8">
            <h3 className="text-base font-semibold text-foreground mb-4">
              추천 작성자
            </h3>
            <div className="space-y-4">
              {whoToFollow.map((user) => (
                <div key={user.username} className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-muted shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div>
                        <Link
                          href={`/profile/${user.username}`}
                          className="text-sm font-medium text-foreground hover:underline"
                        >
                          {user.name}
                        </Link>
                        <p className="text-sm text-sub-foreground">
                          @{user.username}
                        </p>
                      </div>
                      <button
                        type="button"
                        className="px-3 py-1 text-sm font-medium border border-border rounded-full text-foreground hover:bg-muted transition-colors shrink-0"
                      >
                        팔로우
                      </button>
                    </div>
                    <p className="text-sm text-sub-foreground line-clamp-1 mt-1">
                      {user.bio}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
