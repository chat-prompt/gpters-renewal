import Link from "next/link";
import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface UserRowProps {
  name: string;
  username: string;
  description?: string;
  href?: string;
  avatarSrc?: string;
  className?: string;
}

export function UserRow({
  name,
  username,
  description,
  href,
  avatarSrc,
  className,
}: UserRowProps) {
  const content = (
    <div className={cn("flex items-center gap-3 p-4", className)}>
      <Avatar size="sm" className="w-10 h-10" />
      <div>
        <p className="text-sm font-medium text-foreground">
          {name}{" "}
          <span className="text-muted-foreground">@{username}</span>
        </p>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </div>
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}
