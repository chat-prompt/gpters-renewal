"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Input, Button, Badge, Pagination } from "@/components/ui";
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
import { Textarea } from "@/components/ui";
import { cn } from "@/lib/utils";

interface AdminEvent {
  id: number;
  title: string;
  category: string;
  type: "online" | "offline";
  host: string;
  hostType: "official" | "user";
  eventDate: string;
  submittedAt: string;
  status: "pending_review" | "published" | "rejected" | "closed" | "completed" | "cancelled";
  reviewNote?: string;
}

const initialEvents: AdminEvent[] = [
  { id: 1, title: "AI 트렌드 2026 토크쇼", category: "토크", type: "online", host: "GPTers", hostType: "official", eventDate: "2026-03-20", submittedAt: "2026-03-01", status: "published" },
  { id: 2, title: "프롬프트 엔지니어링 워크숍", category: "워크숍", type: "offline", host: "김민수", hostType: "user", eventDate: "2026-03-25", submittedAt: "2026-03-05", status: "pending_review" },
  { id: 3, title: "AI 창업 네트워킹 데이", category: "네트워킹", type: "offline", host: "GPTers", hostType: "official", eventDate: "2026-03-15", submittedAt: "2026-02-28", status: "completed" },
  { id: 4, title: "Claude 활용법 웨비나", category: "웨비나", type: "online", host: "이영희", hostType: "user", eventDate: "2026-03-22", submittedAt: "2026-03-08", status: "pending_review" },
  { id: 5, title: "GPTers 정기 모임 3월", category: "모임", type: "offline", host: "GPTers", hostType: "official", eventDate: "2026-03-18", submittedAt: "2026-03-02", status: "closed" },
  { id: 6, title: "바이브 코딩 라이브 세션", category: "웨비나", type: "online", host: "박철수", hostType: "user", eventDate: "2026-04-01", submittedAt: "2026-03-10", status: "pending_review" },
  { id: 7, title: "AI 디자인 툴 체험 워크숍", category: "워크숍", type: "offline", host: "한서연", hostType: "user", eventDate: "2026-03-12", submittedAt: "2026-02-25", status: "rejected", reviewNote: "장소 정보 미기재" },
  { id: 8, title: "n8n 자동화 핸즈온", category: "워크숍", type: "online", host: "정우성", hostType: "user", eventDate: "2026-04-05", submittedAt: "2026-03-11", status: "published" },
  { id: 9, title: "AI 비즈니스 밋업", category: "네트워킹", type: "offline", host: "GPTers", hostType: "official", eventDate: "2026-03-10", submittedAt: "2026-02-20", status: "completed" },
  { id: 10, title: "Cursor IDE 소개 토크", category: "토크", type: "online", host: "김영호", hostType: "user", eventDate: "2026-03-28", submittedAt: "2026-03-09", status: "published" },
  { id: 11, title: "LLM 파인튜닝 세미나", category: "기타", type: "online", host: "최지원", hostType: "user", eventDate: "2026-04-10", submittedAt: "2026-03-12", status: "pending_review" },
  { id: 12, title: "GPTers 송년회", category: "모임", type: "offline", host: "GPTers", hostType: "official", eventDate: "2026-02-28", submittedAt: "2026-02-10", status: "cancelled" },
];

const categories = ["토크", "모임", "웨비나", "네트워킹", "워크숍", "기타"];

type TabKey = "all" | "pending_review" | "published" | "rejected" | "closed" | "completed";

const tabs: { key: TabKey; label: string }[] = [
  { key: "all", label: "전체" },
  { key: "pending_review", label: "심사대기" },
  { key: "published", label: "공개" },
  { key: "rejected", label: "반려" },
  { key: "closed", label: "마감" },
  { key: "completed", label: "완료" },
];

const statusLabel: Record<AdminEvent["status"], string> = {
  pending_review: "심사대기",
  published: "공개",
  rejected: "반려",
  closed: "마감",
  completed: "완료",
  cancelled: "취소",
};

const statusVariant = (status: AdminEvent["status"]) => {
  if (status === "pending_review") return "active" as const;
  if (status === "rejected" || status === "cancelled") return "completed" as const;
  return "default" as const;
};

