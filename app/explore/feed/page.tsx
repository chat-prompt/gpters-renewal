"use client";

import { useState } from "react";
import Link from "next/link";
import { PenSquare, X } from "lucide-react";
import { PostCard } from "@/components/site/post-card";
import { Pagination } from "@/components/ui/pagination";

/* ─── Mock Data ─── */

const categories = [
  "전체",
  "AI활용법",
  "프롬프트",
  "자동화",
  "개발/코딩",
  "비즈니스",
  "뉴스",
];

const allPosts = [
  {
    slug: "claude-marketing",
    category: "AI 활용법",
    title: "Claude로 마케팅 자동화 구축기",
    author: "홍길동",
    time: "3시간 전",
    tags: ["Claude", "마케팅", "자동화", "중급"],
    excerpt:
      "이번에 Claude를 활용해서 마케팅 이메일 자동화 파이프라인을 구축한 경험을 공유합니다. 매주 3시간 걸리던 작업이 30분으로 줄었어요.",
    votes: 142,
    comments: 23,
  },
  {
    slug: "gpt4o-prompt",
    category: "프롬프트",
    title: "GPT-4o 프롬프트 작성법 완전 가이드",
    author: "이영희",
    time: "5시간 전",
    tags: ["ChatGPT", "입문", "튜토리얼"],
    excerpt:
      "프롬프트 엔지니어링 기초부터 고급 기법까지 체계적으로 정리했습니다. 비개발자도 쉽게 따라할 수 있는 가이드.",
    votes: 98,
    comments: 15,
  },
  {
    slug: "cursor-fullstack",
    category: "개발/코딩",
    title: "Cursor로 풀스택 앱 만들기 - Part 1",
    author: "박철수",
    time: "1일 전",
    tags: ["Cursor", "중급", "튜토리얼"],
    excerpt:
      "바이브 코딩으로 실제 서비스를 만드는 과정을 처음부터 끝까지 공유합니다. React + Supabase 조합으로 진행.",
    votes: 87,
    comments: 31,
  },
  {
    slug: "n8n-automation",
    category: "자동화",
    title: "n8n으로 업무 자동화 워크플로우 구축하기",
    author: "김영호",
    time: "2일 전",
    tags: ["n8n", "자동화", "노코드"],
    excerpt:
      "반복적인 업무를 n8n 워크플로우로 자동화한 실전 사례를 소개합니다. Slack 알림부터 데이터 수집까지.",
    votes: 65,
    comments: 12,
  },
  {
    slug: "ai-business-plan",
    category: "비즈니스",
    title: "AI로 사업계획서 작성하는 완벽 가이드",
    author: "김민지",
    time: "2일 전",
    tags: ["ChatGPT", "비즈니스", "입문"],
    excerpt:
      "ChatGPT와 Claude를 활용하여 투자 유치용 사업계획서를 작성하는 방법을 단계별로 안내합니다.",
    votes: 76,
    comments: 19,
  },
  {
    slug: "midjourney-branding",
    category: "AI 활용법",
    title: "Midjourney V6로 브랜드 이미지 제작하기",
    author: "이수현",
    time: "3일 전",
    tags: ["Midjourney", "디자인", "중급"],
    excerpt:
      "Midjourney V6의 새로운 기능을 활용하여 브랜드 로고와 마케팅 이미지를 직접 만드는 과정을 공유합니다.",
    votes: 65,
    comments: 8,
  },
  {
    slug: "gemini-analysis",
    category: "AI 활용법",
    title: "Gemini로 데이터 분석하기 - 실전 사례",
    author: "정재호",
    time: "3일 전",
    tags: ["Gemini", "데이터", "중급"],
    excerpt:
      "구글 Gemini의 멀티모달 능력을 활용하여 엑셀 데이터를 자동 분석하고 인사이트를 도출하는 방법.",
    votes: 43,
    comments: 7,
  },
  {
    slug: "ai-news-weekly",
    category: "뉴스",
    title: "AI 뉴스 위클리 - Claude 4, GPT-5 루머 정리",
    author: "뉴스봇",
    time: "4일 전",
    tags: ["뉴스", "트렌드"],
    excerpt:
      "이번 주 주요 AI 뉴스를 정리했습니다. Anthropic의 Claude 4 발표, OpenAI GPT-5 루머, Google의 Gemini 업데이트 등.",
    votes: 112,
    comments: 35,
  },
];

const initialTags = ["ChatGPT", "Claude", "Gemini"];

/* ─── Page ─── */

export default function FeedPage() {
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [selectedSort, setSelectedSort] = useState("인기순");
  const [tags, setTags] = useState(initialTags);
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-foreground">탐색</h1>
        <Link
          href="/write?type=case"
          className="flex items-center gap-2 px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md"
        >
          <PenSquare className="w-4 h-4" /> 글쓰기
        </Link>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-1 border-b border-border mb-4 overflow-x-auto">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 text-sm whitespace-nowrap border-b-2 ${
              selectedCategory === cat
                ? "border-primary text-foreground font-medium"
                : "border-transparent text-muted-foreground"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Tag Filter */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <span className="text-sm text-muted-foreground">태그 필터:</span>
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-accent text-accent-foreground rounded-md"
          >
            #{tag}
            <button onClick={() => setTags(tags.filter((t) => t !== tag))}>
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
        <button className="text-xs text-primary font-medium">
          + 태그 추가
        </button>
      </div>

      {/* Sort & Filter */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-2">
          {["인기순", "최신순", "추천순"].map((sort) => (
            <button
              key={sort}
              onClick={() => setSelectedSort(sort)}
              className={`px-3 py-1 text-sm rounded-md ${
                selectedSort === sort
                  ? "bg-foreground text-background"
                  : "text-muted-foreground"
              }`}
            >
              {sort}
            </button>
          ))}
        </div>
        <select className="text-sm border border-border rounded-md px-2 py-1 bg-background text-foreground">
          <option>난이도: 전체</option>
          <option>입문</option>
          <option>중급</option>
          <option>고급</option>
        </select>
      </div>

      {/* Post List */}
      <div className="border border-border rounded-lg divide-y divide-border bg-background">
        {allPosts.map((post) => (
          <PostCard key={post.slug} {...post} thumbnail />
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-8">
        <Pagination
          currentPage={currentPage}
          totalPages={5}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
