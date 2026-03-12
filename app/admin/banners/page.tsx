"use client";

import { useState } from "react";
import { GripVertical, Plus, Trash2 } from "lucide-react";
import { Button, Input, Tabs, Toggle } from "@/components/ui";

interface Banner {
  id: number;
  title: string;
  link: string;
  active: boolean;
}

const initialBanners: Record<string, Banner[]> = {
  hero: [
    { id: 1, title: "21기 스터디 모집 배너", link: "/study", active: true },
    { id: 2, title: "GPTers 소개 배너", link: "/about", active: true },
    { id: 3, title: "뉴스레터 구독 배너", link: "/newsletter", active: true },
    { id: 4, title: "이전 기수 모집 배너", link: "/study/archive", active: false },
  ],
  feed: [
    { id: 5, title: "피드 상단 프로모션 배너", link: "/promo", active: true },
    { id: 6, title: "이벤트 안내 배너", link: "/event", active: true },
    { id: 7, title: "커뮤니티 가이드 배너", link: "/guide", active: false },
  ],
  bottom: [
    { id: 8, title: "하단 CTA 배너", link: "/signup", active: true },
    { id: 9, title: "파트너 소개 배너", link: "/partners", active: true },
  ],
};

const tabItems = [
  { key: "hero", label: "히어로" },
  { key: "feed", label: "피드" },
  { key: "bottom", label: "하단" },
];

export default function AdminBannersPage() {
  const [activeTab, setActiveTab] = useState("hero");
  const [banners, setBanners] = useState(initialBanners);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ title: "", link: "" });
  const [showAddForm, setShowAddForm] = useState(false);
  const [addForm, setAddForm] = useState({ title: "", link: "" });

  const currentBanners = banners[activeTab] ?? [];

  const toggleActive = (id: number) => {
    setBanners((prev) => {
      const updated = { ...prev };
      for (const key of Object.keys(updated)) {
        updated[key] = updated[key].map((b) =>
          b.id === id ? { ...b, active: !b.active } : b
        );
      }
      return updated;
    });
  };

  const startEdit = (banner: Banner) => {
    setEditingId(banner.id);
    setEditForm({ title: banner.title, link: banner.link });
  };

  const saveEdit = () => {
    if (!editingId) return;
    setBanners((prev) => ({
      ...prev,
      [activeTab]: prev[activeTab].map((b) =>
        b.id === editingId ? { ...b, title: editForm.title, link: editForm.link } : b
      ),
    }));
    setEditingId(null);
  };

  const deleteBanner = (id: number) => {
    setBanners((prev) => ({
      ...prev,
      [activeTab]: prev[activeTab].filter((b) => b.id !== id),
    }));
  };

  const handleAdd = () => {
    if (!addForm.title.trim()) return;
    const newBanner: Banner = {
      id: Date.now(),
      title: addForm.title,
      link: addForm.link,
      active: true,
    };
    setBanners((prev) => ({
      ...prev,
      [activeTab]: [...prev[activeTab], newBanner],
    }));
    setAddForm({ title: "", link: "" });
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-foreground">배너 관리</h1>
        <Button onClick={() => { setShowAddForm(true); setEditingId(null); }}>
          <Plus className="w-4 h-4" strokeWidth={1.5} />
          새 배너
        </Button>
      </div>

      <Tabs items={tabItems} activeKey={activeTab} onTabChange={(key) => { setActiveTab(key); setShowAddForm(false); setEditingId(null); }} />

      <div className="border border-border rounded-lg divide-y divide-border">
        {currentBanners.map((banner, i) => (
          <div
            key={banner.id}
            className={`flex items-center gap-4 p-4 ${!banner.active ? "opacity-50" : ""}`}
          >
            <GripVertical className="w-4 h-4 text-sub-foreground cursor-grab shrink-0" strokeWidth={1.5} />
            <span className="text-sm text-sub-foreground w-6 shrink-0">{i + 1}.</span>
            <div className="w-20 h-12 rounded-md bg-muted border border-border shrink-0" />

            {editingId === banner.id ? (
              <div className="flex-1 flex items-center gap-2 flex-wrap">
                <Input
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  className="h-8 text-sm flex-1 min-w-32"
                  placeholder="배너 제목"
                />
                <Input
                  value={editForm.link}
                  onChange={(e) => setEditForm({ ...editForm, link: e.target.value })}
                  className="h-8 text-sm flex-1 min-w-32"
                  placeholder="링크 (/path)"
                />
                <Button size="sm" onClick={saveEdit}>저장</Button>
                <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>취소</Button>
              </div>
            ) : (
              <>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground truncate">{banner.title}</p>
                  <p className="text-sm text-sub-foreground truncate">{banner.link}</p>
                </div>
                <Toggle
                  checked={banner.active}
                  onChange={() => toggleActive(banner.id)}
                  label={banner.active ? "활성" : "비활성"}
                />
                <Button variant="secondary" size="sm" onClick={() => startEdit(banner)}>
                  수정
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  title="삭제"
                  onClick={() => deleteBanner(banner.id)}
                >
                  <Trash2 className="w-3.5 h-3.5 text-destructive" strokeWidth={1.5} />
                </Button>
              </>
            )}
          </div>
        ))}

        {currentBanners.length === 0 && !showAddForm && (
          <div className="p-8 text-center text-sm text-sub-foreground">
            배너가 없습니다.
          </div>
        )}

        {/* Add Form */}
        {showAddForm && (
          <div className="flex items-center gap-4 p-4">
            <GripVertical className="w-4 h-4 text-sub-foreground shrink-0" strokeWidth={1.5} />
            <span className="text-sm text-sub-foreground w-6 shrink-0">
              {currentBanners.length + 1}.
            </span>
            <div className="w-20 h-12 rounded-md bg-muted border border-border shrink-0" />
            <div className="flex-1 flex items-center gap-2 flex-wrap">
              <Input
                value={addForm.title}
                onChange={(e) => setAddForm({ ...addForm, title: e.target.value })}
                className="h-8 text-sm flex-1 min-w-32"
                placeholder="배너 제목"
                autoFocus
              />
              <Input
                value={addForm.link}
                onChange={(e) => setAddForm({ ...addForm, link: e.target.value })}
                className="h-8 text-sm flex-1 min-w-32"
                placeholder="링크 (/path)"
              />
              <Button size="sm" onClick={handleAdd} disabled={!addForm.title.trim()}>
                추가
              </Button>
              <Button size="sm" variant="ghost" onClick={() => { setShowAddForm(false); setAddForm({ title: "", link: "" }); }}>
                취소
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
