"use client";

import { useState } from "react";
import {
  Plus,
  Award,
  Flame,
  Star,
  Zap,
  Trophy,
  Heart,
  Target,
  Shield,
} from "lucide-react";
import {
  Badge,
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Toggle,
} from "@/components/ui";

interface BadgeItem {
  id: number;
  name: string;
  icon: keyof typeof iconMap;
  description: string;
  type: "자동" | "수동";
  active: boolean;
}

const iconMap = {
  Award,
  Flame,
  Star,
  Zap,
  Trophy,
  Heart,
  Target,
  Shield,
};

const initialBadges: BadgeItem[] = [
  { id: 1, name: "첫 게시글", icon: "Award", description: "첫 번째 게시글을 작성한 회원", type: "자동", active: true },
  { id: 2, name: "열정 참여자", icon: "Flame", description: "4주 연속 과제를 완료한 회원", type: "자동", active: true },
  { id: 3, name: "베스트 발표자", icon: "Star", description: "베스트 발표회에서 선정된 회원", type: "수동", active: true },
  { id: 4, name: "스피드 러너", icon: "Zap", description: "모든 주차 과제를 1일 이내 제출", type: "자동", active: true },
  { id: 5, name: "수료 마스터", icon: "Trophy", description: "3회 이상 스터디를 수료한 회원", type: "자동", active: false },
  { id: 6, name: "도움왕", icon: "Heart", description: "댓글 50개 이상 작성한 회원", type: "자동", active: true },
  { id: 7, name: "목표 달성자", icon: "Target", description: "최종 프로젝트를 제출한 회원", type: "수동", active: false },
  { id: 8, name: "운영 기여자", icon: "Shield", description: "운영팀에서 직접 수여하는 기여 뱃지", type: "수동", active: true },
];

const typeVariant = (type: BadgeItem["type"]) => {
  return type === "자동" ? ("active" as const) : ("pill" as const);
};

export default function AdminBadgesPage() {
  const [badges, setBadges] = useState(initialBadges);

  const handleToggle = (id: number, checked: boolean) => {
    setBadges((prev) =>
      prev.map((b) => (b.id === id ? { ...b, active: checked } : b))
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-foreground">뱃지 관리</h1>
        <Button size="sm">
          <Plus className="w-3.5 h-3.5" />
          뱃지 추가
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {badges.map((badge) => {
          const Icon = iconMap[badge.icon];
          return (
            <Card key={badge.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-md bg-muted flex items-center justify-center">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-sm">{badge.name}</CardTitle>
                      <Badge variant={typeVariant(badge.type)} className="mt-1">
                        {badge.type}
                      </Badge>
                    </div>
                  </div>
                  <Toggle
                    checked={badge.active}
                    onChange={(checked) => handleToggle(badge.id, checked)}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>{badge.description}</CardDescription>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
