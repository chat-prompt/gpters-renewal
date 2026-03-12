import { GraduationCap, Award, ScrollText } from "lucide-react";
import { cn } from "@/lib/utils";

interface StudyHistoryItem {
  title: string;
  period: string;
  leader: string;
  posts: number;
  project: string;
  badge: string;
}

interface StudyHistoryCardProps {
  study: StudyHistoryItem;
  className?: string;
}

export function StudyHistoryCard({ study, className }: StudyHistoryCardProps) {
  return (
    <div className={cn("p-4 space-y-2", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <GraduationCap className="w-4 h-4 text-primary" strokeWidth={1.5} />
          <span className="font-medium text-foreground">{study.title}</span>
        </div>
        <span className="text-sm text-primary bg-accent px-2 py-0.5 rounded-sm">
          수료 완료
        </span>
      </div>
      <div className="text-sm text-sub-foreground space-y-1 pl-6">
        <p>{study.period}</p>
        <p>스터디장: {study.leader}</p>
        <p>사례글: {study.posts}건 작성</p>
        <p>최종 프로젝트: {study.project}</p>
        <p className="flex items-center gap-1.5 text-foreground">
          <Award className="w-3.5 h-3.5 text-primary" strokeWidth={1.5} />
          획득 뱃지: {study.badge}
        </p>
      </div>
      <div className="pl-6 flex gap-2">
        <button className="text-sm text-primary">사례글 보기</button>
        <button className="text-sm text-primary">프로젝트 보기</button>
        <button className="text-sm text-primary flex items-center gap-1">
          <ScrollText className="w-3 h-3" strokeWidth={1.5} />
          수료증 보기
        </button>
      </div>
    </div>
  );
}

interface StudyHistoryListProps {
  studies: StudyHistoryItem[];
  className?: string;
}

export function StudyHistoryList({
  studies,
  className,
}: StudyHistoryListProps) {
  return (
    <div
      className={cn(
        "border border-border rounded-lg divide-y divide-border",
        className
      )}
    >
      {studies.map((study) => (
        <StudyHistoryCard key={study.title} study={study} />
      ))}
    </div>
  );
}
