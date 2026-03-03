import {
  Bell,
  UserPlus,
  CreditCard,
  Calendar,
  MessageSquare,
  Megaphone,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const defaultIconMap: Record<string, LucideIcon> = {
  welcome: UserPlus,
  payment: CreditCard,
  event: Calendar,
  comment: MessageSquare,
  system: Megaphone,
};

interface NotificationRowProps {
  text: string;
  time: string;
  type: string;
  iconMap?: Record<string, LucideIcon>;
}

export function NotificationRow({
  text,
  time,
  type,
  iconMap = defaultIconMap,
}: NotificationRowProps) {
  const Icon = iconMap[type] ?? Bell;

  return (
    <div className="flex items-center gap-3 p-4">
      <span className="text-muted-foreground">
        <Icon className="w-4 h-4" />
      </span>
      <span className="flex-1 text-sm text-muted-foreground">{text}</span>
      <span className="text-xs text-muted-foreground shrink-0">{time}</span>
    </div>
  );
}
