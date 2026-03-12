import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PostDetailCTAProps {
  className?: string;
}

export function PostDetailCTA({ className }: PostDetailCTAProps) {
  return (
    <div
      className={cn(
        "border border-border rounded-lg p-6 text-center bg-muted space-y-3",
        className
      )}
    >
      <p className="text-foreground font-medium">이 글이 도움이 되셨나요?</p>
      <p className="text-sm text-sub-foreground">
        GPTers에 가입하면 매주 AI 활용 인사이트를 받을 수 있어요
      </p>
      <div className="flex justify-center gap-3">
        <Button>
          무료 가입하기
        </Button>
        <Button variant="secondary">
          뉴스레터만 구독
        </Button>
      </div>
    </div>
  );
}
