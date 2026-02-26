"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ExternalLink,
  FileText,
  GraduationCap,
  MessageSquare,
  ArrowUp,
  Award,
  Share2,
  Trophy,
  Star,
  Users,
  Crown,
  Sparkles,
  BadgeCheck,
  ScrollText,
} from "lucide-react";

const stats = [
  { label: "스터디 수료", value: 3 },
  { label: "작성 글", value: 27 },
  { label: "받은 투표", value: "1,234" },
  { label: "댓글", value: 156 },
  { label: "포인트", value: "2,450" },
];

const skills = [
  { name: "자동화/노코드", level: 100, note: "스터디 2회 수료" },
  { name: "프롬프트", level: 80, note: "스터디 1회 수료" },
  { name: "마케팅 AI", level: 60, note: "게시글 12건" },
  { name: "개발/코딩", level: 40, note: "게시글 5건" },
];

const activities = [
  {
    type: "post",
    text: '"Claude로 마케팅 자동화 구축기" 게시',
    time: "3시간 전",
  },
  {
    type: "study",
    text: "21기 AI 자동화 스터디 수료",
    time: "1주 전",
  },
  {
    type: "comment",
    text: '"n8n 팁 공유합니다" 댓글 작성',
    time: "2일 전",
  },
  {
    type: "post",
    text: '"자동화 도구 비교 리뷰" 게시',
    time: "5일 전",
  },
];

const studyHistory = [
  {
    title: "21기 AI 자동화 스터디",
    period: "2026.01.15 ~ 2026.02.26",
    leader: "김영호",
    posts: 3,
    project: "마케팅 이메일 자동화 파이프라인",
    badge: "AI 자동화 전문가",
  },
  {
    title: "20기 프롬프트 엔지니어링",
    period: "2025.11.01 ~ 2025.12.13",
    leader: "이수진",
    posts: 2,
    project: "고급 프롬프트 체이닝 가이드",
    badge: "프롬프트 마스터",
  },
  {
    title: "19기 AI 기초",
    period: "2025.09.01 ~ 2025.10.12",
    leader: "박민수",
    posts: 1,
    project: "AI 도구 활용 실습 포트폴리오",
    badge: "AI 입문자",
  },
];

const interestTags = [
  "AI 자동화",
  "프롬프트 엔지니어링",
  "마케팅 AI",
  "n8n",
  "Claude",
];

const profileBadges = [
  { icon: "🏅", label: "AI 자동화 전문가" },
  { icon: "🎓", label: "3기 수료" },
  { icon: "⭐", label: "베스트 사례 3회" },
  { icon: "🤝", label: "모각AI 리더" },
  { icon: "👑", label: "기여왕" },
];

const allBadges = [
  {
    icon: "🏅",
    name: "AI 자동화 전문가",
    date: "2026.02.26",
    description: "AI 자동화 스터디를 수료하고 최종 프로젝트를 완성하여 획득",
  },
  {
    icon: "🎓",
    name: "3기 수료",
    date: "2026.02.26",
    description: "3개 기수 연속으로 스터디를 수료하여 획득",
  },
  {
    icon: "⭐",
    name: "베스트 사례 3회",
    date: "2026.01.20",
    description: "작성한 AI 활용 사례가 3회 베스트로 선정되어 획득",
  },
  {
    icon: "🤝",
    name: "모각AI 리더",
    date: "2025.12.15",
    description: "모각AI 세션을 5회 이상 리드하여 획득",
  },
  {
    icon: "👑",
    name: "기여왕",
    date: "2025.11.30",
    description: "월간 기여 포인트 Top 3에 진입하여 획득",
  },
  {
    icon: "📝",
    name: "프롬프트 마스터",
    date: "2025.12.13",
    description: "프롬프트 엔지니어링 스터디를 수료하여 획득",
  },
  {
    icon: "🚀",
    name: "AI 입문자",
    date: "2025.10.12",
    description: "첫 번째 AI 스터디를 성공적으로 수료하여 획득",
  },
  {
    icon: "💬",
    name: "소통왕",
    date: "2025.10.01",
    description: "댓글 100개 이상 작성하여 획득",
  },
];

