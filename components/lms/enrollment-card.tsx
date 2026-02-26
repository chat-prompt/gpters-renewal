import Link from "next/link";
import { Avatar } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface EnrollmentCardProps {
  title: string;
  leaderName: string;
  period: string;
  currentWeek: number;
  progressValue: number;
  href: string;
  children?: ReactNode;
  className?: string;
}

export function EnrollmentCard({
  title,
  leaderName,
  period,
  currentWeek,
  progressValue,
  href,
  children,
  className,
}: EnrollmentCardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-background p-6 space-y-4",
        className
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="text-lg font-bold text-foreground">{title}</h3>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Avatar size="xs" />
              {leaderName}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {period}
            </span>
            <Badge variant="active">{currentWeek}주차 진행 중</Badge>
          </div>
        </div>
      </div>

      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>진도</span>
          <span>{progressValue}%</span>
        </div>
        <Progress value={progressValue} />
      </div>

      {children}

      <div className="flex flex-wrap gap-2">
        <Link href={href}>
          <Button size="sm">학습하기</Button>
        </Link>
        <Link href={`${href}/vod`}>
          <Button variant="outline" size="sm">
            VOD 다시보기
          </Button>
        </Link>
        <Link href={`${href}/tasks`}>
          <Button variant="outline" size="sm">
            과제 쓰기
          </Button>
        </Link>
      </div>
    </div>
  );
}
