import Link from "next/link";
import {
  Heart,
  MessageSquare,
  CornerDownRight,
  UserPlus,
  Bell,
  CreditCard,
  Calendar,
  BookOpen,
  Megaphone,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const SOCIAL_TYPES = new Set(["like", "comment", "reply", "follow"]);

const iconConfig: Record<string, { icon: LucideIcon; color: string; actionText: string }> = {
  like:    { icon: Heart,           color: "text-primary",        actionText: "님이 좋아합니다" },
  comment: { icon: MessageSquare,   color: "text-primary",        actionText: "님이 댓글을 남겼습니다" },
  reply:   { icon: CornerDownRight, color: "text-primary",        actionText: "님이 답글을 남겼습니다" },
  follow:  { icon: UserPlus,        color: "text-primary",        actionText: "님이 팔로우했습니다" },
  payment: { icon: CreditCard,      color: "text-sub-foreground", actionText: "" },
  event:   { icon: Calendar,        color: "text-sub-foreground", actionText: "" },
  study:   { icon: BookOpen,        color: "text-sub-foreground", actionText: "" },
  system:  { icon: Megaphone,       color: "text-sub-foreground", actionText: "" },
  welcome: { icon: UserPlus,        color: "text-sub-foreground", actionText: "" },
};

interface NotificationRowProps {
  type: string;
  text: string;
  time: string;
  actor?: string;
  actorUsername?: string;
  targetTitle?: string;
  href?: string;
  unread?: boolean;
}

export function NotificationRow({
  type,
  text,
  time,
  actor,
  targetTitle,
  href,
  unread,
}: NotificationRowProps) {
  const config = iconConfig[type] ?? { icon: Bell, color: "text-sub-foreground", actionText: "" };
  const Icon = config.icon;
  const isSocial = SOCIAL_TYPES.has(type);

  const inner = (
    <div className="flex items-start gap-3 py-4">
      <span className={cn("mt-0.5 shrink-0", config.color)}>
        <Icon className="w-4 h-4" strokeWidth={1.5} />
      </span>

      {isSocial && <Avatar size="sm" fallback={actor?.[0]} className="shrink-0" />}

      <div className="flex-1 min-w-0">
        {isSocial ? (
          <>
            <p className="text-sm text-foreground leading-relaxed">
              <span className="font-medium">{actor}</span>
              {config.actionText}
              {targetTitle && (
                <span className="text-sub-foreground"> · {targetTitle}</span>
              )}
            </p>
            {text && (
              <p className="text-sm font-regular text-sub-foreground mt-1 line-clamp-1">
                &ldquo;{text}&rdquo;
              </p>
            )}
          </>
        ) : (
          <p className="text-sm text-secondary-foreground">{text}</p>
        )}
        <p className="text-sm font-regular text-sub-foreground mt-0.5">{time}</p>
      </div>

      {unread && (
        <span className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1.5" />
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block hover:bg-muted/50 transition-colors px-2 -mx-2 rounded">
        {inner}
      </Link>
    );
  }
  return inner;
}
