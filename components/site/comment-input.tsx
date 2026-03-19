"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";

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
  const [value, setValue] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!submitted) return;
    const timer = setTimeout(() => setSubmitted(false), 2000);
    return () => clearTimeout(timer);
  }, [submitted]);

  return (
    <div className={cn("border border-border rounded-lg p-4", className)}>
      {helperText && (
        <p className="text-sm text-sub-foreground mb-2">{helperText}</p>
      )}
      <Textarea
        rows={3}
        placeholder={placeholder}
        className="resize-none"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <div className="flex justify-end mt-2">
        <button
          onClick={() => {
            setValue("");
            setSubmitted(true);
          }}
          disabled={submitted}
          className={cn(
            "px-4 py-2 text-sm rounded-md",
            submitted
              ? "bg-muted text-sub-foreground"
              : "bg-primary text-primary-foreground"
          )}
        >
          {submitted ? "등록됨" : submitLabel}
        </button>
      </div>
    </div>
  );
}
