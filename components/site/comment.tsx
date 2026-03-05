"use client";

import { useState } from "react";
import { ArrowUp, ArrowDown, MessageSquare, ChevronDown } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

interface CommentData {
  id: string;
  author: string;
  isOP?: boolean;
  time: string;
  text: string;
  votes: number;
  replies?: CommentData[];
}

interface CommentProps {
  comment: CommentData;
  depth?: number;
}

function CommentItem({ comment, depth = 0 }: CommentProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [showReply, setShowReply] = useState(false);
  const hasReplies = comment.replies && comment.replies.length > 0;

  return (
    <div className={depth > 0 ? "ml-8 border-l-2 border-border pl-4" : ""}>
      <div className="py-3">
        {/* Header */}
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-full bg-muted shrink-0" />
          <span className="text-sm text-foreground font-medium">
            @{comment.author}
          </span>
          {comment.isOP && (
            <span className="text-xs text-primary bg-primary/10 px-1.5 py-0.5 rounded-sm">
              작성자
            </span>
          )}
          <span className="text-xs text-muted-foreground">{comment.time}</span>
          {hasReplies && (
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="text-xs text-muted-foreground flex items-center gap-0.5"
            >
              <ChevronDown
                className={`w-3 h-3 transition-transform ${collapsed ? "-rotate-90" : ""}`}
              />
              {collapsed ? "펼치기" : "접기"}
            </button>
          )}
        </div>

        {/* Body */}
        {!collapsed && (
          <>
            <p className="text-sm text-foreground mb-2">{comment.text}</p>
            {/* Actions */}
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <ArrowUp className="w-3.5 h-3.5" />
                {comment.votes}
                <ArrowDown className="w-3.5 h-3.5" />
              </span>
              <button
                onClick={() => setShowReply(!showReply)}
                className="flex items-center gap-1"
              >
                <MessageSquare className="w-3.5 h-3.5" /> 답글
              </button>
            </div>

            {/* Reply input */}
            {showReply && (
              <div className="mt-3">
                <Textarea
                  rows={2}
                  placeholder="답글을 입력하세요..."
                  className="resize-none"
                />
                <div className="flex justify-end gap-2 mt-1">
                  <button
                    onClick={() => setShowReply(false)}
                    className="px-3 py-1 text-xs text-muted-foreground"
                  >
                    취소
                  </button>
                  <button className="px-3 py-1 text-xs bg-primary text-primary-foreground rounded-md">
                    답글 등록
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Replies */}
      {!collapsed && hasReplies && (
        <div>
          {comment.replies!.map((reply) => (
            <CommentItem key={reply.id} comment={reply} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

interface CommentTreeProps {
  comments: CommentData[];
}

export function CommentTree({ comments }: CommentTreeProps) {
  return (
    <div className="divide-y divide-border">
      {comments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} />
      ))}
    </div>
  );
}

export type { CommentData };
