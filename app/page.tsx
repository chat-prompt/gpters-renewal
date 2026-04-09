import Link from "next/link";
import {
  Heart,
  MessageSquare,
  ArrowRight,
  Mail,
} from "lucide-react";
import { HeroCarousel } from "@/components/site/hero-carousel";
import { EventCard } from "@/components/site/event-card";
import { Avatar } from "@/components/ui/avatar";
import { PostCard } from "@/components/site/post-card";
/* ─── Mock Data ─── */

const heroSlides = [
  {
    tag: "스터디 모집",
    title: "22기 AI 스터디 모집 중 — 신청하기",
    description:
      "바이브코딩, AI 자동화, 에이전트 등 6개 프로그램. 4주간 실전 학습.",
    href: "/study/ai-study-22",
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

const featuredPosts = [
  {
    slug: "ai-trend-2025",
    category: "AI Trend",
    title: "2025년 주목할 AI 트렌드 TOP 10 — 에이전트, 멀티모달, 온디바이스까지",
    author: "최준혁",
    username: "choijunhyuk",
    time: "5일 전",
    excerpt:
      "올해 하반기부터 주목해야 할 AI 산업 트렌드를 정리했습니다. AI 에이전트의 실전 도입부터 멀티모달 모델의 대중화, 온디바이스 AI의 확산까지 핵심 흐름을 짚어봅니다.",
    votes: 312,
    comments: 47,
    thumbnailUrl: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=600&h=400&fit=crop",
  },
  {
    slug: "cursor-fullstack",
    category: "바이브코딩",
    title: "Cursor로 풀스택 앱 만들기 — 바이브 코딩 실전기",
    author: "박철수",
    username: "parkchulsoo",
    time: "1일 전",
    votes: 87,
    comments: 31,
  },
  {
    slug: "claude-marketing",
    category: "AI 사용법",
    title: "Claude로 마케팅 자동화 구축기 — 주 3시간을 30분으로",
    author: "홍길동",
    username: "honggildong",
    time: "3시간 전",
    votes: 142,
    comments: 23,
  },
  {
    slug: "n8n-automation-beginner",
    category: "자동화/노코드",
    title: "n8n 입문 가이드 — 비개발자도 만드는 업무 자동화",
    author: "이서연",
    username: "leesy",
    time: "2일 전",
    votes: 98,
    comments: 15,
  },
];

const weeklyPopular = [
  { slug: "claude-code-vibecoding", title: "Claude Code로 SaaS 하루 만에 런칭한 후기", author: "박철수", votes: 287 },
  { slug: "zenspark-review", title: "Zenspark 완벽 가이드 — AI 리서치 도구 비교", author: "이영희", votes: 231 },
  { slug: "notebooklm-study", title: "NotebookLM으로 논문 100편 정리한 방법", author: "김영호", votes: 198 },
  { slug: "harness-agent", title: "AI 에이전트 Harness로 업무 자동화 구축기", author: "정다은", votes: 176 },
  { slug: "codex-openai", title: "OpenAI Codex CLI 실전 활용법 총정리", author: "최준혁", votes: 154 },
];

const latestPosts = [
  {
    slug: "claude-code-vibecoding",
    category: "바이브코딩",
    title: "Claude Code로 SaaS 하루 만에 런칭한 후기",
    author: "박철수",
    username: "parkchulsoo",
    time: "2시간 전",
    tags: ["Claude Code", "바이브코딩"],
    excerpt: "Claude Code를 활용해서 아이디어부터 배포까지 하루 만에 완성한 SaaS 프로젝트 후기를 공유합니다.",
    votes: 287,
    comments: 42,
    thumbnailUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=240&h=160&fit=crop",
  },
  {
    slug: "n8n-slack-automation",
    category: "자동화/노코드",
    title: "n8n + Slack으로 팀 업무 자동화 완전 정복",
    author: "김영호",
    username: "kimyoungho",
    time: "4시간 전",
    tags: ["n8n", "Slack"],
    excerpt: "Slack 메시지 기반으로 n8n 워크플로우를 트리거하는 실전 자동화 사례 5가지를 소개합니다.",
    votes: 89,
    comments: 14,
  },
  {
    slug: "mcp-opencode",
    category: "에이전트",
    title: "MCP 서버 입문 — OpenCode로 AI 에이전트 만들기",
    author: "정다은",
    username: "jungdaeun",
    time: "6시간 전",
    tags: ["MCP", "에이전트"],
    excerpt: "Model Context Protocol과 OpenCode를 활용해서 나만의 AI 에이전트를 만드는 과정을 단계별로 설명합니다.",
    votes: 67,
    comments: 21,
  },
  {
    slug: "gemini-usage",
    category: "AI 사용법",
    title: "제미나이 2.5 사용법 완전 가이드 — 무료로 시작하기",
    author: "이영희",
    username: "leeyounghee",
    time: "8시간 전",
    tags: ["Gemini", "사용법"],
    excerpt: "Google Gemini 2.5의 새로운 기능과 무료 플랜으로 최대한 활용하는 방법을 정리했습니다.",
    votes: 134,
    comments: 28,
  },
];

const popularTags = ["Claude", "바이브코딩", "n8n", "자동화", "Cursor", "MCP", "에이전트", "ChatGPT", "Gemini", "Midjourney"];

const upcomingEvents = [
  {
    id: 1,
    title: "AI 트렌드 2026 토크쇼 — 에이전트 시대의 시작",
    category: "토크",
    type: "online" as const,
    date: "3월 29일 (토)",
    time: "19:00",
    location: "온라인 (Zoom)",
    description: "2026년 AI 산업의 핵심 트렌드를 짚어보는 토크쇼입니다.",
    host: "GPTers",
    attendees: 84,
    capacity: 200,
    free: true,
  },
  {
    id: 2,
    title: "프롬프트 엔지니어링 핸즈온 워크숍",
    category: "워크숍",
    type: "offline" as const,
    date: "4월 5일 (토)",
    time: "14:00",
    location: "서울 강남구 역삼동 위워크",
    description: "실전 프롬프트 작성법을 배우는 오프라인 워크숍입니다.",
    host: "김민수",
    attendees: 18,
    capacity: 30,
    free: false,
    price: "30,000원",
  },
  {
    id: 3,
    title: "Claude Code 활용법 웨비나",
    category: "웨비나",
    type: "online" as const,
    date: "4월 12일 (토)",
    time: "20:00",
    location: "온라인 (Zoom)",
    description: "AI 코드 에디터 실전 활용법을 알려드립니다.",
    host: "박철수",
    attendees: 132,
    capacity: 300,
    free: true,
  },
];

/* ─── Page ─── */

export default function Home() {
  return (
    <div className="mx-auto max-w-[1020px] px-6 py-page">
      {/* Hero Carousel */}
      <div className="mb-8">
        <HeroCarousel slides={heroSlides} />
      </div>

      {/* Editor's Pick + 이번 주 인기 글 — 2컬럼 */}
      <div className="mb-section">
        <div className="flex gap-8">
          {/* Left: Editor's Pick */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-sub-foreground uppercase tracking-wider mb-4">
              Editor&apos;s Pick
            </p>
            {/* Main Feature */}
            <Link href={`/posts/${featuredPosts[0].slug}`} className="group block mb-4">
              {featuredPosts[0].thumbnailUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={featuredPosts[0].thumbnailUrl}
                  alt=""
                  className="w-full h-52 object-cover rounded-lg mb-4"
                />
              )}
              <div className="flex items-center gap-2 mb-2">
                <Avatar size="sm" />
                <span className="text-sm text-sub-foreground">
                  <span className="font-medium text-foreground">
                    {featuredPosts[0].author}
                  </span>
                  {" · "}{featuredPosts[0].category}
                  {" · "}{featuredPosts[0].time}
                </span>
              </div>
              <h2 className="text-xl font-semibold text-foreground group-hover:underline leading-snug mb-2">
                {featuredPosts[0].title}
              </h2>
              <p className="text-sm font-regular text-secondary-foreground line-clamp-2 leading-relaxed mb-3">
                {featuredPosts[0].excerpt}
              </p>
              <div className="flex items-center gap-3 text-sm text-sub-foreground">
                <span className="flex items-center gap-1">
                  <Heart className="w-5 h-5" strokeWidth={1.5} /> {featuredPosts[0].votes}
                </span>
                <span className="flex items-center gap-1">
                  <MessageSquare className="w-5 h-5" strokeWidth={1.5} /> {featuredPosts[0].comments}
                </span>
              </div>
            </Link>
            {/* Sub Features */}
            <div className="flex gap-4">
              {featuredPosts.slice(1, 3).map((fp) => (
                <Link key={fp.slug} href={`/posts/${fp.slug}`} className="group flex-1 min-w-0 border border-border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Avatar size="sm" />
                    <span className="text-sm text-sub-foreground">
                      <span className="font-medium text-foreground">{fp.author}</span>
                      {" · "}{fp.category}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-foreground group-hover:underline leading-snug mb-2 line-clamp-2">
                    {fp.title}
                  </h3>
                  <div className="flex items-center gap-3 text-sm text-sub-foreground">
                    <span className="flex items-center gap-1">
                      <Heart className="w-4 h-4" strokeWidth={1.5} /> {fp.votes}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="w-4 h-4" strokeWidth={1.5} /> {fp.comments}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Vertical Divider */}
          <div className="w-px bg-border shrink-0" />

          {/* Right: 이번 주 인기 글 */}
          <div className="w-[300px] shrink-0">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-semibold text-sub-foreground uppercase tracking-wider">
                이번 주 인기 글
              </p>
              <Link href="/explore/feed?sort=popular" className="flex items-center gap-1 text-sm text-sub-foreground hover:text-foreground transition-colors">
                전체보기 <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
              </Link>
            </div>
            <div className="space-y-4">
              {weeklyPopular.map((post, i) => (
                <Link key={post.slug} href={`/posts/${post.slug}`} className="group flex gap-3 items-start">
                  <span className="text-lg font-semibold text-sub-foreground w-5 shrink-0">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-foreground group-hover:underline leading-snug line-clamp-2">
                      {post.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1 text-sm text-sub-foreground">
                      <span>{post.author}</span>
                      <span className="flex items-center gap-1">
                        <Heart className="w-4 h-4" strokeWidth={1.5} /> {post.votes}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 다가오는 이벤트 */}
      <div className="mb-section">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-semibold text-sub-foreground uppercase tracking-wider">
            다가오는 이벤트
          </p>
          <Link href="/events" className="flex items-center gap-1 text-sm text-sub-foreground hover:text-foreground transition-colors">
            전체보기 <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
          </Link>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {upcomingEvents.map((event) => (
            <EventCard key={event.id} {...event} />
          ))}
        </div>
      </div>

      {/* 최신 포스트 */}
      <div className="mb-section">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-semibold text-sub-foreground uppercase tracking-wider">
            최신 포스트
          </p>
          <Link href="/explore/feed" className="flex items-center gap-1 text-sm text-sub-foreground hover:text-foreground transition-colors">
            전체보기 <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {latestPosts.map((post) => (
            <PostCard key={post.slug} {...post} />
          ))}
        </div>
      </div>

      {/* 뉴스레터 구독 */}
      <div className="mb-section">
        <div className="border border-border rounded-lg p-8 text-center">
          <Mail className="w-8 h-8 text-primary mx-auto mb-3" strokeWidth={1.5} />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            매주 AI 활용 사례를 이메일로 받아보세요
          </h3>
          <p className="text-sm text-secondary-foreground mb-4">
            에디터가 엄선한 AI 활용 사례와 트렌드를 매주 금요일 보내드립니다.
          </p>
          <div className="flex items-center gap-2 max-w-md mx-auto">
            <input
              type="email"
              placeholder="이메일 주소"
              className="flex-1 h-10 px-4 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <button className="h-10 px-5 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
              구독하기
            </button>
          </div>
        </div>
      </div>

      {/* 인기 태그 */}
      <div>
        <p className="text-sm font-semibold text-sub-foreground uppercase tracking-wider mb-4">
          인기 태그
        </p>
        <div className="flex flex-wrap gap-2">
          {popularTags.map((tag) => (
            <Link
              key={tag}
              href={`/tag/${tag}`}
              className="px-3 py-1.5 text-sm text-secondary-foreground bg-muted rounded-full hover:bg-accent transition-colors"
            >
              #{tag}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
