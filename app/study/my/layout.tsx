"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Video,
  FileText,
  GraduationCap,
  ScrollText,
  BookOpen,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";

const menuItems = [
  { label: "홈", href: "/study/my", icon: Home },
  { label: "다시보기", href: "/study/my/audit", icon: Video },
  { label: "게시글", href: "/study/my/posts", icon: FileText },
  { label: "수강 이력", href: "/study/my/history", icon: GraduationCap },
  { label: "수료증", href: "/study/my/certificates", icon: ScrollText },
];

export default function MyStudyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { isLoggedIn } = useAuth();

  const isActive = (href: string) =>
    href === "/study/my"
      ? pathname === "/study/my"
      : pathname.startsWith(href);

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
    <>
      {/* 모바일: 하단 탭 */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border px-4 py-2 flex gap-1 overflow-x-auto">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 text-sm whitespace-nowrap rounded-md shrink-0 transition-colors",
              isActive(item.href)
                ? "bg-accent text-foreground font-medium"
                : "text-sub-foreground hover:text-foreground"
            )}
          >
            <item.icon className="w-3.5 h-3.5" />
            {item.label}
          </Link>
        ))}
      </nav>

      {/* 데스크톱: 사이드바 */}
      <aside className="fixed top-16 left-0 w-[200px] h-[calc(100vh-4rem)] hidden md:block px-4 py-page overflow-y-auto">
        <h2 className="text-sm font-bold text-foreground mb-4">내 스터디</h2>
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors",
                isActive(item.href)
                  ? "bg-accent text-foreground font-medium"
                  : "text-sub-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          ))}
          <div className="border-t border-border my-2" />
          <Link
            href="/study/21-ai-automation/learn"
            className="flex items-center gap-2 px-3 py-2 text-sm text-sub-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
          >
            <BookOpen className="w-4 h-4" />
            나의 학습
            <ChevronRight className="w-3 h-3 ml-auto" />
          </Link>
        </nav>
        <div className="mt-6 px-3 py-3 rounded-lg bg-muted">
          <p className="text-sm font-medium text-foreground">홍길동</p>
          <p className="text-xs text-sub-foreground">21기 옵시디언</p>
        </div>
      </aside>

      {/* 콘텐츠 */}
      <div className="mx-auto max-w-[860px] px-6 py-page">
        {children}
      </div>
    </>
  );
}
