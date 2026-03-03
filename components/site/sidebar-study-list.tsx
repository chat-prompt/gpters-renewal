import Link from "next/link";
import { Calendar, Users } from "lucide-react";

interface SidebarStudy {
  slug: string;
  title: string;
  date: string;
  enrolled: number;
  capacity: number;
  price: string;
}

interface SidebarStudyListProps {
  studies: SidebarStudy[];
}

export function SidebarStudyList({ studies }: SidebarStudyListProps) {
  return (
    <div className="border border-border rounded-lg">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <h3 className="text-sm font-bold text-foreground">
          모집 중인 스터디
        </h3>
        <Link href="/study" className="text-xs text-muted-foreground">
          전체보기
        </Link>
      </div>
      <div className="p-3 space-y-3">
        {studies.map((study) => (
          <Link
            key={study.slug}
            href={`/study/${study.slug}`}
            className="block p-3 border border-border rounded-md space-y-2"
          >
            <p className="text-sm font-medium text-foreground">
              {study.title}
            </p>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {study.date}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1 text-muted-foreground">
                <Users className="w-3 h-3" />
                {study.enrolled}/{study.capacity}명
              </span>
              <span className="text-primary font-medium">{study.price}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
