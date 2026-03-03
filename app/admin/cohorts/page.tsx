"use client";

import { Plus } from "lucide-react";
import { Badge, Button } from "@/components/ui";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

interface Cohort {
  id: number;
  number: number;
  status: "준비" | "모집" | "진행" | "완료";
  recruitmentPeriod: string;
  studyPeriod: string;
  studyCount: number;
}

const cohorts: Cohort[] = [
  { id: 1, number: 23, status: "준비", recruitmentPeriod: "5/1 ~ 5/18", studyPeriod: "5/19 ~ 6/15", studyCount: 0 },
  { id: 2, number: 22, status: "모집", recruitmentPeriod: "4/1 ~ 4/18", studyPeriod: "4/19 ~ 5/16", studyCount: 12 },
  { id: 3, number: 21, status: "진행", recruitmentPeriod: "3/1 ~ 3/15", studyPeriod: "3/16 ~ 4/12", studyCount: 15 },
  { id: 4, number: 20, status: "완료", recruitmentPeriod: "2/1 ~ 2/15", studyPeriod: "2/16 ~ 3/15", studyCount: 14 },
  { id: 5, number: 19, status: "완료", recruitmentPeriod: "1/1 ~ 1/15", studyPeriod: "1/16 ~ 2/12", studyCount: 13 },
];

const statusVariant = (status: Cohort["status"]) => {
  switch (status) {
    case "모집":
    case "진행":
      return "active" as const;
    case "완료":
      return "completed" as const;
    default:
      return "default" as const;
  }
};

export default function AdminCohortsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-foreground">기수 관리</h1>
        <Button variant="primary" size="sm">
          <Plus className="w-3.5 h-3.5" />
          기수 추가
        </Button>
      </div>

      <div className="border border-border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-20">기수</TableHead>
              <TableHead className="w-20">상태</TableHead>
              <TableHead>모집 기간</TableHead>
              <TableHead>스터디 기간</TableHead>
              <TableHead className="w-24 text-right">스터디 수</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cohorts.map((cohort) => (
              <TableRow key={cohort.id}>
                <TableCell>
                  <span className="text-sm font-medium text-foreground">
                    {cohort.number}기
                  </span>
                </TableCell>
                <TableCell>
                  <Badge variant={statusVariant(cohort.status)}>
                    {cohort.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-muted-foreground">
                    {cohort.recruitmentPeriod}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-muted-foreground">
                    {cohort.studyPeriod}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <span className="text-sm text-foreground">
                    {cohort.studyCount}개
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
