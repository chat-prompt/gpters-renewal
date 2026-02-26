import { Lock, PenSquare } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AssignmentGuideProps {
  className?: string;
}

export function AssignmentGuide({ className }: AssignmentGuideProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-muted/50 p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3",
        className
      )}
    >
      <Lock className="w-5 h-5 text-muted-foreground shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground">과제 연동 안내</p>
        <p className="text-xs text-muted-foreground mt-0.5">
          사례글을 작성하면 전체 15개 스터디 다시보기를 볼 수 있어요. 매주 월요일에 리셋됩니다.
        </p>
      </div>
      <Link href="/write?type=case" className="shrink-0">
        <Button size="sm">
          <PenSquare className="w-3.5 h-3.5" />
          글쓰기
        </Button>
      </Link>
    </div>
  );
}
