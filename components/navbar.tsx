"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mail, Search, User } from "lucide-react";

const navItems = [
  { label: "탐색", href: "/explore/feed" },
  { label: "스터디", href: "/study/ai-automation" },
  { label: "커뮤니티", href: "/community/feed" },
  { label: "AI이력서", href: "/profile/honggildong" },
];

export function Navbar() {
  const pathname = usePathname();

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
        <div className="flex items-center gap-4">
          <Link href="/search" className="text-muted-foreground">
            <Search className="w-5 h-5" />
          </Link>
          <Link href="/messages" className="text-muted-foreground relative">
            <Mail className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-primary-foreground text-[10px] flex items-center justify-center rounded-full">
              3
            </span>
          </Link>
          <Link href="/admin" className="text-muted-foreground">
            <User className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </header>
  );
}
