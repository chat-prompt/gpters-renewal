"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  PenSquare,
  Lightbulb,
  Sparkles,
  Zap,
  Code,
  Briefcase,
  TrendingUp,
  Palette,
  Film,
} from "lucide-react";
import { PostCard } from "@/components/site/post-card";
import { SortTabs } from "@/components/site/sort-tabs";
import { CategoryFilter } from "@/components/site/category-filter";
import { TagFilter } from "@/components/site/tag-filter";
import { CategoryList } from "@/components/site/category-list";
import { SidebarStudyList } from "@/components/site/sidebar-study-list";
import { Pagination } from "@/components/ui/pagination";

/* ─── Mock Data ─── */

const categoryTabs = [
  { id: "전체", name: "전체" },
  { id: "AI활용법", name: "AI활용법" },
  { id: "프롬프트", name: "프롬프트" },
  { id: "자동화", name: "자동화" },
  { id: "개발/코딩", name: "개발/코딩" },
  { id: "디자인", name: "디자인" },
  { id: "미디어", name: "미디어" },
  { id: "비즈니스", name: "비즈니스" },
  { id: "트렌드", name: "트렌드" },
];

const tagOptions = [
  { id: "ChatGPT", name: "ChatGPT" },
  { id: "Claude", name: "Claude" },
  { id: "Gemini", name: "Gemini" },
  { id: "Cursor", name: "Cursor" },
  { id: "Midjourney", name: "Midjourney" },
  { id: "n8n", name: "n8n" },
  { id: "Runway", name: "Runway" },
  { id: "Suno", name: "Suno" },
];

const allPosts = [
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
    slug: "n8n-automation",
    category: "자동화",
    title: "n8n으로 업무 자동화 워크플로우 구축하기",
    author: "김영호",
    time: "2일 전",
    tags: ["n8n"],
    excerpt:
      "반복적인 업무를 n8n 워크플로우로 자동화한 실전 사례를 소개합니다. Slack 알림부터 데이터 수집까지.",
    votes: 65,
    comments: 12,
    thumbnail: false,
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
    slug: "midjourney-branding",
    category: "디자인",
    title: "Midjourney V6로 브랜드 이미지 제작하기",
    author: "이수현",
    time: "3일 전",
    tags: ["Midjourney"],
    excerpt:
      "Midjourney V6의 새로운 기능을 활용하여 브랜드 로고와 마케팅 이미지를 직접 만드는 과정을 공유합니다.",
    votes: 65,
    comments: 8,
    thumbnail: true,
  },
  {
    slug: "runway-short-film",
    category: "미디어",
    title: "Runway Gen-3로 단편 영상 제작기",
    author: "정다은",
    time: "4일 전",
    tags: ["Runway"],
    excerpt:
      "AI 영상 생성 도구 Runway Gen-3를 활용해서 3분짜리 단편 영상을 만든 전체 과정과 팁을 공유합니다.",
    votes: 54,
    comments: 17,
    thumbnail: true,
  },
  {
    slug: "ai-trend-2025",
    category: "트렌드",
    title: "2025년 주목할 AI 트렌드 TOP 10",
    author: "최준혁",
    time: "5일 전",
    tags: ["ChatGPT", "Claude", "Gemini"],
    excerpt:
      "올해 하반기부터 주목해야 할 AI 산업 트렌드를 정리했습니다. 에이전트, 멀티모달, 온디바이스 AI까지.",
    votes: 112,
    comments: 27,
    thumbnail: false,
  },
];

const sidebarCategories = [
  { name: "AI 활용법", slug: "ai-usage", count: 234, icon: Lightbulb },
  { name: "프롬프트", slug: "prompt", count: 156, icon: Sparkles },
  { name: "자동화", slug: "automation", count: 89, icon: Zap },
  { name: "개발/코딩", slug: "dev", count: 121, icon: Code },
  { name: "디자인", slug: "design", count: 67, icon: Palette },
  { name: "미디어", slug: "media", count: 45, icon: Film },
  { name: "비즈니스", slug: "business", count: 78, icon: Briefcase },
  { name: "트렌드", slug: "trend", count: 203, icon: TrendingUp },
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

export default function FeedPage() {
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("popular");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredPosts = useMemo(() => {
    let posts = allPosts;

    // 카테고리 필터
    if (selectedCategory !== "전체") {
      posts = posts.filter((p) => p.category === selectedCategory);
    }

    // 태그 필터 (선택된 태그 중 하나라도 포함)
    if (selectedTags.length > 0) {
      posts = posts.filter((p) =>
        selectedTags.some((tag) => p.tags.includes(tag))
      );
    }

    // 정렬
    if (sortBy === "popular") {
      posts = [...posts].sort((a, b) => b.votes - a.votes);
    }

    return posts;
  }, [selectedCategory, selectedTags, sortBy]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="flex gap-6 items-start">
        {/* Main Feed */}
        <div className="flex-1 min-w-0 space-y-5">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-bold text-foreground">탐색</h1>
            <Link
              href="/write?type=case"
              className="flex items-center gap-2 px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md"
            >
              <PenSquare className="w-4 h-4" /> 글쓰기
            </Link>
          </div>

          {/* Category Tabs + Sort Dropdown */}
          <div className="flex items-end justify-between gap-4">
            <CategoryFilter
              categories={categoryTabs}
              selected={selectedCategory}
              onChange={(id) => {
                setSelectedCategory(id);
                setCurrentPage(1);
              }}
              className="flex-1 min-w-0"
            />
            <SortTabs
              defaultValue={sortBy}
              onChange={setSortBy}
              className="shrink-0 mb-px"
            />
          </div>

          {/* Tag Filter */}
          <TagFilter
            tags={tagOptions}
            selected={selectedTags}
            onChange={(ids) => {
              setSelectedTags(ids);
              setCurrentPage(1);
            }}
          />

          {/* Post List */}
          {filteredPosts.length > 0 ? (
            <div className="border border-border rounded-lg divide-y divide-border">
              {filteredPosts.map((post) => (
                <PostCard key={post.slug} {...post} />
              ))}
            </div>
          ) : (
            <div className="border border-border rounded-lg p-8 text-center text-sm text-muted-foreground">
              해당 조건에 맞는 게시글이 없습니다.
            </div>
          )}

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={5}
            onPageChange={setCurrentPage}
          />
        </div>

        {/* Sidebar */}
        <aside className="w-72 hidden lg:flex flex-col gap-5 shrink-0">
          <SidebarStudyList study={cohortStudy} />
          <CategoryList categories={sidebarCategories} />
        </aside>
      </div>
    </div>
  );
}
