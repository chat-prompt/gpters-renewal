"use client";

import { useState } from "react";
import Link from "next/link";
import { EventCard } from "@/components/site/event-card";
import { CategoryFilter } from "@/components/site/category-filter";
import { SortTabs } from "@/components/site/sort-tabs";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/lib/auth-context";

/* ─── Mock Data ─── */

const events = [
  {
    id: 1,
    title: "무료 AI 토크: Claude Code 활용법",
    category: "토크",
    type: "online" as const,
    date: "3월 15일 (토)",
    time: "19:00",
    location: "온라인 (Zoom)",
    description:
      "AI 코드 에디터 Claude Code의 실전 활용법을 알려드립니다. 비개발자도 참여 가능!",
    host: "GPTers",
    hostType: "official" as const,
    status: "published" as const,
    attendees: 84,
    capacity: 200,
    free: true,
    imageUrl: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=224&h=224&fit=crop",
  },
  {
    id: 2,
    title: "모각AI — 강남역 위워크",
    category: "모임",
    type: "offline" as const,
    date: "3월 20일 (목)",
    time: "14:00",
    location: "강남역 위워크 10층",
    description: "각자 AI 프로젝트를 진행하며 네트워킹하는 모임입니다.",
    host: "GPTers 서울",
    hostType: "official" as const,
    status: "published" as const,
    attendees: 18,
    capacity: 30,
    free: true,
    imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=224&h=224&fit=crop",
  },
  {
    id: 3,
    title: "AI 자동화 웨비나",
    category: "웨비나",
    type: "online" as const,
    date: "3월 22일 (토)",
    time: "20:00",
    location: "온라인 (Zoom)",
    description:
      "n8n과 Make를 활용한 업무 자동화 실전 노하우를 공유합니다.",
    host: "김영호",
    hostType: "user" as const,
    status: "published" as const,
    attendees: 132,
    capacity: 300,
    free: true,
    imageUrl: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=224&h=224&fit=crop",
  },
  {
    id: 4,
    title: "GPTers 네트워킹 데이",
    category: "네트워킹",
    type: "offline" as const,
    date: "4월 5일 (토)",
    time: "15:00",
    location: "서울 성수동",
    description:
      "AI에 관심 있는 분들의 대규모 오프라인 네트워킹 행사입니다. 다양한 분야의 AI 실무자를 만나보세요.",
    host: "GPTers",
    hostType: "official" as const,
    status: "published" as const,
    attendees: 56,
    capacity: 150,
    free: false,
    price: "10,000원",
    imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=224&h=224&fit=crop",
  },
  {
    id: 5,
    title: "AI 프롬프트 워크숍",
    category: "워크숍",
    type: "online" as const,
    date: "4월 12일 (토)",
    time: "14:00",
    location: "온라인 (Zoom)",
    description:
      "프롬프트 엔지니어링의 기초부터 고급 기법까지 실습과 함께 배워봅니다.",
    host: "이수현",
    hostType: "user" as const,
    status: "published" as const,
    attendees: 24,
    capacity: 50,
    free: true,
    imageUrl: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=224&h=224&fit=crop",
  },
  {
    id: 6,
    title: "Claude API 활용 세미나",
    category: "웨비나",
    type: "online" as const,
    date: "3월 8일 (토)",
    time: "20:00",
    location: "온라인 (Zoom)",
    description:
      "Claude API를 실무에 적용하는 방법을 공유합니다. 토큰 최적화부터 프롬프트 캐싱까지.",
    host: "홍길동",
    hostType: "user" as const,
    status: "completed" as const,
    attendees: 87,
    capacity: 100,
    free: true,
    imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=224&h=224&fit=crop",
  },
];

const categories = [
  { id: "all", name: "전체" },
  { id: "토크", name: "토크" },
  { id: "모임", name: "모임" },
  { id: "웨비나", name: "웨비나" },
  { id: "네트워킹", name: "네트워킹" },
  { id: "워크숍", name: "워크숍" },
];

/* ─── Page ─── */

export default function EventsPage() {
  const { isLoggedIn } = useAuth();
  const [activeFilter, setActiveFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("recent");

  // Only show published + closed + completed
  const visibleEvents = events.filter(
    (e) => e.status === "published" || e.status === "completed"
  );

  const filtered = visibleEvents
    .filter((e) => activeFilter === "all" || e.category === activeFilter)
    .filter((e) => typeFilter === "all" || e.type === typeFilter)
    // Sort: active events first, then by user selection
    .sort((a, b) => {
      const order = { published: 0, closed: 1, completed: 2 };
      const statusDiff = (order[a.status] ?? 0) - (order[b.status] ?? 0);
      if (statusDiff !== 0) return statusDiff;
      if (sortBy === "popular") return b.capacity - a.capacity;
      return 0; // recent: 원본 순서 유지
    });

  return (
    <div className="max-w-[860px] mx-auto px-6 py-page">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-foreground mb-2">이벤트</h1>
          <p className="text-sm text-sub-foreground">
            AI 토크, 웨비나, 오프라인 모임 등 다양한 이벤트에 참여하세요.
          </p>
        </div>
        {isLoggedIn && (
          <Link href="/events/create">
            <Button>이벤트 개설</Button>
          </Link>
        )}
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between mb-6">
        <CategoryFilter
          categories={categories}
          selected={activeFilter}
          onChange={setActiveFilter}
        />
        <div className="flex items-center gap-3">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger size="sm" className="w-auto">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">유형: 전체</SelectItem>
              <SelectItem value="online">온라인</SelectItem>
              <SelectItem value="offline">오프라인</SelectItem>
            </SelectContent>
          </Select>
          <SortTabs value={sortBy} onChange={setSortBy} />
        </div>
      </div>

      {/* Event Grid — 2 columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((event) => (
          <EventCard key={event.id} {...event} />
        ))}
      </div>

      {/* Empty State */}
      {filtered.length === 0 && (
        <div className="text-center py-16 text-sm text-sub-foreground">
          해당 조건의 이벤트가 없습니다.
        </div>
      )}
    </div>
  );
}
