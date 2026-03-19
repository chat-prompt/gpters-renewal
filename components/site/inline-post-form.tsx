"use client";

import { useState, useRef } from "react";
import { ImageIcon, LinkIcon, Hash } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface InlinePostFormProps {
  placeholder?: string;
  onSubmit?: (content: string) => void;
}

export function InlinePostForm({ placeholder = "무슨 AI 이야기를 나누고 싶으신가요?", onSubmit }: InlinePostFormProps) {
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isEmpty = content.trim().length === 0;

  return (
    <div className="border border-border rounded-lg p-4">
      {!open ? (
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => setOpen(true)}
        >
          <div className="w-10 h-10 rounded-full bg-muted shrink-0" />
          <span className="text-sm text-sub-foreground">
            {placeholder}
          </span>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-muted shrink-0" />
            <Textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={placeholder}
              className="flex-1 min-h-[80px] resize-none"
              autoFocus
            />
          </div>
          <div className="flex items-center justify-between ml-[52px]">
            <div className="flex items-center gap-1">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
              />
              <Button
                variant="ghost"
                size="icon-sm"
                className="text-sub-foreground"
                onClick={() => fileInputRef.current?.click()}
              >
                <ImageIcon className="w-4 h-4" strokeWidth={1.5} />
              </Button>
              <Button
                variant="ghost"
                size="icon-sm"
                className="text-sub-foreground"
                onClick={() => setContent((prev) => prev + " [링크제목](URL)")}
              >
                <LinkIcon className="w-4 h-4" strokeWidth={1.5} />
              </Button>
              <Button
                variant="ghost"
                size="icon-sm"
                className="text-sub-foreground"
                onClick={() => {
                  setContent((prev) => prev + " #");
                  textareaRef.current?.focus();
                }}
              >
                <Hash className="w-4 h-4" strokeWidth={1.5} />
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setOpen(false);
                  setContent("");
                }}
              >
                취소
              </Button>
              <Button
                size="sm"
                disabled={isEmpty}
                onClick={() => {
                  onSubmit?.(content.trim());
                  setContent("");
                  setOpen(false);
                }}
              >
                포스트 게시
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
