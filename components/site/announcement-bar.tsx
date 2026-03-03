import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface AnnouncementBarProps {
  text: string;
  href: string;
}

export function AnnouncementBar({ text, href }: AnnouncementBarProps) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between px-4 py-2.5 rounded-lg bg-primary/10 text-sm"
    >
      <span className="text-primary font-medium">{text}</span>
      <ChevronRight className="w-4 h-4 text-primary shrink-0" />
    </Link>
  );
}
