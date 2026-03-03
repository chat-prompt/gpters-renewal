import { Calendar, Users, MapPin, Coins, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface StudyHeroProps {
  cohort: string;
  title: string;
  description: string;
  status: "recruiting" | "ongoing" | "completed";
  dateRange: string;
  enrolled: number;
  capacity: number;
  location: string;
  price: string;
  deadline: string;
}

const statusConfig = {
  recruiting: { label: "모집중", variant: "active" as const },
  ongoing: { label: "진행중", variant: "active" as const },
  completed: { label: "완료", variant: "completed" as const },
};

export function StudyHero({
  cohort,
  title,
  description,
  status,
  dateRange,
  enrolled,
  capacity,
  location,
  price,
  deadline,
}: StudyHeroProps) {
  const config = statusConfig[status];

  return (
    <section className="border border-border rounded-lg p-8 mb-8">
      <div className="flex items-center gap-2 mb-3">
        <Badge variant={config.variant}>{config.label}</Badge>
        <span className="text-sm text-muted-foreground">{cohort}</span>
      </div>
      <h1 className="text-2xl font-bold text-foreground mb-2">{title}</h1>
      <p className="text-muted-foreground mb-6">{description}</p>

      <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
        <span className="flex items-center gap-1">
          <Calendar className="w-4 h-4" /> {dateRange}
        </span>
        <span className="flex items-center gap-1">
          <Users className="w-4 h-4" /> {enrolled}/{capacity}명
        </span>
        <span className="flex items-center gap-1">
          <MapPin className="w-4 h-4" /> {location}
        </span>
        <span className="flex items-center gap-1">
          <Coins className="w-4 h-4" /> {price}
        </span>
        <span className="flex items-center gap-1">
          <Clock className="w-4 h-4" /> 마감 {deadline}
        </span>
      </div>
    </section>
  );
}
