import Link from "next/link";

interface RelatedPostCardProps {
  slug: string;
  title: string;
  category: string;
}

export function RelatedPostCard({ slug, title, category }: RelatedPostCardProps) {
  return (
    <Link
      href={`/posts/${slug}`}
      className="border border-border rounded-lg p-4"
    >
      <div className="h-20 bg-muted rounded-md mb-2" />
      <p className="text-xs text-primary font-medium mb-1">{category}</p>
      <p className="text-sm font-medium text-foreground">{title}</p>
    </Link>
  );
}
