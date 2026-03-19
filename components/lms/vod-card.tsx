import Link from "next/link";
import { Play } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface VodCardProps {
  title: string;
  studyName: string;
  week: number;
  duration: string;
  watched: boolean;
  thumbnailUrl?: string;
  href?: string;
  onClick?: () => void;
  className?: string;
}

export function VodCard({
  title,
  studyName,
  week,
  duration,
  watched,
  thumbnailUrl,
  href,
  onClick,
  className,
}: VodCardProps) {
  const content = (
    <>
      <div className="aspect-video bg-muted flex items-center justify-center relative overflow-hidden">
        {thumbnailUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={thumbnailUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />
        )}
        <Play className="w-8 h-8 text-white drop-shadow relative z-10" />
        {watched && (
          <Badge variant="active" className="absolute top-2 right-2">
            시청 완료
          </Badge>
        )}
      </div>
      <div className="p-3 space-y-1">
        <p className="text-sm font-medium text-foreground line-clamp-1">{title}</p>
        <p className="text-xs font-regular text-sub-foreground">
          {studyName} &middot; {week}주차 &middot; {duration}
        </p>
      </div>
    </>
  );

  const baseClassName = cn(
    "rounded-lg border border-border overflow-hidden",
    (href || onClick) && "cursor-pointer hover:border-primary/50 transition-colors",
    className
  );

  if (href) {
    return (
      <Link href={href} className={baseClassName}>
        {content}
      </Link>
    );
  }

  if (onClick) {
    return (
      <div role="button" tabIndex={0} onClick={onClick} className={baseClassName}>
        {content}
      </div>
    );
  }

  return <div className={baseClassName}>{content}</div>;
}
