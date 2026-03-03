import Link from "next/link";
import { ExternalLink, Trophy, Share2 } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { TagList } from "@/components/site/tag-list";
import { cn } from "@/lib/utils";

interface ExternalLinkItem {
  label: string;
  href: string;
}

interface ProfileHeaderProps {
  user: {
    name: string;
    username: string;
    avatar?: string;
    bio: string;
    joinDate: string;
    quote: string;
    points: string;
    interestTags: string[];
    links: ExternalLinkItem[];
  };
  className?: string;
}

export function ProfileHeader({ user, className }: ProfileHeaderProps) {
  return (
    <section className={cn("border border-border rounded-lg p-6", className)}>
      <div className="flex items-start gap-4">
        <Avatar src={user.avatar} alt={user.name} size="lg" />
        <div className="space-y-2 flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-foreground">{user.name}</h1>
            <span className="text-sm text-muted-foreground">
              @{user.username}
            </span>
            <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary">
              <Trophy className="w-4 h-4" />
              기여 포인트: {user.points} P
            </span>
          </div>
          <p className="text-sm text-muted-foreground">{user.bio}</p>
          <p className="text-xs text-muted-foreground">
            GPTers 활동 시작: {user.joinDate}
          </p>
          <p className="text-sm text-foreground italic">
            &ldquo;{user.quote}&rdquo;
          </p>
          <TagList tags={user.interestTags} variant="pill" className="pt-1" />
          <div className="flex items-center gap-3 text-sm text-primary">
            {user.links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="flex items-center gap-1"
              >
                {link.label} <ExternalLink className="w-3 h-3" />
              </Link>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-2 shrink-0">
          <Button variant="secondary" size="md">
            프로필 수정
          </Button>
          <Button variant="primary" size="md">
            <Share2 className="w-3.5 h-3.5" />
            이 프로필을 LinkedIn에 공유
          </Button>
        </div>
      </div>
    </section>
  );
}
