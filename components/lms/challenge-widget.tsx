import { Flame } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface TopSender {
  name: string;
  avatarUrl?: string;
  count: number;
}

interface ChallengeWidgetProps {
  totalCerts: number;
  myDays: number;
  myTotal: number;
  topSenders: TopSender[];
  className?: string;
}

export function ChallengeWidget({
  totalCerts,
  myDays,
  myTotal,
  topSenders,
  className,
}: ChallengeWidgetProps) {
  const maxDays = 7;
  const progressValue = Math.round((myDays / maxDays) * 100);

  return (
    <div
      className={cn(
        "rounded-lg border border-border p-4 space-y-4",
        className
      )}
    >
      <div className="flex items-center gap-2">
        <Flame className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-bold text-foreground">찐친챌린지</h3>
      </div>

      {/* 전체 인증 수 */}
      <div className="text-center py-2">
        <p className="text-2xl font-bold text-foreground">{totalCerts}</p>
        <p className="text-xs text-muted-foreground">전체 인증 수</p>
      </div>

      {/* 내 인증 현황 */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>내 인증 현황</span>
          <span>
            {myDays}/{maxDays}일 (총 {myTotal}회)
          </span>
        </div>
        <Progress value={progressValue} />
      </div>

      {/* Top 5 리더보드 */}
      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground">Top 5</p>
        <div className="space-y-1.5">
          {topSenders.map((sender, i) => (
            <div key={sender.name} className="flex items-center gap-2">
              <span
                className={cn(
                  "w-4 text-center text-xs font-bold",
                  i < 3 ? "text-primary" : "text-muted-foreground"
                )}
              >
                {i + 1}
              </span>
              <Avatar size="xs" src={sender.avatarUrl} alt={sender.name} />
              <span className="flex-1 text-xs text-foreground truncate">
                {sender.name}
              </span>
              <span className="text-xs text-muted-foreground">
                {sender.count}회
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
