"use client";

import { useState } from "react";
import { Search, Pencil, Trash2 } from "lucide-react";
import { Input, Button, Badge, Pagination } from "@/components/ui";
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
          icon={<Search className="w-4 h-4" />}
          placeholder="제목, 작성자 검색..."
        />
        <select className="border border-input rounded-md px-3 py-2 text-sm bg-background text-foreground whitespace-nowrap">
          <option>카테고리: 전체</option>
          <option>AI활용법</option>
          <option>프롬프트</option>
          <option>자동화/노코드</option>
          <option>개발/코딩</option>
          <option>비즈니스/마케팅</option>
          <option>AI뉴스</option>
        </select>
        <select className="border border-input rounded-md px-3 py-2 text-sm bg-background text-foreground whitespace-nowrap">
          <option>상태: 전체</option>
          <option>공개</option>
          <option>비공개</option>
          <option>신고됨</option>
        </select>
      </div>

      {/* Table */}
      <div className="border border-border rounded-lg bg-background overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10">
                <input
                  type="checkbox"
                  checked={selected.length === posts.length && posts.length > 0}
                  onChange={toggleAll}
                  className="w-4 h-4"
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
                  <input
                    type="checkbox"
                    checked={selected.includes(post.id)}
                    onChange={() => toggleSelect(post.id)}
                    className="w-4 h-4"
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
