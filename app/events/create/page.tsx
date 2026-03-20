"use client";

import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { EventForm } from "@/components/site/event-form";
import { useAuth } from "@/lib/auth-context";

export default function EventCreatePage() {
  const router = useRouter();
  const pathname = usePathname();
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center py-page gap-group">
        <p className="text-lg font-semibold text-foreground">로그인이 필요합니다</p>
        <p className="text-sm text-sub-foreground">이벤트를 등록하려면 로그인해주세요.</p>
        <Link
          href={`/login?from=${encodeURIComponent(pathname)}`}
          className="inline-flex items-center justify-center px-6 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          로그인
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[680px] px-6 py-page">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link href="/events" className="text-sub-foreground">
            <ChevronLeft className="w-5 h-5" strokeWidth={1.5} />
          </Link>
          <h1 className="text-xl font-semibold text-foreground">
            이벤트 개설
          </h1>
        </div>
        <button
          onClick={() => router.push("/events")}
          className="px-6 py-2 text-sm bg-primary text-primary-foreground rounded-md font-medium"
        >
          제출
        </button>
      </div>

      {/* Form */}
      <EventForm mode="create" />
    </div>
  );
}