const tabs = ["개요", "스터디 이력", "작성글", "뱃지"];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("개요");

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* Profile Header */}
      <section className="border border-border rounded-lg p-6 mb-6 bg-background">
        <div className="flex items-start gap-4">
          <div className="w-24 h-24 rounded-full bg-muted shrink-0" />
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-foreground">홍길동</h1>
              <span className="text-sm text-muted-foreground">
                @honggildong
              </span>
              <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary">
                <Trophy className="w-4 h-4" />
                기여 포인트: 2,450 P
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              AI 자동화 전문가 · 마케터
            </p>
            <p className="text-xs text-muted-foreground">
              GPTers 활동 시작: 2025.03
            </p>
            <p className="text-sm text-foreground italic">
              &ldquo;AI로 반복 업무를 자동화하는 것에 관심이 많습니다.&rdquo;
            </p>
            {/* Interest Tags */}
            <div className="flex flex-wrap gap-2 pt-1">
              {interestTags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-0.5 text-xs rounded-full bg-accent text-primary border border-border"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-3 text-sm text-primary">
              <Link href="#" className="flex items-center gap-1">
                GitHub <ExternalLink className="w-3 h-3" />
              </Link>
              <Link href="#" className="flex items-center gap-1">
                LinkedIn <ExternalLink className="w-3 h-3" />
              </Link>
              <Link href="#" className="flex items-center gap-1">
                블로그 <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </div>
          <div className="flex flex-col gap-2 shrink-0">
            <button className="px-4 py-2 text-sm border border-border rounded-md text-foreground">
              프로필 수정
            </button>
            <button className="px-4 py-2 text-sm rounded-md bg-primary text-primary-foreground flex items-center gap-1.5">
              <Share2 className="w-3.5 h-3.5" />
              이 프로필을 LinkedIn에 공유
            </button>
          </div>
        </div>
      </section>

      {/* Badges Row */}
      <section className="mb-6 overflow-x-auto">
        <div className="flex gap-2">
          {profileBadges.map((badge) => (
            <span
              key={badge.label}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-full bg-accent text-foreground whitespace-nowrap border border-border"
            >
              <span>{badge.icon}</span>
              {badge.label}
            </span>
          ))}
        </div>
      </section>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="border border-border rounded-lg p-4 text-center bg-background"
          >
            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border mb-8 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm whitespace-nowrap border-b-2 ${
              activeTab === tab
                ? "border-primary text-foreground font-medium"
                : "border-transparent text-muted-foreground"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === "개요" && (
        <div className="space-y-8">
          {/* AI Usage Auto-Summary */}
          <div className="border border-border rounded-lg bg-accent p-5 space-y-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <h3 className="font-bold text-foreground">
                AI 활용 요약 (자동 생성)
              </h3>
            </div>
            <p className="text-sm text-foreground italic leading-relaxed">
              &ldquo;이 사용자는 주로 Claude와 n8n을 활용하여 마케팅 자동화
              분야에서 활동합니다. 19기~21기까지 3개 스터디를 수료했으며, AI 활용
              사례 게시글 27건을 작성했습니다.&rdquo;
            </p>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              AI가 자동 생성한 요약입니다
            </p>
          </div>

          {/* Skill Map */}
          <div>
            <h3 className="font-bold text-foreground mb-4">AI 스킬 맵</h3>
            <div className="border border-border rounded-lg p-4 bg-background space-y-3">
              {skills.map((skill) => (
                <div key={skill.name} className="flex items-center gap-4">
                  <span className="text-sm text-foreground w-28 shrink-0">
                    {skill.name}
                  </span>
                  <div className="flex-1 bg-muted rounded-full h-2">
                    <div
                      className="bg-primary rounded-full h-2"
                      style={{ width: `${skill.level}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground w-28 shrink-0 text-right">
                    ({skill.note})
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <h3 className="font-bold text-foreground mb-4">최근 활동</h3>
            <div className="border border-border rounded-lg divide-y divide-border bg-background">
              {activities.map((activity) => (
                <div
                  key={activity.text}
                  className="flex items-center gap-3 p-4"
                >
                  <span className="text-muted-foreground">
                    {activity.type === "post" && (
                      <FileText className="w-4 h-4" />
                    )}
                    {activity.type === "study" && (
                      <GraduationCap className="w-4 h-4" />
                    )}
                    {activity.type === "comment" && (
                      <MessageSquare className="w-4 h-4" />
                    )}
                  </span>
                  <span className="text-sm text-foreground flex-1">
                    {activity.text}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {activity.time}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Study History Tab */}
      {activeTab === "스터디 이력" && (
        <div className="space-y-4">
          {/* Cumulative Badge */}
          <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-accent border border-border">
            <Award className="w-5 h-5 text-primary" />
            <span className="text-sm font-semibold text-foreground">
              3기 연속 수료
            </span>
            <span className="text-xs text-muted-foreground">
              — 꾸준한 학습 의지를 보여주는 뱃지입니다
            </span>
          </div>

          <div className="border border-border rounded-lg divide-y divide-border bg-background">
            {studyHistory.map((study) => (
              <div key={study.title} className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-primary" />
                    <span className="font-medium text-foreground">
                      {study.title}
                    </span>
                  </div>
                  <span className="text-xs text-primary bg-accent px-2 py-0.5 rounded-sm">
                    수료 완료
                  </span>
                </div>
                <div className="text-sm text-muted-foreground space-y-1 pl-6">
                  <p>{study.period}</p>
                  <p>스터디장: {study.leader}</p>
                  <p>사례글: {study.posts}건 작성</p>
                  <p>최종 프로젝트: {study.project}</p>
                  <p className="flex items-center gap-1.5 text-foreground">
                    <Award className="w-3.5 h-3.5 text-primary" />
                    획득 뱃지: 🏅 {study.badge}
                  </p>
                </div>
                <div className="pl-6 flex gap-2">
                  <button className="text-xs text-primary">사례글 보기</button>
                  <button className="text-xs text-primary">
                    프로젝트 보기
                  </button>
                  <button className="text-xs text-primary flex items-center gap-1">
                    <ScrollText className="w-3 h-3" />
                    수료증 보기
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "작성글" && (
        <p className="text-sm text-muted-foreground">
          작성글 목록이 여기에 표시됩니다.
        </p>
      )}

      {/* Badges Tab */}
      {activeTab === "뱃지" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {allBadges.map((badge) => (
            <div
              key={badge.name}
              className="border border-border rounded-lg p-4 bg-background space-y-2"
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl">{badge.icon}</span>
                <div>
                  <p className="font-semibold text-foreground">{badge.name}</p>
                  <p className="text-xs text-muted-foreground">{badge.date}</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                {badge.description}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
