"use client";

import { useState } from "react";
import { Pencil, Check } from "lucide-react";
import { Input, Button } from "@/components/ui";

interface TextItem {
  id: string;
  key: string;
  value: string;
  updatedAt: string;
}

interface TextGroup {
  label: string;
  items: TextItem[];
}

const initialGroups: TextGroup[] = [
  {
    label: "GNB",
    items: [
      {
        id: "gnb-1",
        key: "gnb.logo_text",
        value: "GPTers",
        updatedAt: "2026-02-20",
      },
      {
        id: "gnb-2",
        key: "gnb.cta_button",
        value: "스터디 신청",
        updatedAt: "2026-02-18",
      },
      {
        id: "gnb-3",
        key: "gnb.search_placeholder",
        value: "검색어를 입력하세요",
        updatedAt: "2026-02-15",
      },
    ],
  },
  {
    label: "홈",
    items: [
      {
        id: "home-1",
        key: "home.hero_title",
        value: "AI를 활용하는 사람들의 커뮤니티",
        updatedAt: "2026-02-25",
      },
      {
        id: "home-2",
        key: "home.hero_subtitle",
        value: "함께 배우고, 함께 성장하세요",
        updatedAt: "2026-02-25",
      },
      {
        id: "home-3",
        key: "home.cta_primary",
        value: "지금 시작하기",
        updatedAt: "2026-02-20",
      },
      {
        id: "home-4",
        key: "home.popular_title",
        value: "인기 게시글",
        updatedAt: "2026-02-10",
      },
    ],
  },
  {
    label: "피드",
    items: [
      {
        id: "feed-1",
        key: "feed.page_title",
        value: "콘텐츠 피드",
        updatedAt: "2026-02-15",
      },
      {
        id: "feed-2",
        key: "feed.empty_state",
        value: "아직 게시글이 없습니다. 첫 번째 글을 작성해보세요!",
        updatedAt: "2026-02-10",
      },
      {
        id: "feed-3",
        key: "feed.write_cta",
        value: "글쓰기",
        updatedAt: "2026-02-10",
      },
    ],
  },
  {
    label: "스터디 상세",
    items: [
      {
        id: "study-1",
        key: "study.enroll_button",
        value: "수강 신청하기",
        updatedAt: "2026-02-22",
      },
      {
        id: "study-2",
        key: "study.early_bird_label",
        value: "얼리버드 할인",
        updatedAt: "2026-02-20",
      },
      {
        id: "study-3",
        key: "study.curriculum_title",
        value: "커리큘럼",
        updatedAt: "2026-02-18",
      },
      {
        id: "study-4",
        key: "study.review_title",
        value: "수강 후기",
        updatedAt: "2026-02-18",
      },
      {
        id: "study-5",
        key: "study.faq_title",
        value: "자주 묻는 질문",
        updatedAt: "2026-02-15",
      },
    ],
  },
];

export default function AdminTextsPage() {
  const [groups, setGroups] = useState(initialGroups);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const startEdit = (item: TextItem) => {
    setEditingId(item.id);
    setEditValue(item.value);
  };

  const saveEdit = (groupIndex: number, itemId: string) => {
    setGroups((prev) =>
      prev.map((group, gi) =>
        gi === groupIndex
          ? {
              ...group,
              items: group.items.map((item) =>
                item.id === itemId
                  ? { ...item, value: editValue, updatedAt: "2026-02-26" }
                  : item
              ),
            }
          : group
      )
    );
    setEditingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValue("");
  };

  return (
    <div className="space-y-8">
      <h1 className="text-xl font-bold text-foreground">텍스트 관리</h1>

      {groups.map((group, gi) => (
        <section key={group.label} className="space-y-3">
          <h3 className="text-sm font-bold text-foreground">{group.label}</h3>
          <div className="border border-border rounded-lg divide-y divide-border bg-background">
            {group.items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 px-4 py-3"
              >
                <code className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-sm whitespace-nowrap shrink-0 w-44 truncate">
                  {item.key}
                </code>
                <div className="flex-1 min-w-0">
                  {editingId === item.id ? (
                    <Input
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") saveEdit(gi, item.id);
                        if (e.key === "Escape") cancelEdit();
                      }}
                      className="text-sm"
                    />
                  ) : (
                    <span className="text-sm text-foreground truncate block">
                      {item.value}
                    </span>
                  )}
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap shrink-0">
                  {item.updatedAt}
                </span>
                {editingId === item.id ? (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => saveEdit(gi, item.id)}
                  >
                    <Check className="w-3.5 h-3.5" />
                    저장
                  </Button>
                ) : (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => startEdit(item)}
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    수정
                  </Button>
                )}
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
