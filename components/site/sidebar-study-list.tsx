import Link from "next/link";
import { Calendar, Users, ChevronRight } from "lucide-react";

interface Program {
  slug: string;
  title: string;
}

interface CohortStudy {
  slug: string;
  cohort: string;
  date: string;
  enrolled: number;
  capacity: number;
  price: string;
  programs: Program[];
}

interface SidebarStudyListProps {
  study: CohortStudy;
}

export function SidebarStudyList({ study }: SidebarStudyListProps) {
  return (
    <div className="border border-border rounded-lg">
      <div className="px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-medium text-primary-foreground bg-primary px-2 py-0.5 rounded">
            모집 중
          </span>
        </div>
        <h3 className="text-sm font-semibold text-foreground mt-2">
          {study.cohort} AI 스터디
        </h3>
        <div className="flex items-center gap-3 mt-1.5 text-sm text-sub-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="w-4 h-4" strokeWidth={1.5} />
            {study.date}
          </span>
          <span className="flex items-center gap-1">
            <Users className="w-4 h-4" strokeWidth={1.5} />
            {study.enrolled}/{study.capacity}명
          </span>
        </div>
      </div>

      <div className="p-3 space-y-1">
        {study.programs.map((program) => (
          <Link
            key={program.slug}
            href={`/study/${program.slug}`}
            className="flex items-center justify-between px-3 py-2 rounded-md text-sm text-foreground hover:bg-muted transition-colors"
          >
            {program.title}
            <ChevronRight className="w-4 h-4 text-sub-foreground" strokeWidth={1.5} />
          </Link>
        ))}
      </div>

      <div className="px-4 py-3 border-t border-border flex items-center justify-between">
        <span className="text-sm font-semibold text-primary">{study.price}</span>
        <Link
          href="/study"
          className="text-sm font-medium text-primary hover:underline"
        >
          자세히 보기
        </Link>
      </div>
    </div>
  );
}
