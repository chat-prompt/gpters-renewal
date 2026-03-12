"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ExternalLink,
  Settings,
  Users,
  Video,
  Megaphone,
  AlertCircle,
  Trophy,
} from "lucide-react";
import { Badge, Button, Toggle, Progress, Avatar } from "@/components/ui";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

const studyMembers = [
  "김민지", "이준혁", "박소연", "최동현", "정하윤",
  "이영희", "정대호", "최수민", "한지원", "오세진",
];

const mockStudy = {
  title: "21기 AI 자동화 스터디",
  slug: "21-ai-automation",
  status: "진행중",
  currentWeek: 2,
  totalWeeks: 4,
  period: "3/16 ~ 4/12",
  enrolled: 18,
  capacity: 20,
  isFinalSubmitted: true,
  weeklySubmission: { submitted: 12, total: 18 },
  cumulativeAttendance: 85,
  prediction: { good: 15, risk: 2, fail: 1 },
};

const missingMembers = [
  { name: "이영희", items: ["과제"] },
  { name: "정대호", items: ["출석", "과제"] },
  { name: "최수민", items: ["과제"] },
  { name: "한지원", items: ["출석", "과제"] },
  { name: "오세진", items: ["과제"] },
  { name: "윤미래", items: ["과제"] },
];

const weeklyBars = [
  { week: 1, submitted: 16, total: 18 },
  { week: 2, submitted: 12, total: 18 },
  { week: 3, submitted: 0, total: 18 },
  { week: 4, submitted: 0, total: 18 },
];

const navItems = [
  { label: "수강생 현황", href: "members", icon: Users },
  { label: "VOD 관리", href: "vod", icon: Video },
  { label: "공지 관리", href: "notices", icon: Megaphone },
];

export default function StudyManagePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const [finalSubmit, setFinalSubmit] = useState(mockStudy.isFinalSubmitted);
  const [bestPresenter, setBestPresenter] = useState<string | null>("김민지");

  return (
    <div className="mx-auto max-w-[1080px] px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">
            스터디 관리: {mockStudy.title}
          </h1>
          <p className="text-sm text-sub-foreground mt-1">
            {mockStudy.period} &middot; {mockStudy.currentWeek}주차 진행 중
          </p>
        </div>
        <Badge variant="active">{mockStudy.status}</Badge>
      </div>

      {/* Sub Navigation */}
      <div className="flex gap-2">
        {navItems.map((item) => (
          <Link key={item.href} href={`/study/manage/${mockStudy.slug}/${item.href}`}>
            <Button variant="secondary" size="sm">
              <item.icon className="w-3.5 h-3.5" />
              {item.label}
            </Button>
          </Link>
        ))}
      </div>

      {/* Quick Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Settings className="w-4 h-4" />
            빠른 설정
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-foreground font-medium">최종제출</p>
                <p className="text-xs text-sub-foreground">
                  ON이면 수강신청 페이지에 노출됩니다
                </p>
              </div>
              <Toggle
                checked={finalSubmit}
                onChange={setFinalSubmit}
                label={finalSubmit ? "ON" : "OFF"}
              />
            </div>
            <div className="flex gap-2">
              <Link href={`/study/${mockStudy.slug}`}>
                <Button variant="secondary" size="sm">
                  <ExternalLink className="w-3.5 h-3.5" />
                  상세페이지 수정
                </Button>
              </Link>
              <Button variant="secondary" size="sm">
                커리큘럼 수정
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Study Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">스터디 요약</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div>
              <p className="text-xs text-sub-foreground">수강생</p>
              <p className="text-lg font-bold text-foreground">
                {mockStudy.enrolled}/{mockStudy.capacity}명
              </p>
            </div>
            <div>
              <p className="text-xs text-sub-foreground">현재 주차</p>
              <p className="text-lg font-bold text-foreground">
                {mockStudy.currentWeek}/{mockStudy.totalWeeks}주차
              </p>
            </div>
            <div>
              <p className="text-xs text-sub-foreground">누적 출석률</p>
              <p className="text-lg font-bold text-foreground">
                {mockStudy.cumulativeAttendance}%
              </p>
            </div>
            <div>
              <p className="text-xs text-sub-foreground">수료 예측</p>
              <p className="text-sm text-foreground">
                <span className="text-primary font-bold">{mockStudy.prediction.good}명</span> 순조
                &middot; <span className="font-bold">{mockStudy.prediction.risk}명</span> 위험
                &middot; <span className="text-destructive font-bold">{mockStudy.prediction.fail}명</span> 미달
              </p>
            </div>
          </div>

          {/* Recruitment Progress */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs text-sub-foreground">모집률</p>
              <p className="text-xs text-sub-foreground">
                {mockStudy.enrolled}/{mockStudy.capacity}명 ({Math.round((mockStudy.enrolled / mockStudy.capacity) * 100)}%)
              </p>
            </div>
            <Progress value={(mockStudy.enrolled / mockStudy.capacity) * 100} />
          </div>
        </CardContent>
      </Card>

      {/* Weekly Submission Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">주차별 과제 제출 현황</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-4 h-32">
            {weeklyBars.map((bar) => {
              const pct = bar.total > 0 ? (bar.submitted / bar.total) * 100 : 0;
              return (
                <div key={bar.week} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-xs text-sub-foreground">
                    {bar.submitted}/{bar.total}
                  </span>
                  <div className="w-full bg-muted rounded-t-sm relative" style={{ height: "100px" }}>
                    <div
                      className="absolute bottom-0 w-full bg-primary rounded-t-sm transition-all"
                      style={{ height: `${pct}%` }}
                    />
                  </div>
                  <span className="text-xs text-foreground font-medium">{bar.week}주차</span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Best Presenter Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Trophy className="w-4 h-4 text-primary" />
            베스트 발표자 선정
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-sub-foreground mb-3">
            {mockStudy.currentWeek}주차 베스트 발표자를 선정하세요
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 mb-3">
            {studyMembers.map((name) => (
              <button
                key={name}
                onClick={() => setBestPresenter(name)}
                className={`flex items-center gap-2 rounded-lg border p-2.5 text-left transition-colors ${
                  bestPresenter === name
                    ? "border-primary bg-accent"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <Avatar size="sm" />
                <span className="text-xs text-foreground truncate">{name}</span>
              </button>
            ))}
          </div>
          {bestPresenter && (
            <p className="text-sm text-primary flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5" />
              <span className="font-medium">{bestPresenter}</span>님이 {mockStudy.currentWeek}주차 베스트 발표자로 선정되었습니다.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Missing Members This Week */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <AlertCircle className="w-4 h-4 text-destructive" />
            이번 주 미제출자 ({missingMembers.length}명)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {missingMembers.map((member) => (
              <div
                key={member.name}
                className="flex items-center gap-3 rounded-lg border border-border p-3"
              >
                <Avatar size="sm" />
                <div className="min-w-0">
                  <p className="text-sm text-foreground font-medium">
                    {member.name}
                  </p>
                  <div className="flex gap-1 mt-0.5">
                    {member.items.map((item) => (
                      <Badge key={item} variant="default">
                        {item} 미제출
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
