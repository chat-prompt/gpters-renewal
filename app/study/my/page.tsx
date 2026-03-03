import Link from "next/link";
import { PenSquare, Video, Users, GraduationCap, ScrollText, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ActionItemCard } from "@/components/lms/action-item-card";
import { WeekProgress } from "@/components/lms/week-progress";
import { EnrollmentCard } from "@/components/lms/enrollment-card";
import { AssignmentGuide } from "@/components/lms/assignment-guide";
import { VodCard } from "@/components/lms/vod-card";

// -- Mock Data --

const actionItems = [
  {
    icon: <PenSquare className="w-5 h-5" />,
    title: "사례 게시글 작성",
    description: "2주차 과제 미제출",
    href: "/write?type=case&studyId=21-ai-automation&week=2",
    ctaLabel: "글쓰기",
  },
  {
    icon: <Video className="w-5 h-5" />,
    title: "AI토크 참여",
    description: '화 7PM "n8n 자동화"',
    href: "#",
    ctaLabel: "참여하기",
  },
  {
    icon: <Video className="w-5 h-5" />,
    title: "AI토크 다시보기",
    description: "1주차 세션 녹화본 등록됨",
    href: "/study/21-ai-automation/learn/vod",
    ctaLabel: "시청하기",
  },
];

const weekData = [
  { week: 1, status: "completed" as const, attendance: "done" as const, assignment: "done" as const, vod: "done" as const },
  { week: 2, status: "in-progress" as const, attendance: "upcoming" as const, assignment: "not-done" as const, vod: "new" as const },
  { week: 3, status: "upcoming" as const, attendance: "upcoming" as const, assignment: "upcoming" as const, vod: "upcoming" as const },
  { week: 4, status: "upcoming" as const, attendance: "upcoming" as const, assignment: "upcoming" as const, vod: "upcoming" as const },
];

const auditVods = [
  { title: "프롬프트 엔지니어링 실전", studyName: "프롬프트 ENG", week: 2, duration: "45분", watched: false },
  { title: "바이브코딩 기초", studyName: "바이브코딩", week: 1, duration: "52분", watched: false },
  { title: "콘텐츠 자동화 전략", studyName: "콘텐츠 제작", week: 2, duration: "38분", watched: false },
];

const historyItems = [
  { title: "20기 프롬프트 엔지니어링", status: "completed" as const },
  { title: "19기 AI 활용 기초", status: "completed" as const },
];

export default function MyStudyPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 space-y-8">
      <h1 className="text-2xl font-bold text-foreground">내 스터디</h1>

      {/* Section: 이번 주 할 일 */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-foreground">이번 주 할 일</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {actionItems.map((item) => (
            <ActionItemCard key={item.title} {...item} />
          ))}
        </div>
      </section>

      {/* Section: 과제 연동 안내 */}
      <AssignmentGuide />

      {/* Section: 진행 중 스터디 */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-foreground">진행 중 스터디</h2>
        <EnrollmentCard
          title="21기 AI 자동화 스터디"
          leaderName="김스터디"
          period="3/16 ~ 4/12"
          currentWeek={2}
          progressValue={45}
          href="/study/21-ai-automation/learn"
        >
          <div className="grid grid-cols-4 gap-2">
            {weekData.map((w) => (
              <WeekProgress key={w.week} {...w} />
            ))}
          </div>
        </EnrollmentCard>
      </section>

      {/* Section: 청강 가능 VOD */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground">청강 가능 VOD</h2>
          <Link
            href="/study/my/audit"
            className="flex items-center text-xs text-primary font-medium hover:text-primary/80 transition-colors"
          >
            전체보기
            <ChevronRight className="w-3 h-3 ml-0.5" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {auditVods.map((vod) => (
            <VodCard key={vod.title} {...vod} />
          ))}
        </div>
      </section>

      {/* Section: 수강 이력 */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground">수강 이력</h2>
          <Link
            href="/study/my/history"
            className="flex items-center text-xs text-primary font-medium hover:text-primary/80 transition-colors"
          >
            전체보기
            <ChevronRight className="w-3 h-3 ml-0.5" />
          </Link>
        </div>
        <div className="rounded-lg border border-border divide-y divide-border">
          {historyItems.map((item) => (
            <div key={item.title} className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <GraduationCap className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-foreground">{item.title}</span>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="active">수료 완료</Badge>
                <Link
                  href="#"
                  className="flex items-center text-xs text-primary font-medium hover:text-primary/80 transition-colors"
                >
                  <ScrollText className="w-3.5 h-3.5 mr-1" />
                  수료증 보기
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
