import Link from "next/link";
import { Check, X, PenSquare, Play } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type WeekStatus = "completed" | "in-progress" | "upcoming";

interface VodItem {
  title: string;
  watched: boolean;
}

interface AttendanceInfo {
  done: boolean;
  label: string;
}

interface AssignmentInfo {
  done: boolean;
  label: string;
  postTitle: string | null;
  postSlug: string | null;
}

interface WeekAccordionItemProps {
  week: number;
  status: WeekStatus;
  period: string;
  curriculum: string;
  attendance: AttendanceInfo | null;
  assignment: AssignmentInfo | null;
  vods: VodItem[];
  studySlug: string;
}

function StatusBadge({ status }: { status: WeekStatus }) {
  switch (status) {
    case "completed":
      return <Badge variant="completed">완료</Badge>;
    case "in-progress":
      return <Badge variant="active">진행중</Badge>;
    case "upcoming":
      return <Badge variant="default">예정</Badge>;
  }
}

export function WeekAccordionItem({
  week,
  status,
  period,
  curriculum,
  attendance,
  assignment,
  vods,
  studySlug,
}: WeekAccordionItemProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">{period}</p>
        <StatusBadge status={status} />
      </div>
      <p className="text-sm text-muted-foreground">
        <span className="text-xs font-medium text-foreground">커리큘럼:</span>{" "}
        {curriculum}
      </p>

      {attendance && (
        <div className="flex items-center gap-2 text-sm">
          <span className="text-xs text-muted-foreground w-10">출석</span>
          {attendance.done ? (
            <Check className="w-3.5 h-3.5 text-primary" />
          ) : (
            <X className="w-3.5 h-3.5 text-destructive" />
          )}
          <span className="text-xs text-muted-foreground">
            {attendance.label}
          </span>
        </div>
      )}

      {assignment && (
        <div className="flex items-center gap-2 text-sm">
          <span className="text-xs text-muted-foreground w-10">과제</span>
          {assignment.done ? (
            <>
              <Check className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs text-muted-foreground">
                {assignment.label}
              </span>
              {assignment.postSlug && (
                <Link
                  href={assignment.postSlug}
                  className="text-xs text-primary hover:text-primary/80 transition-colors"
                >
                  &ldquo;{assignment.postTitle}&rdquo;
                </Link>
              )}
            </>
          ) : (
            <>
              <X className="w-3.5 h-3.5 text-destructive" />
              <span className="text-xs text-muted-foreground">
                {assignment.label}
              </span>
              <Link
                href={`/write?type=case&studyId=${studySlug}&week=${week}`}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-xs"
                >
                  <PenSquare className="w-3 h-3" />
                  과제 쓰기
                </Button>
              </Link>
            </>
          )}
        </div>
      )}

      {vods.length > 0 && (
        <div className="space-y-1">
          <span className="text-xs text-muted-foreground">VOD</span>
          {vods.map((vod) => (
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

      {status === "upcoming" && (
        <p className="text-xs text-muted-foreground">({period})</p>
      )}
    </div>
  );
}
