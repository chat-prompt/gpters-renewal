"use client";

import { useState } from "react";
import { Tabs } from "@/components/ui/tabs";
import { StudyCard } from "@/components/site/study-card";

const studies = [
  {
    slug: "ai-automation-21",
    title: "21기 AI 자동화 스터디",
    cohort: "21기",
    leader: "홍길동",
    date: "2026.03.15 ~ 04.26 (6주)",
    enrolled: 12,
    capacity: 20,
    price: "150,000원",
    status: "recruiting" as const,
  },
  {
    slug: "prompt-engineering-21",
    title: "21기 프롬프트 엔지니어링",
    cohort: "21기",
    leader: "이영희",
    date: "2026.03.22 ~ 04.19 (4주)",
    enrolled: 15,
    capacity: 25,
    price: "120,000원",
    status: "recruiting" as const,
  },
  {
    slug: "chatgpt-practical-21",
    title: "21기 ChatGPT 실무 활용",
    cohort: "21기",
    leader: "박철수",
    date: "2026.03.08 ~ 04.05 (4주)",
    enrolled: 18,
    capacity: 20,
    price: "100,000원",
    status: "ongoing" as const,
  },
  {
    slug: "n8n-automation-21",
    title: "21기 n8n 자동화 마스터",
    cohort: "21기",
    leader: "김지은",
    date: "2026.03.01 ~ 03.29 (4주)",
    enrolled: 22,
    capacity: 25,
    price: "130,000원",
    status: "ongoing" as const,
  },
  {
    slug: "ai-design-20",
    title: "20기 AI 디자인 스터디",
    cohort: "20기",
    leader: "최민수",
    date: "2026.01.15 ~ 02.12 (4주)",
    enrolled: 20,
    capacity: 20,
    price: "110,000원",
    status: "completed" as const,
  },
  {
    slug: "ai-business-20",
    title: "20기 AI 비즈니스 전략",
    cohort: "20기",
    leader: "정수진",
    date: "2026.01.22 ~ 02.19 (4주)",
    enrolled: 18,
    capacity: 20,
    price: "140,000원",
    status: "completed" as const,
  },
];

const filterTabs = [
  { key: "all", label: "전체", count: studies.length },
  {
    key: "recruiting",
    label: "모집중",
    count: studies.filter((s) => s.status === "recruiting").length,
  },
  {
    key: "ongoing",
    label: "진행중",
    count: studies.filter((s) => s.status === "ongoing").length,
  },
  {
    key: "completed",
    label: "완료",
    count: studies.filter((s) => s.status === "completed").length,
  },
];

export default function StudyListPage() {
  const [activeFilter, setActiveFilter] = useState("all");

  const filtered =
    activeFilter === "all"
      ? studies
      : studies.filter((s) => s.status === activeFilter);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-xl font-bold text-foreground mb-6">AI 스터디</h1>

      <Tabs
        items={filterTabs}
        activeKey={activeFilter}
        onTabChange={setActiveFilter}
        className="mb-8"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((study) => (
          <StudyCard
            key={study.slug}
            slug={study.slug}
            title={study.title}
            date={study.date}
            enrolled={study.enrolled}
            capacity={study.capacity}
            price={study.price}
            status={study.status}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-muted-foreground py-12">
          해당 상태의 스터디가 없습니다.
        </p>
      )}
    </div>
  );
}
