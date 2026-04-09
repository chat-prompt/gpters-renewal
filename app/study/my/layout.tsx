"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

export default function MyStudyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { isLoggedIn } = useAuth();

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

  return (
    <div className="mx-auto max-w-[860px] px-6 py-page">
      {children}
    </div>
  );
}
