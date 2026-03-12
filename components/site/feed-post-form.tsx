"use client";

import { useState } from "react";
import { ImageIcon } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

interface FeedPostFormProps {
  suggestedTags: string[];
}

export function FeedPostForm({ suggestedTags }: FeedPostFormProps) {
  const [feedContent, setFeedContent] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  return (
    <div className="space-y-4">
      <div className="border border-border rounded-lg p-4">
        <Textarea
          value={feedContent}
          onChange={(e) => setFeedContent(e.target.value)}
          placeholder="무슨 AI 이야기를 나누고 싶으신가요? (최대 500자)"
          className="min-h-[120px] resize-none border-0 shadow-none focus-visible:ring-0 focus-visible:border-0"
          maxLength={500}
        />
        <div className="flex items-center justify-between border-t border-border pt-3 mt-3">
          <div className="flex items-center gap-2">
            <button className="p-2 text-sub-foreground rounded-md">
              <ImageIcon className="w-4 h-4" strokeWidth={1.5} />
            </button>
          </div>
          <span className="text-sm text-sub-foreground">
            {feedContent.length}/500
          </span>
        </div>
      </div>

      {/* Tags */}
      <div>
        <p className="text-sm font-medium text-foreground mb-2">태그 (선택)</p>
        <div className="flex gap-2 flex-wrap">
          {suggestedTags.map((tag) => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`px-2 py-1 text-sm rounded-md border ${
                selectedTags.includes(tag)
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-sub-foreground"
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
