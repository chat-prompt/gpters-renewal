import Link from "next/link";
import { MapPin, Monitor } from "lucide-react";
import { cn } from "@/lib/utils";

export interface EventCardProps {
  id: number;
  title: string;
  category: string;
  type: "online" | "offline";
  date: string;
  time: string;
  location: string;
  description: string;
  host: string;
  attendees: number;
  capacity: number;
  free: boolean;
  price?: string;
}

export function EventCard({
  id,
  title,
  type,
  date,
  time,
  location,
  attendees,
  capacity,
  free,
  price,
}: EventCardProps) {
  const remaining = capacity - attendees;
  const almostFull = attendees / capacity > 0.8;

  return (
    <Link
      href={`/events/${id}`}
      className="group flex gap-4 p-4 rounded-lg border border-border hover:border-primary/30 transition-colors"
    >
      {/* Thumbnail */}
      <div className="w-28 h-28 bg-muted rounded-lg shrink-0 overflow-hidden">
        <div className="w-full h-full group-hover:scale-105 transition-transform bg-muted" />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Date + Badge */}
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-xs font-medium text-primary">
            {date} {time}
          </span>
          <span
            className={cn(
              "text-xs font-medium px-1.5 py-0.5 rounded",
              type === "online"
                ? "bg-accent text-primary"
                : "bg-muted text-sub-foreground"
            )}
          >
            {type === "online" ? "온라인" : "오프라인"}
          </span>
          {almostFull && (
            <span className="text-xs font-medium px-1.5 py-0.5 rounded bg-primary/10 text-primary">
              {remaining}석 남음
            </span>
          )}
        </div>

        {/* Title */}
        <h2 className="text-sm font-semibold text-foreground group-hover:underline line-clamp-2 mb-1">
          {title}
        </h2>

        {/* Location */}
        <div className="flex items-center gap-1 text-xs text-sub-foreground mb-auto">
          {type === "online" ? (
            <Monitor className="w-4 h-4" strokeWidth={1.5} />
          ) : (
            <MapPin className="w-4 h-4" strokeWidth={1.5} />
          )}
          <span className="truncate">{location}</span>
        </div>

        {/* Footer: Attendees + Price */}
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-1.5">
            {/* Attendee avatars */}
            <div className="flex -space-x-1.5">
              {[...Array(Math.min(3, attendees))].map((_, i) => (
                <div
                  key={i}
                  className="w-5 h-5 rounded-full bg-muted border-2 border-background"
                />
              ))}
            </div>
            <span className="text-xs text-sub-foreground">
              {attendees}명 참여
            </span>
          </div>
          <span className="text-xs font-medium text-foreground">
            {free ? "무료" : price}
          </span>
        </div>
      </div>
    </Link>
  );
}
