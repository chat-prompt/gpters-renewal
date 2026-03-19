"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { EventForm, type EventFormData } from "@/components/site/event-form";

/* ─── Mock Data ─── */

const eventsMap: Record<string, MockEvent> = {
  "1": {
    id: 1,
    title: "무료 AI 토크: Claude Code 활용법",
    category: "토크",
    eventType: "online",
    date: "2026-03-15",
    startTime: "19:00",
    endTime: "20:30",
    location: "온라인 (Zoom)",
    capacity: 200,
    pricingType: "free",
    price: 0,
    shortDescription: "AI 코드 에디터 Claude Code의 실전 활용법을 알려드립니다.",
    body: "AI 코딩 도구가 빠르게 발전하고 있습니다...",
    coverImage: null,
    agenda: [
      { time: "19:00", title: "오프닝 & Claude Code 소개" },
      { time: "19:15", title: "실전 데모: 프로젝트 세팅부터 배포까지" },
      { time: "19:45", title: "팁 & 트릭: 생산성을 높이는 활용법" },
      { time: "20:00", title: "Q&A" },
    ],
    speakers: [
      { name: "김현수", role: "AI 엔지니어" },
      { name: "이다혜", role: "프로덕트 매니저" },
    ],
    tags: ["Claude", "AI"],
    status: "published",
  },
  "3": {
    id: 3,
    title: "AI 자동화 웨비나",
    category: "웨비나",
    eventType: "online",
    date: "2026-03-22",
    startTime: "20:00",
    endTime: "21:30",
    location: "온라인 (Zoom)",
    capacity: 300,
    pricingType: "free",
    price: 0,
    shortDescription: "n8n과 Make를 활용한 업무 자동화 실전 노하우를 공유합니다.",
    body: "반복적인 업무에 지치셨나요?...",
    coverImage: null,
    agenda: [
      { time: "20:00", title: "자동화 도구 비교: n8n vs Make" },
      { time: "20:20", title: "실전 데모 1: 이메일 자동 분류" },
    ],
    speakers: [{ name: "김영호", role: "자동화 컨설턴트" }],
    tags: ["자동화", "AI"],
    status: "rejected",
    reviewNote: "이벤트 설명이 불충분합니다. 대상 수준과 사전 준비사항을 추가해주세요.",
  },
};

interface MockEvent extends EventFormData {
  id: number;
  status: string;
  reviewNote?: string;
}

/* ─── Page ─── */

export default function EventEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = use(params);
  const event = eventsMap[id];

  if (!event) {
    return (
      <div className="mx-auto max-w-[680px] px-6 py-page text-center">
        <p className="text-sub-foreground">이벤트를 찾을 수 없습니다.</p>
        <Link href="/events" className="text-sm text-primary mt-4 inline-block">
          이벤트 목록으로 돌아가기
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[680px] px-6 py-page">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link href={`/events/${id}`} className="text-sub-foreground">
            <ChevronLeft className="w-5 h-5" strokeWidth={1.5} />
          </Link>
          <h1 className="text-xl font-semibold text-foreground">
            이벤트 수정
          </h1>
        </div>
        <button
          onClick={() => router.push(`/events/${id}`)}
          className="px-6 py-2 text-sm bg-primary text-primary-foreground rounded-md font-medium"
        >
          {event.status === "rejected" ? "재제출" : "수정 완료"}
        </button>
      </div>

      {/* Form */}
      <EventForm
        mode="edit"
        initialData={event}
        rejectionNote={event.status === "rejected" ? event.reviewNote : undefined}
      />
    </div>
  );
}
