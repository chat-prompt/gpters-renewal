import { cn } from "@/lib/utils";

interface SkillItem {
  name: string;
  level: number;
  note?: string;
}

interface SkillBarListProps {
  skills: SkillItem[];
  className?: string;
}

export function SkillBarList({ skills, className }: SkillBarListProps) {
  return (
    <div className={cn("border border-border rounded-lg p-4 space-y-3", className)}>
      {skills.map((skill) => (
        <div key={skill.name} className="flex items-center gap-4">
          <span className="text-sm text-foreground w-28 shrink-0">
            {skill.name}
          </span>
          <div className="flex-1 bg-muted rounded-full h-2">
            <div
              className="bg-primary rounded-full h-2"
              style={{ width: `${skill.level}%` }}
            />
          </div>
          {skill.note && (
            <span className="text-xs text-muted-foreground w-28 shrink-0 text-right">
              ({skill.note})
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

export type { SkillItem };
