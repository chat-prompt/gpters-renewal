import Link from "next/link";
import { GraduationCap, Calendar, ScrollText } from "lucide-react";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";

// -- Mock Data --

interface HistoryItem {
  id: string;
  studyTitle: string;
  generation: number;
  period: string;
  status: "수료" | "미수료" | "진행중";
  hasCertificate: boolean;
}

const historyItems: HistoryItem[] = [
  {
    id: "1",
    studyTitle: "AI 자동화 스터디",
    generation: 21,
    period: "2026.03.16 ~ 2026.04.12",
    status: "진행중",
    hasCertificate: false,
  },
  {
    id: "2",
    studyTitle: "프롬프트 엔지니어링",
    generation: 20,
    period: "2026.02.16 ~ 2026.03.15",
    status: "수료",
    hasCertificate: true,
  },
  {
    id: "3",
    studyTitle: "AI 활용 기초",
    generation: 19,
    period: "2026.01.16 ~ 2026.02.12",
    status: "수료",
    hasCertificate: true,
  },
  {
    id: "4",
    studyTitle: "콘텐츠 제작 자동화",
    generation: 18,
    period: "2025.12.16 ~ 2026.01.12",
    status: "미수료",
    hasCertificate: false,
  },
  {
    id: "5",
    studyTitle: "바이브코딩 입문",
    generation: 17,
    period: "2025.11.16 ~ 2025.12.13",
    status: "수료",
    hasCertificate: true,
  },
];

const statusVariant = (status: HistoryItem["status"]) => {
  switch (status) {
    case "수료":
      return "active" as const;
    case "진행중":
      return "default" as const;
    case "미수료":
      return "completed" as const;
  }
};

export default function HistoryPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 space-y-6">
      <Breadcrumb
        items={[
          { label: "내 스터디", href: "/study/my" },
          { label: "수강 이력" },
        ]}
      />

      <h1 className="text-2xl font-bold text-foreground">수강 이력</h1>

      <div className="rounded-lg border border-border bg-background divide-y divide-border">
        {historyItems.map((item) => (
          <div
            key={item.id}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4"
          >
            <div className="flex items-start gap-3 min-w-0">
              <GraduationCap className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground">
                  {item.generation}기 {item.studyTitle}
                </p>
                <p className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                  <Calendar className="w-3 h-3" />
                  {item.period}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 sm:shrink-0">
              <Badge variant={statusVariant(item.status)}>{item.status}</Badge>
              {item.hasCertificate && (
                <Link
                  href="/study/my/certificates"
                  className="flex items-center text-xs text-primary font-medium hover:text-primary/80 transition-colors whitespace-nowrap"
                >
                  <ScrollText className="w-3.5 h-3.5 mr-1" />
                  수료증 보기
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
