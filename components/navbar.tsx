"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Mail,
  Search,
  User,
  Settings,
  LogOut,
  Shield,
  BookOpen,
  Bell,
  MessageSquare,
  Heart,
  AtSign,
} from "lucide-react";

const navItems = [
  { label: "탐색", href: "/explore/feed" },
  { label: "스터디", href: "/study/ai-automation" },
  { label: "커뮤니티", href: "/community/feed" },
  { label: "AI이력서", href: "/profile/honggildong" },
];

const notifications = [
  {
    icon: Heart,
    text: "홍길동님이 회원님의 글을 추천했습니다",
    time: "10분 전",
    href: "/posts/claude-marketing",
  },
  {
    icon: MessageSquare,
    text: "이영희님이 댓글을 남겼습니다",
    time: "1시간 전",
    href: "/posts/gpt4o-prompt",
  },
  {
    icon: AtSign,
    text: "박철수님이 회원님을 멘션했습니다",
    time: "3시간 전",
    href: "/posts/cursor-fullstack",
  },
];

function useClickOutside(
  ref: React.RefObject<HTMLElement | null>,
  handler: () => void
) {
  useEffect(() => {
    const listener = (e: MouseEvent) => {
      if (!ref.current || ref.current.contains(e.target as Node)) return;
      handler();
    };
    document.addEventListener("mousedown", listener);
    return () => document.removeEventListener("mousedown", listener);
  }, [ref, handler]);
}

export function Navbar() {
  const pathname = usePathname();
  const [openDropdown, setOpenDropdown] = useState<
    "notifications" | "profile" | null
  >(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useClickOutside(dropdownRef, () => setOpenDropdown(null));

  const toggle = (key: "notifications" | "profile") =>
    setOpenDropdown((prev) => (prev === key ? null : key));

  return (
    <header className="border-b border-border bg-background sticky top-0 z-50">
      <div className="mx-auto max-w-6xl flex items-center justify-between px-4 h-14">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-foreground font-bold text-lg">
            GPTers
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm ${
                  pathname.startsWith(item.href)
                    ? "text-foreground font-medium"
                    : "text-muted-foreground"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4" ref={dropdownRef}>
          <Link href="/search" className="text-muted-foreground">
            <Search className="w-5 h-5" />
          </Link>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => toggle("notifications")}
              className="text-muted-foreground relative"
            >
              <Mail className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-primary-foreground text-[10px] flex items-center justify-center rounded-full">
                3
              </span>
            </button>
            {openDropdown === "notifications" && (
              <div className="absolute right-0 top-10 w-80 border border-border rounded-lg bg-background z-50">
                <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                  <p className="text-sm font-bold text-foreground">알림</p>
                  <button className="text-xs text-primary">모두 읽음</button>
                </div>
                <div className="divide-y divide-border">
                  {notifications.map((n, i) => (
                    <Link
                      key={i}
                      href={n.href}
                      onClick={() => setOpenDropdown(null)}
                      className="flex items-start gap-3 px-4 py-3"
                    >
                      <n.icon className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-foreground">{n.text}</p>
                        <p className="text-xs text-muted-foreground">
                          {n.time}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
                <Link
                  href="/messages"
                  onClick={() => setOpenDropdown(null)}
                  className="block text-center text-sm text-primary py-3 border-t border-border"
                >
                  전체보기
                </Link>
              </div>
            )}
          </div>

          {/* Profile */}
          <div className="relative">
            <button
              onClick={() => toggle("profile")}
              className="text-muted-foreground"
            >
              <User className="w-5 h-5" />
            </button>
            {openDropdown === "profile" && (
              <div className="absolute right-0 top-10 w-56 border border-border rounded-lg bg-background z-50">
                <div className="px-4 py-3 border-b border-border">
                  <p className="text-sm font-medium text-foreground">
                    홍길동
                  </p>
                  <p className="text-xs text-muted-foreground">
                    @honggildong
                  </p>
                </div>
                <div className="py-1">
                  <Link
                    href="/profile/honggildong"
                    onClick={() => setOpenDropdown(null)}
                    className="flex items-center gap-3 px-4 py-2 text-sm text-foreground"
                  >
                    <User className="w-4 h-4 text-muted-foreground" />내 프로필
                  </Link>
                  <Link
                    href="/study/my"
                    onClick={() => setOpenDropdown(null)}
                    className="flex items-center gap-3 px-4 py-2 text-sm text-foreground"
                  >
                    <BookOpen className="w-4 h-4 text-muted-foreground" />내
                    스터디
                  </Link>
                  <Link
                    href="/messages"
                    onClick={() => setOpenDropdown(null)}
                    className="flex items-center gap-3 px-4 py-2 text-sm text-foreground"
                  >
                    <Bell className="w-4 h-4 text-muted-foreground" />
                    알림/쪽지
                  </Link>
                  <Link
                    href="/settings"
                    onClick={() => setOpenDropdown(null)}
                    className="flex items-center gap-3 px-4 py-2 text-sm text-foreground"
                  >
                    <Settings className="w-4 h-4 text-muted-foreground" />
                    설정
                  </Link>
                </div>
                <div className="border-t border-border py-1">
                  <Link
                    href="/admin"
                    onClick={() => setOpenDropdown(null)}
                    className="flex items-center gap-3 px-4 py-2 text-sm text-foreground"
                  >
                    <Shield className="w-4 h-4 text-muted-foreground" />
                    어드민
                  </Link>
                </div>
                <div className="border-t border-border py-1">
                  <button className="flex items-center gap-3 px-4 py-2 text-sm text-foreground w-full">
                    <LogOut className="w-4 h-4 text-muted-foreground" />
                    로그아웃
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
