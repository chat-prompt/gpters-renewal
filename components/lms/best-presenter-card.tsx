import Link from "next/link";
import { Award } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BestPresenterCardProps {
  week: number;
  studentName?: string;
  postTitle?: string;
  postSlug?: string;
  isSelected: boolean;
  className?: string;
}

export function BestPresenterCard({
  week,
  studentName,
  postTitle,
  postSlug,
  isSelected,
  className,
}: BestPresenterCardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border p-4 space-y-3",
        isSelected && "border-primary",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">
          {week}주차
        </span>
        {isSelected && (
          <Badge variant="active">
            <Award className="w-3 h-3 mr-0.5" />
            베스트
          </Badge>
        )}
      </div>

      {isSelected ? (
        <div className="space-y-1">
          <p className="text-sm font-bold text-foreground">{studentName}</p>
          {postTitle && postSlug ? (
            <Link
              href={`/posts/${postSlug}`}
              className="text-xs text-primary hover:text-primary/80 transition-colors line-clamp-1"
            >
              {postTitle}
            </Link>
          ) : (
            <p className="text-xs text-muted-foreground">{postTitle}</p>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">아직 선정되지 않았습니다</p>
          <Button variant="outline" size="sm">
            선정하기
          </Button>
        </div>
      )}
    </div>
  );
}
