"use client";

import { useState } from "react";
import Link from "next/link";
import { Calendar, MapPin, Monitor, Users } from "lucide-react";

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

const filterTabs = [
  { key: "all", label: "전체" },
  { key: "online", label: "온라인" },
  { key: "offline", label: "오프라인" },
];

/* ─── Page ─── */

export default function EventsPage() {
  const [activeFilter, setActiveFilter] = useState("all");

  const filtered =
    activeFilter === "all"
      ? events
      : events.filter((e) => e.type === activeFilter);

  return (
    <div className="max-w-[1080px] mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground mb-2">이벤트</h1>
        <p className="text-sm text-muted-foreground">
          AI 토크, 웨비나, 오프라인 모임 등 다양한 이벤트에 참여하세요.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
        {filterTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveFilter(tab.key)}
            className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
              activeFilter === tab.key
                ? "bg-foreground text-background font-medium"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Event Grid — 2 columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((event) => (
          <Link
            key={event.id}
            href={`/events/${event.id}`}
            className="group flex gap-4 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
          >
            {/* Thumbnail */}
            <div className="w-28 h-28 bg-muted rounded-lg shrink-0 overflow-hidden">
              <div className="w-full h-full group-hover:scale-105 transition-transform bg-muted" />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0 flex flex-col">
              {/* Date + Badge */}
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-xs font-medium text-primary">
                  {event.date} {event.time}
                </span>
                <span
                  className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
                    event.type === "online"
                      ? "bg-blue-50 text-blue-600"
                      : "bg-green-50 text-green-600"
                  }`}
                >
                  {event.type === "online" ? "온라인" : "오프라인"}
                </span>
              </div>

              {/* Title */}
              <h2 className="text-sm font-bold text-foreground group-hover:underline line-clamp-2 mb-1">
                {event.title}
              </h2>

              {/* Location */}
              <div className="flex items-center gap-1 text-xs text-muted-foreground mb-auto">
                {event.type === "online" ? (
                  <Monitor className="w-3 h-3" />
                ) : (
                  <MapPin className="w-3 h-3" />
                )}
                <span className="truncate">{event.location}</span>
              </div>

              {/* Footer: Attendees + Price */}
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-1.5">
                  {/* Attendee avatars */}
                  <div className="flex -space-x-1.5">
                    {[...Array(Math.min(3, event.attendees))].map((_, i) => (
                      <div
                        key={i}
                        className="w-5 h-5 rounded-full bg-muted border-2 border-background"
                      />
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {event.attendees}명 참여
                  </span>
                </div>
                <span className="text-xs font-medium text-foreground">
                  {event.free ? "무료" : event.price}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Empty State */}
      {filtered.length === 0 && (
        <div className="text-center py-16 text-sm text-muted-foreground">
          해당 카테고리의 이벤트가 없습니다.
        </div>
      )}
    </div>
  );
}
