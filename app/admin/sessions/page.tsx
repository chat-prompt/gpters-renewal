"use client";

import { useState } from "react";
import { Plus, Link as LinkIcon } from "lucide-react";
import { Badge, Button } from "@/components/ui";
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

interface Session {
  id: number;
  name: string;
  type: "AI토크" | "줌" | "오프라인";
  cohort: number;
  date: string;
  time: string;
  isRecurring: boolean;
  zoomUrl: string;
}

const sessions: Session[] = [
  { id: 1, name: "21기 OT", type: "줌", cohort: 21, date: "3/16(토)", time: "14:00", isRecurring: false, zoomUrl: "https://zoom.us/j/111" },
  { id: 2, name: "AI토크 - n8n 기초", type: "AI토크", cohort: 21, date: "3/18(화)", time: "19:00", isRecurring: true, zoomUrl: "https://zoom.us/j/222" },
  { id: 3, name: "AI토크 - 워크플로우 설계", type: "AI토크", cohort: 21, date: "3/25(화)", time: "19:00", isRecurring: true, zoomUrl: "https://zoom.us/j/222" },
  { id: 4, name: "네트워킹 모임", type: "오프라인", cohort: 21, date: "4/5(토)", time: "14:00", isRecurring: false, zoomUrl: "" },
  { id: 5, name: "AI토크 - 고급 패턴", type: "AI토크", cohort: 21, date: "4/1(화)", time: "19:00", isRecurring: true, zoomUrl: "https://zoom.us/j/222" },
  { id: 6, name: "AI토크 - 프로젝트 리뷰", type: "AI토크", cohort: 21, date: "4/8(화)", time: "19:00", isRecurring: true, zoomUrl: "https://zoom.us/j/222" },
  { id: 7, name: "베스트 발표회", type: "줌", cohort: 21, date: "4/12(토)", time: "14:00", isRecurring: false, zoomUrl: "https://zoom.us/j/333" },
  { id: 8, name: "22기 OT", type: "줌", cohort: 22, date: "4/19(토)", time: "14:00", isRecurring: false, zoomUrl: "https://zoom.us/j/444" },
];

const typeVariant = (type: Session["type"]) => {
  switch (type) {
    case "AI토크":
      return "active" as const;
    case "줌":
      return "default" as const;
    case "오프라인":
      return "pill" as const;
  }
};

const cohortOptions = [21, 22, 23];

export default function AdminSessionsPage() {
  const [selectedCohort, setSelectedCohort] = useState("21");

  const filtered = sessions.filter((s) => s.cohort === Number(selectedCohort));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-foreground">세션 관리</h1>
        <Button size="sm">
          <Plus className="w-3.5 h-3.5" />
          세션 추가
        </Button>
      </div>

      {/* Cohort Filter */}
      <div>
        <Select value={selectedCohort} onValueChange={setSelectedCohort}>
          <SelectTrigger size="sm" className="w-auto">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {cohortOptions.map((c) => (
              <SelectItem key={c} value={String(c)}>
                {c}기
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="border border-border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>세션명</TableHead>
              <TableHead className="w-20">타입</TableHead>
              <TableHead className="w-24">날짜</TableHead>
              <TableHead className="w-16">시간</TableHead>
              <TableHead className="w-16 text-center">반복</TableHead>
              <TableHead className="w-20">줌 링크</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((session) => (
              <TableRow key={session.id}>
                <TableCell>
                  <span className="text-sm font-medium text-foreground">
                    {session.name}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge variant={typeVariant(session.type)}>
                    {session.type}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-muted-foreground whitespace-nowrap">
                    {session.date}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-muted-foreground">
                    {session.time}
                  </span>
                </TableCell>
                <TableCell className="text-center">
                  <span className="text-sm text-muted-foreground">
                    {session.isRecurring ? "O" : "-"}
                  </span>
                </TableCell>
                <TableCell>
                  {session.zoomUrl ? (
                    <a
                      href={session.zoomUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-primary hover:text-primary/80 transition-colors"
                    >
                      <LinkIcon className="w-3.5 h-3.5" />
                    </a>
                  ) : (
                    <span className="text-xs text-muted-foreground">-</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
