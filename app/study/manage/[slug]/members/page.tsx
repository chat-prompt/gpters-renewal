"use client";

import { useState } from "react";
import { Breadcrumb, Toggle } from "@/components/ui";
import { AttendanceMatrix } from "@/components/lms/attendance-matrix";

type CellStatus = "done" | "not-done" | "upcoming";

interface Member {
  name: string;
  attendance: CellStatus[];
  assignments: CellStatus[];
  prediction: "순조" | "위험" | "미달";
}

const members: Member[] = [
  { name: "김철수", attendance: ["done", "done", "upcoming", "upcoming"], assignments: ["done", "done", "upcoming", "upcoming"], prediction: "순조" },
  { name: "이영희", attendance: ["done", "not-done", "upcoming", "upcoming"], assignments: ["done", "not-done", "upcoming", "upcoming"], prediction: "위험" },
  { name: "박민수", attendance: ["done", "done", "upcoming", "upcoming"], assignments: ["done", "done", "upcoming", "upcoming"], prediction: "순조" },
  { name: "정대호", attendance: ["not-done", "not-done", "upcoming", "upcoming"], assignments: ["done", "not-done", "upcoming", "upcoming"], prediction: "미달" },
  { name: "최수민", attendance: ["done", "done", "upcoming", "upcoming"], assignments: ["done", "not-done", "upcoming", "upcoming"], prediction: "위험" },
  { name: "한지원", attendance: ["not-done", "done", "upcoming", "upcoming"], assignments: ["done", "not-done", "upcoming", "upcoming"], prediction: "위험" },
  { name: "오세진", attendance: ["done", "done", "upcoming", "upcoming"], assignments: ["done", "not-done", "upcoming", "upcoming"], prediction: "순조" },
  { name: "윤미래", attendance: ["done", "not-done", "upcoming", "upcoming"], assignments: ["done", "not-done", "upcoming", "upcoming"], prediction: "위험" },
  { name: "송하은", attendance: ["done", "done", "upcoming", "upcoming"], assignments: ["done", "done", "upcoming", "upcoming"], prediction: "순조" },
  { name: "장민호", attendance: ["done", "done", "upcoming", "upcoming"], assignments: ["done", "done", "upcoming", "upcoming"], prediction: "순조" },
  { name: "임서현", attendance: ["done", "done", "upcoming", "upcoming"], assignments: ["done", "done", "upcoming", "upcoming"], prediction: "순조" },
  { name: "강태우", attendance: ["done", "done", "upcoming", "upcoming"], assignments: ["done", "done", "upcoming", "upcoming"], prediction: "순조" },
  { name: "배수지", attendance: ["done", "done", "upcoming", "upcoming"], assignments: ["done", "done", "upcoming", "upcoming"], prediction: "순조" },
  { name: "조현아", attendance: ["done", "done", "upcoming", "upcoming"], assignments: ["done", "done", "upcoming", "upcoming"], prediction: "순조" },
  { name: "권도윤", attendance: ["done", "done", "upcoming", "upcoming"], assignments: ["done", "done", "upcoming", "upcoming"], prediction: "순조" },
];

export default function MembersPage() {
  const [showMissingOnly, setShowMissingOnly] = useState(false);

  const filtered = showMissingOnly
    ? members.filter((m) =>
        m.assignments.some((a) => a === "not-done") ||
        m.attendance.some((a) => a === "not-done")
      )
    : members;

  const attendanceRate = Math.round(
    (members.flatMap((m) => m.attendance).filter((a) => a === "done").length /
      members.flatMap((m) => m.attendance).filter((a) => a !== "upcoming").length) *
      100
  );

  const assignmentRate = Math.round(
    (members.flatMap((m) => m.assignments).filter((a) => a === "done").length /
      members.flatMap((m) => m.assignments).filter((a) => a !== "upcoming").length) *
      100
  );

  return (
    <div className="mx-auto max-w-[1080px] px-6 py-page space-y-6">
      <Breadcrumb
        items={[
          { label: "스터디 관리", href: "/study/manage/21-ai-automation" },
          { label: "수강생 현황" },
        ]}
      />

      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-foreground">
          수강생 현황 ({members.length}명)
        </h1>
        <Toggle
          checked={showMissingOnly}
          onChange={setShowMissingOnly}
          label="미제출만 보기"
        />
      </div>

      <AttendanceMatrix members={filtered} weeks={4} />

      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-lg border border-border p-4">
          <p className="text-xs text-sub-foreground mb-1">출석률 (1~2주차)</p>
          <p className="text-2xl font-bold text-foreground">{attendanceRate}%</p>
        </div>
        <div className="rounded-lg border border-border p-4">
          <p className="text-xs text-sub-foreground mb-1">과제 제출률 (1~2주차)</p>
          <p className="text-2xl font-bold text-foreground">{assignmentRate}%</p>
        </div>
      </div>
    </div>
  );
}
