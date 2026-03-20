import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { notFound } from "next/navigation";

const notices: Record<number, {
  id: number;
  category: string;
  title: string;
  date: string;
  body: string;
}> = {
  1: {
    id: 1,
    category: "스터디",
    title: "21기 AI 스터디 모집이 시작되었습니다",
    date: "2026-03-18",
    body: `안녕하세요, GPTers 운영팀입니다.

21기 AI 스터디 모집이 시작되었습니다. 이번 기수에는 총 6개 프로그램이 준비되어 있습니다.

**프로그램 구성**
- AI 자동화 (n8n, Make)
- 프롬프트 엔지니어링
- 바이브 코딩 (Cursor, Claude Code)
- AI 비즈니스
- AI 디자인 (Midjourney, Figma AI)
- AI 데이터 분석

**일정**
- 모집 기간: 3월 18일 ~ 4월 3일
- 얼리버드 할인: 3월 25일까지 (10% 할인)
- 스터디 시작: 4월 7일

스터디 페이지에서 자세한 커리큘럼과 스터디장 소개를 확인하실 수 있습니다.

많은 참여 부탁드립니다.`,
  },
  2: {
    id: 2,
    category: "운영",
    title: "3월 커뮤니티 운영 정책 안내",
    date: "2026-03-15",
    body: `안녕하세요, GPTers 운영팀입니다.

건강한 토론 문화를 위해 커뮤니티 운영 정책을 업데이트했습니다.

**주요 변경 사항**

1. 홍보성 게시글 기준 강화
   - 본인 서비스/상품 홍보는 '비즈니스/마케팅' 카테고리에만 허용
   - 무분별한 외부 링크 첨부 시 삭제 조치

2. 신고 처리 절차 개선
   - 신고 접수 후 24시간 내 1차 검토
   - 처리 결과를 신고자에게 알림으로 안내

3. 커뮤니티 규칙 위반 시 조치 기준
   - 1회: 경고
   - 2회: 7일 활동 정지
   - 3회: 영구 정지

운영 정책 관련 문의는 운영팀으로 쪽지 부탁드립니다.`,
  },
  3: {
    id: 3,
    category: "서비스",
    title: "GPTers 리뉴얼 오픈 안내",
    date: "2026-03-01",
    body: `안녕하세요, GPTers 운영팀입니다.

GPTers 사이트가 새로운 모습으로 돌아왔습니다.

**달라진 점**
- 인사이트 피드: AI 활용 사례와 노하우를 공유하는 전문 콘텐츠 공간
- 커뮤니티: 자유로운 질문과 토론 공간
- AI 이력서: 내 AI 활용 역량을 정리하는 프로필 페이지
- 스터디 시스템: 개선된 수강생 대시보드와 자동 수료 판정

**앞으로의 계획**
- 시리즈 기능 (연재 게시글)
- 뱃지 시스템
- DM 기능 강화

사용 중 불편한 점이나 개선 의견은 커뮤니티에 자유롭게 남겨주세요.

감사합니다.`,
  },
  4: {
    id: 4,
    category: "서비스",
    title: "서비스 점검 완료 안내 (2월 28일)",
    date: "2026-02-28",
    body: `안녕하세요, GPTers 운영팀입니다.

2월 28일 새벽 2시~4시에 진행된 서비스 점검이 정상적으로 완료되었습니다.

**점검 내용**
- 서버 성능 개선
- 데이터베이스 최적화
- 보안 업데이트

이용에 불편을 드려 죄송합니다. 감사합니다.`,
  },
  5: {
    id: 5,
    category: "운영",
    title: "20기 AI 스터디 수료 안내",
    date: "2026-02-20",
    body: `안녕하세요, GPTers 운영팀입니다.

20기 AI 스터디가 성공적으로 마무리되었습니다.

**수료 관련 안내**
- 수료증: 마이페이지 → 수료증 탭에서 확인 및 다운로드 가능
- 환급 처리: 수료 조건 충족 회원 대상으로 3월 5일까지 처리 완료 예정
- 수강 이력: 마이페이지 → 수강 이력에서 확인 가능

20기 스터디에 참여해 주신 모든 분들께 감사드립니다.`,
  },
};

export default function NoticeDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const notice = notices[Number(params.id)];
  if (!notice) notFound();

  const categoryVariant = notice.category === "스터디" ? "active" as const : "default" as const;

  return (
    <div className="mx-auto max-w-[680px] px-6 py-page">
      <Link
        href="/notices"
        className="inline-flex items-center gap-1 text-sm text-sub-foreground hover:text-foreground transition-colors mb-8"
      >
        <ChevronLeft className="w-4 h-4" strokeWidth={1.5} />
        공지사항 목록
      </Link>

      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Badge variant={categoryVariant}>{notice.category}</Badge>
          <span className="text-sm font-regular text-sub-foreground">{notice.date}</span>
        </div>
        <h1 className="text-2xl font-semibold text-foreground leading-snug">{notice.title}</h1>
      </div>

      <div className="border-t border-border pt-6">
        <div className="prose-custom space-y-4">
          {notice.body.split("\n\n").map((paragraph, i) => {
            if (paragraph.startsWith("**") && paragraph.endsWith("**")) {
              return (
                <p key={i} className="font-semibold text-foreground">
                  {paragraph.slice(2, -2)}
                </p>
              );
            }
            const lines = paragraph.split("\n");
            if (lines.length > 1 && lines.every((l) => l.startsWith("- ") || l.match(/^\d+\./))) {
              return (
                <ul key={i} className="space-y-1 pl-4">
                  {lines.map((line, j) => (
                    <li key={j} className="text-sm text-secondary-foreground leading-relaxed list-disc">
                      {line.replace(/^- /, "").replace(/^\d+\.\s/, "")}
                    </li>
                  ))}
                </ul>
              );
            }
            return (
              <p key={i} className="text-sm text-secondary-foreground leading-relaxed whitespace-pre-line">
                {paragraph}
              </p>
            );
          })}
        </div>
        <p className="text-sm font-regular text-sub-foreground mt-8 pt-6 border-t border-border">
          GPTers 운영팀
        </p>
      </div>
    </div>
  );
}
