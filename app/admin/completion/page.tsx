"use client";

import { useState } from "react";
import { CheckCircle, XCircle, Award, FileText, RefreshCw } from "lucide-react";
import { Badge, Button, Input } from "@/components/ui";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

// -- Mock Data --

interface Student {
  id: number;
  name: string;
  attendance: number;
  assignments: number;
  verdict: "수료" | "미수료" | "우수";
  certificateIssued: boolean;
  refundStatus: "미처리" | "처리완료" | "해당없음";
}

const cohortOptions = [21, 20, 19];

const studentsMap: Record<number, Student[]> = {
  21: [
    { id: 1, name: "김지피", attendance: 4, assignments: 4, verdict: "우수", certificateIssued: true, refundStatus: "해당없음" },
    { id: 2, name: "이에이", attendance: 4, assignments: 3, verdict: "수료", certificateIssued: true, refundStatus: "처리완료" },
    { id: 3, name: "박클로", attendance: 3, assignments: 4, verdict: "수료", certificateIssued: false, refundStatus: "미처리" },
    { id: 4, name: "정프롬", attendance: 4, assignments: 4, verdict: "우수", certificateIssued: true, refundStatus: "해당없음" },
    { id: 5, name: "최바이", attendance: 2, assignments: 2, verdict: "미수료", certificateIssued: false, refundStatus: "해당없음" },
    { id: 6, name: "한오토", attendance: 3, assignments: 3, verdict: "수료", certificateIssued: false, refundStatus: "미처리" },
    { id: 7, name: "윤코딩", attendance: 4, assignments: 4, verdict: "우수", certificateIssued: true, refundStatus: "처리완료" },
    { id: 8, name: "장마케", attendance: 1, assignments: 1, verdict: "미수료", certificateIssued: false, refundStatus: "해당없음" },
    { id: 9, name: "송데이", attendance: 3, assignments: 4, verdict: "수료", certificateIssued: true, refundStatus: "처리완료" },
    { id: 10, name: "임러닝", attendance: 4, assignments: 3, verdict: "수료", certificateIssued: false, refundStatus: "미처리" },
    { id: 11, name: "오스터", attendance: 2, assignments: 3, verdict: "미수료", certificateIssued: false, refundStatus: "해당없음" },
    { id: 12, name: "배챗봇", attendance: 4, assignments: 4, verdict: "우수", certificateIssued: true, refundStatus: "해당없음" },
  ],
  20: [
    { id: 1, name: "김이십", attendance: 4, assignments: 4, verdict: "우수", certificateIssued: true, refundStatus: "처리완료" },
    { id: 2, name: "이이십", attendance: 3, assignments: 3, verdict: "수료", certificateIssued: true, refundStatus: "처리완료" },
    { id: 3, name: "박이십", attendance: 2, assignments: 1, verdict: "미수료", certificateIssued: false, refundStatus: "해당없음" },
  ],
  19: [
    { id: 1, name: "김십구", attendance: 4, assignments: 4, verdict: "수료", certificateIssued: true, refundStatus: "처리완료" },
    { id: 2, name: "이십구", attendance: 3, assignments: 4, verdict: "수료", certificateIssued: true, refundStatus: "처리완료" },
  ],
};

const verdictVariant = (verdict: Student["verdict"]) => {
  switch (verdict) {
    case "우수":
      return "active" as const;
    case "수료":
      return "default" as const;
    case "미수료":
      return "completed" as const;
  }
};

const refundVariant = (status: Student["refundStatus"]) => {
  switch (status) {
    case "처리완료":
      return "active" as const;
    case "미처리":
      return "default" as const;
    case "해당없음":
      return "completed" as const;
  }
};

export default function AdminCompletionPage() {
  const [selectedCohort, setSelectedCohort] = useState("21");
  const [minAttendance, setMinAttendance] = useState("3");
  const [minAssignments, setMinAssignments] = useState("3");

  const students = studentsMap[Number(selectedCohort)] ?? [];

  const completedCount = students.filter(
    (s) => s.verdict === "수료" || s.verdict === "우수"
  ).length;
  const outstandingCount = students.filter(
    (s) => s.verdict === "우수"
  ).length;
  const notCompletedCount = students.filter(
    (s) => s.verdict === "미수료"
  ).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-foreground">수료/환급 관리</h1>
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

      {/* 수료 기준 설정 */}
      <Card>
        <CardHeader>
          <CardTitle>수료 기준 설정</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-end gap-4">
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">
                최소 출석 (회)
              </label>
              <Input
                type="number"
                value={minAttendance}
                onChange={(e) => setMinAttendance(e.target.value)}
                className="w-24"
                min={0}
                max={4}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">
                최소 과제 (주)
              </label>
              <Input
                type="number"
                value={minAssignments}
                onChange={(e) => setMinAssignments(e.target.value)}
                className="w-24"
                min={0}
                max={4}
              />
            </div>
            <Button size="sm">
              <RefreshCw className="w-3.5 h-3.5" />
              판정 실행
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 수료 현황 요약 */}
      <div className="flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-1.5">
          <CheckCircle className="w-4 h-4 text-primary" />
          <span className="text-muted-foreground">수료</span>
          <span className="font-bold text-foreground">{completedCount}명</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Award className="w-4 h-4 text-primary" />
          <span className="text-muted-foreground">우수</span>
          <span className="font-bold text-foreground">{outstandingCount}명</span>
        </div>
        <div className="flex items-center gap-1.5">
          <XCircle className="w-4 h-4 text-destructive" />
          <span className="text-muted-foreground">미수료</span>
          <span className="font-bold text-foreground">{notCompletedCount}명</span>
        </div>
      </div>

      {/* 일괄 액션 */}
      <div className="flex flex-wrap gap-2">
        <Button variant="secondary" size="sm">
          <FileText className="w-3.5 h-3.5" />
          수료증 일괄 발급
        </Button>
        <Button variant="secondary" size="sm">
          <CheckCircle className="w-3.5 h-3.5" />
          환급 처리
        </Button>
      </div>

      {/* 수료 현황 테이블 */}
      <div className="border border-border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>이름</TableHead>
              <TableHead className="w-20 text-center">출석</TableHead>
              <TableHead className="w-20 text-center">과제</TableHead>
              <TableHead className="w-20 text-center">판정</TableHead>
              <TableHead className="w-24 text-center">수료증</TableHead>
              <TableHead className="w-24 text-center">환급</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((student) => (
              <TableRow key={student.id}>
                <TableCell>
                  <span className="text-sm font-medium text-foreground">
                    {student.name}
                  </span>
                </TableCell>
                <TableCell className="text-center">
                  <span className="text-sm text-foreground">
                    {student.attendance}/4
                  </span>
                </TableCell>
                <TableCell className="text-center">
                  <span className="text-sm text-foreground">
                    {student.assignments}/4
                  </span>
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant={verdictVariant(student.verdict)}>
                    {student.verdict}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  {student.certificateIssued ? (
                    <Badge variant="active">발급완료</Badge>
                  ) : (
                    <span className="text-xs text-muted-foreground">미발급</span>
                  )}
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant={refundVariant(student.refundStatus)}>
                    {student.refundStatus}
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
