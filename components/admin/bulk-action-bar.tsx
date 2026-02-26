"use client";

import { Button } from "@/components/ui";

interface BulkAction {
  label: string;
  onClick: () => void;
  variant?: "primary" | "secondary" | "destructive";
}

interface BulkActionBarProps {
  selectedCount: number;
  actions: BulkAction[];
  onClear: () => void;
}

export function BulkActionBar({
  selectedCount,
  actions,
  onClear,
}: BulkActionBarProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="flex items-center gap-3 p-3 border border-border rounded-lg bg-muted">
      <span className="text-sm text-foreground font-medium">
        {selectedCount}개 선택됨
      </span>
      {actions.map((action) => (
        <Button
          key={action.label}
          variant={action.variant ?? "secondary"}
          size="sm"
          onClick={action.onClick}
        >
          {action.label}
        </Button>
      ))}
      <Button variant="ghost" size="sm" onClick={onClear}>
        선택 해제
      </Button>
    </div>
  );
}
