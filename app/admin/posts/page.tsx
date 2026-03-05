"use client";

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Input, Button, Badge, Pagination, Checkbox } from "@/components/ui";
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
import { BulkActionBar } from "@/components/admin/bulk-action-bar";

interface Post {
  id: number;
  title: string;
  category: string;
  author: string;
  date: string;
  status: string;
}

const posts: Post[] = [
  {
    id: 1,
    title: "Claude로 마케팅 자동화 구축기",
    category: "AI활용법",
    author: "홍길동",
    date: "2026-02-26",
    status: "공개",
  },
  {
    id: 2,
    title: "GPT-4o 프롬프트 작성법 완전 가이드",
    category: "프롬프트",
    author: "이영희",
    date: "2026-02-25",
    status: "공개",
  },
  {
    id: 3,
    title: "Cursor로 풀스택 앱 만들기",
    category: "개발/코딩",
    author: "박철수",
    date: "2026-02-25",
    status: "공개",
  },
  {
    id: 4,
    title: "n8n 자동화 워크플로우 가이드",
    category: "자동화/노코드",
    author: "김영호",
    date: "2026-02-24",
    status: "비공개",
  },
  {
    id: 5,
    title: "AI 비즈니스 모델 5가지 분석",
    category: "비즈니스/마케팅",
    author: "이수진",
    date: "2026-02-24",
    status: "공개",
  },
  {
    id: 6,
    title: "GPT-5 전망과 활용법 총정리",
    category: "AI뉴스",
    author: "최지원",
    date: "2026-02-23",
    status: "공개",
  },
  {
    id: 7,
    title: "AI 에이전트 만들기 실전 가이드",
    category: "개발/코딩",
    author: "한서연",
    date: "2026-02-23",
    status: "신고됨",
  },
  {
    id: 8,
    title: "노코드로 SaaS 런칭하기",
    category: "자동화/노코드",
    author: "정우성",
    date: "2026-02-22",
    status: "공개",
  },
  {
    id: 9,
    title: "프롬프트 엔지니어링 심화 과정 후기",
    category: "프롬프트",
    author: "송다혜",
    date: "2026-02-22",
    status: "공개",
  },
  {
    id: 10,
    title: "AI 뉴스레터 자동 발행 시스템 구축",
    category: "AI활용법",
    author: "김민준",
    date: "2026-02-21",
    status: "비공개",
  },
];

const statusVariant = (status: string) => {
  if (status === "신고됨") return "active" as const;
  if (status === "비공개") return "completed" as const;
  return "default" as const;
};

export default function AdminPostsPage() {
  const [selected, setSelected] = useState<number[]>([]);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const toggleSelect = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    setSelected(
      selected.length === posts.length ? [] : posts.map((p) => p.id)
    );
  };

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-foreground">게시글 관리</h1>

      {/* Filters */}
      <div className="flex gap-2">
        <Input
          placeholder="제목, 작성자 검색..."
        />
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger size="sm" className="w-auto">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">카테고리: 전체</SelectItem>
            <SelectItem value="AI활용법">AI활용법</SelectItem>
            <SelectItem value="프롬프트">프롬프트</SelectItem>
            <SelectItem value="자동화/노코드">자동화/노코드</SelectItem>
            <SelectItem value="개발/코딩">개발/코딩</SelectItem>
            <SelectItem value="비즈니스/마케팅">비즈니스/마케팅</SelectItem>
            <SelectItem value="AI뉴스">AI뉴스</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger size="sm" className="w-auto">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">상태: 전체</SelectItem>
            <SelectItem value="공개">공개</SelectItem>
            <SelectItem value="비공개">비공개</SelectItem>
            <SelectItem value="신고됨">신고됨</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="border border-border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10">
                <Checkbox
                  checked={selected.length === posts.length && posts.length > 0}
                  onCheckedChange={toggleAll}
                />
              </TableHead>
              <TableHead>제목</TableHead>
              <TableHead className="w-28">카테고리</TableHead>
              <TableHead className="w-20">작성자</TableHead>
              <TableHead className="w-28">날짜</TableHead>
              <TableHead className="w-20">상태</TableHead>
              <TableHead className="w-24">작업</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.map((post) => (
              <TableRow key={post.id}>
                <TableCell>
                  <Checkbox
                    checked={selected.includes(post.id)}
                    onCheckedChange={() => toggleSelect(post.id)}
                  />
                </TableCell>
                <TableCell>
                  <span className="text-sm text-foreground truncate block max-w-xs">
                    {post.title}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge>{post.category}</Badge>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-muted-foreground whitespace-nowrap">
                    {post.author}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-muted-foreground whitespace-nowrap">
                    {post.date}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge variant={statusVariant(post.status)}>
                    {post.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon">
                      <Pencil className="w-3.5 h-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="w-3.5 h-3.5 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Bulk Actions */}
      <BulkActionBar
        selectedCount={selected.length}
        actions={[
          { label: "이동", onClick: () => {} },
          { label: "삭제", onClick: () => {}, variant: "destructive" },
        ]}
        onClear={() => setSelected([])}
      />

      {/* Pagination */}
      <Pagination currentPage={1} totalPages={3} />
    </div>
  );
}
