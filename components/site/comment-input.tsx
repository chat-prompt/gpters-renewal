"use client";

import { cn } from "@/lib/utils";

interface CommentInputProps {
  placeholder?: string;
  submitLabel?: string;
  helperText?: string;
  className?: string;
}

export function CommentInput({
  placeholder = "댓글을 입력하세요...",
  submitLabel = "댓글 등록",
  helperText = "댓글 작성 (로그인 필요)",
  className,
}: CommentInputProps) {
  return (
    <div className={cn("border border-border rounded-lg p-4", className)}>
      {helperText && (
        <p className="text-sm text-muted-foreground mb-2">{helperText}</p>
      )}
      <textarea
        className="w-full border border-input rounded-md p-3 text-sm bg-background text-foreground resize-none"
        rows={3}
        placeholder={placeholder}
      />
      <div className="flex justify-end mt-2">
        <button className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md">
          {submitLabel}
        </button>
      </div>
    </div>
  );
}
