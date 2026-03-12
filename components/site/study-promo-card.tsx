import Link from "next/link";
import { Calendar, Coins } from "lucide-react";
import { cn } from "@/lib/utils";

interface StudyPromoCardProps {
  study: {
    title: string;
    image?: string;
    date: string;
    price: string;
    href: string;
  };
  className?: string;
}

export function StudyPromoCard({ study, className }: StudyPromoCardProps) {
  return (
    <section className={cn("border border-border rounded-lg p-6", className)}>
      <p className="text-sm font-medium text-foreground mb-3">
        이 주제를 더 깊이 배우고 싶다면?
      </p>
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-muted rounded-md shrink-0 overflow-hidden">
          {study.image && (
            <img
              src={study.image}
              alt={study.title}
              className="w-full h-full object-cover"
            />
          )}
        </div>
        <div className="space-y-1">
          <p className="font-medium text-foreground">{study.title}</p>
          <p className="text-sm text-sub-foreground flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" strokeWidth={1.5} /> {study.date}
            </span>
            <span className="flex items-center gap-1">
              <Coins className="w-4 h-4" strokeWidth={1.5} /> {study.price}
            </span>
          </p>
          <Link
            href={study.href}
            className="text-sm text-primary font-medium"
          >
            상세보기
          </Link>
        </div>
      </div>
    </section>
  );
}
