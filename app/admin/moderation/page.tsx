"use client";

import { useState } from "react";
import { Check, X, Trash2 } from "lucide-react";
import { Badge, Button, Tabs } from "@/components/ui";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

interface Report {
  id: number;
  reportedAt: string;
  targetType: "게시글" | "댓글" | "사용자";
  targetTitle: string;
  reason: string;
  reporter: string;
  status: "대기" | "처리완료" | "무시";
}

const reports: Report[] = [
  { id: 1, reportedAt: "2026-02-25", targetType: "게시글", targetTitle: "ChatGPT로 돈 벌기 꿀팁", reason: "스팸/광고성 콘텐츠", reporter: "이지영", status: "대기" },
  { id: 2, reportedAt: "2026-02-24", targetType: "댓글", targetTitle: "무의미한 댓글 반복", reason: "도배", reporter: "박도현", status: "대기" },
  { id: 3, reportedAt: "2026-02-23", targetType: "사용자", targetTitle: "spam_user_01", reason: "프로필 사칭", reporter: "최서연", status: "대기" },
  { id: 4, reportedAt: "2026-02-22", targetType: "게시글", targetTitle: "불법 프로그램 공유", reason: "불법/유해 콘텐츠", reporter: "정우진", status: "처리완료" },
  { id: 5, reportedAt: "2026-02-21", targetType: "댓글", targetTitle: "욕설이 포함된 댓글", reason: "욕설/비하", reporter: "한소희", status: "처리완료" },
  { id: 6, reportedAt: "2026-02-20", targetType: "게시글", targetTitle: "n8n 워크플로우 모음집", reason: "저작권 침해 의심", reporter: "윤재호", status: "무시" },
  { id: 7, reportedAt: "2026-02-19", targetType: "사용자", targetTitle: "angry_user_99", reason: "타 회원 괴롭힘", reporter: "송다혜", status: "대기" },
];

const statusVariant = (status: Report["status"]) => {
  switch (status) {
    case "대기":
      return "active" as const;
    case "처리완료":
      return "completed" as const;
    case "무시":
      return "default" as const;
  }
};

const targetVariant = (type: Report["targetType"]) => {
  switch (type) {
    case "게시글":
      return "default" as const;
    case "댓글":
      return "pill" as const;
    case "사용자":
      return "active" as const;
  }
};

const statusTabs = [
  { key: "all", label: "전체" },
  { key: "대기", label: "대기" },
  { key: "처리완료", label: "처리완료" },
  { key: "무시", label: "무시" },
];

export default function AdminModerationPage() {
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = reports.filter(
    (r) => statusFilter === "all" || r.status === statusFilter
  );

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-foreground">신고/모더레이션</h1>

      <Tabs
        items={statusTabs}
        activeKey={statusFilter}
        onTabChange={setStatusFilter}
      />

      <div className="border border-border rounded-lg bg-background overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-24">신고일</TableHead>
              <TableHead className="w-20">대상</TableHead>
              <TableHead>내용</TableHead>
              <TableHead>사유</TableHead>
              <TableHead className="w-20">신고자</TableHead>
              <TableHead className="w-20">상태</TableHead>
              <TableHead className="w-32">액션</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((report) => (
              <TableRow key={report.id}>
                <TableCell>
                  <span className="text-sm text-muted-foreground whitespace-nowrap">
                    {report.reportedAt}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge variant={targetVariant(report.targetType)}>
                    {report.targetType}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className="text-sm font-medium text-foreground">
                    {report.targetTitle}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-muted-foreground">
                    {report.reason}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-muted-foreground">
                    {report.reporter}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge variant={statusVariant(report.status)}>
                    {report.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" title="확인">
                      <Check className="w-3.5 h-3.5" />
                    </Button>
                    <Button variant="ghost" size="sm" title="무시">
                      <X className="w-3.5 h-3.5" />
                    </Button>
                    <Button variant="destructive" size="sm" title="삭제">
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
