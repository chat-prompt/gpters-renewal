"use client";

import { useState } from "react";
import { Download, ArrowRight } from "lucide-react";
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CohortReport {
  cohort: number;
  content: { posts: number; comments: number; votes: number };
  study: { students: number; completionRate: number; refundRate: number };
  funnel: { visits: number; signups: number; enrollments: number; completions: number };
}

const reportData: Record<number, CohortReport> = {
  22: {
    cohort: 22,
    content: { posts: 1248, comments: 3672, votes: 8430 },
    study: { students: 342, completionRate: 78, refundRate: 12 },
    funnel: { visits: 45200, signups: 2860, enrollments: 342, completions: 267 },
  },
  21: {
    cohort: 21,
    content: { posts: 1102, comments: 3105, votes: 7210 },
    study: { students: 315, completionRate: 82, refundRate: 9 },
    funnel: { visits: 38500, signups: 2450, enrollments: 315, completions: 258 },
  },
  20: {
    cohort: 20,
    content: { posts: 980, comments: 2890, votes: 6540 },
    study: { students: 289, completionRate: 75, refundRate: 14 },
    funnel: { visits: 32100, signups: 2100, enrollments: 289, completions: 217 },
  },
};

const cohortOptions = [22, 21, 20];

export default function AdminReportsPage() {
  const [selectedCohort, setSelectedCohort] = useState("22");
  const data = reportData[Number(selectedCohort)];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-foreground">리포트</h1>
        <Button variant="secondary" size="sm">
          <Download className="w-3.5 h-3.5" strokeWidth={1.5} />
          CSV 다운로드
        </Button>
      </div>

      <div>
        <Select value={selectedCohort} onValueChange={setSelectedCohort}>
          <SelectTrigger size="sm" className="w-auto">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {cohortOptions.map((c) => (
              <SelectItem key={c} value={String(c)}>
                {c}기
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* 콘텐츠 통계 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">콘텐츠 통계</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-sub-foreground">게시글 수</p>
              <p className="text-2xl font-semibold text-foreground">
                {data.content.posts.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-sub-foreground">댓글 수</p>
              <p className="text-2xl font-semibold text-foreground">
                {data.content.comments.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-sub-foreground">투표 수</p>
              <p className="text-2xl font-semibold text-foreground">
                {data.content.votes.toLocaleString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 스터디 통계 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">스터디 통계</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-sub-foreground">수강생 수</p>
              <p className="text-2xl font-semibold text-foreground">
                {data.study.students.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-sub-foreground">수료율</p>
              <p className="text-2xl font-semibold text-foreground">
                {data.study.completionRate}%
              </p>
            </div>
            <div>
              <p className="text-sm text-sub-foreground">환급률</p>
              <p className="text-2xl font-semibold text-foreground">
                {data.study.refundRate}%
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 퍼널 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">퍼널</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-center flex-1">
              <p className="text-sm text-sub-foreground">방문</p>
              <p className="text-2xl font-semibold text-foreground">
                {data.funnel.visits.toLocaleString()}
              </p>
            </div>
            <ArrowRight className="w-4 h-4 text-sub-foreground shrink-0" strokeWidth={1.5} />
            <div className="text-center flex-1">
              <p className="text-sm text-sub-foreground">가입</p>
              <p className="text-2xl font-semibold text-foreground">
                {data.funnel.signups.toLocaleString()}
              </p>
            </div>
            <ArrowRight className="w-4 h-4 text-sub-foreground shrink-0" strokeWidth={1.5} />
            <div className="text-center flex-1">
              <p className="text-sm text-sub-foreground">수강</p>
              <p className="text-2xl font-semibold text-foreground">
                {data.funnel.enrollments.toLocaleString()}
              </p>
            </div>
            <ArrowRight className="w-4 h-4 text-sub-foreground shrink-0" strokeWidth={1.5} />
            <div className="text-center flex-1">
              <p className="text-sm text-sub-foreground">수료</p>
              <p className="text-2xl font-semibold text-foreground">
                {data.funnel.completions.toLocaleString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
