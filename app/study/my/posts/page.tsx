"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// -- Mock Data --

interface Post {
  id: string;
  title: string;
  author: string;
  isMyPost: boolean;
  study: string;
  week: number;
  date: string;
  content: string;
  likes: number;
  comments: number;
}

const posts: Post[] = [
  {
    id: "1",
    title: "n8n으로 뉴스레터 자동화하기",
    author: "홍길동",
    isMyPost: true,
    study: "AI 자동화",
    week: 2,
    date: "03.20",
    content: "이번 주에 n8n 워크플로우를 만들어서 매일 아침 AI 뉴스를 수집하고 요약해서 이메일로 발송하는 자동화를 구축했습니다. Gmail API + Claude API를 연동해서 하루 30분씩 걸리던 작업을 완전 자동화했어요.\n\n핵심 포인트:\n- n8n HTTP Request 노드로 RSS 피드 수집\n- Claude API로 요약 생성 (500자 이내)\n- Gmail 노드로 아침 7시 발송\n\n삽질한 부분은 API rate limit인데, 1분에 10회 제한이라 큰 피드는 청크로 나눠야 했습니다.",
    likes: 12,
    comments: 3,
  },
  {
    id: "2",
    title: "Claude Code로 실무 자동화 사례 공유",
    author: "김민지",
    isMyPost: false,
    study: "AI 자동화",
    week: 2,
    date: "03.20",
    content: "Claude Code를 활용해서 반복적인 데이터 처리 업무를 자동화한 사례를 공유합니다. 매주 엑셀 파일을 수작업으로 정리하던 업무를 3시간에서 5분으로 단축했습니다.",
    likes: 18,
    comments: 5,
  },
  {
    id: "3",
    title: "프롬프트 패턴 정리 - 업무 효율화",
    author: "이준혁",
    isMyPost: false,
    study: "프롬프트 ENG",
    week: 2,
    date: "03.19",
    content: "2주차 학습 내용을 정리했습니다. Chain-of-thought, Few-shot, Role prompting 패턴을 실무에 적용해본 경험을 공유합니다.",
    likes: 9,
    comments: 2,
  },
  {
    id: "4",
    title: "Cursor AI로 사내 대시보드 만들기",
    author: "박소연",
    isMyPost: false,
    study: "바이브코딩",
    week: 1,
    date: "03.18",
    content: "비개발자인 제가 Cursor AI를 활용해서 부서 KPI 대시보드를 만든 경험입니다. Python 전혀 못 하는데 3일 만에 완성했어요!",
    likes: 24,
    comments: 8,
  },
  {
    id: "5",
    title: "Make로 SNS 콘텐츠 자동 스케줄링",
    author: "최동현",
    isMyPost: false,
    study: "AI 자동화",
    week: 1,
    date: "03.17",
    content: "Make(구 Integromat)를 사용해서 인스타그램과 링크드인 포스팅을 자동화했습니다. 콘텐츠 아이디어 → Claude 작성 → 예약 발행까지 원클릭으로 처리합니다.",
    likes: 15,
    comments: 4,
  },
  {
    id: "6",
    title: "AI 미팅 요약 봇 구축 후기",
    author: "정하윤",
    isMyPost: false,
    study: "AI 자동화",
    week: 2,
    date: "03.20",
    content: "Zoom 녹화 → Whisper 변환 → Claude 요약 → Slack 발송 파이프라인을 n8n으로 구축했습니다. 매주 5~6개 미팅 요약에 걸리던 2시간이 완전 자동화됐어요.",
    likes: 21,
    comments: 6,
  },
  {
    id: "7",
    title: "GPT-4V로 이미지 데이터 분류 자동화",
    author: "윤서진",
    isMyPost: false,
    study: "프롬프트 ENG",
    week: 1,
    date: "03.16",
    content: "쇼핑몰 상품 이미지 수천 장을 카테고리별로 분류하는 작업을 GPT-4V를 활용해 자동화했습니다. 정확도 92%로 충분히 실무에 쓸 수 있는 수준입니다.",
    likes: 11,
    comments: 3,
  },
  {
    id: "8",
    title: "바이브코딩으로 3일 만에 랜딩페이지 완성",
    author: "강민호",
    isMyPost: false,
    study: "바이브코딩",
    week: 2,
    date: "03.21",
    content: "개발 지식 없이 Claude + Vercel 조합으로 사업 소개 랜딩페이지를 만든 과정을 공유합니다. 외주 견적 300만원 나온 작업을 무료로 해결했어요.",
    likes: 30,
    comments: 10,
  },
];

