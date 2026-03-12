import { Star } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";

interface Review {
  name: string;
  cohort: string;
  rating: number;
  text: string;
}

interface ReviewTabProps {
  reviews: Review[];
}

export function ReviewTab({ reviews }: ReviewTabProps) {
  const avgRating =
    reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  return (
    <section className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              strokeWidth={1.5}
              className={`w-5 h-5 ${
                i < Math.round(avgRating)
                  ? "text-primary fill-primary"
                  : "text-muted"
              }`}
            />
          ))}
        </div>
        <span className="text-sm text-sub-foreground">
          {avgRating.toFixed(1)} ({reviews.length}개 후기)
        </span>
      </div>

      <div className="space-y-4">
        {reviews.map((review, i) => (
          <div
            key={i}
            className="border border-border rounded-lg p-4 space-y-2"
          >
            <div className="flex items-center gap-3">
              <Avatar size="sm" />
              <div>
                <p className="text-sm font-medium text-foreground">
                  {review.name}
                </p>
                <p className="text-sm text-sub-foreground">{review.cohort}</p>
              </div>
              <div className="flex gap-0.5 ml-auto">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star
                    key={j}
                    strokeWidth={1.5}
                    className={`w-3 h-3 ${
                      j < review.rating
                        ? "text-primary fill-primary"
                        : "text-muted"
                    }`}
                  />
                ))}
              </div>
            </div>
            <p className="text-sm text-foreground">{review.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
