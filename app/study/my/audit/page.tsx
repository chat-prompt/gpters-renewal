"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { VodCard } from "@/components/lms/vod-card";
import { VodLockCard } from "@/components/lms/vod-lock-card";
import { AssignmentGuide } from "@/components/lms/assignment-guide";

// -- Mock Data --

const generations = ["전체", "21기", "20기", "19기"];
const studies = [
  "전체",
  "AI 자동화",
  "프롬프트 ENG",
  "바이브코딩",
  "콘텐츠 제작",
  "AI 마케팅",
];
const weekOptions = ["전체", "1주차", "2주차", "3주차", "4주차"];

const allVods = [
  { id: "1", title: "프롬프트 엔지니어링 실전", studyName: "프롬프트 ENG", week: 2, duration: "45분", locked: true, generation: "21기" },
  { id: "2", title: "바이브코딩 기초", studyName: "바이브코딩", week: 1, duration: "52분", locked: true, generation: "21기" },
  { id: "3", title: "콘텐츠 자동화 전략", studyName: "콘텐츠 제작", week: 2, duration: "38분", locked: false, generation: "21기" },
  { id: "4", title: "AI 마케팅 자동화", studyName: "AI 마케팅", week: 1, duration: "41분", locked: true, generation: "21기" },
  { id: "5", title: "GPT-4 활용법", studyName: "프롬프트 ENG", week: 1, duration: "55분", locked: false, generation: "21기" },
  { id: "6", title: "n8n 기초 워크플로우", studyName: "AI 자동화", week: 1, duration: "48분", locked: false, generation: "21기" },
  { id: "7", title: "20기 프롬프트 마스터", studyName: "프롬프트 ENG", week: 2, duration: "50분", locked: false, generation: "20기" },
  { id: "8", title: "20기 AI 활용 기초", studyName: "AI 자동화", week: 1, duration: "44분", locked: false, generation: "20기" },
];

export default function AuditVodPage() {
  const [selectedGen, setSelectedGen] = useState("전체");
  const [selectedStudy, setSelectedStudy] = useState("전체");
  const [selectedWeek, setSelectedWeek] = useState("전체");

  const filteredVods = allVods.filter((vod) => {
    if (selectedGen !== "전체" && vod.generation !== selectedGen) return false;
    if (selectedStudy !== "전체" && vod.studyName !== selectedStudy) return false;
    if (selectedWeek !== "전체") {
      const weekNum = parseInt(selectedWeek);
      if (vod.week !== weekNum) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">청강 VOD</h1>

      <AssignmentGuide />

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <Select value={selectedGen} onValueChange={setSelectedGen}>
          <SelectTrigger size="sm" className="w-auto">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {generations.map((g) => (
              <SelectItem key={g} value={g}>
                {g === "전체" ? "기수 전체" : g}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedStudy} onValueChange={setSelectedStudy}>
          <SelectTrigger size="sm" className="w-auto">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {studies.map((s) => (
              <SelectItem key={s} value={s}>
                {s === "전체" ? "스터디 전체" : s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedWeek} onValueChange={setSelectedWeek}>
          <SelectTrigger size="sm" className="w-auto">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {weekOptions.map((w) => (
              <SelectItem key={w} value={w}>
                {w === "전체" ? "주차 전체" : w}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* VOD Grid */}
      {filteredVods.length === 0 ? (
        <div className="rounded-lg border border-border bg-muted/50 p-8 text-center">
          <p className="text-sm text-sub-foreground">조건에 맞는 VOD가 없습니다.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredVods.map((vod) =>
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
      )}
    </div>
  );
}
