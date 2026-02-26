import { Trophy } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  avatarUrl?: string;
  postCount: number;
}

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  title: string;
  currentUserId?: string;
  className?: string;
}

export function Leaderboard({
  entries,
  title,
  currentUserId,
  className,
}: LeaderboardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-background",
        className
      )}
    >
      <div className="flex items-center gap-2 p-4 border-b border-border">
        <Trophy className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-bold text-foreground">{title}</h3>
      </div>
      <div className="divide-y divide-border">
        {entries.map((entry) => {
          const isMe = currentUserId === entry.userId;
          return (
            <div
              key={entry.userId}
              className={cn(
                "flex items-center gap-3 px-4 py-3",
                isMe && "bg-primary/5"
              )}
            >
              <span
                className={cn(
                  "w-6 text-center text-sm font-bold",
                  entry.rank <= 3 ? "text-primary" : "text-muted-foreground"
                )}
              >
                {entry.rank}
              </span>
              <Avatar size="xs" src={entry.avatarUrl} alt={entry.name} />
              <span className="flex-1 text-sm font-medium text-foreground truncate">
                {entry.name}
              </span>
              {isMe && <Badge variant="active">나</Badge>}
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {entry.postCount}편
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
