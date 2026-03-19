import Link from "next/link";
import { PenSquare, ExternalLink } from "lucide-react";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

// -- Mock Data --

const assignments = [
  {
    week: 1,
    description: "n8n 기초 워크플로우를 만들고 사례를 공유하세요",
    status: "submitted" as const,
    postTitle: "n8n으로 이메일 자동 분류하기",
    postSlug: "/posts/n8n-email-classification",
  },
  {
    week: 2,
    description: "조건 분기와 API 연동을 활용한 자동화 사례를 공유하세요",
    status: "not-submitted" as const,
    postTitle: null,
    postSlug: null,
  },
  {
    week: 3,
    description: "멀티 워크플로우 또는 스케줄 기반 자동화 사례를 공유하세요",
    status: "upcoming" as const,
    postTitle: null,
    postSlug: null,
  },
  {
    week: 4,
    description: "최종 프로젝트 결과를 발표 형식으로 공유하세요",
    status: "upcoming" as const,
    postTitle: null,
    postSlug: null,
  },
];

const submittedCount = assignments.filter((a) => a.status === "submitted").length;
const totalCount = assignments.length;
const progressValue = Math.round((submittedCount / totalCount) * 100);

function StatusBadge({ status }: { status: "submitted" | "not-submitted" | "overdue" | "upcoming" }) {
  switch (status) {
    case "submitted":
      return <Badge variant="active">제출완료</Badge>;
    case "not-submitted":
      return <Badge variant="default">미제출</Badge>;
    case "overdue":
      return (
        <span className="inline-flex items-center whitespace-nowrap text-xs font-medium bg-destructive/10 text-destructive px-2 py-0.5 rounded-sm">
          기한지남
        </span>
      );
    case "upcoming":
      return <Badge variant="default">예정</Badge>;
  }
}

export default function TasksPage() {
  return (
    <div className="mx-auto max-w-[860px] px-6 py-page space-y-6">
      <Breadcrumb
        items={[
          { label: "내 스터디", href: "/study/my" },
          { label: "21기 AI 자동화 스터디", href: "/study/21-ai-automation/learn" },
          { label: "과제 현황" },
        ]}
      />

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">과제 현황</h1>
        <Link href="/write?type=case&studyId=21-ai-automation&week=2">
          <Button size="sm">
            <PenSquare className="w-3.5 h-3.5" />
            과제 쓰기
          </Button>
        </Link>
      </div>

      {/* Overall Progress */}
      <div className="rounded-lg border border-border p-4 space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-sub-foreground">전체 과제 제출률</span>
          <span className="font-medium text-foreground">
            {submittedCount}/{totalCount} ({progressValue}%)
          </span>
        </div>
        <Progress value={progressValue} />
      </div>

      {/* Weekly Assignment List */}
      <div className="rounded-lg border border-border divide-y divide-border">
        {assignments.map((a) => (
          <div key={a.week} className="p-4 flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex items-center gap-3 shrink-0">
              <span className="text-sm font-bold text-foreground w-12">{a.week}주차</span>
              <StatusBadge status={a.status} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-sub-foreground">{a.description}</p>
              {a.postTitle && a.postSlug && (
                <Link
                  href={a.postSlug}
                  className="inline-flex items-center gap-1 text-xs text-primary font-medium hover:text-primary/80 transition-colors mt-1"
                >
                  <ExternalLink className="w-3 h-3" />
                  {a.postTitle}
                </Link>
              )}
            </div>
            {a.status === "not-submitted" && (
              <Link href={`/write?type=case&studyId=21-ai-automation&week=${a.week}`} className="shrink-0">
                <Button variant="outline" size="sm">
                  <PenSquare className="w-3.5 h-3.5" />
                  글쓰기
                </Button>
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
