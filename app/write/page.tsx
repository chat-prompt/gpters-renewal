"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, ImageIcon, X } from "lucide-react";

/* ─── Mock Data ─── */

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

/* ─── Page ─── */

export default function WritePage() {
  const [type, setType] = useState<"feed" | "case">("case");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [feedContent, setFeedContent] = useState("");

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link
            href="/explore/feed"
            className="text-muted-foreground"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-bold text-foreground">글쓰기</h1>
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
              : "border-transparent text-muted-foreground"
          }`}
        >
          피드 포스트
        </button>
        <button
          onClick={() => setType("case")}
          className={`px-4 py-2 text-sm whitespace-nowrap border-b-2 ${
            type === "case"
              ? "border-primary text-foreground font-medium"
              : "border-transparent text-muted-foreground"
          }`}
        >
          사례 게시글
        </button>
      </div>

      {/* Feed Post Form */}
      {type === "feed" && (
        <div className="space-y-4">
          <div className="border border-border rounded-lg p-4 bg-background">
            <textarea
              value={feedContent}
              onChange={(e) => setFeedContent(e.target.value)}
              placeholder="무슨 AI 이야기를 나누고 싶으신가요? (최대 500자)"
              className="w-full min-h-[120px] resize-none text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none"
              maxLength={500}
            />
            <div className="flex items-center justify-between border-t border-border pt-3 mt-3">
              <div className="flex items-center gap-2">
                <button className="p-2 text-muted-foreground rounded-md">
                  <ImageIcon className="w-4 h-4" />
                </button>
              </div>
              <span className="text-xs text-muted-foreground">
                {feedContent.length}/500
              </span>
            </div>
          </div>

          {/* Tags */}
          <div>
            <p className="text-sm font-medium text-foreground mb-2">
              태그 (선택)
            </p>
            <div className="flex gap-2 flex-wrap">
              {suggestedTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-2 py-1 text-xs rounded-md border ${
                    selectedTags.includes(tag)
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground"
                  }`}
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Case Article Form */}
      {type === "case" && (
        <div className="space-y-6">
          {/* Thumbnail */}
          <div>
            <p className="text-sm font-medium text-foreground mb-2">
              썸네일 이미지 (선택)
            </p>
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center bg-background">
              <ImageIcon className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                이미지를 드래그하거나 클릭하여 업로드
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                권장 크기: 1200x630px
              </p>
            </div>
          </div>

          {/* Title */}
          <div>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="제목을 입력하세요"
              className="w-full text-2xl font-bold bg-background text-foreground placeholder:text-muted-foreground focus:outline-none border-b border-border pb-3"
            />
          </div>

          {/* Category */}
          <div>
            <p className="text-sm font-medium text-foreground mb-2">
              카테고리 (필수)
            </p>
            <div className="flex gap-2 flex-wrap">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-3 py-1.5 text-sm rounded-md border ${
                    category === cat
                      ? "border-primary bg-primary/10 text-primary font-medium"
                      : "border-border text-muted-foreground"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div>
            <p className="text-sm font-medium text-foreground mb-2">
              태그 (선택, 복수 가능)
            </p>
            <div className="flex gap-2 flex-wrap mb-2">
              {selectedTags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-accent text-accent-foreground rounded-md"
                >
                  #{tag}
                  <button onClick={() => toggleTag(tag)}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2 flex-wrap">
              {suggestedTags
                .filter((t) => !selectedTags.includes(t))
                .map((tag) => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className="px-2 py-1 text-xs rounded-md border border-border text-muted-foreground"
                  >
                    #{tag}
                  </button>
                ))}
            </div>
          </div>

          {/* Body (Editor Mockup) */}
          <div>
            <p className="text-sm font-medium text-foreground mb-2">
              본문
            </p>
            {/* Toolbar mockup */}
            <div className="flex items-center gap-1 p-2 border border-border border-b-0 rounded-t-lg bg-muted">
              {["B", "I", "H1", "H2", "UL", "OL", "Code", "Link"].map(
                (tool) => (
                  <button
                    key={tool}
                    className="px-2 py-1 text-xs text-muted-foreground rounded-md"
                  >
                    {tool}
                  </button>
                )
              )}
            </div>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="AI 활용 경험을 자유롭게 작성해주세요..."
              className="w-full min-h-[300px] resize-none border border-border rounded-b-lg p-4 text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring leading-relaxed"
            />
          </div>

          {/* Auto-save indicator */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>자동 저장: 30초마다 저장됩니다</span>
            <Link href="/write/drafts" className="text-primary">
              임시저장 목록
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
