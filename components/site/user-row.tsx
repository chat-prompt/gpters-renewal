"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";

interface UserRowProps {
  name: string;
  username: string;
  description?: string;
  href?: string;
  avatarSrc?: string;
  showFollowButton?: boolean;
  initialFollowing?: boolean;
  className?: string;
}

export function UserRow({
  name,
  username,
  description,
  href,
  avatarSrc,
  showFollowButton = false,
  initialFollowing = false,
  className,
}: UserRowProps) {
  const { isLoggedIn } = useAuth();
  const pathname = usePathname();
  const [following, setFollowing] = useState(initialFollowing);

  const info = (
    <>
      <Avatar className="w-8 h-8 shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate">
          {name}
        </p>
        {description && (
          <p className="text-sm text-sub-foreground truncate">{description}</p>
        )}
      </div>
    </>
  );

  return (
    <div className={cn("flex items-center gap-2 py-2", className)}>
      {href ? (
        <Link href={href} className="flex items-center gap-2 flex-1 min-w-0">
          {info}
        </Link>
      ) : (
        <div className="flex items-center gap-2 flex-1 min-w-0">{info}</div>
      )}
      {showFollowButton && (
        isLoggedIn ? (
          <Button
            variant={following ? "secondary" : "soft"}
            size="xs"
            className="shrink-0"
            onClick={() => setFollowing((f) => !f)}
          >
            {following ? "팔로잉" : "팔로우"}
          </Button>
        ) : (
          <Link href={`/login?from=${encodeURIComponent(pathname)}`}>
            <Button variant="soft" size="xs" className="shrink-0">
              팔로우
            </Button>
          </Link>
        )
      )}
    </div>
  );
}
