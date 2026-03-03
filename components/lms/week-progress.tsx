import { Check, X, Minus, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

type StatusValue = "done" | "not-done" | "new" | "upcoming";

interface WeekProgressProps {
  week: number;
  status: "completed" | "in-progress" | "upcoming";
  attendance: StatusValue;
  assignment: StatusValue;
  vod: StatusValue;
  className?: string;
}

function StatusIcon({ value }: { value: StatusValue }) {
  switch (value) {
    case "done":
      return <Check className="w-3.5 h-3.5 text-primary" />;
    case "not-done":
      return <X className="w-3.5 h-3.5 text-destructive" />;
    case "new":
      return <Circle className="w-3.5 h-3.5 text-primary fill-primary" />;
    case "upcoming":
      return <Minus className="w-3.5 h-3.5 text-muted-foreground" />;
  }
}

function statusLabel(value: StatusValue) {
  switch (value) {
    case "done":
      return "O";
    case "not-done":
      return "X";
    case "new":
      return "NEW";
    case "upcoming":
      return "-";
  }
}

export function WeekProgress({
  week,
  status,
  attendance,
  assignment,
  vod,
  className,
}: WeekProgressProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border p-3 text-center min-w-[80px]",
        status === "in-progress" && "border-primary",
        className
      )}
    >
      <p className="text-xs font-medium text-foreground mb-2">{week}주차</p>
      <div className="space-y-1.5">
        <div className="flex items-center justify-center gap-1">
          <span className="text-xs text-muted-foreground">출석</span>
          <StatusIcon value={attendance} />
        </div>
        <div className="flex items-center justify-center gap-1">
          <span className="text-xs text-muted-foreground">과제</span>
          <StatusIcon value={assignment} />
        </div>
        <div className="flex items-center justify-center gap-1">
          <span className="text-xs text-muted-foreground">VOD</span>
          <StatusIcon value={vod} />
        </div>
      </div>
    </div>
  );
}
