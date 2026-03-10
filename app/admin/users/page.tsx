"use client";

import { useState } from "react";
import { UserX, UserCheck, Trash2 } from "lucide-react";
import { Button, Input, Tabs } from "@/components/ui";
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

interface User {
  id: number;
  name: string;
  email: string;
  role: "일반" | "스터디장" | "운영자";
  joinedAt: string;
  studyCount: number;
  postCount: number;
  suspended?: boolean;
}

const initialUsers: User[] = [
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

const roleTabs = [
  { key: "all", label: "전체" },
  { key: "일반", label: "일반" },
  { key: "스터디장", label: "스터디장" },
  { key: "운영자", label: "운영자" },
];

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [users, setUsers] = useState<User[]>(initialUsers);

  const filtered = users.filter((u) => {
    const matchesSearch =
      !search ||
      u.name.includes(search) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const updateRole = (id: number, role: User["role"]) =>
    setUsers((prev) => prev.map((u) => u.id === id ? { ...u, role } : u));

  const toggleSuspend = (id: number) =>
    setUsers((prev) =>
      prev.map((u) => u.id === id ? { ...u, suspended: !u.suspended } : u)
    );

  const deleteUser = (id: number) =>
    setUsers((prev) => prev.filter((u) => u.id !== id));

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-foreground">회원 관리</h1>

      <Input
        placeholder="이름 또는 이메일로 검색"
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
              <TableHead className="w-32">역할</TableHead>
              <TableHead className="w-24">가입일</TableHead>
              <TableHead className="w-20 text-right">스터디</TableHead>
              <TableHead className="w-20 text-right">게시글</TableHead>
              <TableHead className="w-20" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((user) => (
              <TableRow key={user.id} className={user.suspended ? "opacity-60" : ""}>
                <TableCell>
                  <span className="text-sm font-medium text-foreground">
                    {user.name}
                    {user.suspended && (
                      <span className="ml-1 text-xs text-muted-foreground">(정지)</span>
                    )}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-muted-foreground">
                    {user.email}
                  </span>
                </TableCell>
                <TableCell>
                  <Select
                    value={user.role}
                    onValueChange={(val) => updateRole(user.id, val as User["role"])}
                  >
                    <SelectTrigger size="sm" className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="일반">일반</SelectItem>
                      <SelectItem value="스터디장">스터디장</SelectItem>
                      <SelectItem value="운영자">운영자</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-muted-foreground whitespace-nowrap">
                    {user.joinedAt}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <span className="text-sm text-foreground">{user.studyCount}</span>
                </TableCell>
                <TableCell className="text-right">
                  <span className="text-sm text-foreground">{user.postCount}</span>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1 justify-end">
                    <Button
                      variant="ghost"
                      size="icon"
                      title={user.suspended ? "정지 해제" : "계정 정지"}
                      onClick={() => toggleSuspend(user.id)}
                    >
                      {user.suspended ? (
                        <UserCheck className="w-3.5 h-3.5 text-primary" />
                      ) : (
                        <UserX className="w-3.5 h-3.5" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      title="삭제"
                      onClick={() => deleteUser(user.id)}
                    >
                      <Trash2 className="w-3.5 h-3.5 text-destructive" />
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
