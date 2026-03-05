"use client";

import { useState } from "react";
import { ImageIcon, LinkIcon, Hash } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

export function InlinePostForm() {
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState("");

  return (
    <div className="border border-border rounded-lg p-4">
      {!open ? (
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => setOpen(true)}
        >
          <div className="w-10 h-10 rounded-full bg-muted shrink-0" />
          <span className="text-sm text-muted-foreground">
            무슨 AI 이야기를 나누고 싶으신가요?
          </span>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-muted shrink-0" />
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="무슨 AI 이야기를 나누고 싶으신가요?"
              className="flex-1 min-h-[80px] resize-none"
              autoFocus
            />
          </div>
          <div className="flex items-center justify-between ml-13">
            <div className="flex items-center gap-2">
              <button className="p-2 text-muted-foreground rounded-md">
                <ImageIcon className="w-4 h-4" />
              </button>
              <button className="p-2 text-muted-foreground rounded-md">
                <LinkIcon className="w-4 h-4" />
              </button>
              <button className="p-2 text-muted-foreground rounded-md">
                <Hash className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setOpen(false);
                  setContent("");
                }}
                className="px-3 py-1.5 text-sm text-muted-foreground"
              >
                취소
              </button>
              <button className="px-4 py-1.5 text-sm bg-primary text-primary-foreground rounded-md">
                포스트 게시
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
