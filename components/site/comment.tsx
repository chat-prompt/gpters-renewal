"use client";

import { useState } from "react";
import { Heart, MessageSquare } from "lucide-react";
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
  const [showReply, setShowReply] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [localReplies, setLocalReplies] = useState<CommentData[]>([]);
  const allReplies = [...(comment.replies || []), ...localReplies];
  const hasReplies = allReplies.length > 0;

  return (
    <div className={depth > 0 ? "ml-10" : ""}>
      <div className="py-4">
        {/* Header */}
        <div className="flex items-center gap-2 mb-2">
          <div className="w-7 h-7 rounded-full bg-muted shrink-0" />
          <span className="text-sm font-medium text-foreground">
            {comment.author}
          </span>
          {comment.isOP && (
            <span className="text-sm text-primary bg-primary/10 px-1.5 py-0.5 rounded-sm">
              작성자
            </span>
          )}
          <span className="text-sm font-regular text-muted-foreground">{comment.time}</span>
        </div>

        {/* Body */}
        <p className="text-sm text-secondary-foreground mb-2 pl-9">
          {comment.text}
        </p>

        {/* Actions */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground pl-9">
          <button className="flex items-center gap-1 hover:text-foreground transition-colors">
            <Heart className="w-4 h-4" strokeWidth={1.5} />
            {comment.votes}
          </button>
          <button
            onClick={() => setShowReply(!showReply)}
            className="flex items-center gap-1 hover:text-foreground transition-colors"
          >
            <MessageSquare className="w-4 h-4" strokeWidth={1.5} />
            답글
          </button>
        </div>

        {/* Reply input */}
        {showReply && (
          <div className="mt-3 pl-9">
            <Textarea
              rows={2}
              placeholder="답글을 입력하세요..."
              className="resize-none"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
            />
            <div className="flex justify-end gap-2 mt-2">
              <button
                onClick={() => {
                  setShowReply(false);
                  setReplyText("");
                }}
                className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                취소
              </button>
              <button
                onClick={() => {
                  if (replyText.trim().length === 0) return;
                  setLocalReplies((prev) => [
                    ...prev,
                    {
                      id: `reply-${Date.now()}`,
                      author: "나",
                      time: "방금 전",
                      text: replyText,
                      votes: 0,
                    },
                  ]);
                  setReplyText("");
                  setShowReply(false);
                }}
                className="px-3 py-1.5 text-sm bg-primary text-primary-foreground rounded-md"
              >
                답글 등록
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Replies */}
      {hasReplies && (
        <div>
          {allReplies.map((reply) => (
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
