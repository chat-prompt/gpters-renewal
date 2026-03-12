"use client";

import { useState } from "react";
import { Plus, Link as LinkIcon, Trash2 } from "lucide-react";
import { Badge, Button, Input } from "@/components/ui";
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
} from "@/components/ui/table";

interface Session {
  id: number;
  name: string;
  type: "AI토크" | "줌" | "오프라인";
  cohort: number;
  date: string;
  time: string;
  isRecurring: boolean;
  zoomUrl: string;
}

const initialSessions: Session[] = [
  { id: 1, name: "21기 OT", type: "줌", cohort: 21, date: "3/16(토)", time: "14:00", isRecurring: false, zoomUrl: "https://zoom.us/j/111" },
  { id: 2, name: "AI토크 - n8n 기초", type: "AI토크", cohort: 21, date: "3/18(화)", time: "19:00", isRecurring: true, zoomUrl: "https://zoom.us/j/222" },
  { id: 3, name: "AI토크 - 워크플로우 설계", type: "AI토크", cohort: 21, date: "3/25(화)", time: "19:00", isRecurring: true, zoomUrl: "https://zoom.us/j/222" },
  { id: 4, name: "네트워킹 모임", type: "오프라인", cohort: 21, date: "4/5(토)", time: "14:00", isRecurring: false, zoomUrl: "" },
  { id: 5, name: "AI토크 - 고급 패턴", type: "AI토크", cohort: 21, date: "4/1(화)", time: "19:00", isRecurring: true, zoomUrl: "https://zoom.us/j/222" },
  { id: 6, name: "AI토크 - 프로젝트 리뷰", type: "AI토크", cohort: 21, date: "4/8(화)", time: "19:00", isRecurring: true, zoomUrl: "https://zoom.us/j/222" },
  { id: 7, name: "베스트 발표회", type: "줌", cohort: 21, date: "4/12(토)", time: "14:00", isRecurring: false, zoomUrl: "https://zoom.us/j/333" },
  { id: 8, name: "22기 OT", type: "줌", cohort: 22, date: "4/19(토)", time: "14:00", isRecurring: false, zoomUrl: "https://zoom.us/j/444" },
];

const typeVariant = (type: Session["type"]) => {
  switch (type) {
    case "AI토크": return "active" as const;
    case "줌": return "default" as const;
    case "오프라인": return "pill" as const;
  }
};

const cohortOptions = [21, 22, 23];

export default function AdminSessionsPage() {
  const [selectedCohort, setSelectedCohort] = useState("21");
  const [sessionList, setSessionList] = useState<Session[]>(initialSessions);
  const [showAddForm, setShowAddForm] = useState(false);
  const [addForm, setAddForm] = useState<{
    name: string;
    type: Session["type"];
    date: string;
    time: string;
  }>({ name: "", type: "줌", date: "", time: "" });

  const filtered = sessionList.filter((s) => s.cohort === Number(selectedCohort));

  const deleteSession = (id: number) =>
    setSessionList((prev) => prev.filter((s) => s.id !== id));

  const handleAdd = () => {
    if (!addForm.name.trim()) return;
    const newSession: Session = {
      id: Date.now(),
      name: addForm.name,
      type: addForm.type,
      cohort: Number(selectedCohort),
      date: addForm.date,
      time: addForm.time,
      isRecurring: false,
      zoomUrl: "",
    };
    setSessionList((prev) => [...prev, newSession]);
    setAddForm({ name: "", type: "줌", date: "", time: "" });
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-foreground">세션 관리</h1>
        <Button size="sm" onClick={() => setShowAddForm(true)}>
          <Plus className="w-3.5 h-3.5" strokeWidth={1.5} />
          세션 추가
        </Button>
      </div>

      <div>
        <Select value={selectedCohort} onValueChange={(v) => { setSelectedCohort(v); setShowAddForm(false); }}>
          <SelectTrigger size="sm" className="w-auto">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {cohortOptions.map((c) => (
              <SelectItem key={c} value={String(c)}>{c}기</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="border border-border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>세션명</TableHead>
              <TableHead className="w-20">타입</TableHead>
              <TableHead className="w-24">날짜</TableHead>
              <TableHead className="w-16">시간</TableHead>
              <TableHead className="w-16 text-center">반복</TableHead>
              <TableHead className="w-20">줌 링크</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((session) => (
              <TableRow key={session.id}>
                <TableCell>
                  <span className="text-sm font-medium text-foreground">{session.name}</span>
                </TableCell>
                <TableCell>
                  <Badge variant={typeVariant(session.type)}>{session.type}</Badge>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-sub-foreground whitespace-nowrap">{session.date}</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-sub-foreground">{session.time}</span>
                </TableCell>
                <TableCell className="text-center">
                  <span className="text-sm text-sub-foreground">{session.isRecurring ? "O" : "-"}</span>
                </TableCell>
                <TableCell>
                  {session.zoomUrl ? (
                    <a
                      href={session.zoomUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-primary hover:text-primary/80 transition-colors"
                    >
                      <LinkIcon className="w-3.5 h-3.5" strokeWidth={1.5} />
                    </a>
                  ) : (
                    <span className="text-sm text-sub-foreground">-</span>
                  )}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    title="삭제"
                    onClick={() => deleteSession(session.id)}
                  >
                    <Trash2 className="w-3.5 h-3.5 text-destructive" strokeWidth={1.5} />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && !showAddForm && (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-sm text-sub-foreground py-8">
                  세션이 없습니다.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Add Form */}
        {showAddForm && (
          <div className="flex items-center gap-2 p-4 flex-wrap border-t border-border">
            <Input
              value={addForm.name}
              onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
              placeholder="세션명"
              className="h-8 text-sm flex-1 min-w-32"
              autoFocus
            />
            <Select value={addForm.type} onValueChange={(v) => setAddForm({ ...addForm, type: v as Session["type"] })}>
              <SelectTrigger size="sm" className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="줌">줌</SelectItem>
                <SelectItem value="AI토크">AI토크</SelectItem>
                <SelectItem value="오프라인">오프라인</SelectItem>
              </SelectContent>
            </Select>
            <Input
              value={addForm.date}
              onChange={(e) => setAddForm({ ...addForm, date: e.target.value })}
              placeholder="날짜 (3/16(토))"
              className="h-8 text-sm w-28"
            />
            <Input
              value={addForm.time}
              onChange={(e) => setAddForm({ ...addForm, time: e.target.value })}
              placeholder="시간 (19:00)"
              className="h-8 text-sm w-24"
            />
            <Button size="sm" onClick={handleAdd} disabled={!addForm.name.trim()}>추가</Button>
            <Button size="sm" variant="ghost" onClick={() => { setShowAddForm(false); setAddForm({ name: "", type: "줌", date: "", time: "" }); }}>취소</Button>
          </div>
        )}
      </div>
    </div>
  );
}
