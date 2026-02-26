"use client";

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Badge, Button, Tabs } from "@/components/ui";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

interface Category {
  id: number;
  order: number;
  name: string;
  slug: string;
  postCount: number;
}

interface Tag {
  id: number;
  name: string;
  slug: string;
  type: "tool" | "difficulty" | "format";
  usageCount: number;
}

const categories: Category[] = [
  { id: 1, order: 1, name: "AI 활용 사례", slug: "ai-usecase", postCount: 312 },
  { id: 2, order: 2, name: "프롬프트 공유", slug: "prompt", postCount: 245 },
  { id: 3, order: 3, name: "도구 리뷰", slug: "tool-review", postCount: 178 },
  { id: 4, order: 4, name: "질문/답변", slug: "qna", postCount: 421 },
  { id: 5, order: 5, name: "스터디 후기", slug: "study-review", postCount: 89 },
  { id: 6, order: 6, name: "자유 게시판", slug: "free", postCount: 156 },
];

const tags: Tag[] = [
  { id: 1, name: "ChatGPT", slug: "chatgpt", type: "tool", usageCount: 534 },
  { id: 2, name: "Claude", slug: "claude", type: "tool", usageCount: 312 },
  { id: 3, name: "Midjourney", slug: "midjourney", type: "tool", usageCount: 189 },
  { id: 4, name: "n8n", slug: "n8n", type: "tool", usageCount: 145 },
  { id: 5, name: "Cursor", slug: "cursor", type: "tool", usageCount: 98 },
  { id: 6, name: "초급", slug: "beginner", type: "difficulty", usageCount: 267 },
  { id: 7, name: "중급", slug: "intermediate", type: "difficulty", usageCount: 198 },
  { id: 8, name: "고급", slug: "advanced", type: "difficulty", usageCount: 76 },
  { id: 9, name: "튜토리얼", slug: "tutorial", type: "format", usageCount: 201 },
  { id: 10, name: "비교 분석", slug: "comparison", type: "format", usageCount: 87 },
  { id: 11, name: "팁/노하우", slug: "tips", type: "format", usageCount: 342 },
  { id: 12, name: "NotebookLM", slug: "notebooklm", type: "tool", usageCount: 64 },
  { id: 13, name: "프로젝트 회고", slug: "retrospective", type: "format", usageCount: 55 },
];

const tagTypeVariant = (type: Tag["type"]) => {
  switch (type) {
    case "tool":
      return "active" as const;
    case "difficulty":
      return "pill" as const;
    case "format":
      return "default" as const;
  }
};

const tagTypeLabel = (type: Tag["type"]) => {
  switch (type) {
    case "tool":
      return "도구";
    case "difficulty":
      return "난이도";
    case "format":
      return "포맷";
  }
};

const sectionTabs = [
  { key: "categories", label: "카테고리" },
  { key: "tags", label: "태그" },
];

export default function AdminTaxonomyPage() {
  const [activeTab, setActiveTab] = useState("categories");

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-foreground">분류 관리</h1>

      <Tabs items={sectionTabs} activeKey={activeTab} onTabChange={setActiveTab} />

      {activeTab === "categories" && (
        <div className="border border-border rounded-lg bg-background overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">순서</TableHead>
                <TableHead>이름</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead className="w-24 text-right">게시글 수</TableHead>
                <TableHead className="w-24" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((cat) => (
                <TableRow key={cat.id}>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {cat.order}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm font-medium text-foreground">
                      {cat.name}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {cat.slug}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="text-sm text-foreground">
                      {cat.postCount}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1 justify-end">
                      <Button variant="ghost" size="sm" title="수정">
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <Button variant="ghost" size="sm" title="삭제">
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {activeTab === "tags" && (
        <div className="border border-border rounded-lg bg-background overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>이름</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead className="w-20">타입</TableHead>
                <TableHead className="w-24 text-right">사용 횟수</TableHead>
                <TableHead className="w-24" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {tags.map((tag) => (
                <TableRow key={tag.id}>
                  <TableCell>
                    <span className="text-sm font-medium text-foreground">
                      {tag.name}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {tag.slug}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={tagTypeVariant(tag.type)}>
                      {tagTypeLabel(tag.type)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="text-sm text-foreground">
                      {tag.usageCount}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1 justify-end">
                      <Button variant="ghost" size="sm" title="수정">
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <Button variant="ghost" size="sm" title="삭제">
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
