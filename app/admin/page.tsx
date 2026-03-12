"use client";

import {
  Image,
  FileText,
  BookOpen,
  ShoppingBag,
  Megaphone,
  Type,
  CalendarDays,
  Award,
} from "lucide-react";
import { StatCard } from "@/components/admin/stat-card";
import { QuickAction } from "@/components/admin/quick-action";
import { ActivityFeed } from "@/components/admin/activity-feed";

const todayStats = [
  { label: "오늘 가입", value: 12, change: 3 },
  { label: "신규 게시글", value: 34, change: 8 },
  { label: "댓글", value: 89, change: -5 },
  { label: "스터디 신청", value: 5, change: 2 },
  { label: "매출", value: "₩1.2M", change: 15 },
];

const quickActions = [
  { label: "배너 관리", href: "/admin/banners", icon: Image },
  { label: "게시글 관리", href: "/admin/posts", icon: FileText },
  { label: "스터디 관리", href: "/admin/studies", icon: BookOpen },
  { label: "상품/쿠폰", href: "/admin/products", icon: ShoppingBag },
  { label: "공지 작성", href: "/admin/posts", icon: Megaphone },
  { label: "텍스트 수정", href: "/admin/texts", icon: Type },
  { label: "기수 관리", href: "/admin/studies", icon: CalendarDays },
  { label: "수료 판정", href: "/admin/studies", icon: Award },
];

const recentActivities = [
  {
    id: "1",
    type: "post" as const,
    text: '김철수님이 게시글 작성 "Claude로 마케팅 자동화 구축기"',
    time: "10:30",
  },
  {
    id: "2",
    type: "study" as const,
    text: "이영희님이 AI 자동화 스터디 수강 신청",
    time: "10:15",
  },
  {
    id: "3",
    type: "signup" as const,
    text: "박민수님이 회원가입",
    time: "09:45",
  },
  {
    id: "4",
    type: "comment" as const,
    text: '김영호님이 댓글 작성 "좋은 글이네요!"',
    time: "09:30",
  },
  {
    id: "5",
    type: "post" as const,
    text: '이수진님이 게시글 작성 "GPT-5 전망과 활용법"',
    time: "09:15",
  },
  {
    id: "6",
    type: "admin" as const,
    text: "관리자가 히어로 배너 수정",
    time: "09:00",
  },
  {
    id: "7",
    type: "study" as const,
    text: "최지원님이 프롬프트 엔지니어링 스터디 신청",
    time: "08:45",
  },
  {
    id: "8",
    type: "comment" as const,
    text: '한서연님이 댓글 작성 "도움이 많이 됐습니다"',
    time: "08:30",
  },
  {
    id: "9",
    type: "signup" as const,
    text: "정우성님이 회원가입",
    time: "08:15",
  },
  {
    id: "10",
    type: "post" as const,
    text: '송다혜님이 게시글 작성 "n8n 자동화 워크플로우 가이드"',
    time: "08:00",
  },
];

export default function AdminPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-xl font-semibold text-foreground">대시보드</h1>

      <section>
        <h3 className="text-sm font-semibold text-foreground mb-3">오늘의 요약</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {todayStats.map((stat) => (
            <StatCard
              key={stat.label}
              label={stat.label}
              value={stat.value}
              change={stat.change}
            />
          ))}
        </div>
      </section>

      <section>
        <h3 className="text-sm font-semibold text-foreground mb-3">빠른 작업</h3>
        <QuickAction items={quickActions} />
      </section>

      <section>
        <h3 className="text-sm font-semibold text-foreground mb-3">최근 활동</h3>
        <ActivityFeed items={recentActivities} />
      </section>
    </div>
  );
}
