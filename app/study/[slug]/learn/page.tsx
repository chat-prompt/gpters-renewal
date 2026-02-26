"use client";

import Link from "next/link";
import { Check, X, Minus, Circle, PenSquare, Play } from "lucide-react";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Accordion } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";

// -- Mock Data --

const notice = {
  date: "2/25",
  content: "이번 주 줌 세션은 수요일 8PM으로 변경됩니다",
};

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

function StatusBadge({ status }: { status: "completed" | "in-progress" | "upcoming" }) {
  switch (status) {
    case "completed":
      return <Badge variant="completed">완료</Badge>;
    case "in-progress":
      return <Badge variant="active">진행중</Badge>;
    case "upcoming":
      return <Badge variant="default">예정</Badge>;
  }
}

export default function StudyLearnPage() {
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
        <div className="rounded-lg border border-border bg-background p-4 text-center">
          <p className="text-xs text-muted-foreground">출석</p>
          <p className="text-lg font-bold text-foreground mt-1">
            {progressSummary.attendance.done}/{progressSummary.attendance.total}
          </p>
        </div>
        <div className="rounded-lg border border-border bg-background p-4 text-center">
          <p className="text-xs text-muted-foreground">과제</p>
          <p className="text-lg font-bold text-foreground mt-1">
            {progressSummary.assignment.done}/{progressSummary.assignment.total}
          </p>
        </div>
        <div className="rounded-lg border border-border bg-background p-4 text-center">
          <p className="text-xs text-muted-foreground">VOD</p>
          <p className="text-lg font-bold text-foreground mt-1">
            {progressSummary.vod.done}/{progressSummary.vod.total}
          </p>
        </div>
      </div>

      {/* Tabs - navigate to sub-pages for VOD and Tasks */}
      <Tabs items={tabItems} activeKey={activeTab} onTabChange={(key) => {
        if (key === "vod") {
          window.location.href = "/study/21-ai-automation/learn/vod";
          return;
        }
        if (key === "tasks") {
          window.location.href = "/study/21-ai-automation/learn/tasks";
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
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">{w.period}</p>
                <StatusBadge status={w.status} />
              </div>
              <p className="text-sm text-muted-foreground">
                <span className="text-xs font-medium text-foreground">커리큘럼:</span>{" "}
                {w.curriculum}
              </p>

              {w.attendance && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-xs text-muted-foreground w-10">출석</span>
                  {w.attendance.done ? (
                    <Check className="w-3.5 h-3.5 text-primary" />
                  ) : (
                    <X className="w-3.5 h-3.5 text-destructive" />
                  )}
                  <span className="text-xs text-muted-foreground">{w.attendance.label}</span>
                </div>
              )}

              {w.assignment && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-xs text-muted-foreground w-10">과제</span>
                  {w.assignment.done ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-primary" />
                      <span className="text-xs text-muted-foreground">{w.assignment.label}</span>
                      {w.assignment.postSlug && (
                        <Link href={w.assignment.postSlug} className="text-xs text-primary hover:text-primary/80 transition-colors">
                          &ldquo;{w.assignment.postTitle}&rdquo;
                        </Link>
                      )}
                    </>
                  ) : (
                    <>
                      <X className="w-3.5 h-3.5 text-destructive" />
                      <span className="text-xs text-muted-foreground">{w.assignment.label}</span>
                      <Link href={`/write?type=case&studyId=21-ai-automation&week=${w.week}`}>
                        <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                          <PenSquare className="w-3 h-3" />
                          과제 쓰기
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              )}

              {w.vods.length > 0 && (
                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground">VOD</span>
                  {w.vods.map((vod) => (
                    <div key={vod.title} className="flex items-center gap-2 ml-2">
                      <Play className="w-3 h-3 text-muted-foreground" />
                      <span className="text-xs text-foreground">{vod.title}</span>
                      {vod.watched ? (
                        <Badge variant="completed">시청 완료</Badge>
                      ) : (
                        <Badge variant="active">신규</Badge>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {w.status === "upcoming" && (
                <p className="text-xs text-muted-foreground">({w.period})</p>
              )}
            </div>
          ),
        }))}
      />
    </div>
  );
}
