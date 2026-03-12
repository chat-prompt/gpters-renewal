"use client";

import { useState } from "react";
import { Button, Input, Textarea } from "@/components/ui";

interface WhiteboardData {
  imageUrl: string;
  title: string;
  body: string;
  ctaText: string;
  ctaHref: string;
}

const initialData: WhiteboardData = {
  imageUrl: "",
  title: "AI로 일하는 법, GPTers에서 시작하세요",
  body: "12,000명의 AI 실무자 커뮤니티에서 최신 AI 활용법을 배우고, 함께 성장하세요. 초보자도 환영합니다.",
  ctaText: "커뮤니티 둘러보기",
  ctaHref: "/explore/feed",
};

export default function AdminWhiteboardPage() {
  const [data, setData] = useState<WhiteboardData>(initialData);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<WhiteboardData>(initialData);

  const startEdit = () => {
    setForm(data);
    setEditing(true);
  };

  const save = () => {
    setData(form);
    setEditing(false);
  };

  const cancel = () => {
    setEditing(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-foreground">화이트보드 관리</h1>
        {!editing && (
          <Button variant="secondary" onClick={startEdit}>
            수정
          </Button>
        )}
      </div>

      {/* Preview */}
      <div>
        <p className="text-sm font-medium text-sub-foreground mb-3">미리보기</p>
        <div className="border border-border rounded-lg overflow-hidden">
          {data.imageUrl ? (
            <img
              src={data.imageUrl}
              alt="화이트보드 이미지"
              className="w-full h-48 object-cover"
            />
          ) : (
            <div className="w-full h-48 bg-muted flex items-center justify-center">
              <span className="text-sm text-sub-foreground">이미지 없음</span>
            </div>
          )}
          <div className="p-6 space-y-3">
            <p className="text-lg font-semibold text-foreground">{data.title}</p>
            <p className="text-sm text-sub-foreground leading-relaxed">{data.body}</p>
            <div>
              <span className="inline-block px-4 py-2 text-sm font-medium text-primary border border-primary rounded-md">
                {data.ctaText}
              </span>
              <p className="text-sm text-sub-foreground mt-1">{data.ctaHref}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Form */}
      {editing && (
        <div className="border border-border rounded-lg p-6 space-y-4">
          <p className="text-sm font-medium text-foreground">편집</p>

          <div className="space-y-1.5">
            <label className="text-sm text-sub-foreground">이미지 URL</label>
            <Input
              value={form.imageUrl}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm text-sub-foreground">제목</label>
            <Input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="제목을 입력하세요"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm text-sub-foreground">본문</label>
            <Textarea
              value={form.body}
              onChange={(e) => setForm({ ...form, body: e.target.value })}
              placeholder="본문을 입력하세요"
              rows={3}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm text-sub-foreground">CTA 텍스트</label>
            <Input
              value={form.ctaText}
              onChange={(e) => setForm({ ...form, ctaText: e.target.value })}
              placeholder="버튼 텍스트"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm text-sub-foreground">CTA 링크</label>
            <Input
              value={form.ctaHref}
              onChange={(e) => setForm({ ...form, ctaHref: e.target.value })}
              placeholder="/path"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <Button onClick={save}>저장</Button>
            <Button variant="ghost" onClick={cancel}>취소</Button>
          </div>
        </div>
      )}
    </div>
  );
}
