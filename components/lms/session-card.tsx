import { Video, Clock, Play, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type SessionStatus = "upcoming" | "today" | "ended" | "replay";

interface SessionCardProps {
  title: string;
  type: "AI토크" | "줌" | "오프라인";
  date: string;
  time: string;
  status: SessionStatus;
  zoomUrl?: string;
  replayUrl?: string;
  className?: string;
}

const statusConfig: Record<
  SessionStatus,
  { label: string; variant: "default" | "active" | "completed" }
> = {
  upcoming: { label: "예정", variant: "default" },
  today: { label: "오늘", variant: "active" },
  ended: { label: "종료", variant: "completed" },
  replay: { label: "다시보기 가능", variant: "active" },
};

const typeIcon = {
  "AI토크": Video,
  "줌": Video,
  "오프라인": Calendar,
};

export function SessionCard({
  title,
  type,
  date,
  time,
  status,
  zoomUrl,
  replayUrl,
  className,
}: SessionCardProps) {
  const config = statusConfig[status];
  const Icon = typeIcon[type];

  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-background p-4 flex items-start gap-3",
        status === "today" && "border-primary",
        className
      )}
    >
      <span className="text-primary shrink-0 mt-0.5">
        <Icon className="w-4 h-4" />
      </span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <p className="text-sm font-medium text-foreground truncate">
            {title}
          </p>
          <Badge variant={config.variant}>{config.label}</Badge>
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {date}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {time}
          </span>
          <Badge variant="default">{type}</Badge>
        </div>
        {status === "today" && zoomUrl && (
          <a
            href={zoomUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-xs font-medium text-primary hover:text-primary/80 transition-colors mt-2"
          >
            참여하기 &rarr;
          </a>
        )}
        {status === "replay" && replayUrl && (
          <a
            href={replayUrl}
            className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80 transition-colors mt-2"
          >
            <Play className="w-3 h-3" />
            다시보기 &rarr;
          </a>
        )}
      </div>
    </div>
  );
}
