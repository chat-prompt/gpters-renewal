"use client";

import { useState } from "react";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Tabs } from "@/components/ui/tabs";
import { VodCard } from "@/components/lms/vod-card";
import { VodLockCard } from "@/components/lms/vod-lock-card";
import { AssignmentGuide } from "@/components/lms/assignment-guide";

// -- Mock Data --

const myVods = [
  {
    id: "1",
    title: 'AI토크: "n8n 고급 자동화"',
    studyName: "AI 자동화",
    week: 2,
    duration: "45분",
    watched: false,
  },
  {
    id: "2",
    title: 'AI토크: "n8n 기초 입문"',
    studyName: "AI 자동화",
    week: 1,
    duration: "52분",
    watched: true,
  },
  {
    id: "3",
    title: "줌 세션: 1주차 발표",
    studyName: "AI 자동화",
    week: 1,
    duration: "1시간 20분",
    watched: true,
  },
  {
    id: "4",
    title: 'AI토크: "자동화 실전 케이스"',
    studyName: "AI 자동화",
    week: 2,
    duration: "48분",
    watched: false,
  },
];

const otherVods = [
  {
    id: "5",
    title: "프롬프트 엔지니어링 실전",
    studyName: "프롬프트 ENG",
    week: 2,
    duration: "45분",
    locked: true,
  },
  {
    id: "6",
    title: "바이브코딩 기초",
    studyName: "바이브코딩",
    week: 1,
    duration: "52분",
    locked: true,
  },
  {
    id: "7",
    title: "콘텐츠 자동화 전략",
    studyName: "콘텐츠 제작",
    week: 2,
    duration: "38분",
    locked: false,
  },
  {
    id: "8",
    title: "AI 마케팅 자동화",
    studyName: "AI 마케팅",
    week: 1,
    duration: "41분",
    locked: true,
  },
];

export default function VodPage() {
  const [activeTab, setActiveTab] = useState("my");

  const tabItems = [
    { key: "my", label: "내 스터디 VOD", count: myVods.length },
    { key: "other", label: "다른 스터디 청강", count: otherVods.length },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 space-y-6">
      <Breadcrumb
        items={[
          { label: "내 스터디", href: "/study/my" },
          { label: "21기 AI 자동화 스터디", href: "/study/21-ai-automation/learn" },
          { label: "VOD 다시보기" },
        ]}
      />

      <h1 className="text-2xl font-bold text-foreground">VOD 다시보기</h1>

      <Tabs items={tabItems} activeKey={activeTab} onTabChange={setActiveTab} />

      {activeTab === "my" && (
        <div className="space-y-4">
          {/* Group by week descending */}
          {[2, 1].map((week) => {
            const weekVods = myVods.filter((v) => v.week === week);
            if (weekVods.length === 0) return null;
            return (
              <div key={week} className="space-y-3">
                <h3 className="text-sm font-medium text-foreground">{week}주차</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {weekVods.map((vod) => (
                    <VodCard key={vod.id} {...vod} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === "other" && (
        <div className="space-y-4">
          <AssignmentGuide />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {otherVods.map((vod) =>
              vod.locked ? (
                <VodLockCard
                  key={vod.id}
                  title={vod.title}
                  studyName={vod.studyName}
                  week={vod.week}
                  duration={vod.duration}
                />
              ) : (
                <VodCard
                  key={vod.id}
                  title={vod.title}
                  studyName={vod.studyName}
                  week={vod.week}
                  duration={vod.duration}
                  watched={false}
                />
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}
