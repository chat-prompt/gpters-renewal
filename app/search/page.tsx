"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/ui/pagination";
import { SectionHeader } from "@/components/site/section-header";
import { UserRow } from "@/components/site/user-row";
import { SearchResultRow } from "@/components/site/search-result-row";

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
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* Search Input */}
      <div className="flex gap-2 mb-6">
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="검색어를 입력하세요..."
        />
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
        <SectionHeader
          title="스터디 (5건)"
          onViewAll={() => {}}
          className="mb-3"
        />
        <div className="border border-border rounded-lg divide-y divide-border">
          {studyResults.map((study) => (
            <SearchResultRow
              key={study.title}
              type="study"
              data={{
                title: study.title,
                description: study.desc,
                status: study.status,
                href: "/study/ai-automation",
              }}
            />
          ))}
        </div>
      </section>

      {/* Post Results */}
      <section className="mb-8">
        <h2 className="text-sm font-bold text-foreground mb-3">
          게시글 (38건)
        </h2>
        <div className="border border-border rounded-lg divide-y divide-border">
          {postResults.map((post) => (
            <SearchResultRow
              key={post.title}
              type="post"
              data={{
                category: post.category,
                title: post.title,
                author: post.author,
                time: post.time,
                excerpt: post.excerpt,
                votes: post.votes,
                href: "/posts/claude-marketing",
              }}
            />
          ))}
        </div>
      </section>

      {/* User Results */}
      <section className="mb-8">
        <SectionHeader
          title="사용자 (4명)"
          onViewAll={() => {}}
          className="mb-3"
        />
        <div className="border border-border rounded-lg divide-y divide-border">
          {userResults.map((user) => (
            <UserRow
              key={user.username}
              name={user.name}
              username={user.username}
              description={user.desc}
              href={`/profile/${user.username}`}
            />
          ))}
        </div>
      </section>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={5}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
