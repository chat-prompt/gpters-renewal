import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  change?: number;
  className?: string;
}

export function StatCard({ label, value, change, className }: StatCardProps) {
  const isPositive = change !== undefined && change > 0;
  const isNegative = change !== undefined && change < 0;
  const isNeutral = change === undefined || change === 0;

  return (
    <div
      className={cn(
        "border border-border rounded-lg p-4 bg-background",
        className
      )}
    >
      <p className="text-2xl font-bold text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground mt-1">{label}</p>
      {change !== undefined && (
        <div
          className={cn(
            "flex items-center gap-1 mt-2 text-xs",
            isPositive && "text-primary",
            isNegative && "text-destructive",
            isNeutral && "text-muted-foreground"
          )}
        >
          {isPositive && <TrendingUp className="w-3 h-3" />}
          {isNegative && <TrendingDown className="w-3 h-3" />}
          {isNeutral && <Minus className="w-3 h-3" />}
          <span>
            {isPositive && "+"}
            {change} 전일 대비
          </span>
        </div>
      )}
    </div>
  );
}
