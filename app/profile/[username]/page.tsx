"use client";

import { useState } from "react";
import { Award, Sparkles } from "lucide-react";
import { Tabs } from "@/components/ui/tabs";
import { StatGrid } from "@/components/site/stat-grid";
import { SkillBarList, type SkillItem } from "@/components/site/skill-bar";
import { ActivityList, type ActivityItem } from "@/components/site/activity-list";
import { ProfileHeader } from "@/components/site/profile-header";
import { StudyHistoryList } from "@/components/site/study-history-card";
import { BadgeDetailCard } from "@/components/site/badge-detail-card";
import {
  Medal,
  GraduationCap,
  Star,
  Handshake,
  Crown,
  PenLine,
  Rocket,
  MessageCircle,
} from "lucide-react";

const stats = [
  { label: "스터디 수료", value: 3 },
  { label: "작성 글", value: 27 },
  { label: "받은 투표", value: "1,234" },
  { label: "댓글", value: 156 },
  { label: "포인트", value: "2,450" },
];

const skills: SkillItem[] = [
  { name: "자동화/노코드", level: 100, note: "스터디 2회 수료" },
  { name: "프롬프트", level: 80, note: "스터디 1회 수료" },
  { name: "마케팅 AI", level: 60, note: "게시글 12건" },
  { name: "개발/코딩", level: 40, note: "게시글 5건" },
];

const activities: ActivityItem[] = [
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
  { icon: Medal, label: "AI 자동화 전문가" },
  { icon: GraduationCap, label: "3기 수료" },
  { icon: Star, label: "베스트 사례 3회" },
  { icon: Handshake, label: "모각AI 리더" },
  { icon: Crown, label: "기여왕" },
];

const allBadges = [
  {
    icon: Medal,
    name: "AI 자동화 전문가",
    earnedDate: "2026.02.26",
    description: "AI 자동화 스터디를 수료하고 최종 프로젝트를 완성하여 획득",
  },
  {
    icon: GraduationCap,
    name: "3기 수료",
    earnedDate: "2026.02.26",
    description: "3개 기수 연속으로 스터디를 수료하여 획득",
  },
  {
    icon: Star,
    name: "베스트 사례 3회",
    earnedDate: "2026.01.20",
    description: "작성한 AI 활용 사례가 3회 베스트로 선정되어 획득",
  },
  {
    icon: Handshake,
    name: "모각AI 리더",
    earnedDate: "2025.12.15",
    description: "모각AI 세션을 5회 이상 리드하여 획득",
  },
  {
    icon: Crown,
    name: "기여왕",
    earnedDate: "2025.11.30",
    description: "월간 기여 포인트 Top 3에 진입하여 획득",
  },
  {
    icon: PenLine,
    name: "프롬프트 마스터",
    earnedDate: "2025.12.13",
    description: "프롬프트 엔지니어링 스터디를 수료하여 획득",
  },
  {
    icon: Rocket,
    name: "AI 입문자",
    earnedDate: "2025.10.12",
    description: "첫 번째 AI 스터디를 성공적으로 수료하여 획득",
  },
  {
    icon: MessageCircle,
    name: "소통왕",
    earnedDate: "2025.10.01",
    description: "댓글 100개 이상 작성하여 획득",
  },
];

const tabItems = [
  { key: "overview", label: "개요" },
  { key: "study", label: "스터디 이력" },
  { key: "posts", label: "작성글" },
  { key: "badges", label: "뱃지" },
];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* Profile Header */}
      <ProfileHeader
        user={{
          name: "홍길동",
          username: "honggildong",
          bio: "AI 자동화 전문가 · 마케터",
          joinDate: "2025.03",
          quote: "AI로 반복 업무를 자동화하는 것에 관심이 많습니다.",
          points: "2,450",
          interestTags,
          links: [
            { label: "GitHub", href: "#" },
            { label: "LinkedIn", href: "#" },
            { label: "블로그", href: "#" },
          ],
        }}
        className="mb-6"
      />

      {/* Badges Row */}
      <section className="mb-6 overflow-x-auto">
        <div className="flex gap-2">
          {profileBadges.map((badge) => {
            const Icon = badge.icon;
            return (
              <span
                key={badge.label}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-full bg-accent text-foreground whitespace-nowrap border border-border"
              >
                <Icon className="w-4 h-4 text-primary" />
                {badge.label}
              </span>
            );
          })}
        </div>
      </section>

      {/* Stats */}
      <StatGrid items={stats} columns={5} className="mb-8" />

      {/* Tabs */}
      <Tabs
        items={tabItems}
        activeKey={activeTab}
        onTabChange={setActiveTab}
        className="mb-8"
      />

      {/* Overview Tab */}
      {activeTab === "overview" && (
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
            <SkillBarList skills={skills} />
          </div>

          {/* Recent Activity */}
          <div>
            <h3 className="font-bold text-foreground mb-4">최근 활동</h3>
            <ActivityList activities={activities} />
          </div>
        </div>
      )}

      {/* Study History Tab */}
      {activeTab === "study" && (
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

          <StudyHistoryList studies={studyHistory} />
        </div>
      )}

      {activeTab === "posts" && (
        <p className="text-sm text-muted-foreground">
          작성글 목록이 여기에 표시됩니다.
        </p>
      )}

      {/* Badges Tab */}
      {activeTab === "badges" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {allBadges.map((badge) => (
            <BadgeDetailCard key={badge.name} badge={badge} />
          ))}
        </div>
      )}
    </div>
  );
}
