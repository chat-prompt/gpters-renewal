import { cn } from "@/lib/utils";

interface ProgressProps {
  value: number;
  className?: string;
}

export function Progress({ value, className }: ProgressProps) {
  const clamped = Math.max(0, Math.min(100, value));

  return (
    <div className={cn("w-full bg-muted rounded-full h-2", className)}>
      <div
        className="bg-primary rounded-full h-2 transition-all"
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
