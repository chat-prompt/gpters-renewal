"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, ArrowUp, ChevronRight } from "lucide-react";

const types = [
  { label: "전체", count: 47 },
  { label: "게시글", count: 38 },
  { label: "스터디", count: 5 },
  { label: "사용자", count: 4 },
];

const studyResults = [
  {
    title: "21기 AI 자동화 스터디",
    status: "모집중",
    desc: "Claude API + n8n 활용 · 3/15 시작 · 150,000원",
  },
  {
    title: "20기 Claude 마스터 스터디",
    status: "완료",
    desc: "Claude 심화 활용 · 수료생 18명",
  },
];

const postResults = [
  {
    category: "AI 활용법",
    title: "Claude로 마케팅 자동화 구축기",
    author: "홍길동",
    time: "3시간 전",
    excerpt:
      "이번에 Claude를 활용해서 마케팅 자동화 파이프라인을 구축한 경험을...",
    votes: 142,
  },
  {
    category: "자동화",
    title: "Claude API와 n8n 연동 가이드",
    author: "이영희",
    time: "2일 전",
    excerpt:
      "Claude API를 n8n과 연동해서 자동화 워크플로우를 만드는 방법...",
    votes: 89,
  },
];

const userResults = [
  {
    name: "홍길동",
    username: "honggildong",
    desc: "AI 자동화 전문가 · 스터디 3회 수료",
  },
  {
    name: "김영호",
    username: "kimyoungho",
    desc: "자동화 스터디장 · 게시글 15건",
  },
];

export default function SearchPage() {
  const [query, setQuery] = useState("Claude 자동화");
  const [selectedType, setSelectedType] = useState("전체");

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* Search Input */}
      <div className="flex gap-2 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full border border-input rounded-md pl-10 pr-4 py-2 text-sm bg-background text-foreground"
            placeholder="검색어를 입력하세요..."
          />
        </div>
        <button className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md">
          검색
        </button>
      </div>

      <p className="text-sm text-muted-foreground mb-4">
        &ldquo;{query}&rdquo; 검색 결과 (47건)
      </p>

      {/* Type Filter */}
      <div className="flex gap-2 mb-6">
        {types.map((type) => (
          <button
            key={type.label}
            onClick={() => setSelectedType(type.label)}
            className={`px-3 py-1 text-sm rounded-md ${
              selectedType === type.label
                ? "bg-foreground text-background"
                : "text-muted-foreground border border-border"
            }`}
          >
            {type.label}({type.count})
          </button>
        ))}
      </div>

      {/* Study Results */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-foreground">스터디 (5건)</h2>
          <button className="text-xs text-muted-foreground flex items-center gap-1">
            전체보기 <ChevronRight className="w-3 h-3" />
          </button>
        </div>
        <div className="border border-border rounded-lg divide-y divide-border bg-background">
          {studyResults.map((study) => (
            <Link
              key={study.title}
              href="/study/ai-automation"
              className="flex items-center justify-between p-4"
            >
              <div>
                <p className="text-sm font-medium text-foreground">
                  {study.title}
                </p>
                <p className="text-xs text-muted-foreground">{study.desc}</p>
              </div>
              <span
                className={`text-xs px-2 py-0.5 rounded-sm ${
                  study.status === "모집중"
                    ? "bg-primary/10 text-primary"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {study.status}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Post Results */}
      <section className="mb-8">
        <h2 className="text-sm font-bold text-foreground mb-3">
          게시글 (38건)
        </h2>
        <div className="border border-border rounded-lg divide-y divide-border bg-background">
          {postResults.map((post) => (
            <Link
              key={post.title}
              href="/posts/claude-marketing"
              className="block p-4"
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-primary font-medium">
                    {post.category}
                  </span>
                  <span className="text-sm font-medium text-foreground">
                    {post.title}
                  </span>
                </div>
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <ArrowUp className="w-3 h-3" />
                  {post.votes}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mb-1">
                @{post.author} · {post.time}
              </p>
              <p className="text-sm text-muted-foreground">{post.excerpt}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* User Results */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-foreground">사용자 (4명)</h2>
          <button className="text-xs text-muted-foreground flex items-center gap-1">
            전체보기 <ChevronRight className="w-3 h-3" />
          </button>
        </div>
        <div className="border border-border rounded-lg divide-y divide-border bg-background">
          {userResults.map((user) => (
            <Link
              key={user.username}
              href={`/profile/${user.username}`}
              className="flex items-center gap-3 p-4"
            >
              <div className="w-10 h-10 rounded-full bg-muted shrink-0" />
              <div>
                <p className="text-sm font-medium text-foreground">
                  {user.name}{" "}
                  <span className="text-muted-foreground">
                    @{user.username}
                  </span>
                </p>
                <p className="text-xs text-muted-foreground">{user.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Pagination */}
      <div className="flex justify-center gap-1">
        {[1, 2, 3, 4, 5].map((page) => (
          <button
            key={page}
            className={`w-8 h-8 text-sm rounded-md ${
              page === 1
                ? "bg-foreground text-background"
                : "text-muted-foreground"
            }`}
          >
            {page}
          </button>
        ))}
      </div>
    </div>
  );
}
