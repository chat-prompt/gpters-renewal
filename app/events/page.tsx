"use client";

import { useState } from "react";
import { EventCard } from "@/components/site/event-card";
import { CategoryFilter } from "@/components/site/category-filter";

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
    attendees: 84,
    capacity: 200,
    free: true,
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
    attendees: 18,
    capacity: 30,
    free: true,
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
    attendees: 132,
    capacity: 300,
    free: true,
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
    attendees: 56,
    capacity: 150,
    free: false,
    price: "10,000원",
  },
];

const categories = [
  { id: "all", name: "전체" },
  { id: "online", name: "온라인" },
  { id: "offline", name: "오프라인" },
];

/* ─── Page ─── */

export default function EventsPage() {
  const [activeFilter, setActiveFilter] = useState("all");

  const filtered =
    activeFilter === "all"
      ? events
      : events.filter((e) => e.type === activeFilter);

  return (
    <div className="max-w-[1080px] mx-auto px-6 py-page">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-foreground mb-2">이벤트</h1>
        <p className="text-sm text-sub-foreground">
          AI 토크, 웨비나, 오프라인 모임 등 다양한 이벤트에 참여하세요.
        </p>
      </div>

      {/* Filter */}
      <CategoryFilter
        categories={categories}
        selected={activeFilter}
        onChange={setActiveFilter}
        className="mb-6"
      />

      {/* Event Grid — 2 columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((event) => (
          <EventCard key={event.id} {...event} />
        ))}
      </div>

      {/* Empty State */}
      {filtered.length === 0 && (
        <div className="text-center py-16 text-sm text-sub-foreground">
          해당 카테고리의 이벤트가 없습니다.
        </div>
      )}
    </div>
  );
}
