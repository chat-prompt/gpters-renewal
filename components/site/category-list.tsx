import Link from "next/link";
import type { LucideIcon } from "lucide-react";

interface Category {
  name: string;
  slug: string;
  count: number;
  icon: LucideIcon;
}

interface CategoryListProps {
  categories: Category[];
}

export function CategoryList({ categories }: CategoryListProps) {
  return (
    <div className="border border-border rounded-lg">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <h3 className="text-sm font-bold text-foreground">카테고리</h3>
        <Link href="/explore/feed" className="text-xs text-muted-foreground">
          전체보기
        </Link>
      </div>
      <div className="p-2">
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            href={`/explore/feed?category=${cat.slug}`}
            className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-foreground"
          >
            <cat.icon className="w-4 h-4 text-primary shrink-0" />
            <span className="flex-1">{cat.name}</span>
            <span className="text-xs text-muted-foreground">{cat.count}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
