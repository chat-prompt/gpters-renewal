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
  status?: "published" | "closed" | "completed" | "draft" | "pending" | "rejected";
  attendees: number;
  capacity: number;
  free: boolean;
  price?: string;
  imageUrl?: string;
}

export function EventCard({
  id,
  title,
  type,
  date,
  time,
  location,
  host,
  status,
  attendees,
  capacity,
  free,
  price,
  imageUrl,
}: EventCardProps) {
  const remaining = capacity - attendees;
  const almostFull = attendees / capacity > 0.8;

  return (
    <Link
      href={`/events/${id}`}
      className="group block rounded-lg border border-border hover:border-primary/30 transition-colors overflow-hidden"
    >
      {/* Thumbnail */}
      <div className="h-36 bg-muted overflow-hidden">
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt=""
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-muted" />
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        {/* Date + badges */}
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <span className="text-sm font-medium text-primary">
            {date} {time}
          </span>
          <span
            className={cn(
              "text-sm font-medium px-1.5 py-0.5 rounded",
              type === "online"
                ? "bg-accent text-primary"
                : "bg-muted text-sub-foreground"
            )}
          >
            {type === "online" ? "온라인" : "오프라인"}
          </span>
          {almostFull && status !== "closed" && status !== "completed" && (
            <span className="text-sm font-medium px-1.5 py-0.5 rounded bg-primary/10 text-primary">
              {remaining}석 남음
            </span>
          )}
          {status === "closed" && (
            <span className="text-sm font-medium px-1.5 py-0.5 rounded bg-muted text-sub-foreground">
              마감
            </span>
          )}
          {status === "completed" && (
            <span className="text-sm font-medium px-1.5 py-0.5 rounded bg-muted text-sub-foreground">
              종료
            </span>
          )}
        </div>

        {/* Title */}
        <h2 className="font-semibold text-foreground group-hover:underline line-clamp-2 leading-snug mb-2">
          {title}
        </h2>

        {/* Location */}
        <div className="flex items-center gap-1 text-sm text-sub-foreground mb-3">
          {type === "online" ? (
            <Monitor className="w-4 h-4 shrink-0" strokeWidth={1.5} />
          ) : (
            <MapPin className="w-4 h-4 shrink-0" strokeWidth={1.5} />
          )}
          <span className="truncate">{location}</span>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-sub-foreground">{host}</span>
          <span className="text-sm font-semibold text-foreground">
            {free ? "무료" : price}
          </span>
        </div>
      </div>
    </Link>
  );
}
