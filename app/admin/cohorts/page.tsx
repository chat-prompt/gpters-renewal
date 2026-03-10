"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

const initialCohorts: Cohort[] = [
  { id: 1, number: 23, status: "준비", recruitmentPeriod: "5/1 ~ 5/18", studyPeriod: "5/19 ~ 6/15", studyCount: 0 },
  { id: 2, number: 22, status: "모집", recruitmentPeriod: "4/1 ~ 4/18", studyPeriod: "4/19 ~ 5/16", studyCount: 12 },
  { id: 3, number: 21, status: "진행", recruitmentPeriod: "3/1 ~ 3/15", studyPeriod: "3/16 ~ 4/12", studyCount: 15 },
  { id: 4, number: 20, status: "완료", recruitmentPeriod: "2/1 ~ 2/15", studyPeriod: "2/16 ~ 3/15", studyCount: 14 },
  { id: 5, number: 19, status: "완료", recruitmentPeriod: "1/1 ~ 1/15", studyPeriod: "1/16 ~ 2/12", studyCount: 13 },
];

const statusOptions = ["준비", "모집", "진행", "완료"] as const;

export default function AdminCohortsPage() {
  const [cohortList, setCohortList] = useState<Cohort[]>(initialCohorts);

  const changeStatus = (id: number, status: Cohort["status"]) =>
    setCohortList((prev) => prev.map((c) => c.id === id ? { ...c, status } : c));

  const deleteCohort = (id: number) =>
    setCohortList((prev) => prev.filter((c) => c.id !== id));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-foreground">기수 관리</h1>
        <Button size="sm">
          <Plus className="w-3.5 h-3.5" />
          기수 추가
        </Button>
      </div>

      <div className="border border-border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-20">기수</TableHead>
              <TableHead className="w-28">상태</TableHead>
              <TableHead>모집 기간</TableHead>
              <TableHead>스터디 기간</TableHead>
              <TableHead className="w-24 text-right">스터디 수</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {cohortList.map((cohort) => (
              <TableRow key={cohort.id}>
                <TableCell>
                  <span className="text-sm font-medium text-foreground">{cohort.number}기</span>
                </TableCell>
                <TableCell>
                  <Select
                    value={cohort.status}
                    onValueChange={(val) => changeStatus(cohort.id, val as Cohort["status"])}
                  >
                    <SelectTrigger size="sm" className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((s) => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-muted-foreground">{cohort.recruitmentPeriod}</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-muted-foreground">{cohort.studyPeriod}</span>
                </TableCell>
                <TableCell className="text-right">
                  <span className="text-sm text-foreground">{cohort.studyCount}개</span>
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    title="삭제"
                    onClick={() => deleteCohort(cohort.id)}
                  >
                    <Trash2 className="w-3.5 h-3.5 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
