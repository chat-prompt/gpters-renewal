import Link from "next/link";
import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface UserMetaProps {
  name?: string;
  username?: string;
  avatar?: string;
  date?: string;
  href?: string;
  size?: "sm" | "md";
  showAvatar?: boolean;
  className?: string;
}

export function UserMeta({
  name,
  username,
  avatar,
  date,
  href,
  size = "sm",
  showAvatar = true,
  className,
}: UserMetaProps) {
  const avatarSize = size === "sm" ? ("sm" as const) : ("default" as const);

  const content = (
    <span className={cn("inline-flex items-center gap-2", className)}>
      {showAvatar && <Avatar size={avatarSize} />}
      <span className={cn(showAvatar && (size === "sm" ? "text-sm text-foreground" : "text-base text-foreground"))}>
        {name && <span className="font-medium">{name}</span>}
        {(username || date) && (
          <span className="text-sub-foreground font-normal">
            {username && <>{name ? " " : ""}@{username}</>}
            {date && <> · {date}</>}
          </span>
        )}
      </span>
    </span>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}
