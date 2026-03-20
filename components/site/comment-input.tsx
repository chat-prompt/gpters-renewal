"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/lib/auth-context";

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
  const { isLoggedIn } = useAuth();
  const pathname = usePathname();
  const [value, setValue] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!submitted) return;
    const timer = setTimeout(() => setSubmitted(false), 2000);
    return () => clearTimeout(timer);
  }, [submitted]);

  const loginUrl = `/login?from=${encodeURIComponent(pathname)}`;

  return (
    <div
      className={cn("border border-border rounded-lg p-4", className)}
      onClick={!isLoggedIn ? () => window.location.assign(loginUrl) : undefined}
      style={!isLoggedIn ? { cursor: "pointer" } : undefined}
    >
      {helperText && (
        <p className="text-sm text-sub-foreground mb-2">{helperText}</p>
      )}
      <Textarea
        rows={3}
        placeholder={isLoggedIn ? placeholder : "로그인하고 자유롭게 의견을 남겨주세요"}
        className="resize-none"
        readOnly={!isLoggedIn}
        tabIndex={!isLoggedIn ? -1 : undefined}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <div className="flex justify-end mt-2">
        <button
          onClick={(e) => {
            if (!isLoggedIn) { e.stopPropagation(); window.location.assign(loginUrl); return; }
            setValue("");
            setSubmitted(true);
          }}
          disabled={!isLoggedIn || submitted}
          className={cn(
            "px-4 py-2 text-sm rounded-md",
            !isLoggedIn || submitted
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
