import Link from "next/link";
import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface DropdownMenuProps {
  children: React.ReactNode;
  className?: string;
}

export function DropdownMenu({ children, className }: DropdownMenuProps) {
  return (
    <div className={cn("absolute right-0 top-10 border border-border rounded-lg bg-background z-50", className)}>
      {children}
    </div>
  );
}

interface DropdownMenuItemProps {
  icon?: LucideIcon;
  label: string;
  href?: string;
  onClick?: () => void;
}

export function DropdownMenuItem({ icon: Icon, label, href, onClick }: DropdownMenuItemProps) {
  const classes = "flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors w-full";

  if (href) {
    return (
      <Link href={href} onClick={onClick} className={classes}>
        {Icon && <Icon className="w-4 h-4 text-muted-foreground" />}
        {label}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={classes}>
      {Icon && <Icon className="w-4 h-4 text-muted-foreground" />}
      {label}
    </button>
  );
}

export function DropdownMenuDivider() {
  return <div className="border-t border-border" />;
}
