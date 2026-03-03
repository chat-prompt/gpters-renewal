"use client";

import { useState } from "react";
import { Search, ExternalLink } from "lucide-react";
import { Badge, Button, Input, Tabs } from "@/components/ui";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

interface User {
  id: number;
  name: string;
  email: string;
  role: "일반" | "스터디장" | "운영자";
  joinedAt: string;
  studyCount: number;
  postCount: number;
}

const users: User[] = [
  { id: 1, name: "김민수", email: "minsu@example.com", role: "운영자", joinedAt: "2024-01-15", studyCount: 8, postCount: 42 },
  { id: 2, name: "이지영", email: "jiyoung@example.com", role: "스터디장", joinedAt: "2024-02-20", studyCount: 5, postCount: 28 },
  { id: 3, name: "박도현", email: "dohyun@example.com", role: "스터디장", joinedAt: "2024-03-05", studyCount: 4, postCount: 31 },
  { id: 4, name: "최서연", email: "seoyeon@example.com", role: "일반", joinedAt: "2024-04-12", studyCount: 2, postCount: 7 },
  { id: 5, name: "정우진", email: "woojin@example.com", role: "일반", joinedAt: "2024-05-08", studyCount: 3, postCount: 15 },
  { id: 6, name: "한소희", email: "sohee@example.com", role: "일반", joinedAt: "2024-06-01", studyCount: 1, postCount: 3 },
  { id: 7, name: "윤재호", email: "jaeho@example.com", role: "스터디장", joinedAt: "2024-06-20", studyCount: 6, postCount: 45 },
  { id: 8, name: "송다혜", email: "dahye@example.com", role: "운영자", joinedAt: "2024-07-10", studyCount: 7, postCount: 38 },
  { id: 9, name: "임태윤", email: "taeyoon@example.com", role: "일반", joinedAt: "2024-08-15", studyCount: 2, postCount: 9 },
  { id: 10, name: "강하린", email: "harin@example.com", role: "일반", joinedAt: "2024-09-03", studyCount: 1, postCount: 4 },
  { id: 11, name: "조영준", email: "youngjun@example.com", role: "일반", joinedAt: "2024-10-22", studyCount: 1, postCount: 2 },
  { id: 12, name: "배수아", email: "sua@example.com", role: "스터디장", joinedAt: "2024-11-01", studyCount: 3, postCount: 22 },
  { id: 13, name: "오승민", email: "seungmin@example.com", role: "일반", joinedAt: "2025-01-05", studyCount: 1, postCount: 1 },
];

const roleVariant = (role: User["role"]) => {
  switch (role) {
    case "운영자":
      return "active" as const;
    case "스터디장":
      return "pill" as const;
    default:
      return "default" as const;
  }
};

const roleTabs = [
  { key: "all", label: "전체" },
  { key: "일반", label: "일반" },
  { key: "스터디장", label: "스터디장" },
  { key: "운영자", label: "운영자" },
];

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const filtered = users.filter((u) => {
    const matchesSearch =
      !search ||
      u.name.includes(search) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-foreground">회원 관리</h1>

      <Input
        placeholder="이름 또는 이메일로 검색"
        icon={<Search className="w-4 h-4" />}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <Tabs items={roleTabs} activeKey={roleFilter} onTabChange={setRoleFilter} />

      <div className="border border-border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>이름</TableHead>
              <TableHead>이메일</TableHead>
              <TableHead className="w-20">역할</TableHead>
              <TableHead className="w-24">가입일</TableHead>
              <TableHead className="w-20 text-right">스터디</TableHead>
              <TableHead className="w-20 text-right">게시글</TableHead>
              <TableHead className="w-16" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <span className="text-sm font-medium text-foreground">
                    {user.name}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-muted-foreground">
                    {user.email}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge variant={roleVariant(user.role)}>{user.role}</Badge>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-muted-foreground whitespace-nowrap">
                    {user.joinedAt}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <span className="text-sm text-foreground">
                    {user.studyCount}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <span className="text-sm text-foreground">
                    {user.postCount}
                  </span>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">
                    <ExternalLink className="w-3.5 h-3.5" />
                    상세
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
