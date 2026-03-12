import Link from "next/link";
import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface MessageRowProps {
  from: string;
  username: string;
  subject: string;
  preview?: string;
  time: string;
  unread?: boolean;
  href: string;
  avatarSrc?: string;
}

export function MessageRow({
  from,
  username,
  subject,
  preview,
  time,
  unread = false,
  href,
  avatarSrc,
}: MessageRowProps) {
  return (
    <Link
      href={href}
      className={cn("flex items-start gap-3 p-4", unread && "bg-accent")}
    >
      <Avatar size="sm" className="w-10 h-10" />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span
            className={cn(
              "text-sm",
              unread
                ? "font-semibold text-foreground"
                : "font-medium text-foreground"
            )}
          >
            {from}
          </span>
          <span className="text-sm text-sub-foreground">@{username}</span>
        </div>
        <p
          className={cn(
            "text-sm mb-0.5",
            unread ? "font-semibold text-foreground" : "text-foreground"
          )}
        >
          {subject}
        </p>
        {preview && (
          <p className="text-sm text-sub-foreground truncate">{preview}</p>
        )}
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <span className="text-sm text-sub-foreground">{time}</span>
        {unread && (
          <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
        )}
      </div>
    </Link>
  );
}
