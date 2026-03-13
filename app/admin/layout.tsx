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

const sidebarItems = [
  { label: "대시보드", href: "/admin", icon: LayoutDashboard },
  { label: "게시글", href: "/admin/posts", icon: FileText },
  { label: "스터디", href: "/admin/studies", icon: BookOpen },
  { label: "배너", href: "/admin/banners", icon: Image },
  { label: "이벤트", href: "/admin/events", icon: CalendarDays },
  { label: "화이트보드", href: "/admin/whiteboard", icon: Megaphone },
  { label: "텍스트", href: "/admin/texts", icon: Type },
  { label: "상품/쿠폰", href: "/admin/products", icon: ShoppingBag },
  { label: "기수", href: "/admin/cohorts", icon: Calendar },
  { label: "세션", href: "/admin/sessions", icon: Video },
  { label: "수료/환급", href: "/admin/completion", icon: GraduationCap },
  { label: "회원", href: "/admin/users", icon: Users },
  { label: "신고", href: "/admin/moderation", icon: Shield },
  { label: "뱃지", href: "/admin/badges", icon: Award },
  { label: "분류", href: "/admin/taxonomy", icon: Tag },
  { label: "리포트", href: "/admin/reports", icon: BarChart3 },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="mx-auto max-w-6xl px-4 py-page">
      <div className="flex gap-8">
        <aside className="w-48 shrink-0 hidden md:block">
          <h2 className="text-sm font-semibold text-foreground mb-4">관리자</h2>
          <nav className="space-y-1">
            {sidebarItems.map((item) => {
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
          </nav>
        </aside>
        <div className="flex-1 min-w-0">{children}</div>
      </div>
    </div>
  );
}
