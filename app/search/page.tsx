"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
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

/* ── Type Tabs ── */

type FilterType = "게시글" | "스터디" | "사용자";

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
      스터디: studyResults.length,
      사용자: userResults.length,
    }),
    []
  );

  const types: FilterType[] = ["게시글", "스터디", "사용자"];

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
