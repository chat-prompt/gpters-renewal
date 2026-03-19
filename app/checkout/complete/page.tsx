import Link from "next/link";
import { CheckCircle, Calendar, BookOpen, MessageCircle, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const studyInfo = {
  title: "21기 AI 자동화 스터디",
  startDate: "2026년 3월 16일 (월)",
  firstSession: "핵심강의 월 9-11PM",
};

const nextSteps = [
  {
    icon: BookOpen,
    title: "내 스터디 확인하기",
    description: "스터디 일정과 이번 주 할 일을 확인하세요",
    href: "/study/my",
  },
  {
    icon: Calendar,
    title: "스터디 상세 보기",
    description: "커리큘럼과 스터디장 정보를 확인하세요",
    href: "/study/21-ai-automation",
  },
];

export default function CheckoutCompletePage() {
  return (
    <div className="mx-auto max-w-[680px] px-6 py-16 space-y-8">
      {/* Success */}
      <div className="text-center space-y-3">
        <CheckCircle className="w-14 h-14 text-primary mx-auto" strokeWidth={1.5} />
        <h1 className="text-2xl font-semibold text-foreground">신청이 완료되었습니다!</h1>
        <p className="text-sub-foreground">{studyInfo.title}에 합류하셨습니다.</p>
      </div>

      {/* Study Start Info */}
      <div className="rounded-lg border border-border p-5 space-y-3">
        <h2 className="font-semibold text-foreground text-sm">스터디 시작 정보</h2>
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-sm">
            <Calendar className="w-4 h-4 text-primary shrink-0" strokeWidth={1.5} />
            <span className="text-foreground">
              시작일: <span className="font-medium">{studyInfo.startDate}</span>
            </span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <BookOpen className="w-4 h-4 text-primary shrink-0" strokeWidth={1.5} />
            <span className="text-foreground">
              첫 세션: <span className="font-medium">{studyInfo.firstSession}</span>
            </span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <MessageCircle className="w-4 h-4 text-primary shrink-0" strokeWidth={1.5} />
            <span className="text-sub-foreground">
              카카오 오픈채팅 링크는 이메일로 발송됩니다
            </span>
          </div>
        </div>
      </div>

      {/* Next Steps */}
      <div className="rounded-lg border border-border overflow-hidden">
        <p className="px-4 py-3 text-sm font-semibold text-foreground border-b border-border">
          지금 할 수 있는 것
        </p>
        <div className="divide-y divide-border">
          {nextSteps.map((step) => (
            <Link
              key={step.href}
              href={step.href}
              className="flex items-center justify-between px-4 py-3.5 hover:bg-muted transition-colors group"
            >
              <div className="flex items-center gap-3">
                <step.icon className="w-4 h-4 text-primary shrink-0" strokeWidth={1.5} />
                <div>
                  <p className="text-sm font-medium text-foreground">{step.title}</p>
                  <p className="text-sm text-sub-foreground">{step.description}</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-sub-foreground group-hover:text-foreground transition-colors" strokeWidth={1.5} />
            </Link>
          ))}
        </div>
      </div>

      <Button asChild size="lg" className="w-full">
        <Link href="/study/my">내 스터디 바로가기</Link>
      </Button>
    </div>
  );
}
