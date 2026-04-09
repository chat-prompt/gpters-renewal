import Link from "next/link";
import {
  ExternalLink,
  BookOpen,
  Video,
  PenSquare,
  Award,
  Calendar,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

/* ─── Mock Data ─── */

const myStudies = [
  {
    id: "21-ai-automation",
    title: "21기 AI 자동화 스터디",
    status: "진행 중" as const,
    period: "2026.03.24 - 2026.04.20",
    leader: "김영호",
  },
  {
    id: "20-prompt",
    title: "20기 프롬프트 엔지니어링 스터디",
    status: "수료" as const,
    period: "2026.02.24 - 2026.03.23",
    leader: "이영희",
  },
];

const LMS_BASE_URL = "https://ai-study.gpters.org";

const lmsLinks = [
  { icon: BookOpen, label: "학습 페이지", href: `${LMS_BASE_URL}/learn`, description: "커리큘럼, 과제, 주차별 학습" },
  { icon: Video, label: "다시보기", href: `${LMS_BASE_URL}/vod`, description: "AI토크 세션 녹화본" },
  { icon: PenSquare, label: "과제 제출", href: `${LMS_BASE_URL}/tasks`, description: "사례 게시글 작성 및 제출" },
  { icon: Award, label: "수료증", href: `${LMS_BASE_URL}/certificates`, description: "수료증 확인 및 다운로드" },
  { icon: Calendar, label: "출석 현황", href: `${LMS_BASE_URL}/attendance`, description: "주차별 출석 기록" },
];

/* ─── Page ─── */

export default function MyStudyPage() {
  return (
    <div className="space-y-section">
      {/* 내 스터디 목록 */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">내 스터디</h2>
        <div className="space-y-3">
          {myStudies.map((study) => (
            <div key={study.id} className="border border-border rounded-lg p-5">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-foreground">{study.title}</h3>
                <Badge variant={study.status === "진행 중" ? "active" : "default"}>
                  {study.status}
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-sm text-sub-foreground">
                <span>{study.period}</span>
                <span>스터디장: {study.leader}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* LMS 바로가기 */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">학습 관리 (LMS)</h2>
          <a
            href={LMS_BASE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-sm text-primary hover:underline"
          >
            LMS 바로가기 <ExternalLink className="w-4 h-4" strokeWidth={1.5} />
          </a>
        </div>
        <p className="text-sm text-secondary-foreground">
          과제 제출, 다시보기, 출석, 수료증은 LMS에서 관리됩니다.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {lmsLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-3 border border-border rounded-lg p-4 hover:border-primary transition-colors"
            >
              <link.icon className="w-5 h-5 text-primary shrink-0 mt-0.5" strokeWidth={1.5} />
              <div>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-semibold text-foreground">{link.label}</span>
                  <ExternalLink className="w-3 h-3 text-sub-foreground" strokeWidth={1.5} />
                </div>
                <p className="text-sm text-sub-foreground mt-0.5">{link.description}</p>
              </div>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
