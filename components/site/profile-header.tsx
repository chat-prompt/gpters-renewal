"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { ExternalLink, Calendar, Share2, UserPlus, UserCheck, Camera, MessageSquare, X, Plus, Check, type LucideIcon } from "lucide-react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";

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
    links: ExternalLinkItem[];
  };
  featuredBadges?: FeaturedBadge[];
  followerCount?: number;
  followingCount?: number;
  isOwn?: boolean;
  className?: string;
}

export function ProfileHeader({ user, featuredBadges, followerCount, followingCount, isOwn = false, className }: ProfileHeaderProps) {
  const { isLoggedIn } = useAuth();
  const [following, setFollowing] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const [displayUser, setDisplayUser] = useState({ ...user, links: [...user.links] });
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState({ name: user.name, bio: user.bio, links: [...user.links] });

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setAvatarUrl(URL.createObjectURL(file));
  };

  const startEdit = () => {
    setEditForm({ name: displayUser.name, bio: displayUser.bio, links: [...displayUser.links] });
    setEditMode(true);
  };

  const handleSave = () => {
    setDisplayUser({ ...displayUser, name: editForm.name, bio: editForm.bio, links: editForm.links });
    setEditMode(false);
  };

  const updateLink = (i: number, field: "label" | "href", val: string) => {
    const links = [...editForm.links];
    links[i] = { ...links[i], [field]: val };
    setEditForm({ ...editForm, links });
  };

  return (
    <section className={cn("border border-border rounded-xl overflow-hidden", className)}>
      {/* Cover banner */}
      <div className="h-[200px] bg-muted relative">
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
        <div className="-mt-10 mb-3 relative w-fit">
          <Avatar className="w-20 h-20 border-4 border-background">
            {avatarUrl && <AvatarImage src={avatarUrl} />}
          </Avatar>
          {isOwn && (
            <>
              <input
                ref={avatarInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
              <button
                onClick={() => avatarInputRef.current?.click()}
                className="absolute bottom-0 right-0 p-1 rounded-full bg-background border border-border text-sub-foreground hover:text-foreground transition-colors"
              >
                <Camera className="w-3 h-3" strokeWidth={1.5} />
              </button>
            </>
          )}
        </div>

        {/* Name + buttons */}
        <div className="flex items-start justify-between mb-1">
          <div className="flex-1 min-w-0 mr-3">
            {editMode ? (
              <Input
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                className="text-xl font-semibold h-9 max-w-[240px]"
              />
            ) : (
              <h1 className="text-xl font-semibold text-foreground">{displayUser.name}</h1>
            )}
          </div>
          <div className="flex items-center gap-2 mt-1 shrink-0">
            {isOwn ? (
              editMode ? (
                <>
                  <Button size="sm" onClick={handleSave}>
                    <Check className="w-4 h-4" strokeWidth={1.5} />
                    저장
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setEditMode(false)}>
                    취소
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="secondary" size="sm" onClick={startEdit}>
                    프로필 수정
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-sub-foreground"
                    onClick={() => {
                      const url = encodeURIComponent(window.location.href);
                      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, "_blank");
                    }}
                  >
                    <Share2 strokeWidth={1.5} />
                    LinkedIn 공유
                  </Button>
                </>
              )
            ) : isLoggedIn ? (
              <>
                <Link href={`/messages?to=${user.username}`}>
                  <Button variant="ghost" size="sm" className="text-sub-foreground">
                    <MessageSquare className="w-4 h-4" strokeWidth={1.5} />
                    쪽지 보내기
                  </Button>
                </Link>
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
              </>
            ) : null}
          </div>
        </div>

        {/* Bio */}
        {editMode ? (
          <textarea
            value={editForm.bio}
            onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
            rows={2}
            className="w-full mt-2 mb-3 border border-input rounded-md px-3 py-2 text-sm bg-background text-foreground placeholder:text-sub-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            placeholder="한 줄 소개"
          />
        ) : (
          <p className="text-sm text-secondary-foreground mt-2 mb-3">{displayUser.bio}</p>
        )}

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
        {editMode ? (
          <div className="mb-3 space-y-2">
            <p className="text-sm font-medium text-foreground">외부 링크</p>
            {editForm.links.map((link, i) => (
              <div key={i} className="flex items-center gap-2">
                <Input
                  value={link.label}
                  onChange={(e) => updateLink(i, "label", e.target.value)}
                  placeholder="레이블 (예: GitHub)"
                  className="w-28 shrink-0"
                />
                <Input
                  value={link.href}
                  onChange={(e) => updateLink(i, "href", e.target.value)}
                  placeholder="https://"
                  className="flex-1"
                />
                <button
                  onClick={() => setEditForm({ ...editForm, links: editForm.links.filter((_, idx) => idx !== i) })}
                  className="text-sub-foreground hover:text-foreground transition-colors shrink-0"
                >
                  <X className="w-4 h-4" strokeWidth={1.5} />
                </button>
              </div>
            ))}
            {editForm.links.length < 5 && (
              <button
                onClick={() => setEditForm({ ...editForm, links: [...editForm.links, { label: "", href: "" }] })}
                className="flex items-center gap-1 text-sm text-sub-foreground hover:text-primary transition-colors"
              >
                <Plus className="w-3.5 h-3.5" strokeWidth={1.5} />
                링크 추가
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-sub-foreground mb-3">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" strokeWidth={1.5} />
              {displayUser.joinDate}부터 활동
            </span>
            {displayUser.links.map((link) => (
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
        )}

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
      </div>
    </section>
  );
}
