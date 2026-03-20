import Link from "next/link";
import {
  Heart,
  MessageSquare,
} from "lucide-react";
import { HeroCarousel } from "@/components/site/hero-carousel";
import { Avatar } from "@/components/ui/avatar";
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

const featuredPosts = [
  {
    slug: "ai-trend-2025",
    category: "트렌드",
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
    category: "개발/코딩",
    title: "Cursor로 풀스택 앱 만들기 — 바이브 코딩 실전기",
    author: "박철수",
    username: "parkchulsoo",
    time: "1일 전",
    votes: 87,
    comments: 31,
  },
  {
    slug: "claude-marketing",
    category: "AI활용법",
    title: "Claude로 마케팅 자동화 구축기 — 주 3시간을 30분으로",
    author: "홍길동",
    username: "honggildong",
    time: "3시간 전",
    votes: 142,
    comments: 23,
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

      {/* Editor's Pick — Magazine Layout */}
      <div className="mb-8">
        <p className="text-sm font-semibold text-sub-foreground uppercase tracking-wider mb-4">
          Editor&apos;s Pick
        </p>
        <div className="flex gap-6">
          {/* Main Feature (Left) */}
          <Link href={`/posts/${featuredPosts[0].slug}`} className="group flex-1 min-w-0">
            {featuredPosts[0].thumbnailUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={featuredPosts[0].thumbnailUrl}
                alt=""
                className="w-full h-56 object-cover rounded-lg mb-4"
              />
            )}
            <div className="flex items-center gap-2 mb-2">
              <Avatar size="sm" />
              <span className="text-sm text-sub-foreground">
                <span className="font-medium text-foreground">
                  {featuredPosts[0].author}
                </span>
                {" · "}
                <span>{featuredPosts[0].category}</span>
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

          {/* Side Features (Right) */}
          <div className="w-72 shrink-0 flex flex-col gap-6">
            {featuredPosts.slice(1).map((fp) => (
              <Link key={fp.slug} href={`/posts/${fp.slug}`} className="group flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Avatar size="sm" />
                  <span className="text-sm text-sub-foreground">
                    <span className="font-medium text-foreground">{fp.author}</span>
                    {" · "}{fp.category}
                  </span>
                </div>
                <h3 className="font-semibold text-foreground group-hover:underline leading-snug mb-2">
                  {fp.title}
                </h3>
                <div className="flex items-center gap-3 text-sm text-sub-foreground">
                  <span className="flex items-center gap-1">
                    <Heart className="w-5 h-5" strokeWidth={1.5} /> {fp.votes}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageSquare className="w-5 h-5" strokeWidth={1.5} /> {fp.comments}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