export default function AdminEventsPage() {
  const [events, setEvents] = useState<AdminEvent[]>(initialEvents);
  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [rejectingId, setRejectingId] = useState<number | null>(null);
  const [rejectNote, setRejectNote] = useState("");

  const pendingCount = events.filter((e) => e.status === "pending_review").length;

  const filteredEvents = events.filter((e) => {
    if (activeTab !== "all" && e.status !== activeTab) return false;
    if (categoryFilter !== "all" && e.category !== categoryFilter) return false;
    if (searchQuery && !e.title.includes(searchQuery) && !e.host.includes(searchQuery)) return false;
    return true;
  });

  const handleApprove = (id: number) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status: "published" as const } : e))
    );
  };

  const handleReject = (id: number) => {
    setEvents((prev) =>
      prev.map((e) =>
        e.id === id ? { ...e, status: "rejected" as const, reviewNote: rejectNote } : e
      )
    );
    setRejectingId(null);
    setRejectNote("");
  };

  const handleDelete = (id: number) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
    if (rejectingId === id) {
      setRejectingId(null);
      setRejectNote("");
    }
  };

  const handleUnpublish = (id: number) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status: "closed" as const } : e))
    );
  };

  const handleReopen = (id: number) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status: "published" as const } : e))
    );
  };

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-foreground">이벤트 관리</h1>

      {/* Tab Filter */}
      <div className="flex gap-1 border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              "px-3 py-2 text-sm transition-colors border-b-2 -mb-px",
              activeTab === tab.key
                ? "border-primary text-foreground font-medium"
                : "border-transparent text-sub-foreground hover:text-foreground"
            )}
          >
            {tab.label}
            {tab.key === "pending_review" && pendingCount > 0 && (
              <span className="ml-1.5 px-1.5 py-0.5 text-sm bg-primary/10 text-primary rounded-sm">
                {pendingCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        <Input
          placeholder="제목, 개설자 검색..."
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
      </div>

      {/* Table */}
      <div className="border border-border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-28">제출일</TableHead>
              <TableHead>제목</TableHead>
              <TableHead className="w-24">카테고리</TableHead>
              <TableHead className="w-20">유형</TableHead>
              <TableHead className="w-32">개설자</TableHead>
              <TableHead className="w-28">이벤트일시</TableHead>
              <TableHead className="w-20">상태</TableHead>
              <TableHead className="w-40">액션</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEvents.map((event) => (
              <>
                <TableRow key={event.id}>
                  <TableCell>
                    <span className="text-sm text-sub-foreground whitespace-nowrap">
                      {event.submittedAt}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-foreground truncate block max-w-xs">
                      {event.title}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge>{event.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-sub-foreground whitespace-nowrap">
                      {event.type === "online" ? "온라인" : "오프라인"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-sub-foreground whitespace-nowrap">
                      {event.hostType === "official" ? `${event.host} (공식)` : event.host}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-sub-foreground whitespace-nowrap">
                      {event.eventDate}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusVariant(event.status)}>
                      {statusLabel[event.status]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {event.status === "pending_review" && (
                        <>
                          <Button size="sm" onClick={() => handleApprove(event.id)}>
                            승인
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              setRejectingId(rejectingId === event.id ? null : event.id)
                            }
                          >
                            반려
                          </Button>
                        </>
                      )}
                      {event.status === "published" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUnpublish(event.id)}
                        >
                          비공개
                        </Button>
                      )}
                      {event.status === "closed" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleReopen(event.id)}
                        >
                          재오픈
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        title="삭제"
                        onClick={() => handleDelete(event.id)}
                      >
                        <Trash2 className="w-3.5 h-3.5 text-destructive" strokeWidth={1.5} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>

                {/* Rejection reason inline */}
                {rejectingId === event.id && (
                  <TableRow key={`reject-${event.id}`}>
                    <TableCell colSpan={8}>
                      <div className="flex items-start gap-2 py-1">
                        <Textarea
                          placeholder="반려 사유를 입력하세요..."
                          value={rejectNote}
                          onChange={(e) => setRejectNote(e.target.value)}
                          className="flex-1 min-h-[60px]"
                        />
                        <div className="flex flex-col gap-1">
                          <Button
                            size="sm"
                            onClick={() => handleReject(event.id)}
                            disabled={!rejectNote.trim()}
                          >
                            반려 확정
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setRejectingId(null);
                              setRejectNote("");
                            }}
                          >
                            취소
                          </Button>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </>
            ))}
            {filteredEvents.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-sm text-sub-foreground py-8">
                  이벤트가 없습니다.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <Pagination currentPage={1} totalPages={3} />
    </div>
  );
}
