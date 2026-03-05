import Link from "next/link";
import { Calendar, Users, Coins } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface StudyCardProps {
  slug: string;
  title: string;
  date: string;
  enrolled: number;
  capacity: number;
  price: string;
  status?: "recruiting" | "ongoing" | "completed";
}

export function StudyCard({
  slug,
  title,
  date,
  enrolled,
  capacity,
  price,
  status = "recruiting",
}: StudyCardProps) {
  const progress = Math.round((enrolled / capacity) * 100);

  const statusLabel = {
    recruiting: "모집중",
    ongoing: "진행중",
    completed: "완료",
  }[status];

  const statusClass = {
    recruiting: "bg-primary/10 text-primary",
    ongoing: "bg-accent/10 text-accent-foreground",
    completed: "bg-muted text-muted-foreground",
  }[status];

  return (
    <div className="border border-border rounded-lg p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-foreground">{title}</h3>
        <span
          className={`text-xs font-medium px-2 py-0.5 rounded-sm ${statusClass}`}
        >
          {statusLabel}
        </span>
      </div>
      <div className="space-y-1 text-sm text-muted-foreground">
        <p className="flex items-center gap-2">
          <Calendar className="w-4 h-4" /> {date}
        </p>
        <p className="flex items-center gap-2">
          <Users className="w-4 h-4" /> {enrolled}/{capacity}명 모집
        </p>
        <p className="flex items-center gap-2">
          <Coins className="w-4 h-4" /> {price}
        </p>
      </div>
      <div className="space-y-1">
        <Progress value={progress} />
        <p className="text-xs text-muted-foreground text-right">{progress}% 모집</p>
      </div>
      <div className="flex gap-2">
        <Link
          href={`/study/${slug}`}
          className="px-4 py-2 text-sm border border-border rounded-md text-foreground"
        >
          상세보기
        </Link>
        <Link
          href={`/checkout/${slug}`}
          className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md"
        >
          바로신청
        </Link>
      </div>
    </div>
  );
}
