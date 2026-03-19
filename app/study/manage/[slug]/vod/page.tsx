"use client";

import { useState } from "react";
import { Plus, Video } from "lucide-react";
import { Breadcrumb, Button, Input, Toggle } from "@/components/ui";
import { Accordion } from "@/components/ui/accordion";

interface VodItem {
  id: string;
  title: string;
  url: string;
  isPublic: boolean;
  order: number;
}

interface WeekVods {
  week: number;
  vods: VodItem[];
}

const initialData: WeekVods[] = [
  {
    week: 1,
    vods: [
      { id: "v1", title: "AI 자동화 입문 - AI토크", url: "https://youtube.com/watch?v=abc1", isPublic: true, order: 1 },
      { id: "v2", title: "1주차 줌 세션 - 발표", url: "https://youtube.com/watch?v=abc2", isPublic: true, order: 2 },
    ],
  },
  {
    week: 2,
    vods: [
      { id: "v3", title: "실전 워크플로우 설계 - AI토크", url: "https://youtube.com/watch?v=abc3", isPublic: true, order: 1 },
      { id: "v4", title: "2주차 줌 세션 - 발표", url: "https://youtube.com/watch?v=abc4", isPublic: false, order: 2 },
    ],
  },
  {
    week: 3,
    vods: [
      { id: "v5", title: "고급 자동화 패턴 - AI토크", url: "https://youtube.com/watch?v=abc5", isPublic: false, order: 1 },
      { id: "v6", title: "3주차 줌 세션 - 발표", url: "", isPublic: false, order: 2 },
    ],
  },
  {
    week: 4,
    vods: [
      { id: "v7", title: "프로젝트 완성 - AI토크", url: "", isPublic: false, order: 1 },
      { id: "v8", title: "베스트 발표회", url: "", isPublic: false, order: 2 },
    ],
  },
];

export default function VodManagePage() {
  const [data, setData] = useState(initialData);

  const totalVods = data.reduce((sum, w) => sum + w.vods.length, 0);

  const togglePublic = (weekIdx: number, vodId: string) => {
    setData((prev) =>
      prev.map((w, i) =>
        i === weekIdx
          ? {
              ...w,
              vods: w.vods.map((v) =>
                v.id === vodId ? { ...v, isPublic: !v.isPublic } : v
              ),
            }
          : w
      )
    );
  };

  const updateVodField = (weekIdx: number, vodId: string, field: "title" | "url", value: string) => {
    setData((prev) =>
      prev.map((w, i) =>
        i === weekIdx
          ? {
              ...w,
              vods: w.vods.map((v) =>
                v.id === vodId ? { ...v, [field]: value } : v
              ),
            }
          : w
      )
    );
  };

  const accordionItems = data.map((weekData) => {
    const weekIdx = data.findIndex((w) => w.week === weekData.week);
    return {
      key: `week-${weekData.week}`,
      title: `${weekData.week}주차 (${weekData.vods.length}개)`,
      children: (
        <div className="space-y-3">
          {weekData.vods.map((vod) => (
            <div
              key={vod.id}
              className="flex items-center gap-3 rounded-lg border border-border p-3"
            >
              <span className="text-xs text-sub-foreground w-6 text-center shrink-0">
                {vod.order}
              </span>
              <Video className="w-4 h-4 text-sub-foreground shrink-0" />
              <div className="flex-1 min-w-0 grid grid-cols-1 md:grid-cols-2 gap-2">
                <Input
                  value={vod.title}
                  onChange={(e) => updateVodField(weekIdx, vod.id, "title", e.target.value)}
                  placeholder="VOD 제목"
                  className="text-sm"
                />
                <Input
                  value={vod.url}
                  onChange={(e) => updateVodField(weekIdx, vod.id, "url", e.target.value)}
                  placeholder="YouTube 링크"
                  className="text-sm"
                />
              </div>
              <Toggle
                checked={vod.isPublic}
                onChange={() => togglePublic(weekIdx, vod.id)}
                label={vod.isPublic ? "공개" : "비공개"}
              />
            </div>
          ))}
          <Button
            variant="secondary"
            size="sm"
            onClick={() => alert("VOD가 추가되었습니다.")}
          >
            <Plus className="w-3.5 h-3.5" />
            VOD 추가
          </Button>
        </div>
      ),
    };
  });

  return (
    <div className="mx-auto max-w-[1080px] px-4 py-8 space-y-6">
      <Breadcrumb
        items={[
          { label: "스터디 관리", href: "/study/manage/21-ai-automation" },
          { label: "VOD 관리" },
        ]}
      />

      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-foreground">VOD 관리</h1>
        <span className="text-sm text-sub-foreground">
          총 {totalVods}개
        </span>
      </div>

      <Accordion items={accordionItems} defaultOpen={["week-1", "week-2"]} />
    </div>
  );
}
