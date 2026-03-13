"use client";

import { useState } from "react";
import Link from "next/link";
import { ExternalLink, Calendar, Share2, UserPlus, UserCheck, Camera, type LucideIcon } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { TagList } from "@/components/site/tag-list";
import { cn } from "@/lib/utils";

export const BADGE_COLORS = [
  "bg-orange-100 text-orange-700",
  "bg-blue-100 text-blue-700",
  "bg-amber-100 text-amber-700",
  "bg-green-100 text-green-700",
  "bg-violet-100 text-violet-700",
  "bg-teal-100 text-teal-700",
  "bg-rose-100 text-rose-700",
  "bg-sky-100 text-sky-700",
];

interface ExternalLinkItem {
  label: string;
  href: string;
}

interface FeaturedBadge {
  icon: LucideIcon;
  label: string;
}

interface ProfileHeaderProps {
  user: {
    name: string;
    username: string;
    avatar?: string;
    bio: string;
    joinDate: string;
    interestTags: string[];
    links: ExternalLinkItem[];
  };
  featuredBadges?: FeaturedBadge[];
  followerCount?: number;
  followingCount?: number;
  isOwn?: boolean;
  className?: string;
}

export function ProfileHeader({ user, featuredBadges, followerCount, followingCount, isOwn = false, className }: ProfileHeaderProps) {
  const [following, setFollowing] = useState(false);

  return (
    <section className={cn("border border-border rounded-xl overflow-hidden", className)}>
      {/* Cover banner */}
      <div className="h-28 bg-muted relative">
        {isOwn && (
          <button className="absolute bottom-2 right-2 inline-flex items-center gap-1 px-2.5 py-1.5 text-sm rounded-lg bg-background/70 text-foreground hover:bg-background/90 transition-colors">
            <Camera className="w-3.5 h-3.5" strokeWidth={1.5} />
            커버 변경
          </button>
        )}
      </div>

      {/* Content */}
      <div className="px-6 pb-5">
        {/* Avatar — 배너 오버랩 */}
        <div className="-mt-10 mb-3">
          <Avatar className="w-20 h-20 border-4 border-background" />
        </div>

        {/* Name + buttons — 같은 줄 */}
        <div className="flex items-start justify-between mb-1">
          <div>
            <h1 className="text-xl font-semibold text-foreground">{user.name}</h1>
          </div>
          <div className="flex items-center gap-2 mt-1">
            {isOwn ? (
              <>
                <Link href="/settings">
                  <Button variant="secondary" size="sm">프로필 수정</Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-sub-foreground"
                  onClick={() => {
                    const url = encodeURIComponent(window.location.href);
                    window.open(
                      `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
                      "_blank"
                    );
                  }}
                >
                  <Share2 strokeWidth={1.5} />
                  LinkedIn 공유
                </Button>
              </>
            ) : (
              <Button
                variant={following ? "secondary" : "soft"}
                size="sm"
                onClick={() => setFollowing((f) => !f)}
              >
                {following ? (
                  <><UserCheck strokeWidth={1.5} />팔로잉</>
                ) : (
                  <><UserPlus strokeWidth={1.5} />팔로우</>
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Bio */}
        <p className="text-sm text-secondary-foreground mt-2 mb-3">{user.bio}</p>

        {/* Follower/Following count */}
        {(followerCount !== undefined || followingCount !== undefined) && (
          <div className="flex items-center gap-4 text-sm mb-3">
            <span>
              <span className="font-semibold text-foreground">{followerCount ?? 0}</span>
              <span className="text-sub-foreground ml-1">팔로워</span>
            </span>
            <span>
              <span className="font-semibold text-foreground">{followingCount ?? 0}</span>
              <span className="text-sub-foreground ml-1">팔로잉</span>
            </span>
          </div>
        )}

        {/* Meta: join date + external links */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-sub-foreground mb-3">
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" strokeWidth={1.5} />
            {user.joinDate}부터 활동
          </span>
          {user.links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="flex items-center gap-0.5 hover:text-primary transition-colors"
            >
              {link.label}
              <ExternalLink className="w-3 h-3" strokeWidth={1.5} />
            </Link>
          ))}
        </div>

        {/* Featured badges */}
        {featuredBadges && featuredBadges.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-2">
            {featuredBadges.map((badge, i) => {
              const Icon = badge.icon;
              return (
                <span
                  key={badge.label}
                  className={cn(
                    "inline-flex items-center gap-1 px-2.5 py-1 text-sm rounded-full font-medium",
                    BADGE_COLORS[i % BADGE_COLORS.length]
                  )}
                >
                  <Icon className="w-3.5 h-3.5" strokeWidth={1.5} />
                  {badge.label}
                </span>
              );
            })}
          </div>
        )}

        {/* Interest tags */}
        <TagList tags={user.interestTags} variant="pill" className="mt-1" />
      </div>
    </section>
  );
}
