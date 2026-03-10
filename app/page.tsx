"use client";

import { useState } from "react";
import Link from "next/link";
import {
  X,
  Heart,
  MessageSquare,
  Users,
  FileText,
  GraduationCap,
} from "lucide-react";
import { PostCard } from "@/components/site/post-card";
import { SortTabs } from "@/components/site/sort-tabs";
import { SidebarStudyList } from "@/components/site/sidebar-study-list";

/* ─── Mock Data ─── */

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
  const [showBanner, setShowBanner] = useState(true);

  return (
    <div className="mx-auto max-w-[1080px] px-6 py-8">
      {/* Study Recruitment Banner */}
      {showBanner && (
        <div className="flex items-center justify-between px-4 py-3 mb-6 rounded-lg bg-primary text-primary-foreground">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium">
              21기 AI 스터디 모집 중 — 얼리버드 할인 D-7
            </span>
            <Link
              href="/study/ai-study-21"
              className="text-xs font-medium px-3 py-1 rounded-full bg-primary-foreground text-primary hover:opacity-90 transition-opacity"
            >
              보러가기
            </Link>
          </div>
          <button
            onClick={() => setShowBanner(false)}
            className="shrink-0 p-1 hover:opacity-70"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Editor's Pick */}
      <div className="mb-8 pb-8 border-b border-border">
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4">
          Editor's Pick
        </p>
        <Link href={`/posts/${featuredPost.slug}`} className="group block">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-full bg-muted shrink-0" />
            <span className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">
                {featuredPost.author}
              </span>
              {" in "}
              <span className="font-medium text-foreground">
                {featuredPost.category}
              </span>
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-foreground group-hover:underline leading-snug mb-2">
            {featuredPost.title}
          </h2>
          <p className="text-base text-muted-foreground line-clamp-3 leading-relaxed mb-3">
            {featuredPost.excerpt}
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>{featuredPost.time}</span>
            <span className="flex items-center gap-1">
              <Heart className="w-3.5 h-3.5" /> {featuredPost.votes}
            </span>
            <span className="flex items-center gap-1">
              <MessageSquare className="w-3.5 h-3.5" /> {featuredPost.comments}
            </span>
          </div>
        </Link>
      </div>

      {/* Trending Topics */}
      <div className="mb-8">
        <h3 className="text-sm font-bold text-foreground mb-3">
          트렌딩 토픽
        </h3>
        <div className="flex flex-wrap gap-2">
          {trendingTopics.map((topic) => (
            <Link
              key={topic}
              href={`/tag/${encodeURIComponent(topic)}`}
              className="px-3 py-1.5 rounded-full text-xs bg-muted text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
            >
              {topic}
            </Link>
          ))}
        </div>
      </div>

      <div className="flex gap-10 items-start">
        {/* Main Feed */}
        <div className="flex-1 min-w-0">
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
            <h3 className="text-base font-bold text-foreground mb-4">
              커뮤니티
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <Users className="w-4 h-4 text-muted-foreground mx-auto mb-1" />
                <p className="text-lg font-bold text-foreground">12,400</p>
                <p className="text-xs text-muted-foreground">회원</p>
              </div>
              <div className="text-center">
                <FileText className="w-4 h-4 text-muted-foreground mx-auto mb-1" />
                <p className="text-lg font-bold text-foreground">3,200</p>
                <p className="text-xs text-muted-foreground">게시글</p>
              </div>
              <div className="text-center">
                <GraduationCap className="w-4 h-4 text-muted-foreground mx-auto mb-1" />
                <p className="text-lg font-bold text-foreground">2,100</p>
                <p className="text-xs text-muted-foreground">수료</p>
              </div>
            </div>
          </div>

          {/* Study Recruitment */}
          <div className="pb-8">
            <SidebarStudyList study={cohortStudy} />
          </div>

          {/* Who to Follow */}
          <div className="pb-8">
            <h3 className="text-base font-bold text-foreground mb-4">
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
                        <p className="text-xs text-muted-foreground">
                          @{user.username}
                        </p>
                      </div>
                      <button
                        type="button"
                        className="px-3 py-1 text-xs font-medium border border-border rounded-full text-foreground hover:bg-muted transition-colors shrink-0"
                      >
                        팔로우
                      </button>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-1 mt-1">
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
