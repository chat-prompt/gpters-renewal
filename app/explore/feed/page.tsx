"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { PostCard } from "@/components/site/post-card";
import { SortTabs } from "@/components/site/sort-tabs";
import { CategoryFilter } from "@/components/site/category-filter";
import { Pagination } from "@/components/ui/pagination";
import { UserRow } from "@/components/site/user-row";
import { Avatar } from "@/components/ui/avatar";
import { TagList } from "@/components/site/tag-list";

/* ─── Mock Data ─── */

const categoryTabs = [
  { id: "전체", name: "전체" },
  { id: "AI활용법", name: "AI활용법" },
  { id: "프롬프트", name: "프롬프트" },
  { id: "자동화", name: "자동화" },
  { id: "개발/코딩", name: "개발/코딩" },
  { id: "디자인", name: "디자인" },
  { id: "미디어", name: "미디어" },
  { id: "비즈니스", name: "비즈니스" },
  { id: "트렌드", name: "트렌드" },
];

const allPosts = [
  {
    slug: "claude-marketing",
    category: "AI활용법",
    title: "Claude로 마케팅 자동화 구축기",
    author: "홍길동",
    username: "honggildong",
    time: "3시간 전",
    tags: ["Claude", "자동화"],
    excerpt:
      "이번에 Claude를 활용해서 마케팅 이메일 자동화 파이프라인을 구축한 경험을 공유합니다. 매주 3시간 걸리던 작업이 30분으로 줄었어요.",
    votes: 142,
    comments: 23,
    thumbnailUrl: "https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=240&h=160&fit=crop",
  },
  {
    slug: "gpt4o-prompt",
    category: "프롬프트",
    title: "GPT-4o 프롬프트 작성법 완전 가이드",
    author: "이영희",
    username: "leeyounghee",
    time: "5시간 전",
    tags: ["ChatGPT"],
    excerpt:
      "프롬프트 엔지니어링 기초부터 고급 기법까지 체계적으로 정리했습니다. 비개발자도 쉽게 따라할 수 있는 가이드.",
    votes: 98,
    comments: 15,
  },
  {
    slug: "cursor-fullstack",
    category: "개발/코딩",
    title: "Cursor로 풀스택 앱 만들기 - Part 1",
    author: "박철수",
    username: "parkchulsoo",
    time: "1일 전",
    tags: ["Cursor"],
    excerpt:
      "바이브 코딩으로 실제 서비스를 만드는 과정을 처음부터 끝까지 공유합니다. React + Supabase 조합으로 진행.",
    votes: 87,
    comments: 31,
    thumbnailUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=240&h=160&fit=crop",
  },
  {
    slug: "n8n-automation",
    category: "자동화",
    title: "n8n으로 업무 자동화 워크플로우 구축하기",
    author: "김영호",
    username: "kimyoungho",
    time: "2일 전",
    tags: ["n8n"],
    excerpt:
      "반복적인 업무를 n8n 워크플로우로 자동화한 실전 사례를 소개합니다. Slack 알림부터 데이터 수집까지.",
    votes: 65,
    comments: 12,
  },
  {
    slug: "ai-business-plan",
    category: "비즈니스",
    title: "AI로 사업계획서 작성하는 완벽 가이드",
    author: "김민지",
    username: "kimminji",
    time: "2일 전",
    tags: ["ChatGPT"],
    excerpt:
      "ChatGPT와 Claude를 활용하여 투자 유치용 사업계획서를 작성하는 방법을 단계별로 안내합니다.",
    votes: 76,
    comments: 19,
  },
  {
    slug: "midjourney-branding",
    category: "디자인",
    title: "Midjourney V6로 브랜드 이미지 제작하기",
    author: "이수현",
    username: "leesuhyun",
    time: "3일 전",
    tags: ["Midjourney"],
    excerpt:
      "Midjourney V6의 새로운 기능을 활용하여 브랜드 로고와 마케팅 이미지를 직접 만드는 과정을 공유합니다.",
    votes: 65,
    comments: 8,
    thumbnailUrl: "https://images.unsplash.com/photo-1609921141835-710b7fa6e438?w=240&h=160&fit=crop",
  },
  {
    slug: "runway-short-film",
    category: "미디어",
    title: "Runway Gen-3로 단편 영상 제작기",
    author: "정다은",
    username: "jungdaeun",
    time: "4일 전",
    tags: ["Runway"],
    excerpt:
      "AI 영상 생성 도구 Runway Gen-3를 활용해서 3분짜리 단편 영상을 만든 전체 과정과 팁을 공유합니다.",
    votes: 54,
    comments: 17,
    thumbnailUrl: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=240&h=160&fit=crop",
  },
  {
    slug: "ai-trend-2025",
    category: "트렌드",
    title: "2025년 주목할 AI 트렌드 TOP 10",
    author: "최준혁",
    username: "choijunhyuk",
    time: "5일 전",
    tags: ["ChatGPT", "Claude", "Gemini"],
    excerpt:
      "올해 하반기부터 주목해야 할 AI 산업 트렌드를 정리했습니다. 에이전트, 멀티모달, 온디바이스 AI까지.",
    votes: 112,
    comments: 27,
  },
];

