"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  BookOpen,
  Image,
  CalendarDays,
  Megaphone,
  Type,
  ShoppingBag,
  Calendar,
  Video,
  GraduationCap,
  Users,
  Shield,
  Award,
  Tag,
  BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";

const sidebarGroups = [
  {
    label: "일반",
    items: [
      { label: "대시보드", href: "/admin", icon: LayoutDashboard },
      { label: "게시글", href: "/admin/posts", icon: FileText },
      { label: "회원", href: "/admin/users", icon: Users },
      { label: "배너", href: "/admin/banners", icon: Image },
      { label: "이벤트", href: "/admin/events", icon: CalendarDays },
      { label: "화이트보드", href: "/admin/whiteboard", icon: Megaphone },
      { label: "텍스트", href: "/admin/texts", icon: Type },
    ],
  },
  {
    label: "스터디",
    items: [
      { label: "스터디", href: "/admin/studies", icon: BookOpen },
      { label: "기수", href: "/admin/cohorts", icon: Calendar },
      { label: "세션", href: "/admin/sessions", icon: Video },
      { label: "상품/쿠폰", href: "/admin/products", icon: ShoppingBag },
      { label: "수료/환급", href: "/admin/completion", icon: GraduationCap },
    ],
  },
  {
    label: "시스템",
    items: [
      { label: "신고", href: "/admin/moderation", icon: Shield },
      { label: "뱃지", href: "/admin/badges", icon: Award },
      { label: "분류", href: "/admin/taxonomy", icon: Tag },
      { label: "리포트", href: "/admin/reports", icon: BarChart3 },
    ],
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { isLoggedIn, isAdmin } = useAuth();

  if (!isLoggedIn || !isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center py-page gap-group">
        <p className="text-lg font-semibold text-foreground">관리자 권한이 필요합니다</p>
        <p className="text-sm text-sub-foreground">이 페이지는 관리자만 접근할 수 있습니다.</p>
        <Link href={`/login?from=${encodeURIComponent(pathname)}`} className="inline-flex items-center px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
          로그인
        </Link>
      </div>
    );
  }

  return (
    <>
      <aside className="fixed top-16 left-0 w-48 h-[calc(100vh-4rem)] hidden md:block px-4 py-page overflow-y-auto">
        <nav className="space-y-6">
          {sidebarGroups.map((group) => (
            <div key={group.label}>
              <p className="text-sm font-semibold text-foreground px-3 mb-2">
                {group.label}
              </p>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const isActive =
                    item.href === "/admin"
                      ? pathname === "/admin"
                      : pathname.startsWith(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors",
                        isActive
                          ? "bg-accent text-foreground font-medium"
                          : "text-sub-foreground hover:text-foreground hover:bg-muted"
                      )}
                    >
                      <item.icon className="w-4 h-4" strokeWidth={1.5} />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </aside>
      <div className="mx-auto max-w-[860px] px-6 py-page">
        {children}
      </div>
    </>
  );
}
