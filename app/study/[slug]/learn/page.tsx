"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Accordion } from "@/components/ui/accordion";
import { Tabs } from "@/components/ui/tabs";
import { WeekAccordionItem } from "@/components/lms/week-accordion-item";

// -- Mock Data --

const notice = {
  date: "2/25",
  content: "이번 주 줌 세션은 수요일 8PM으로 변경됩니다",
};

const studySlug = "21-ai-automation";

const weeks = [
  {
    key: "week-1",
    week: 1,
    title: "AI 자동화 입문",
    status: "completed" as const,
    curriculum: "n8n 기초, 워크플로우 개념, 첫 자동화 구축",
    period: "3/16 ~ 3/22",
    attendance: { done: true, label: "참여 완료 (3/16 줌 세션)" },
    assignment: {
      done: true,
      label: '제출 완료',
      postTitle: "n8n으로 이메일 자동 분류하기",
      postSlug: "#",
    },
    vods: [
      { title: "AI토크: n8n 기초 입문", watched: true },
      { title: "줌 세션: 1주차 발표", watched: true },
    ],
  },
  {
    key: "week-2",
    week: 2,
    title: "실전 워크플로우 설계",
    status: "in-progress" as const,
    curriculum: "조건 분기, API 연동, 에러 처리",
    period: "3/23 ~ 3/29",
    attendance: { done: false, label: "미참여" },
    assignment: { done: false, label: "미제출", postTitle: null, postSlug: null },
    vods: [{ title: "AI토크: n8n 고급 자동화", watched: false }],
  },
  {
    key: "week-3",
    week: 3,
    title: "고급 자동화 패턴",
    status: "upcoming" as const,
    curriculum: "멀티 워크플로우, 스케줄링, 모니터링",
    period: "3/30 ~ 4/5",
    attendance: null,
    assignment: null,
    vods: [],
  },
  {
    key: "week-4",
    week: 4,
    title: "프로젝트 완성 & 발표",
    status: "upcoming" as const,
    curriculum: "최종 프로젝트, 베스트 발표회",
    period: "4/6 ~ 4/12",
    attendance: null,
    assignment: null,
    vods: [],
  },
];

const progressSummary = {
  attendance: { done: 1, total: 4 },
  assignment: { done: 1, total: 4 },
  vod: { done: 2, total: 3 },
};

export default function StudyLearnPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("progress");

  const tabItems = [
    { key: "progress", label: "주차별 진도" },
    { key: "vod", label: "VOD 다시보기" },
    { key: "tasks", label: "내 과제" },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 space-y-6">
      <Breadcrumb
        items={[
          { label: "내 스터디", href: "/study/my" },
          { label: "21기 AI 자동화 스터디" },
        ]}
      />

      <h1 className="text-2xl font-bold text-foreground">21기 AI 자동화 스터디</h1>

      {/* Notice */}
      <div className="rounded-lg border border-border bg-muted/50 p-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium text-primary">공지 (스터디장)</p>
            <p className="text-sm text-foreground mt-1">{notice.content}</p>
          </div>
          <span className="text-xs text-muted-foreground shrink-0">{notice.date} 등록</span>
        </div>
      </div>

      {/* Progress Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-lg border border-border p-4 text-center">
          <p className="text-xs text-muted-foreground">출석</p>
          <p className="text-lg font-bold text-foreground mt-1">
            {progressSummary.attendance.done}/{progressSummary.attendance.total}
          </p>
        </div>
        <div className="rounded-lg border border-border p-4 text-center">
          <p className="text-xs text-muted-foreground">과제</p>
          <p className="text-lg font-bold text-foreground mt-1">
            {progressSummary.assignment.done}/{progressSummary.assignment.total}
          </p>
        </div>
        <div className="rounded-lg border border-border p-4 text-center">
          <p className="text-xs text-muted-foreground">VOD</p>
          <p className="text-lg font-bold text-foreground mt-1">
            {progressSummary.vod.done}/{progressSummary.vod.total}
          </p>
        </div>
      </div>

      {/* Tabs - navigate to sub-pages for VOD and Tasks */}
      <Tabs items={tabItems} activeKey={activeTab} onTabChange={(key) => {
        if (key === "vod") {
          router.push(`/study/${studySlug}/learn/vod`);
          return;
        }
        if (key === "tasks") {
          router.push(`/study/${studySlug}/learn/tasks`);
          return;
        }
        setActiveTab(key);
      }} />

      {/* Weekly Curriculum Accordion */}
      <Accordion
        defaultOpen={["week-2"]}
        items={weeks.map((w) => ({
          key: w.key,
          title: `${w.week}주차: ${w.title}`,
          children: (
            <WeekAccordionItem
              week={w.week}
              status={w.status}
              period={w.period}
              curriculum={w.curriculum}
              attendance={w.attendance}
              assignment={w.assignment}
              vods={w.vods}
              studySlug={studySlug}
            />
          ),
        }))}
      />
    </div>
  );
}
