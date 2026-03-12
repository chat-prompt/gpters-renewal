"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, TrendingUp, Hash, ArrowRight } from "lucide-react";

const popularTags = [
  "ChatGPT",
  "Claude",
  "Cursor",
  "프롬프트",
  "자동화",
  "n8n",
  "Midjourney",
  "바이브코딩",
];

const popularSearches = [
  "Claude 자동화",
  "GPT-4o 프롬프트",
  "Cursor 풀스택",
  "n8n 워크플로우",
  "AI 사업계획서",
];

export function SearchInput() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Click outside to close
  useEffect(() => {
    const listener = (e: MouseEvent) => {
      if (
        !containerRef.current ||
        containerRef.current.contains(e.target as Node)
      )
        return;
      setOpen(false);
    };
    document.addEventListener("mousedown", listener);
    return () => document.removeEventListener("mousedown", listener);
  }, []);

  const navigate = (term: string) => {
    setOpen(false);
    inputRef.current?.blur();
    router.push(`/search?q=${encodeURIComponent(term)}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && query.trim()) {
      navigate(query.trim());
    }
    if (e.key === "Escape") {
      setOpen(false);
      inputRef.current?.blur();
    }
  };

  const trimmed = query.trim().toLowerCase();

  const filteredTags = trimmed
    ? popularTags.filter((t) => t.toLowerCase().includes(trimmed))
    : popularTags;

  const filteredSearches = trimmed
    ? popularSearches.filter((s) => s.toLowerCase().includes(trimmed))
    : popularSearches;

  return (
    <div className="hidden sm:block relative" ref={containerRef}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-sub-foreground" strokeWidth={1.5} />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="GPTers 검색..."
          className={`w-64 pl-9 pr-4 py-1.5 rounded-full text-sm text-foreground placeholder:text-sub-foreground focus:outline-none focus:ring-1 focus:ring-border transition-colors ${open ? "bg-background" : "bg-muted"}`}
        />
      </div>

      {open && (
        <div className="absolute left-0 top-10 w-80 border border-border rounded-lg bg-background z-50">
          {/* Popular Tags */}
          {filteredTags.length > 0 && (
            <div className="px-4 py-3">
              <div className="flex items-center gap-1.5 mb-2">
                <Hash className="w-4 h-4 text-sub-foreground" strokeWidth={1.5} />
                <span className="text-sm font-medium text-sub-foreground">
                  인기 태그
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {filteredTags.slice(0, 6).map((tag) => (
                  <Link
                    key={tag}
                    href={`/tag/${tag}`}
                    onClick={() => setOpen(false)}
                    className="px-2.5 py-1 rounded-full text-sm bg-muted text-sub-foreground hover:bg-accent hover:text-foreground transition-colors"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Divider */}
          {filteredTags.length > 0 && filteredSearches.length > 0 && (
            <div className="border-t border-border" />
          )}

          {/* Popular Searches */}
          {filteredSearches.length > 0 && (
            <div className="py-2">
              <div className="flex items-center gap-1.5 px-4 py-1 mb-1">
                <TrendingUp className="w-4 h-4 text-sub-foreground" strokeWidth={1.5} />
                <span className="text-sm font-medium text-sub-foreground">
                  인기 검색어
                </span>
              </div>
              {filteredSearches.map((term) => (
                <button
                  key={term}
                  onClick={() => navigate(term)}
                  className="flex items-center gap-3 w-full px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                >
                  <Search className="w-4 h-4 text-sub-foreground shrink-0" strokeWidth={1.5} />
                  <span className="flex-1 text-left">{term}</span>
                  <ArrowRight className="w-4 h-4 text-sub-foreground shrink-0" strokeWidth={1.5} />
                </button>
              ))}
            </div>
          )}

          {/* Search footer when query is typed */}
          {trimmed && (
            <>
              <div className="border-t border-border" />
              <button
                onClick={() => navigate(query.trim())}
                className="flex items-center gap-2 w-full px-4 py-3 text-sm text-primary hover:bg-muted transition-colors"
              >
                <Search className="w-4 h-4 shrink-0" strokeWidth={1.5} />
                <span>
                  &ldquo;{query.trim()}&rdquo; 검색하기
                </span>
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
