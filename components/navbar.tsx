"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  User,
  Settings,
  LogOut,
  Shield,
  BookOpen,
  Bell,
  MessageSquare,
  Heart,
  AtSign,
  PenSquare,
} from "lucide-react";
import { IconButton } from "@/components/ui/icon-button";
import { DropdownMenu, DropdownMenuItem, DropdownMenuDivider } from "@/components/ui/dropdown-menu";
import { SearchInput } from "@/components/site/search-input";

const navItems = [
  { label: "인사이트", href: "/explore/feed" },
  { label: "커뮤니티", href: "/community/feed" },
  { label: "이벤트", href: "/events" },
  { label: "스터디", href: "/study" },
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

  const close = () => setOpenDropdown(null);

  return (
    <header className="border-b border-border bg-background sticky top-0 z-50">
      <div className="flex items-center justify-between px-6 h-14">
        {/* Left: Logo + Search */}
        <div className="flex items-center gap-6 flex-1">
          <Link href="/" className="shrink-0">
            <img src="/logo.svg" alt="GPTers" className="h-7" />
          </Link>
          <SearchInput />
        </div>

        {/* Center: Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm transition-colors ${
                pathname.startsWith(item.href)
                  ? "text-foreground font-medium"
                  : "text-sub-foreground hover:text-foreground"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right: Write + DM + Profile */}
        <div className="flex items-center gap-3 flex-1 justify-end" ref={dropdownRef}>
          <Link
            href="/write?type=case"
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            <PenSquare className="w-4 h-4" strokeWidth={1.5} />
            글쓰기
          </Link>

          {/* Notifications */}
          <div className="relative">
            <IconButton
              icon={Bell}
              badge={3}
              onClick={() => toggle("notifications")}
            />
            {openDropdown === "notifications" && (
              <DropdownMenu className="w-80">
                <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                  <p className="text-sm font-semibold text-foreground">알림</p>
                  <button className="text-sm text-primary hover:underline">모두 읽음</button>
                </div>
                <div className="divide-y divide-border">
                  {notifications.map((n, i) => (
                    <Link
                      key={i}
                      href={n.href}
                      onClick={close}
                      className="flex items-start gap-3 px-4 py-3 hover:bg-muted transition-colors"
                    >
                      <n.icon className="w-4 h-4 text-primary shrink-0 mt-0.5" strokeWidth={1.5} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-foreground">{n.text}</p>
                        <p className="text-sm text-sub-foreground">{n.time}</p>
                      </div>
                    </Link>
                  ))}
                </div>
                <Link
                  href="/messages"
                  onClick={close}
                  className="block text-center text-sm text-primary py-3 border-t border-border hover:bg-muted transition-colors"
                >
                  전체보기
                </Link>
              </DropdownMenu>
            )}
          </div>

          {/* Profile */}
          <div className="relative">
            <IconButton icon={User} onClick={() => toggle("profile")} />
            {openDropdown === "profile" && (
              <DropdownMenu className="w-56">
                <div className="px-4 py-3 border-b border-border">
                  <p className="text-sm font-medium text-foreground">홍길동</p>
                  <p className="text-sm text-sub-foreground">honggildong</p>
                </div>
                <div className="py-1">
                  <DropdownMenuItem icon={User} label="내 프로필" href="/profile/honggildong" onClick={close} />
                  <DropdownMenuItem icon={BookOpen} label="내 스터디" href="/study/my" onClick={close} />
                  <DropdownMenuItem icon={Bell} label="알림/쪽지" href="/messages" onClick={close} />
                  <DropdownMenuItem icon={Settings} label="설정" href="/settings" onClick={close} />
                </div>
                <DropdownMenuDivider />
                <div className="py-1">
                  <DropdownMenuItem icon={Shield} label="어드민" href="/admin" onClick={close} />
                </div>
                <DropdownMenuDivider />
                <div className="py-1">
                  <DropdownMenuItem icon={LogOut} label="로그아웃" onClick={close} />
                </div>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
