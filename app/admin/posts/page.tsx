"use client";

import { useState } from "react";
import { Trash2, Star } from "lucide-react";
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
  editorPick: boolean;
}

const EDITOR_PICK_MAX = 3;

const initialPosts: Post[] = [
  { id: 1, title: "Claude로 마케팅 자동화 구축기", category: "AI활용법", author: "홍길동", date: "2026-02-26", status: "공개", editorPick: true },
  { id: 2, title: "GPT-4o 프롬프트 작성법 완전 가이드", category: "프롬프트", author: "이영희", date: "2026-02-25", status: "공개", editorPick: true },
  { id: 3, title: "Cursor로 풀스택 앱 만들기", category: "개발/코딩", author: "박철수", date: "2026-02-25", status: "공개", editorPick: true },
  { id: 4, title: "n8n 자동화 워크플로우 가이드", category: "자동화/노코드", author: "김영호", date: "2026-02-24", status: "비공개", editorPick: false },
  { id: 5, title: "AI 비즈니스 모델 5가지 분석", category: "비즈니스/마케팅", author: "이수진", date: "2026-02-24", status: "공개", editorPick: false },
  { id: 6, title: "GPT-5 전망과 활용법 총정리", category: "AI뉴스", author: "최지원", date: "2026-02-23", status: "공개", editorPick: false },
  { id: 7, title: "AI 에이전트 만들기 실전 가이드", category: "개발/코딩", author: "한서연", date: "2026-02-23", status: "신고됨", editorPick: false },
  { id: 8, title: "노코드로 SaaS 런칭하기", category: "자동화/노코드", author: "정우성", date: "2026-02-22", status: "공개", editorPick: false },
  { id: 9, title: "프롬프트 엔지니어링 심화 과정 후기", category: "프롬프트", author: "송다혜", date: "2026-02-22", status: "공개", editorPick: false },
  { id: 10, title: "AI 뉴스레터 자동 발행 시스템 구축", category: "AI활용법", author: "김민준", date: "2026-02-21", status: "비공개", editorPick: false },
];

const categories = ["AI활용법", "프롬프트", "자동화/노코드", "개발/코딩", "비즈니스/마케팅", "AI뉴스"];

const statusVariant = (status: string) => {
  if (status === "신고됨") return "active" as const;
  if (status === "비공개") return "completed" as const;
  return "default" as const;
};

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [selected, setSelected] = useState<number[]>([]);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showMoveSelect, setShowMoveSelect] = useState(false);
  const [moveCategory, setMoveCategory] = useState("");

  const filteredPosts = posts.filter((p) => {
    if (categoryFilter !== "all" && p.category !== categoryFilter) return false;
    if (statusFilter !== "all" && p.status !== statusFilter) return false;
    if (searchQuery && !p.title.includes(searchQuery) && !p.author.includes(searchQuery)) return false;
    return true;
  });

  const toggleSelect = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    const ids = filteredPosts.map((p) => p.id);
    setSelected(selected.length === ids.length ? [] : ids);
  };

  const handleBulkDelete = () => {
    setPosts((prev) => prev.filter((p) => !selected.includes(p.id)));
    setSelected([]);
  };

  const handleBulkMove = () => {
    if (!moveCategory) return;
    setPosts((prev) =>
      prev.map((p) => selected.includes(p.id) ? { ...p, category: moveCategory } : p)
    );
    setSelected([]);
    setShowMoveSelect(false);
    setMoveCategory("");
  };

  const handleDelete = (id: number) =>
    setPosts((prev) => prev.filter((p) => p.id !== id));

  const toggleEditorPick = (id: number) => {
    const post = posts.find((p) => p.id === id);
    if (!post) return;
    const pickCount = posts.filter((p) => p.editorPick).length;
    if (!post.editorPick && pickCount >= EDITOR_PICK_MAX) return;
    setPosts((prev) => prev.map((p) => p.id === id ? { ...p, editorPick: !p.editorPick } : p));
  };

  const editorPickCount = posts.filter((p) => p.editorPick).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-foreground">게시글 관리</h1>
        <div className="flex items-center gap-1.5 text-sm text-sub-foreground">
          <Star className="w-4 h-4 text-primary" strokeWidth={1.5} fill="currentColor" />
          <span>에디터픽 <span className="font-medium text-foreground">{editorPickCount}</span> / {EDITOR_PICK_MAX}</span>
          <span className="text-muted-foreground ml-1">· 홈 · 인사이트 사이드바에 노출</span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        <Input
          placeholder="제목, 작성자 검색..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger size="sm" className="w-auto">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">카테고리: 전체</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
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
                  checked={filteredPosts.length > 0 && selected.length === filteredPosts.length}
                  onCheckedChange={toggleAll}
                />
              </TableHead>
              <TableHead>제목</TableHead>
              <TableHead className="w-28">카테고리</TableHead>
              <TableHead className="w-20">작성자</TableHead>
              <TableHead className="w-28">날짜</TableHead>
              <TableHead className="w-20">상태</TableHead>
              <TableHead className="w-12 text-center">픽</TableHead>
              <TableHead className="w-16">작업</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPosts.map((post) => (
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
                  <span className="text-sm text-sub-foreground whitespace-nowrap">
                    {post.author}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-sub-foreground whitespace-nowrap">
                    {post.date}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge variant={statusVariant(post.status)}>{post.status}</Badge>
                </TableCell>
                <TableCell className="text-center">
                  <button
                    onClick={() => toggleEditorPick(post.id)}
                    title={post.editorPick ? "에디터픽 해제" : editorPickCount >= EDITOR_PICK_MAX ? `최대 ${EDITOR_PICK_MAX}개` : "에디터픽 선정"}
                    className={`transition-colors ${post.editorPick ? "text-primary" : editorPickCount >= EDITOR_PICK_MAX ? "text-border cursor-not-allowed" : "text-border hover:text-primary"}`}
                    disabled={!post.editorPick && editorPickCount >= EDITOR_PICK_MAX}
                  >
                    <Star className="w-4 h-4" strokeWidth={1.5} fill={post.editorPick ? "currentColor" : "none"} />
                  </button>
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    title="삭제"
                    onClick={() => handleDelete(post.id)}
                  >
                    <Trash2 className="w-3.5 h-3.5 text-destructive" strokeWidth={1.5} />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {filteredPosts.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-sm text-sub-foreground py-8">
                  게시글이 없습니다.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Bulk Move UI */}
      {showMoveSelect && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-lg border border-border bg-muted/50">
          <span className="text-sm text-foreground">{selected.length}개 게시글을 이동:</span>
          <Select value={moveCategory} onValueChange={setMoveCategory}>
            <SelectTrigger size="sm" className="w-40">
              <SelectValue placeholder="카테고리 선택" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button size="sm" onClick={handleBulkMove} disabled={!moveCategory}>
            이동하기
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => { setShowMoveSelect(false); setMoveCategory(""); }}
          >
            취소
          </Button>
        </div>
      )}

      {/* Bulk Actions */}
      <BulkActionBar
        selectedCount={selected.length}
        actions={[
          {
            label: "이동",
            onClick: () => setShowMoveSelect((prev) => !prev),
          },
          {
            label: "삭제",
            onClick: handleBulkDelete,
            variant: "destructive",
          },
        ]}
        onClear={() => { setSelected([]); setShowMoveSelect(false); }}
      />

      {/* Pagination */}
      <Pagination currentPage={1} totalPages={3} />
    </div>
  );
}
