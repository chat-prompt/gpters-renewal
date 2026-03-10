"use client";

import { useState } from "react";
import { Plus, GripVertical } from "lucide-react";
import { Breadcrumb, Button, Tabs, Toggle } from "@/components/ui";

interface Notice {
  id: string;
  title: string;
  preview: string;
  order: number;
  isHidden: boolean;
}

const mockNotices: Record<string, Notice[]> = {
  member: [
    { id: "n1", title: "[필독] 21기 스터디 시작 안내", preview: "안녕하세요! 21기 AI 자동화 스터디에 오신 것을 환영합니다. OT는 3/16(토) 오후 2시에 진행됩니다.", order: 1, isHidden: false },
    { id: "n2", title: "[모집/홍보] 22기 스터디 얼리버드 오픈", preview: "22기 스터디 얼리버드가 오픈되었습니다. 수강생 추천 시 추가 할인 혜택이 있습니다.", order: 2, isHidden: false },
    { id: "n3", title: "[필독] 과제 제출 안내", preview: "사례 게시글 작성이 과제입니다. 매주 1개 이상 작성하면 다른 스터디 다시보기를 볼 수 있습니다.", order: 3, isHidden: false },
    { id: "n4", title: "[안내] 찐친챌린지 시작", preview: "2주차부터 찐친챌린지가 시작됩니다. 카카오톡 네트워킹방에서 인증해주세요.", order: 4, isHidden: true },
  ],
  leader: [
    { id: "n5", title: "[스터디준비] 상세페이지 작성 가이드", preview: "스터디 상세페이지 작성 시 참고할 가이드입니다. 커리큘럼, 소개, FAQ를 포함해주세요.", order: 1, isHidden: false },
    { id: "n6", title: "[진행가이드] 주차별 운영 체크리스트", preview: "매주 확인할 운영 체크리스트입니다. 과제 리마인드, VOD 업로드, 베스트발표자 선정 등.", order: 2, isHidden: false },
    { id: "n7", title: "[다시보기] VOD 업로드 방법", preview: "줌 세션 녹화본을 YouTube에 업로드하고 링크를 등록하는 방법을 안내합니다.", order: 3, isHidden: false },
  ],
  session: [
    { id: "n8", title: "[공통세션] OT - 3/16(토) 14:00", preview: "21기 오리엔테이션입니다. 줌 링크: https://zoom.us/j/123456", order: 1, isHidden: false },
    { id: "n9", title: "[공통세션] AI토크 - 매주 화 19:00", preview: "매주 화요일 저녁 7시에 AI토크가 진행됩니다. 발표자 중심의 세션입니다.", order: 2, isHidden: false },
    { id: "n10", title: "[공통세션] 네트워킹 - 4/5(토) 14:00", preview: "21기 수강생 전체 네트워킹 시간입니다. 오프라인 참석을 권장합니다.", order: 3, isHidden: false },
    { id: "n11", title: "[공통세션] 베스트 발표회 - 4/12(토) 14:00", preview: "21기 마지막 세션입니다. 각 스터디별 베스트 발표자가 발표합니다.", order: 4, isHidden: false },
  ],
};

const tabItems = [
  { key: "member", label: "멤버 공지", count: mockNotices.member.length },
  { key: "leader", label: "스터디장 공지", count: mockNotices.leader.length },
  { key: "session", label: "세션 공지", count: mockNotices.session.length },
];

export default function NoticesManagePage() {
  const [activeTab, setActiveTab] = useState("member");
  const [notices, setNotices] = useState(mockNotices);

  const toggleHidden = (id: string) => {
    setNotices((prev) => {
      const updated = { ...prev };
      for (const key of Object.keys(updated)) {
        updated[key] = updated[key].map((n) =>
          n.id === id ? { ...n, isHidden: !n.isHidden } : n
        );
      }
      return updated;
    });
  };

  const currentNotices = notices[activeTab] || [];

  return (
    <div className="mx-auto max-w-[1080px] px-4 py-8 space-y-6">
      <Breadcrumb
        items={[
          { label: "스터디 관리", href: "/study/manage/21-ai-automation" },
          { label: "공지 관리" },
        ]}
      />

      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-foreground">공지 관리</h1>
        <Button size="sm">
          <Plus className="w-3.5 h-3.5" />
          공지 추가
        </Button>
      </div>

      <Tabs items={tabItems} activeKey={activeTab} onTabChange={setActiveTab} />

      <div className="space-y-3">
        {currentNotices.map((notice) => (
          <div
            key={notice.id}
            className="rounded-lg border border-border p-4 flex items-start gap-3"
          >
            <GripVertical className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5 cursor-grab" />
            <span className="text-xs text-muted-foreground w-6 text-center shrink-0 mt-0.5">
              {notice.order}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">
                {notice.title}
              </p>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                {notice.preview}
              </p>
            </div>
            <Toggle
              checked={!notice.isHidden}
              onChange={() => toggleHidden(notice.id)}
              label={notice.isHidden ? "숨김" : "노출"}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