const recommendedTopics = [
  "ChatGPT", "Claude", "Cursor", "프롬프트", "자동화",
  "n8n", "Midjourney", "바이브코딩", "AI 에이전트",
];

const editorPicks = [
  {
    slug: "ai-trend-2025",
    title: "2025년 주목할 AI 트렌드 TOP 10",
    author: "최준혁",
    time: "5일 전",
  },
  {
    slug: "claude-marketing",
    title: "Claude로 마케팅 자동화 구축기",
    author: "홍길동",
    time: "3시간 전",
  },
  {
    slug: "cursor-fullstack",
    title: "Cursor로 풀스택 앱 만들기",
    author: "박철수",
    time: "1일 전",
  },
];

const whoToFollow = [
  { username: "honggildong", name: "홍길동", bio: "AI 마케팅 자동화 전문가", posts: 42 },
  { username: "leeyounghee", name: "이영희", bio: "프롬프트 엔지니어링 강사", posts: 38 },
  { username: "parkchulsoo", name: "박철수", bio: "바이브 코딩으로 10개 서비스 런칭", posts: 27 },
];

const POSTS_PER_PAGE = 5;

/* ─── Page ─── */

export default function FeedPage() {
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [sortBy, setSortBy] = useState("popular");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredPosts = useMemo(() => {
    let posts = allPosts;

    if (selectedCategory !== "전체") {
      posts = posts.filter((p) => p.category === selectedCategory);
    }

    if (sortBy === "popular") {
      posts = [...posts].sort((a, b) => b.votes - a.votes);
    }

    return posts;
  }, [selectedCategory, sortBy]);

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  return (
    <div className="overflow-x-clip">
      <div className="mx-auto max-w-[680px] px-6 pt-group pb-page">
        {/* 카테고리 섹션 */}
        <CategoryFilter
          categories={categoryTabs}
          selected={selectedCategory}
          onChange={(id) => {
            setSelectedCategory(id);
            setCurrentPage(1);
          }}
        />

        {/* 게시글 섹션 — 카테고리와 섹션 간 간격 */}
        <div className="pt-section">
          {/* Sort + Count (게시글 섹션 내부) */}
          <div className="flex items-center justify-between">
            <SortTabs value={sortBy} onChange={(v) => { setSortBy(v); setCurrentPage(1); }} />
            <span className="text-sm text-sub-foreground">
              {filteredPosts.length}개의 글
            </span>
          </div>

          {/* Post List + Sidebar */}
          <div className="relative">
          <div>
            {paginatedPosts.length > 0 ? (
              <div className="divide-y divide-border">
                {paginatedPosts.map((post) => (
                  <PostCard key={post.slug} {...post} />
                ))}
              </div>
            ) : (
              <div className="py-12 text-center text-sm text-sub-foreground">
                해당 조건에 맞는 게시글이 없습니다.
              </div>
            )}

            {/* Pagination */}
            <div className="pt-6">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          </div>

          {/* Sidebar — 게시글 목록과 같은 높이에서 시작 */}
          <aside className="w-72 hidden xl:block absolute left-full top-0 ml-16">
          <div className="sticky top-20 space-y-10">
            {/* Editor Picks */}
            <div>
              <h3 className="text-base font-semibold text-sub-foreground mb-3">에디터 픽</h3>
              <div className="space-y-6">
                {editorPicks.map((pick) => (
                  <Link
                    key={pick.slug}
                    href={`/posts/${pick.slug}`}
                    className="block group"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Avatar size="sm" />
                      <span className="text-sm text-secondary-foreground font-medium">
                        {pick.author}
                      </span>
                    </div>
                    <p className="font-semibold text-foreground group-hover:underline line-clamp-2 leading-snug">
                      {pick.title}
                    </p>
                    <p className="text-sm font-regular text-muted-foreground mt-1.5">
                      {pick.time}
                    </p>
                  </Link>
                ))}
              </div>
            </div>

            {/* Recommended Topics */}
            <div>
              <h3 className="text-base font-semibold text-sub-foreground mb-3">추천 토픽</h3>
              <TagList tags={recommendedTopics} variant="pill" />
            </div>

            {/* Who to Follow */}
            <div>
              <h3 className="text-base font-semibold text-sub-foreground mb-3">추천 작성자</h3>
              <div className="space-y-1">
                {whoToFollow.map((user) => (
                  <UserRow
                    key={user.username}
                    name={user.name}
                    username={user.username}
                    description={user.bio}
                    href={`/profile/${user.username}`}
                    showFollowButton
                  />
                ))}
              </div>
            </div>
          </div>
        </aside>
        </div>
        </div>
      </div>
    </div>
  );
}
