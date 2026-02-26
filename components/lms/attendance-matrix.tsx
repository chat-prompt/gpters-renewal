import { Check, X, Minus } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

type CellStatus = "done" | "not-done" | "upcoming";

interface MemberRow {
  name: string;
  avatarUrl?: string;
  attendance: CellStatus[];
  assignments: CellStatus[];
  prediction: "순조" | "위험" | "미달";
}

interface AttendanceMatrixProps {
  members: MemberRow[];
  weeks: number;
  className?: string;
}

function StatusCell({ value }: { value: CellStatus }) {
  switch (value) {
    case "done":
      return <Check className="w-3.5 h-3.5 text-primary mx-auto" />;
    case "not-done":
      return <X className="w-3.5 h-3.5 text-destructive mx-auto" />;
    case "upcoming":
      return <Minus className="w-3.5 h-3.5 text-muted-foreground mx-auto" />;
  }
}

const predictionVariant = (p: MemberRow["prediction"]) => {
  if (p === "순조") return "active" as const;
  if (p === "위험") return "default" as const;
  return "default" as const;
};

export function AttendanceMatrix({
  members,
  weeks,
  className,
}: AttendanceMatrixProps) {
  return (
    <div className={className}>
      <div className="border border-border rounded-lg bg-background overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>수강생</TableHead>
              {Array.from({ length: weeks }, (_, i) => (
                <TableHead key={`att-${i}`} className="text-center w-12">
                  {i + 1}주 출석
                </TableHead>
              ))}
              {Array.from({ length: weeks }, (_, i) => (
                <TableHead key={`asg-${i}`} className="text-center w-12">
                  {i + 1}주 과제
                </TableHead>
              ))}
              <TableHead className="text-center w-20">수료 예측</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((member) => (
              <TableRow key={member.name}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar size="xs" src={member.avatarUrl} alt={member.name} />
                    <span className="text-sm text-foreground whitespace-nowrap">
                      {member.name}
                    </span>
                  </div>
                </TableCell>
                {member.attendance.map((val, i) => (
                  <TableCell key={`att-${i}`} className="text-center">
                    <StatusCell value={val} />
                  </TableCell>
                ))}
                {member.assignments.map((val, i) => (
                  <TableCell key={`asg-${i}`} className="text-center">
                    <StatusCell value={val} />
                  </TableCell>
                ))}
                <TableCell className="text-center">
                  <Badge variant={predictionVariant(member.prediction)}>
                    {member.prediction}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
