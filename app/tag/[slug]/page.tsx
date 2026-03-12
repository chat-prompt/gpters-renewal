"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { PostCard } from "@/components/site/post-card";
import { SortTabs } from "@/components/site/sort-tabs";
import { Pagination } from "@/components/ui/pagination";

/* --- Mock Data --- */

const allPosts = [
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
    slug: "gpt4o-prompt",
    category: "프롬프트",
    title: "GPT-4o 프롬프트 작성법 완전 가이드",
    author: "이영희",
    time: "5시간 전",
    tags: ["ChatGPT", "프롬프트"],
    excerpt:
      "프롬프트 엔지니어링 기초부터 고급 기법까지 체계적으로 정리했습니다. 비개발자도 쉽게 따라할 수 있는 가이드.",
    votes: 98,
    comments: 15,
    thumbnail: false,
  },
  {
    slug: "cursor-fullstack",
    category: "개발/코딩",
    title: "Cursor로 풀스택 앱 만들기 - Part 1",
    author: "박철수",
    time: "1일 전",
    tags: ["Cursor", "바이브코딩"],
    excerpt:
      "바이브 코딩으로 실제 서비스를 만드는 과정을 처음부터 끝까지 공유합니다. React + Supabase 조합으로 진행.",
    votes: 87,
    comments: 31,
    thumbnail: true,
  },
  {
    slug: "n8n-automation",
    category: "자동화",
    title: "n8n으로 업무 자동화 워크플로우 구축하기",
    author: "김영호",
    time: "2일 전",
    tags: ["n8n", "자동화"],
    excerpt:
      "반복적인 업무를 n8n 워크플로우로 자동화한 실전 사례를 소개합니다. Slack 알림부터 데이터 수집까지.",
    votes: 65,
    comments: 12,
    thumbnail: false,
  },
  {
    slug: "ai-business-plan",
    category: "비즈니스",
    title: "AI로 사업계획서 작성하는 완벽 가이드",
    author: "김민지",
    time: "2일 전",
    tags: ["ChatGPT", "Claude"],
    excerpt:
      "ChatGPT와 Claude를 활용하여 투자 유치용 사업계획서를 작성하는 방법을 단계별로 안내합니다.",
    votes: 76,
    comments: 19,
    thumbnail: false,
  },
  {
    slug: "midjourney-branding",
    category: "디자인",
    title: "Midjourney V6로 브랜드 이미지 제작하기",
    author: "이수현",
    time: "3일 전",
    tags: ["Midjourney", "디자인"],
    excerpt:
      "Midjourney V6의 새로운 기능을 활용하여 브랜드 로고와 마케팅 이미지를 직접 만드는 과정을 공유합니다.",
    votes: 65,
    comments: 8,
    thumbnail: true,
  },
  {
    slug: "runway-short-film",
    category: "미디어",
    title: "Runway Gen-3로 단편 영상 제작기",
    author: "정다은",
    time: "4일 전",
    tags: ["Runway", "영상"],
    excerpt:
      "AI 영상 생성 도구 Runway Gen-3를 활용해서 3분짜리 단편 영상을 만든 전체 과정과 팁을 공유합니다.",
    votes: 54,
    comments: 17,
    thumbnail: true,
  },
  {
    slug: "ai-trend-2025",
    category: "트렌드",
    title: "2025년 주목할 AI 트렌드 TOP 10",
    author: "최준혁",
    time: "5일 전",
    tags: ["ChatGPT", "Claude", "Gemini"],
    excerpt:
      "올해 하반기부터 주목해야 할 AI 산업 트렌드를 정리했습니다. 에이전트, 멀티모달, 온디바이스 AI까지.",
    votes: 112,
    comments: 27,
    thumbnail: false,
  },
];

const tagDescriptions: Record<string, string> = {
  Claude: "Anthropic이 개발한 AI 어시스턴트. 긴 문맥 처리와 안전성에 강점이 있습니다.",
  ChatGPT: "OpenAI의 대화형 AI. GPT-4o 기반으로 텍스트, 이미지, 음성 멀티모달을 지원합니다.",
  Cursor: "AI 기반 코드 에디터. VS Code 포크로 자동 완성과 코드 생성 기능을 제공합니다.",
  n8n: "오픈소스 워크플로우 자동화 도구. 노코드로 복잡한 업무 자동화를 구축할 수 있습니다.",
  자동화: "AI와 노코드 도구를 활용한 업무 자동화 관련 콘텐츠입니다.",
  프롬프트: "AI에게 효과적으로 지시하는 프롬프트 엔지니어링 기법과 사례를 다룹니다.",
  Midjourney: "텍스트-투-이미지 AI 생성 도구. 고품질 이미지 생성에 특화되어 있습니다.",
  Runway: "AI 기반 영상 생성 및 편집 도구. Gen-3 모델로 텍스트에서 영상을 생성합니다.",
  Gemini: "Google DeepMind의 멀티모달 AI 모델. 텍스트, 이미지, 코드를 통합 처리합니다.",
  바이브코딩: "AI와 함께 코딩하는 새로운 개발 방식. 자연어로 소프트웨어를 만듭니다.",
  "AI 에이전트": "자율적으로 작업을 수행하는 AI 시스템. 복잡한 워크플로우를 자동으로 처리합니다.",
  디자인: "AI를 활용한 디자인 작업 관련 콘텐츠입니다.",
  영상: "AI를 활용한 영상 제작 관련 콘텐츠입니다.",
};


/* --- Page --- */

export default function TagPage() {
  const params = useParams();
  const tag = decodeURIComponent(params.slug as string);
  const [sortBy, setSortBy] = useState("popular");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredPosts = useMemo(() => {
    const matched = allPosts.filter((post) =>
      post.tags.some((t) => t.toLowerCase() === tag.toLowerCase())
    );

    if (sortBy === "popular") {
      return [...matched].sort((a, b) => b.votes - a.votes);
    }

    return matched;
  }, [tag, sortBy]);

  const description =
    tagDescriptions[tag] ??
    `"${tag}" 태그가 붙은 게시글을 모아봅니다.`;

  return (
    <div className="mx-auto max-w-3xl px-6 py-page">
      {/* Tag Header */}
      <div className="pb-6 border-b border-border">
        <h1 className="text-2xl font-semibold text-foreground">{tag}</h1>
        <p className="text-sm text-sub-foreground mt-1">{description}</p>
        <p className="text-sm text-sub-foreground mt-2">
          게시글 {filteredPosts.length}개 · 이번 주 3개
        </p>
      </div>

      {/* Sort */}
      <div className="py-4">
        <SortTabs value={sortBy} onChange={setSortBy} />
      </div>

      {/* Post List */}
      {filteredPosts.length > 0 ? (
        <div className="divide-y divide-border">
          {filteredPosts.map((post) => (
            <PostCard key={post.slug} {...post} />
          ))}
        </div>
      ) : (
        <div className="py-12 text-center text-sm text-sub-foreground">
          해당 태그에 맞는 게시글이 없습니다.
        </div>
      )}

      {/* Pagination */}
      {filteredPosts.length > 0 && (
        <div className="pt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={1}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
}
