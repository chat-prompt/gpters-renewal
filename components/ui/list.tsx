import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const List = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-lg border border-border divide-y divide-border bg-background",
        className
      )}
      {...props}
    />
  )
);
List.displayName = "List";

const ListItem = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-center gap-4 p-4", className)}
      {...props}
    />
  )
);
ListItem.displayName = "ListItem";

export { List, ListItem };
