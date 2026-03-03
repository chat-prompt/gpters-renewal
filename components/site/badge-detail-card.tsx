import type { LucideIcon } from "lucide-react";
import {
  Medal,
  GraduationCap,
  Star,
  Handshake,
  Crown,
  PenLine,
  Rocket,
  MessageCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

/** Map of badge names to lucide icons — extend as new badges are added */
const badgeIconMap: Record<string, LucideIcon> = {
  "AI 자동화 전문가": Medal,
  "3기 수료": GraduationCap,
  "베스트 사례 3회": Star,
  "모각AI 리더": Handshake,
  기여왕: Crown,
  "프롬프트 마스터": PenLine,
  "AI 입문자": Rocket,
  소통왕: MessageCircle,
};

const defaultIcon: LucideIcon = Medal;

export interface BadgeItem {
  icon: LucideIcon | string;
  name: string;
  earnedDate: string;
  description: string;
}

interface BadgeDetailCardProps {
  badge: BadgeItem;
  className?: string;
}

export function BadgeDetailCard({ badge, className }: BadgeDetailCardProps) {
  const Icon =
    typeof badge.icon === "string"
      ? badgeIconMap[badge.name] ?? defaultIcon
      : badge.icon;

  return (
    <div
      className={cn(
        "border border-border rounded-lg p-4 space-y-2",
        className
      )}
    >
      <div className="flex items-center gap-3">
        <Icon className="w-8 h-8 text-primary" />
        <div>
          <p className="font-semibold text-foreground">{badge.name}</p>
          <p className="text-xs text-muted-foreground">{badge.earnedDate}</p>
        </div>
      </div>
      <p className="text-sm text-muted-foreground">{badge.description}</p>
    </div>
  );
}
