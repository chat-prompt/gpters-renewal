import Link from "next/link";
import { Pin } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const notices = [
  {
    id: 1,
    category: "스터디",
    title: "21기 AI 스터디 모집이 시작되었습니다",
    date: "2026-03-18",
    excerpt:
      "21기 AI 스터디가 3월 18일부터 모집을 시작합니다. AI 자동화, 프롬프트 엔지니어링, 바이브 코딩 등 6개 프로그램이 준비되어 있습니다. 얼리버드 할인은 3월 25일까지입니다.",
    pinned: true,
  },
  {
    id: 2,
    category: "운영",
    title: "3월 커뮤니티 운영 정책 안내",
    date: "2026-03-15",
    excerpt:
      "건강한 토론 문화를 위한 커뮤니티 운영 정책을 업데이트했습니다. 주요 변경 사항과 신고 처리 절차를 안내드립니다.",
    pinned: true,
  },
  {
    id: 3,
    category: "서비스",
    title: "GPTers 리뉴얼 오픈 안내",
    date: "2026-03-01",
    excerpt:
      "GPTers 사이트가 새로운 모습으로 돌아왔습니다. 달라진 점과 앞으로의 계획을 안내드립니다. 피드백은 커뮤니티에 남겨주세요.",
    pinned: true,
  },
  {
    id: 4,
    category: "서비스",
    title: "서비스 점검 완료 안내 (2월 28일)",
    date: "2026-02-28",
    excerpt:
      "2월 28일 새벽 2시~4시 서비스 점검이 완료되었습니다. 이용에 불편을 드려 죄송합니다.",
    pinned: false,
  },
  {
    id: 5,
    category: "운영",
    title: "20기 AI 스터디 수료 안내",
    date: "2026-02-20",
    excerpt:
      "20기 AI 스터디가 성공적으로 마무리되었습니다. 수료증은 마이페이지에서 확인하실 수 있습니다.",
    pinned: false,
  },
];

const categoryVariant = (category: string) => {
  if (category === "스터디") return "active" as const;
  return "default" as const;
};

export default function NoticesPage() {
  return (
    <div className="mx-auto max-w-[680px] px-6 py-page">
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-foreground mb-1">공지사항</h1>
        <p className="text-sm text-sub-foreground">GPTers 운영팀의 공식 안내사항입니다.</p>
      </div>

      <div className="divide-y divide-border">
        {notices.map((notice) => (
          <Link
            key={notice.id}
            href={`/notices/${notice.id}`}
            className="flex items-start gap-3 py-5 group hover:bg-muted/30 -mx-2 px-2 rounded transition-colors"
          >
            {notice.pinned && (
              <Pin className="w-3.5 h-3.5 text-primary shrink-0 mt-1" strokeWidth={1.5} />
            )}
            {!notice.pinned && <div className="w-3.5 shrink-0" />}

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1.5">
                <Badge variant={categoryVariant(notice.category)}>{notice.category}</Badge>
                <span className="text-sm font-regular text-sub-foreground">{notice.date}</span>
              </div>
              <p className="font-semibold text-foreground group-hover:underline leading-snug mb-1">
                {notice.title}
              </p>
              <p className="text-sm font-regular text-secondary-foreground line-clamp-2 leading-relaxed">
                {notice.excerpt}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
