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

  const isActive = (href: string) =>
    href === "/study/my"
      ? pathname === "/study/my"
      : pathname.startsWith(href);

  return (
    <div className="mx-auto max-w-[860px] px-4 py-8">
      {/* 모바일: 수평 스크롤 탭 */}
      <nav className="md:hidden mb-6 -mx-4 px-4 overflow-x-auto flex gap-1 border-b border-border pb-3">
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

      {/* 데스크톱: 사이드바 + 콘텐츠 */}
      <div className="flex gap-8">
        <aside className="w-[200px] shrink-0 hidden md:block">
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

        <div className="flex-1 min-w-0">{children}</div>
      </div>
    </div>
  );
}
