"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Heart, MessageSquare } from "lucide-react";
import { PostCard } from "@/components/site/post-card";
import { UserRow } from "@/components/site/user-row";
import { Pagination } from "@/components/ui/pagination";

/* ── Mock Data ── */

const postResults = [
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
    slug: "n8n-automation",
    category: "자동화",
    title: "Claude API와 n8n 연동 가이드",
    author: "이영희",
    time: "2일 전",
    tags: ["n8n", "Claude"],
    excerpt:
      "Claude API를 n8n과 연동해서 자동화 워크플로우를 만드는 방법을 단계별로 정리했습니다.",
    votes: 89,
    comments: 12,
    thumbnail: false,
  },
  {
    slug: "cursor-fullstack",
    category: "개발/코딩",
    title: "Cursor로 풀스택 앱 만들기",
    author: "박철수",
    time: "1일 전",
    tags: ["Cursor"],
    excerpt:
      "바이브 코딩으로 실제 서비스를 만드는 과정을 처음부터 끝까지 공유합니다.",
    votes: 87,
    comments: 31,
    thumbnail: true,
  },
];

const studyResults = [
  {
    title: "21기 AI 자동화 스터디",
    status: "모집중" as const,
    desc: "Claude API + n8n 활용 · 3/15 시작 · 150,000원",
    slug: "ai-automation",
  },
  {
    title: "20기 Claude 마스터 스터디",
    status: "완료" as const,
    desc: "Claude 심화 활용 · 수료생 18명",
    slug: "claude-master",
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

const communityResults = [
  {
    id: "2",
    author: "수현",
    username: "suhyun",
    time: "2시간 전",
    content: "Claude로 주간 마케팅 리포트 자동 생성하는 프롬프트 공유합니다. 30분 걸리던 작업이 3분으로 줄었어요!",
    likes: 45,
    comments: 12,
  },
  {
    id: "q2",
    author: "은서",
    username: "eunseo",
    time: "5시간 전",
    content: "n8n과 Make 중 어떤 걸 먼저 배우는 게 좋을까요? 비개발자 입장에서 추천 부탁드립니다.",
    likes: 15,
    comments: 9,
  },
];

/* ── Type Tabs ── */

type FilterType = "게시글" | "커뮤니티" | "스터디" | "사용자";

/* ── Page ── */

export default function SearchPage() {
  return (
    <Suspense>
      <SearchPageInner />
    </Suspense>
  );
}

function SearchPageInner() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") ?? "";
  const [selectedType, setSelectedType] = useState<FilterType>("게시글");
  const [currentPage, setCurrentPage] = useState(1);

  const counts = useMemo(
    () => ({
      게시글: postResults.length,
      커뮤니티: communityResults.length,
      스터디: studyResults.length,
      사용자: userResults.length,
    }),
    []
  );

  const types: FilterType[] = ["게시글", "커뮤니티", "스터디", "사용자"];

  if (!query) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16 text-center text-sm text-muted-foreground">
        검색어를 입력하세요.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      {/* Query + Count */}
      <h1 className="text-xl font-extrabold text-foreground mb-1">
        &ldquo;{query}&rdquo; 검색 결과
      </h1>
      <p className="text-sm text-muted-foreground mb-6">
        {counts[selectedType]}건
      </p>

      {/* Type Filter */}
      <div className="flex gap-2 mb-6">
        {types.map((type) => (
          <button
            key={type}
            onClick={() => {
              setSelectedType(type);
              setCurrentPage(1);
            }}
            className={`px-3 py-1 text-sm rounded-full transition-colors ${
              selectedType === type
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:bg-muted"
            }`}
          >
            {type} {counts[type]}
          </button>
        ))}
      </div>

      {/* Post Results */}
      {selectedType === "게시글" && postResults.length > 0 && (
        <section className="mb-8">
          <div className="divide-y divide-border">
            {postResults.map((post) => (
              <PostCard key={post.slug} {...post} />
            ))}
          </div>
        </section>
      )}

      {/* Community Results — Threads style */}
      {selectedType === "커뮤니티" && communityResults.length > 0 && (
        <section className="mb-8">
          <div className="divide-y divide-border">
            {communityResults.map((post) => (
              <Link
                key={post.id}
                href={`/community/${post.id}`}
                className="flex gap-3 py-4 group"
              >
                {/* Avatar + thread line */}
                <div className="flex flex-col items-center shrink-0">
                  <div className="w-9 h-9 rounded-full bg-muted" />
                  {post.comments > 0 && (
                    <div className="w-0.5 flex-1 bg-border mt-2" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 pb-1">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-sm font-medium text-foreground">
                      {post.author}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      @{post.username}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      · {post.time}
                    </span>
                  </div>
                  <p className="text-sm text-foreground leading-relaxed line-clamp-3 mb-2">
                    {post.content}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Heart className="w-3.5 h-3.5" /> {post.likes}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="w-3.5 h-3.5" /> {post.comments}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Study Results */}
      {selectedType === "스터디" && studyResults.length > 0 && (
        <section className="mb-8">
          <div className="divide-y divide-border">
            {studyResults.map((study) => (
              <Link
                key={study.slug}
                href={`/study/${study.slug}`}
                className="flex items-center justify-between py-4 group"
              >
                <div>
                  <p className="text-sm font-medium text-foreground group-hover:underline">
                    {study.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {study.desc}
                  </p>
                </div>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full shrink-0 ml-4 ${
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
      )}

      {/* User Results */}
      {selectedType === "사용자" && userResults.length > 0 && (
        <section className="mb-8">
          <div className="divide-y divide-border">
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
      )}

      {/* Pagination — only when many results */}
      {counts[selectedType] > 10 && (
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(counts[selectedType] / 10)}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}
