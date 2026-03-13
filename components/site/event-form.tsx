"use client";

import { useState } from "react";
import Link from "next/link";
import { ImageIcon, Plus, X } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { AgendaInput, type AgendaItem } from "@/components/site/agenda-input";

const EVENT_CATEGORIES = ["토크", "모임", "웨비나", "네트워킹", "워크숍", "기타"];

const SUGGESTED_TAGS = [
  "ChatGPT",
  "Claude",
  "Gemini",
  "AI",
  "자동화",
  "프롬프트",
  "비즈니스",
  "네트워킹",
  "스터디",
  "입문",
];

interface SpeakerItem {
  name: string;
  role: string;
}

export interface EventFormData {
  title: string;
  category: string;
  eventType: "online" | "offline";
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  capacity: number;
  pricingType: "free" | "paid";
  price: number;
  shortDescription: string;
  body: string;
  coverImage: string | null;
  agenda: AgendaItem[];
  speakers: SpeakerItem[];
  tags: string[];
}

interface EventFormProps {
  mode: "create" | "edit";
  initialData?: EventFormData;
  rejectionNote?: string;
}

export function EventForm({ mode, initialData, rejectionNote }: EventFormProps) {
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [category, setCategory] = useState(initialData?.category ?? "");
  const [eventType, setEventType] = useState<"online" | "offline">(
    initialData?.eventType ?? "offline"
  );
  const [date, setDate] = useState(initialData?.date ?? "");
  const [startTime, setStartTime] = useState(initialData?.startTime ?? "");
  const [endTime, setEndTime] = useState(initialData?.endTime ?? "");
  const [location, setLocation] = useState(initialData?.location ?? "");
  const [capacity, setCapacity] = useState(initialData?.capacity ?? 30);
  const [pricingType, setPricingType] = useState<"free" | "paid">(
    initialData?.pricingType ?? "free"
  );
  const [price, setPrice] = useState(initialData?.price ?? 0);
  const [shortDescription, setShortDescription] = useState(
    initialData?.shortDescription ?? ""
  );
  const [body, setBody] = useState(initialData?.body ?? "");
  const [agenda, setAgenda] = useState<AgendaItem[]>(
    initialData?.agenda ?? []
  );
  const [speakers, setSpeakers] = useState<SpeakerItem[]>(
    initialData?.speakers ?? []
  );
  const [selectedTags, setSelectedTags] = useState<string[]>(
    initialData?.tags ?? []
  );

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const addSpeaker = () => {
    setSpeakers([...speakers, { name: "", role: "" }]);
  };

  const removeSpeaker = (index: number) => {
    setSpeakers(speakers.filter((_, i) => i !== index));
  };

  const updateSpeaker = (
    index: number,
    field: keyof SpeakerItem,
    value: string
  ) => {
    const updated = speakers.map((s, i) =>
      i === index ? { ...s, [field]: value } : s
    );
    setSpeakers(updated);
  };

  return (
    <div className="space-y-6">
      {/* Rejection Note */}
      {rejectionNote && (
        <div className="p-4 rounded-lg border border-primary/30 bg-accent text-sm text-foreground">
          <p className="font-medium mb-1">반려 사유</p>
          <p className="text-secondary-foreground">{rejectionNote}</p>
        </div>
      )}

      {/* Cover Image */}
      <div>
        <p className="text-sm font-medium text-foreground mb-2">
          커버 이미지 (선택)
        </p>
        <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
          <ImageIcon
            className="w-8 h-8 mx-auto text-sub-foreground mb-2"
            strokeWidth={1.5}
          />
          <p className="text-sm text-sub-foreground">
            이미지를 드래그하거나 클릭하여 업로드
          </p>
          <p className="text-sm text-sub-foreground mt-1">
            권장 크기: 1200x630px
          </p>
        </div>
      </div>

      {/* Title */}
      <div>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="이벤트 제목을 입력하세요"
          className="w-full text-2xl font-semibold bg-background text-foreground placeholder:text-sub-foreground focus:outline-none border-b border-border pb-3"
        />
      </div>

      {/* Category */}
      <div>
        <p className="text-sm font-medium text-foreground mb-2">
          카테고리 (필수)
        </p>
        <div className="flex gap-2 flex-wrap">
          {EVENT_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 text-sm rounded-md border ${
                category === cat
                  ? "border-primary bg-primary/10 text-primary font-medium"
                  : "border-border text-sub-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Event Type */}
      <div>
        <p className="text-sm font-medium text-foreground mb-2">유형 (필수)</p>
        <div className="flex gap-2">
          {(["online", "offline"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setEventType(t)}
              className={`px-3 py-1.5 text-sm rounded-md border ${
                eventType === t
                  ? "border-primary bg-primary/10 text-primary font-medium"
                  : "border-border text-sub-foreground"
              }`}
            >
              {t === "online" ? "온라인" : "오프라인"}
            </button>
          ))}
        </div>
      </div>

      {/* Date & Time */}
      <div>
        <p className="text-sm font-medium text-foreground mb-2">
          날짜 및 시간 (필수)
        </p>
        <div className="flex flex-wrap gap-3">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="px-3 py-2 text-sm border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <div className="flex items-center gap-2">
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="px-3 py-2 text-sm border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <span className="text-sm text-sub-foreground">~</span>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="px-3 py-2 text-sm border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>
      </div>

      {/* Location */}
      <div>
        <p className="text-sm font-medium text-foreground mb-2">장소 (필수)</p>
        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder={
            eventType === "online"
              ? "Zoom 링크를 입력하세요"
              : "장소를 입력하세요"
          }
          className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background text-foreground placeholder:text-sub-foreground focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      {/* Capacity */}
      <div>
        <p className="text-sm font-medium text-foreground mb-2">정원 (필수)</p>
        <input
          type="number"
          min={2}
          max={1000}
          value={capacity}
          onChange={(e) => setCapacity(Number(e.target.value))}
          className="w-32 px-3 py-2 text-sm border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
        />
        <span className="ml-2 text-sm text-sub-foreground">명</span>
      </div>

      {/* Pricing */}
      <div>
        <p className="text-sm font-medium text-foreground mb-2">가격 (필수)</p>
        <div className="flex gap-2 mb-3">
          {(["free", "paid"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setPricingType(t)}
              className={`px-3 py-1.5 text-sm rounded-md border ${
                pricingType === t
                  ? "border-primary bg-primary/10 text-primary font-medium"
                  : "border-border text-sub-foreground"
              }`}
            >
              {t === "free" ? "무료" : "유료"}
            </button>
          ))}
        </div>
        {pricingType === "paid" && (
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={0}
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              placeholder="0"
              className="w-40 px-3 py-2 text-sm border border-border rounded-md bg-background text-foreground placeholder:text-sub-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <span className="text-sm text-sub-foreground">원</span>
          </div>
        )}
      </div>

      {/* Short Description */}
      <div>
        <p className="text-sm font-medium text-foreground mb-2">
          짧은 소개 (필수)
        </p>
        <Textarea
          value={shortDescription}
          onChange={(e) =>
            setShortDescription(e.target.value.slice(0, 100))
          }
          placeholder="이벤트를 한 줄로 소개해주세요 (카드에 표시됩니다)"
          className="resize-none border-border"
          rows={2}
        />
        <p className="text-sm text-sub-foreground mt-1 text-right">
          {shortDescription.length}/100
        </p>
      </div>

      {/* Body (Editor Mockup) */}
      <div>
        <p className="text-sm font-medium text-foreground mb-2">상세 설명</p>
        <div className="flex items-center gap-1 p-2 border border-border border-b-0 rounded-t-lg bg-muted">
          {["B", "I", "H1", "H2", "UL", "OL", "Code", "Link"].map((tool) => (
            <button
              key={tool}
              className="px-2 py-1 text-sm text-sub-foreground rounded-md"
            >
              {tool}
            </button>
          ))}
        </div>
        <Textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="이벤트 상세 내용을 작성해주세요..."
          className="min-h-[200px] resize-none rounded-t-none border-border p-4 leading-relaxed"
        />
      </div>

      {/* Agenda (Optional) */}
      <div>
        <p className="text-sm font-medium text-foreground mb-2">
          프로그램 (선택)
        </p>
        <AgendaInput items={agenda} onChange={setAgenda} />
      </div>

      {/* Speakers (Optional) */}
      <div>
        <p className="text-sm font-medium text-foreground mb-2">
          연사 (선택)
        </p>
        <div className="space-y-2">
          {speakers.map((speaker, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="text"
                value={speaker.name}
                onChange={(e) => updateSpeaker(index, "name", e.target.value)}
                placeholder="이름"
                className="flex-1 px-3 py-2 text-sm border border-border rounded-md bg-background text-foreground placeholder:text-sub-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <input
                type="text"
                value={speaker.role}
                onChange={(e) => updateSpeaker(index, "role", e.target.value)}
                placeholder="직함/소속"
                className="flex-1 px-3 py-2 text-sm border border-border rounded-md bg-background text-foreground placeholder:text-sub-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <button
                onClick={() => removeSpeaker(index)}
                className="p-1.5 text-sub-foreground hover:text-foreground rounded-md"
              >
                <X className="w-4 h-4" strokeWidth={1.5} />
              </button>
            </div>
          ))}
          <button
            onClick={addSpeaker}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-sm rounded-md border border-dashed border-border text-sub-foreground hover:text-foreground"
          >
            <Plus className="w-3.5 h-3.5" strokeWidth={1.5} />
            추가
          </button>
        </div>
      </div>

      {/* Tags */}
      <div>
        <p className="text-sm font-medium text-foreground mb-2">
          태그 (선택, 복수 가능)
        </p>
        <div className="flex gap-2 flex-wrap mb-2">
          {selectedTags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-2 py-1 text-sm bg-accent text-accent-foreground rounded-md"
            >
              #{tag}
              <button onClick={() => toggleTag(tag)}>
                <X className="w-3 h-3" strokeWidth={1.5} />
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2 flex-wrap">
          {SUGGESTED_TAGS.filter((t) => !selectedTags.includes(t)).map(
            (tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className="px-2 py-1 text-sm rounded-md border border-border text-sub-foreground"
              >
                #{tag}
              </button>
            )
          )}
        </div>
      </div>

      {/* Auto-save indicator */}
      <div className="flex items-center justify-between text-sm text-sub-foreground">
        <span>자동 저장: 30초마다 저장됩니다</span>
        <Link href="/events" className="text-primary">
          내 이벤트 목록
        </Link>
      </div>
    </div>
  );
}
