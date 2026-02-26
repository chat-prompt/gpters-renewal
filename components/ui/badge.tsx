import { cva, type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center whitespace-nowrap text-xs font-medium",
  {
    variants: {
      variant: {
        default: "bg-muted text-muted-foreground px-2 py-0.5 rounded-sm",
        active: "bg-primary/10 text-primary px-2 py-0.5 rounded-sm",
        completed: "bg-muted text-muted-foreground px-2 py-0.5 rounded-sm",
        pill: "bg-accent text-primary border border-border px-2.5 py-0.5 rounded-full",
        filter:
          "bg-accent text-accent-foreground px-2 py-1 rounded-md gap-1",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  onRemove?: () => void;
}

export function Badge({
  className,
  variant,
  onRemove,
  children,
  ...props
}: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant, className }))} {...props}>
      {children}
      {onRemove && (
        <button onClick={onRemove} className="hover:text-foreground">
          <X className="w-3 h-3" />
        </button>
      )}
    </span>
  );
}