const studyOptions = ["전체", "AI 자동화", "프롬프트 ENG", "바이브코딩"];
const weekOptions = ["전체", "1주차", "2주차", "3주차", "4주차"];

export default function MyPostsPage() {
  const [selectedStudy, setSelectedStudy] = useState("전체");
  const [selectedWeek, setSelectedWeek] = useState("전체");
  const [myPostsOnly, setMyPostsOnly] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  const filteredPosts = posts.filter((p) => {
    if (selectedStudy !== "전체" && p.study !== selectedStudy) return false;
    if (selectedWeek !== "전체" && `${p.week}주차` !== selectedWeek) return false;
    if (myPostsOnly && !p.isMyPost) return false;
    return true;
  });

  const selectedPost = posts.find((p) => p.id === selectedPostId);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-foreground">게시글</h1>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <Select value={selectedStudy} onValueChange={setSelectedStudy}>
          <SelectTrigger size="sm" className="w-auto">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {studyOptions.map((s) => (
              <SelectItem key={s} value={s}>
                {s === "전체" ? "스터디 전체" : s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedWeek} onValueChange={setSelectedWeek}>
          <SelectTrigger size="sm" className="w-auto">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {weekOptions.map((w) => (
              <SelectItem key={w} value={w}>
                {w === "전체" ? "주차 전체" : w}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <label className="flex items-center gap-1.5 text-sm text-muted-foreground cursor-pointer select-none">
          <input
            type="checkbox"
            checked={myPostsOnly}
            onChange={(e) => setMyPostsOnly(e.target.checked)}
            className="rounded border-border accent-orange-500"
          />
          내 글만
        </label>
        <span className="text-xs text-muted-foreground ml-auto">
          {filteredPosts.length}개
        </span>
      </div>

      {/* 2-Panel */}
      <div className="flex gap-4" style={{ minHeight: "480px" }}>
        {/* Left: post list */}
        <div className="w-full md:w-[45%] rounded-lg border border-border divide-y divide-border overflow-y-auto">
          {filteredPosts.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              게시글이 없습니다.
            </div>
          ) : (
            filteredPosts.map((post) => (
              <button
                key={post.id}
                onClick={() => setSelectedPostId(post.id)}
                className={cn(
                  "w-full text-left px-4 py-3 transition-colors",
                  selectedPostId === post.id ? "bg-accent" : "hover:bg-muted"
                )}
              >
                <p className="text-sm font-medium text-foreground line-clamp-1">
                  {post.title}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="default" className="text-xs">
                    {post.study} {post.week}주차
                  </Badge>
                  <span className="text-xs text-muted-foreground">{post.author}</span>
                  <span className="text-xs text-muted-foreground ml-auto">{post.date}</span>
                </div>
              </button>
            ))
          )}
        </div>

        {/* Right: post detail */}
        <div className="hidden md:flex flex-1 rounded-lg border border-border p-6">
          {selectedPost ? (
            <div className="space-y-4 w-full">
              <div className="space-y-2">
                <h2 className="text-lg font-bold text-foreground">{selectedPost.title}</h2>
                <div className="flex items-center gap-2">
                  <Badge variant="default">{selectedPost.study} {selectedPost.week}주차</Badge>
                  <span className="text-xs text-muted-foreground">{selectedPost.author}</span>
                  <span className="text-xs text-muted-foreground">{selectedPost.date}</span>
                </div>
              </div>
              <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">
                {selectedPost.content}
              </p>
            </div>
          ) : (
            <div className="flex items-center justify-center w-full text-sm text-muted-foreground">
              게시글을 선택하세요
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
