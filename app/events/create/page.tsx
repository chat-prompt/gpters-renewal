"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { EventForm } from "@/components/site/event-form";

export default function EventCreatePage() {
  const router = useRouter();

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
