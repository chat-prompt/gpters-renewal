import { Download, Share2, Award, GraduationCap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CertificateViewProps {
  studentName: string;
  studyTitle: string;
  generation: number;
  completedAt: string;
  isOutstanding: boolean;
  attendanceCount: number;
  assignmentCount: number;
  className?: string;
}

export function CertificateView({
  studentName,
  studyTitle,
  generation,
  completedAt,
  isOutstanding,
  attendanceCount,
  assignmentCount,
  className,
}: CertificateViewProps) {
  return (
    <div
      className={cn(
        "rounded-lg border-2 border-border p-6 space-y-4",
        isOutstanding && "border-primary",
        className
      )}
    >
      {/* Header */}
      <div className="text-center space-y-2">
        <GraduationCap className="w-8 h-8 text-primary mx-auto" />
        <p className="text-xs tracking-widest text-muted-foreground uppercase">
          수료증
        </p>
        {isOutstanding && (
          <Badge variant="active">
            <Award className="w-3 h-3 mr-0.5" />
            우수활동자
          </Badge>
        )}
      </div>

      {/* Body */}
      <div className="text-center space-y-3 py-2">
        <p className="text-lg font-bold text-foreground">{studentName}</p>
        <p className="text-sm text-muted-foreground">
          {generation}기 {studyTitle}
        </p>
        <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
          <span>출석 {attendanceCount}회</span>
          <span>과제 {assignmentCount}주</span>
        </div>
      </div>

      {/* Date */}
      <p className="text-center text-xs text-muted-foreground">{completedAt}</p>

      {/* Actions */}
      <div className="flex items-center justify-center gap-2 pt-2">
        <Button variant="secondary" size="sm">
          <Download className="w-3.5 h-3.5" />
          다운로드
        </Button>
        <Button variant="outline" size="sm">
          <Share2 className="w-3.5 h-3.5" />
          공유
        </Button>
      </div>
    </div>
  );
}
