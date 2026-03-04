import Link from "next/link";
import { PostCard } from "@/components/site/post-card";
import { SortTabs } from "@/components/site/sort-tabs";
import { HeroCarousel } from "@/components/site/hero-carousel";
import { SidebarStudyList } from "@/components/site/sidebar-study-list";

/* ─── Mock Data ─── */

const banners = [
  {
    tag: "스터디 모집",
    title: "21기 AI 스터디 모집 중",
    description:
      "AI 자동화, 프롬프트 엔지니어링, 바이브코딩 등 6개 스터디가 여러분을 기다립니다. 얼리버드 할인 진행 중!",
    href: "/study/ai-automation",
    cta: "스터디 보러가기",
    bg: "bg-primary",
  },
  {
    tag: "오프라인",
    title: "3월 모각AI — 강남역 위워크",
    description:
      "3/20(토) 14:00, AI 도구 자유 실습 + 네트워킹. 누구나 참여 가능합니다.",
    href: "/community/feed",
    cta: "자세히 보기",
    bg: "bg-[#2563eb]",
  },
  {
    tag: "콘텐츠",
    title: "이번 주 인기 글 Top 3",
    description:
      "Claude 마케팅 자동화, GPT-4o 프롬프트 가이드, Cursor 풀스택 개발기가 가장 많은 관심을 받았습니다.",
    href: "/explore/feed",
    cta: "인기 글 보기",
    bg: "bg-[#171717]",
  },
];

const posts = [
  {
    slug: "claude-marketing",
    category: "AI 활용법",
    title: "Claude로 마케팅 자동화 구축기 — 광고 카피부터 성과 분석까지",
    author: "홍길동",
    time: "3시간 전",
    tags: ["Claude", "마케팅"],
    excerpt: "",
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
    tags: ["GPT-4o", "프롬프트"],
    excerpt: "",
    votes: 98,
    comments: 15,
    thumbnail: false,
  },
  {
    slug: "cursor-fullstack",
    category: "개발/코딩",
    title: "Cursor로 풀스택 앱 만들기 — 기획부터 배포까지 3일 완성",
    author: "박철수",
    time: "1일 전",
    tags: ["Cursor", "바이브코딩"],
    excerpt: "",
    votes: 87,
    comments: 31,
    thumbnail: true,
  },
  {
    slug: "ai-business-plan",
    category: "비즈니스",
    title: "AI로 사업계획서 작성하는 법",
    author: "김민지",
    time: "1일 전",
    tags: ["비즈니스", "ChatGPT"],
    excerpt: "",
    votes: 76,
    comments: 19,
    thumbnail: false,
  },
  {
    slug: "n8n-workflow",
    category: "자동화",
    title: "n8n으로 업무 자동화 시작하기 — 슬랙 알림부터 데이터 수집까지",
    author: "박영호",
    time: "2일 전",
    tags: ["n8n", "자동화"],
    excerpt: "",
    votes: 54,
    comments: 14,
    thumbnail: false,
  },
];

const cohortStudy = {
  slug: "ai-study-21",
  cohort: "21기",
  date: "3/15 ~ 4/12 (4주)",
  enrolled: 47,
  capacity: 120,
  price: "150,000원",
  programs: [
    { slug: "ai-automation", title: "AI 자동화" },
    { slug: "prompt-engineering", title: "프롬프트 엔지니어링" },
    { slug: "vibe-coding", title: "바이브 코딩" },
    { slug: "ai-business", title: "AI 비즈니스" },
    { slug: "ai-design", title: "AI 디자인" },
    { slug: "ai-data", title: "AI 데이터 분석" },
  ],
};

/* ─── Page ─── */

export default function Home() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-6 space-y-6">
      <HeroCarousel slides={banners} />

      <div className="flex gap-6 items-start">
        {/* Main Feed */}
        <div className="flex-1 min-w-0 space-y-5">
          <SortTabs />
          <div className="border border-border rounded-lg divide-y divide-border">
            {posts.map((post) => (
              <PostCard key={post.slug} {...post} />
            ))}
          </div>
          <button className="w-full py-3 text-sm text-muted-foreground border border-border rounded-lg">
            더 보기
          </button>
        </div>

        {/* Sidebar */}
        <aside className="w-72 hidden lg:flex flex-col gap-5 shrink-0">
          <SidebarStudyList study={cohortStudy} />
          <div className="text-xs text-muted-foreground space-y-2 px-2">
            <div className="flex flex-wrap gap-x-3 gap-y-1">
              <Link href="#">이용약관</Link>
              <Link href="#">개인정보처리방침</Link>
              <Link href="#">문의하기</Link>
            </div>
            <p>GPTers &copy; 2025</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
