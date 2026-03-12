"use client";

import { useState } from "react";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { Badge, Button, Toggle } from "@/components/ui";
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
} from "@/components/ui";

interface Study {
  id: number;
  title: string;
  leader: string;
  status: string;
  enrolled: number;
  capacity: number;
  submitted: boolean;
  slug: string;
}

const studies: Study[] = [
  {
    id: 1,
    title: "AI 자동화 마스터",
    leader: "홍길동",
    status: "모집중",
    enrolled: 12,
    capacity: 20,
    submitted: true,
    slug: "ai-automation",
  },
  {
    id: 2,
    title: "프롬프트 엔지니어링 심화",
    leader: "이영희",
    status: "모집중",
    enrolled: 8,
    capacity: 15,
    submitted: true,
    slug: "prompt-engineering",
  },
  {
    id: 3,
    title: "AI 비즈니스 활용",
    leader: "박민수",
    status: "진행중",
    enrolled: 15,
    capacity: 15,
    submitted: true,
    slug: "ai-business",
  },
  {
    id: 4,
    title: "노코드 SaaS 빌딩",
    leader: "김영호",
    status: "작성중",
    enrolled: 0,
    capacity: 20,
    submitted: false,
    slug: "nocode-saas",
  },
  {
    id: 5,
    title: "AI 에이전트 개발",
    leader: "이수진",
    status: "진행중",
    enrolled: 18,
    capacity: 20,
    submitted: true,
    slug: "ai-agent",
  },
  {
    id: 6,
    title: "GPT 활용 마케팅",
    leader: "최지원",
    status: "완료",
    enrolled: 14,
    capacity: 15,
    submitted: true,
    slug: "gpt-marketing",
  },
  {
    id: 7,
    title: "AI 이미지 생성 마스터",
    leader: "한서연",
    status: "작성중",
    enrolled: 0,
    capacity: 25,
    submitted: false,
    slug: "ai-image",
  },
  {
    id: 8,
    title: "ChatGPT API 활용",
    leader: "정우성",
    status: "완료",
    enrolled: 19,
    capacity: 20,
    submitted: true,
    slug: "chatgpt-api",
  },
];

const statusVariant = (status: string) => {
  if (status === "모집중") return "active" as const;
  if (status === "진행중") return "active" as const;
  if (status === "완료") return "completed" as const;
  return "default" as const;
};

const statusOptions = ["작성중", "모집중", "진행중", "완료"];

export default function AdminStudiesPage() {
  const [studyData, setStudyData] = useState(studies);
  const [cohortFilter, setCohortFilter] = useState("21기");
  const [statusFilter, setStatusFilter] = useState("all");

  const toggleSubmit = (id: number) => {
    setStudyData((prev) =>
      prev.map((s) => (s.id === id ? { ...s, submitted: !s.submitted } : s))
    );
  };

  const changeStatus = (id: number, newStatus: string) => {
    setStudyData((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: newStatus } : s))
    );
  };

  const filteredStudies = studyData.filter((s) =>
    statusFilter === "all" || s.status === statusFilter
  );

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-foreground">스터디 관리</h1>

      {/* Filters */}
      <div className="flex gap-2">
        <Select value={cohortFilter} onValueChange={setCohortFilter}>
          <SelectTrigger size="sm" className="w-auto">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="21기">기수: 21기</SelectItem>
            <SelectItem value="20기">20기</SelectItem>
            <SelectItem value="19기">19기</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger size="sm" className="w-auto">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">상태: 전체</SelectItem>
            {statusOptions.map((s) => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="border border-border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>스터디명</TableHead>
              <TableHead className="w-20">스터디장</TableHead>
              <TableHead className="w-24">상태</TableHead>
              <TableHead className="w-24">참여자</TableHead>
              <TableHead className="w-28">최종제출</TableHead>
              <TableHead className="w-28">작업</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStudies.map((study) => (
              <TableRow key={study.id}>
                <TableCell>
                  <span className="text-sm text-foreground font-medium">
                    {study.title}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-sub-foreground whitespace-nowrap">
                    {study.leader}
                  </span>
                </TableCell>
                <TableCell>
                  <Select
                    value={study.status}
                    onValueChange={(value) => changeStatus(study.id, value)}
                  >
                    <SelectTrigger size="sm" className="w-auto text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-sub-foreground whitespace-nowrap">
                    {study.enrolled}/{study.capacity}명
                  </span>
                </TableCell>
                <TableCell>
                  <Toggle
                    checked={study.submitted}
                    onChange={() => toggleSubmit(study.id)}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button variant="secondary" size="sm">
                      상세
                    </Button>
                    <Link href={`/study/${study.slug}`}>
                      <Button variant="ghost" size="icon">
                        <ExternalLink className="w-3.5 h-3.5" strokeWidth={1.5} />
                      </Button>
                    </Link>
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
