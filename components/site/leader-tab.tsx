import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface LeaderTabProps {
  name: string;
  title: string;
  badges: string[];
  bio: string;
  profileUrl: string;
}

export function LeaderTab({
  name,
  title,
  badges,
  bio,
  profileUrl,
}: LeaderTabProps) {
  return (
    <section className="border border-border rounded-lg p-6">
      <div className="flex items-start gap-4">
        <Avatar />
        <div className="space-y-2">
          <p className="font-bold text-foreground">{name}</p>
          <p className="text-sm text-muted-foreground">{title}</p>
          <div className="flex gap-2">
            {badges.map((badge) => (
              <Badge key={badge}>{badge}</Badge>
            ))}
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">{bio}</p>
          <Link
            href={profileUrl}
            className="text-sm text-primary flex items-center gap-1"
          >
            AI 이력서 보기 <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </section>
  );
}
