"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { FeedPostForm } from "@/components/site/feed-post-form";
import { CaseArticleForm } from "@/components/site/case-article-form";

/* --- Mock Data --- */

const categories = [
  "AI 활용법",
  "프롬프트",
  "자동화/노코드",
  "개발/코딩",
  "비즈니스/마케팅",
  "AI 뉴스",
];

const suggestedTags = [
  "ChatGPT",
  "Claude",
  "Gemini",
  "Midjourney",
  "Cursor",
  "n8n",
  "Make",
  "입문",
  "중급",
  "고급",
  "튜토리얼",
  "사례",
  "리뷰",
];

/* --- Page --- */

export default function WritePage() {
  const [type, setType] = useState<"feed" | "case">("case");

  return (
    <div className="mx-auto max-w-3xl px-4 py-page">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link
            href="/explore/feed"
            className="text-sub-foreground"
          >
            <ChevronLeft className="w-5 h-5" strokeWidth={1.5} />
          </Link>
          <h1 className="text-xl font-semibold text-foreground">글쓰기</h1>
        </div>
        <button className="px-6 py-2 text-sm bg-primary text-primary-foreground rounded-md font-medium">
          {type === "feed" ? "포스트 게시" : "게시글 발행"}
        </button>
      </div>

      {/* Type Selection */}
      <div className="flex gap-1 border-b border-border mb-6">
        <button
          onClick={() => setType("feed")}
          className={`px-4 py-2 text-sm whitespace-nowrap border-b-2 ${
            type === "feed"
              ? "border-primary text-foreground font-medium"
              : "border-transparent text-sub-foreground"
          }`}
        >
          피드 포스트
        </button>
        <button
          onClick={() => setType("case")}
          className={`px-4 py-2 text-sm whitespace-nowrap border-b-2 ${
            type === "case"
              ? "border-primary text-foreground font-medium"
              : "border-transparent text-sub-foreground"
          }`}
        >
          사례 게시글
        </button>
      </div>

      {type === "feed" && <FeedPostForm suggestedTags={suggestedTags} />}

      {type === "case" && (
        <CaseArticleForm
          categories={categories}
          suggestedTags={suggestedTags}
        />
      )}
    </div>
  );
}
