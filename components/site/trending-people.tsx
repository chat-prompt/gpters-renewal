"use client";

import { useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";

interface Person {
  name: string;
  username: string;
  role: string;
}

interface TrendingPeopleProps {
  people: Person[];
}

export function TrendingPeople({ people }: TrendingPeopleProps) {
  const { isLoggedIn } = useAuth();
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = 176; // w-40 (160) + gap-4 (16)
    scrollRef.current.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-semibold text-sub-foreground uppercase tracking-wider">
          요즘 뜨는 사람들
        </p>
        <div className="flex gap-1">
          <button
            onClick={() => scroll("left")}
            className="w-8 h-8 flex items-center justify-center rounded-full border border-border text-sub-foreground hover:text-foreground hover:border-foreground transition-colors"
          >
            <ChevronLeft className="w-4 h-4" strokeWidth={1.5} />
          </button>
          <button
            onClick={() => scroll("right")}
            className="w-8 h-8 flex items-center justify-center rounded-full border border-border text-sub-foreground hover:text-foreground hover:border-foreground transition-colors"
          >
            <ChevronRight className="w-4 h-4" strokeWidth={1.5} />
          </button>
        </div>
      </div>
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-2 -mx-6 px-6 scrollbar-hide"
      >
        {people.map((person) => (
          <div
            key={person.username}
            className="flex flex-col items-center text-center p-4 border border-border rounded-lg w-40 shrink-0 hover:border-primary/30 transition-colors"
          >
            <Link href={`/profile/${person.username}`} className="group flex flex-col items-center">
              <Avatar size="xl" fallback={person.name[0]} />
              <p className="mt-3 text-sm font-semibold text-foreground group-hover:underline">
                {person.name}
              </p>
            </Link>
            <p className="text-sm text-sub-foreground mt-0.5">
              {person.role}
            </p>
            {isLoggedIn ? (
              <Button variant="soft" size="sm" className="mt-3 w-full">
                팔로우
              </Button>
            ) : (
              <Link
                href="/login?from=/"
                className="mt-3 w-full inline-flex items-center justify-center px-3 py-1.5 text-sm rounded-md bg-accent text-primary hover:bg-accent/80 transition-colors"
              >
                팔로우
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
