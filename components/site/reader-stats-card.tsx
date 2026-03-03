import { cn } from "@/lib/utils";

export interface ReaderStat {
  label: string;
  percentage: number;
}

interface ReaderStatsCardProps {
  stats: ReaderStat[];
  className?: string;
}

export function ReaderStatsCard({ stats, className }: ReaderStatsCardProps) {
  return (
    <section className={cn("border border-border rounded-lg p-6", className)}>
      <p className="text-sm font-medium text-foreground mb-3">
        이 글을 읽은 독자
      </p>
      <div className="flex gap-4 flex-wrap">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center">
            <p className="text-lg font-bold text-foreground">
              {stat.percentage}%
            </p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
