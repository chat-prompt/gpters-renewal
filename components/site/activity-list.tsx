import { FileText, GraduationCap, MessageSquare } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ActivityItem {
  type: string;
  text: string;
  time: string;
}

interface ActivityListProps {
  activities: ActivityItem[];
  iconMap?: Record<string, LucideIcon>;
  className?: string;
}

const defaultIconMap: Record<string, LucideIcon> = {
  post: FileText,
  study: GraduationCap,
  comment: MessageSquare,
};

export function ActivityList({
  activities,
  iconMap = defaultIconMap,
  className,
}: ActivityListProps) {
  return (
    <div
      className={cn(
        "border border-border rounded-lg divide-y divide-border",
        className
      )}
    >
      {activities.map((activity) => {
        const Icon = iconMap[activity.type];
        return (
          <div key={activity.text} className="flex items-center gap-3 p-4">
            <span className="text-muted-foreground">
              {Icon && <Icon className="w-4 h-4" />}
            </span>
            <span className="text-sm text-foreground flex-1">
              {activity.text}
            </span>
            <span className="text-xs text-muted-foreground">
              {activity.time}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export type { ActivityItem };
