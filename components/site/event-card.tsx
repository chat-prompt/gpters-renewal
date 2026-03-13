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
  hostType?: "official" | "user";
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
  hostType,
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
      className="group flex gap-4 p-4 rounded-lg border border-border hover:border-primary/30 transition-colors"
    >
      {/* Thumbnail */}
      <div className="w-28 h-28 rounded-lg shrink-0 overflow-hidden bg-muted">
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageUrl} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
        ) : (
          <div className="w-full h-full group-hover:scale-105 transition-transform bg-muted" />
        )}
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
          {almostFull && status !== "closed" && status !== "completed" && (
            <span className="text-sm font-medium px-1.5 py-0.5 rounded bg-primary/10 text-primary">
              {remaining}석 남음
            </span>
          )}
          {status === "closed" && (
            <span className="text-sm font-medium px-1.5 py-0.5 rounded bg-muted text-secondary-foreground">
              마감
            </span>
          )}
          {status === "completed" && (
            <span className="text-sm font-medium px-1.5 py-0.5 rounded bg-muted text-secondary-foreground">
              종료
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

        {/* Footer: Host + Attendees + Price */}
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-3">
            <span className="text-sm text-sub-foreground flex items-center gap-1">
              {host}
              {hostType === "official" && (
                <span className="text-sm font-medium px-1.5 py-0.5 rounded bg-accent text-primary">
                  공식
                </span>
              )}
            </span>
            <div className="flex items-center gap-1.5">
              <div className="flex -space-x-1.5">
                {[...Array(Math.min(3, attendees))].map((_, i) => (
                  <div
                    key={i}
                    className="w-5 h-5 rounded-full bg-muted border-2 border-background"
                  />
                ))}
              </div>
              <span className="text-sm text-sub-foreground">
                {attendees}명
              </span>
            </div>
          </div>
          <span className="text-sm font-medium text-foreground">
            {free ? "무료" : price}
          </span>
        </div>
      </div>
    </Link>
  );
}
