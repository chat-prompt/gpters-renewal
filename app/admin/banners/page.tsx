"use client";

import { useState } from "react";
import { GripVertical, Plus } from "lucide-react";
import { Button, Tabs, Toggle } from "@/components/ui";

interface Banner {
  id: number;
  title: string;
  link: string;
  active: boolean;
}

const initialBanners: Record<string, Banner[]> = {
  hero: [
    {
      id: 1,
      title: "21기 스터디 모집 배너",
      link: "/study",
      active: true,
    },
    {
      id: 2,
      title: "GPTers 소개 배너",
      link: "/about",
      active: true,
    },
    {
      id: 3,
      title: "뉴스레터 구독 배너",
      link: "/newsletter",
      active: true,
    },
    {
      id: 4,
      title: "이전 기수 모집 배너",
      link: "/study/archive",
      active: false,
    },
  ],
  feed: [
    {
      id: 5,
      title: "피드 상단 프로모션 배너",
      link: "/promo",
      active: true,
    },
    {
      id: 6,
      title: "이벤트 안내 배너",
      link: "/event",
      active: true,
    },
    {
      id: 7,
      title: "커뮤니티 가이드 배너",
      link: "/guide",
      active: false,
    },
  ],
  bottom: [
    {
      id: 8,
      title: "하단 CTA 배너",
      link: "/signup",
      active: true,
    },
    {
      id: 9,
      title: "파트너 소개 배너",
      link: "/partners",
      active: true,
    },
  ],
};

const tabItems = [
  { key: "hero", label: "히어로", count: 4 },
  { key: "feed", label: "피드", count: 3 },
  { key: "bottom", label: "하단", count: 2 },
];

export default function AdminBannersPage() {
  const [activeTab, setActiveTab] = useState("hero");
  const [banners, setBanners] = useState(initialBanners);

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

  const currentBanners = banners[activeTab] ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-foreground">배너 관리</h1>
        <Button>
          <Plus className="w-4 h-4" />
          새 배너
        </Button>
      </div>

      <Tabs items={tabItems} activeKey={activeTab} onTabChange={setActiveTab} />

      <p className="text-sm text-muted-foreground">
        드래그하여 순서를 변경하세요
      </p>

      <div className="border border-border rounded-lg divide-y divide-border bg-background">
        {currentBanners.map((banner, i) => (
          <div
            key={banner.id}
            className={`flex items-center gap-4 p-4 ${
              !banner.active ? "opacity-50" : ""
            }`}
          >
            <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab shrink-0" />
            <span className="text-sm text-muted-foreground w-6 shrink-0">
              {i + 1}.
            </span>
            <div className="w-20 h-12 rounded-md bg-muted border border-border shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground truncate">{banner.title}</p>
              <p className="text-xs text-muted-foreground truncate">
                {banner.link}
              </p>
            </div>
            <Toggle
              checked={banner.active}
              onChange={() => toggleActive(banner.id)}
              label={banner.active ? "활성" : "비활성"}
            />
            <Button variant="secondary" size="sm">
              수정
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
