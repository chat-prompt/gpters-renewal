"use client";

import { useState } from "react";
import Link from "next/link";
import { ImageIcon, X } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

interface CaseArticleFormProps {
  categories: string[];
  suggestedTags: string[];
}

export function CaseArticleForm({
  categories,
  suggestedTags,
}: CaseArticleFormProps) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  return (
    <div className="space-y-6">
      {/* Thumbnail */}
      <div>
        <p className="text-sm font-medium text-foreground mb-2">
          썸네일 이미지 (선택)
        </p>
        <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
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
        <p className="text-sm font-medium text-foreground mb-2">본문</p>
        {/* Toolbar mockup */}
        <div className="flex items-center gap-1 p-2 border border-border border-b-0 rounded-t-lg bg-muted">
          {["B", "I", "H1", "H2", "UL", "OL", "Code", "Link"].map((tool) => (
            <button
              key={tool}
              className="px-2 py-1 text-xs text-muted-foreground rounded-md"
            >
              {tool}
            </button>
          ))}
        </div>
        <Textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="AI 활용 경험을 자유롭게 작성해주세요..."
          className="min-h-[300px] resize-none rounded-t-none border-border p-4 leading-relaxed"
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
  );
}
