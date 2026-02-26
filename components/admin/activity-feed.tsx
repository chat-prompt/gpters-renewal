import {
  FileText,
  UserPlus,
  MessageSquare,
  BookOpen,
  Settings,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type ActivityType = "post" | "signup" | "comment" | "study" | "admin";

interface ActivityItem {
  id: string;
  type: ActivityType;
  text: string;
  time: string;
}

interface ActivityFeedProps {
  items: ActivityItem[];
}

const typeIcons: Record<ActivityType, LucideIcon> = {
  post: FileText,
  signup: UserPlus,
  comment: MessageSquare,
  study: BookOpen,
  admin: Settings,
};

export function ActivityFeed({ items }: ActivityFeedProps) {
  return (
    <div className="border border-border rounded-lg divide-y divide-border bg-background">
      {items.map((item) => {
        const Icon = typeIcons[item.type];
        return (
          <div
            key={item.id}
            className="flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors"
          >
            <Icon className="w-4 h-4 text-muted-foreground shrink-0" />
            <span className="text-sm text-foreground flex-1 truncate">
              {item.text}
            </span>
            <span className="text-xs text-muted-foreground font-mono whitespace-nowrap shrink-0">
              {item.time}
            </span>
          </div>
        );
      })}
    </div>
  );
}
