"use client";

import { useState } from "react";
import { ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface VoteProps {
  initialCount: number;
  direction?: "vertical" | "inline";
  className?: string;
}

export function Vote({
  initialCount,
  direction = "vertical",
  className,
}: VoteProps) {
  const [count, setCount] = useState(initialCount);
  const [vote, setVote] = useState<"up" | "down" | null>(null);

  const handleVote = (type: "up" | "down") => {
    if (vote === type) {
      setVote(null);
      setCount(initialCount);
    } else {
      setVote(type);
      setCount(
        type === "up" ? initialCount + 1 : initialCount - 1
      );
    }
  };

  if (direction === "inline") {
    return (
      <div className={cn("flex items-center gap-1", className)}>
        <button
          onClick={() => handleVote("up")}
          className={cn(
            "p-0.5",
            vote === "up" ? "text-primary" : "text-muted-foreground"
          )}
        >
          <ArrowUp className="w-4 h-4" />
        </button>
        <span className="text-sm font-medium text-foreground min-w-[1.5rem] text-center">
          {count}
        </span>
        <button
          onClick={() => handleVote("down")}
          className={cn(
            "p-0.5",
            vote === "down" ? "text-destructive" : "text-muted-foreground"
          )}
        >
          <ArrowDown className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col items-center gap-1 shrink-0",
        className
      )}
    >
      <button
        onClick={() => handleVote("up")}
        className={cn(
          vote === "up" ? "text-primary" : "text-muted-foreground"
        )}
      >
        <ArrowUp className="w-5 h-5" />
      </button>
      <span className="text-sm font-bold text-foreground">{count}</span>
      <button
        onClick={() => handleVote("down")}
        className={cn(
          vote === "down" ? "text-destructive" : "text-muted-foreground"
        )}
      >
        <ArrowDown className="w-5 h-5" />
      </button>
    </div>
  );
}
