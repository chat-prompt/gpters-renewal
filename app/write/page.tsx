"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FeedPostForm } from "@/components/site/feed-post-form";
import { CaseArticleForm } from "@/components/site/case-article-form";
import { useAuth } from "@/lib/auth-context";
import Link from "next/link";

/* --- Mock Data --- */

const categories = [
  "AI 활용법",
  "프롬프트",
  "자동화/노코드",
  "개발/코딩",
  "비즈니스/마케팅",
  "AI 뉴스",
];

const mySeries = [
  { id: "1", title: "맘스만 개발기" },
  { id: "2", title: "자동화 마스터 클래스" },
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
  const router = useRouter();
  const pathname = usePathname();
  const { isLoggedIn } = useAuth();
  const [type, setType] = useState<"feed" | "case">("case");

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center py-page gap-group">
        <p className="text-lg font-semibold text-foreground">로그인이 필요합니다</p>
        <p className="text-sm text-sub-foreground">이 페이지를 보려면 로그인해주세요.</p>
        <Link href={`/login?from=${encodeURIComponent(pathname)}`} className="inline-flex items-center px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
          로그인
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[680px] px-6 py-page">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="text-sub-foreground"
          >
            <ChevronLeft className="w-5 h-5" strokeWidth={1.5} />
          </button>
          <h1 className="text-xl font-semibold text-foreground">글쓰기</h1>
        </div>
        <Button
          onClick={() => {
            router.push(type === "case" ? "/posts/claude-marketing" : "/community/feed");
          }}
        >
          {type === "feed" ? "포스트 게시" : "게시글 발행"}
        </Button>
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
          existingSeries={mySeries}
        />
      )}
    </div>
  );
}
