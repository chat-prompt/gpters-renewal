"use client";

import { Plus, X } from "lucide-react";

export interface AgendaItem {
  time: string;
  title: string;
}

interface AgendaInputProps {
  items: AgendaItem[];
  onChange: (items: AgendaItem[]) => void;
}

export function AgendaInput({ items, onChange }: AgendaInputProps) {
  const addItem = () => {
    onChange([...items, { time: "", title: "" }]);
  };

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof AgendaItem, value: string) => {
    const updated = items.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    onChange(updated);
  };

  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <input
            type="time"
            value={item.time}
            onChange={(e) => updateItem(index, "time", e.target.value)}
            className="w-32 px-3 py-2 text-sm border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <input
            type="text"
            value={item.title}
            onChange={(e) => updateItem(index, "title", e.target.value)}
            placeholder="프로그램 제목"
            className="flex-1 px-3 py-2 text-sm border border-border rounded-md bg-background text-foreground placeholder:text-sub-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <button
            onClick={() => removeItem(index)}
            className="p-1.5 text-sub-foreground hover:text-foreground rounded-md"
          >
            <X className="w-4 h-4" strokeWidth={1.5} />
          </button>
        </div>
      ))}
      <button
        onClick={addItem}
        className="inline-flex items-center gap-1 px-3 py-1.5 text-sm rounded-md border border-dashed border-border text-sub-foreground hover:text-foreground"
      >
        <Plus className="w-3.5 h-3.5" strokeWidth={1.5} />
        추가
      </button>
    </div>
  );
}
