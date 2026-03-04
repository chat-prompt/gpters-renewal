import { type LucideIcon } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface IconButtonProps {
  icon: LucideIcon;
  href?: string;
  onClick?: () => void;
  badge?: number;
  className?: string;
}

export function IconButton({ icon: Icon, href, onClick, badge, className }: IconButtonProps) {
  const classes = cn(
    "relative flex items-center justify-center w-9 h-9 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer",
    className
  );

  const content = (
    <>
      <Icon className="w-5 h-5" />
      {badge != null && badge > 0 && (
        <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-primary text-primary-foreground text-[10px] flex items-center justify-center rounded-full">
          {badge}
        </span>
      )}
    </>
  );

  if (href) {
    return <Link href={href} className={classes}>{content}</Link>;
  }

  return <button onClick={onClick} className={classes}>{content}</button>;
}
