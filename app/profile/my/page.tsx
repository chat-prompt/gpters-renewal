"use client";

import { usePathname } from "next/navigation";
import { ProfileView } from "@/components/site/profile-view";
import { useAuth } from "@/lib/auth-context";
import Link from "next/link";

// TODO: 로그인 유저 정보로 교체
const currentUser = {
  name: "홍길동",
  username: "honggildong",
  bio: "AI 자동화 전문가 · 마케터",
  joinDate: "2025.03",
  links: [
    { label: "GitHub", href: "https://github.com/honggildong" },
    { label: "LinkedIn", href: "https://linkedin.com/in/honggildong" },
    { label: "블로그", href: "https://honggildong.tistory.com" },
  ],
};

export default function MyProfilePage() {
  const { isLoggedIn } = useAuth();
  const pathname = usePathname();

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center py-page gap-group">
        <p className="text-lg font-semibold text-foreground">로그인이 필요합니다</p>
        <p className="text-sm text-sub-foreground">이 페이지를 보려면 로그인해주세요.</p>
        <Link href={`/login?from=${encodeURIComponent(pathname)}`} className="inline-flex items-center px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
          로그인
        </Link>
      </div>
    );
  }

  return <ProfileView isOwn user={currentUser} />;
}
