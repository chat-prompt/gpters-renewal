import { cn } from "@/lib/utils";

interface StatItem {
  label: string;
  value: string | number;
}

interface StatGridProps {
  items: StatItem[];
  columns?: number;
  className?: string;
}

export function StatGrid({ items, columns = 5, className }: StatGridProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-4",
        columns === 5 && "md:grid-cols-5",
        columns === 4 && "md:grid-cols-4",
        columns === 3 && "md:grid-cols-3",
        className
      )}
    >
      {items.map((stat) => (
        <div
          key={stat.label}
          className="border border-border rounded-lg p-4 text-center"
        >
          <p className="text-2xl font-semibold text-foreground">{stat.value}</p>
          <p className="text-sm text-sub-foreground">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
