"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUp, MessageSquare, Share2, Send } from "lucide-react";
import { InlinePostForm } from "@/components/site/inline-post-form";

/* ─── Mock Data ─── */

const tabs = [
  { key: "feed", label: "피드" },
  { key: "free", label: "자유게시판" },
  { key: "qna", label: "Q&A" },
  { key: "events", label: "이벤트" },
];

const feedPosts = [
  {
    id: "1",
    author: "다혜",
    username: "dahye",
    time: "30분 전",
    content:
      "바이브코딩으로 만든 스터디 대시보드가 드디어 완성! 에어테이블 + n8n + Cursor로 3일 만에 구현했습니다. 코딩 경험 거의 없는 상태에서 시작했는데 정말 가능하더라구요.",
    hasImage: true,
    tags: ["바이브코딩", "n8n", "자동화"],
    votes: 23,
    comments: 5,
  },
  {
    id: "2",
    author: "수현",
    username: "suhyun",
    time: "2시간 전",
    content:
      "Claude로 주간 마케팅 리포트 자동 생성하는 프롬프트 공유합니다. 30분 걸리던 작업이 3분으로 줄었어요! 댓글로 프롬프트 전문 남겨둘게요.",
    hasImage: false,
    tags: ["Claude", "프롬프트", "마케팅"],
    votes: 45,
    comments: 12,
  },
  {
    id: "3",
    author: "민호",
    username: "minho",
    time: "5시간 전",
    content:
      "GPT-4o로 만든 AI 고객응대 챗봇을 우리 팀에 배포했습니다. 하루 50건 이상 문의를 자동으로 처리 중! 간단한 질문은 95% 정확도로 답변합니다.",
    hasImage: true,
    tags: ["ChatGPT", "챗봇", "자동화"],
    votes: 67,
    comments: 18,
  },
  {
    id: "4",
    author: "지은",
    username: "jieun",
    time: "어제",
    content:
      "오늘 모각AI에서 Midjourney로 브랜드 로고 만들기 도전했는데, 생각보다 퀄리티가 좋아서 놀랐어요. 비포/애프터 공유합니다.",
    hasImage: true,
    tags: ["Midjourney", "디자인"],
    votes: 34,
    comments: 8,
  },
  {
    id: "5",
    author: "재호",
    username: "jaeho",
    time: "어제",
    content:
      "Cursor + Claude 조합으로 Chrome 확장 프로그램을 하루 만에 만들었습니다. AI 검색 결과를 요약해주는 간단한 도구인데, 반응이 좋아서 놀랐어요.",
    hasImage: false,
    tags: ["Cursor", "Claude", "개발"],
    votes: 89,
    comments: 24,
  },
];

const freePosts = [
  {
    id: "f1",
    author: "소연",
    username: "soyeon",
    time: "1시간 전",
    content: "GPTers 모임 후기! 오프라인에서 만나니 더 좋았어요. 다음 모임도 기대됩니다.",
    hasImage: false,
    tags: [],
    votes: 12,
    comments: 3,
  },
  {
    id: "f2",
    author: "현우",
    username: "hyunwoo",
    time: "3시간 전",
    content: "AI 스터디 21기 같이 하실 분 계신가요? 버디로 함께 시작하면 할인도 된다고 하더라구요.",
    hasImage: false,
    tags: ["스터디"],
    votes: 8,
    comments: 6,
  },
];

const qnaPosts = [
  {
    id: "q1",
    author: "정민",
    username: "jungmin",
    time: "2시간 전",
    content: "Claude API에서 시스템 프롬프트 길이 제한이 있나요? 8000토큰 정도 넣으려는데 가능할까요?",
    hasImage: false,
    tags: ["Claude", "질문"],
    votes: 5,
    comments: 4,
  },
  {
    id: "q2",
    author: "은서",
    username: "eunseo",
    time: "5시간 전",
    content: "n8n과 Make 중 어떤 걸 먼저 배우는 게 좋을까요? 비개발자 입장에서 추천 부탁드립니다.",
    hasImage: false,
    tags: ["n8n", "Make", "질문"],
    votes: 15,
    comments: 9,
  },
];

const eventPosts = [
  {
    id: "e1",
    author: "GPTers 운영팀",
    username: "gpters",
    time: "3일 전",
    content: "3월 오프라인 모각AI 안내: 3/20(토) 14:00, 강남역 위워크. AI 도구 자유 실습 + 네트워킹 시간입니다.",
    hasImage: true,
    tags: ["모각AI", "오프라인"],
    votes: 42,
    comments: 15,
  },
];

type PostItem = typeof feedPosts[number];

/* ─── Components ─── */

function FeedPost({ post }: { post: PostItem }) {
  return (
    <div className="border border-border rounded-lg p-4 bg-background space-y-3">
      {/* Author Info */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-muted shrink-0" />
        <div>
          <p className="text-sm font-medium text-foreground">
            {post.author}{" "}
            <span className="text-muted-foreground font-normal">
              @{post.username}
            </span>
          </p>
          <p className="text-xs text-muted-foreground">{post.time}</p>
        </div>
      </div>

      {/* Content */}
      <p className="text-sm text-foreground leading-relaxed">{post.content}</p>

      {/* Image Placeholder */}
      {post.hasImage && <div className="h-48 bg-muted rounded-md" />}

      {/* Tags */}
      {post.tags.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {post.tags.map((tag) => (
            <Link key={tag} href="#" className="text-xs text-primary">
              #{tag}
            </Link>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-6 pt-1 border-t border-border">
        <button className="flex items-center gap-1.5 text-sm text-muted-foreground pt-3">
          <ArrowUp className="w-4 h-4" />
          {post.votes}
        </button>
        <button className="flex items-center gap-1.5 text-sm text-muted-foreground pt-3">
          <MessageSquare className="w-4 h-4" />
          {post.comments}
        </button>
        <button className="flex items-center gap-1.5 text-sm text-muted-foreground pt-3">
          <Share2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

/* ─── Page ─── */

export default function CommunityFeedPage() {
  const [activeTab, setActiveTab] = useState("feed");

  const getPostsForTab = (): PostItem[] => {
    switch (activeTab) {
      case "free":
        return freePosts;
      case "qna":
        return qnaPosts;
      case "events":
        return eventPosts;
      default:
        return feedPosts;
    }
  };

  const currentPosts = getPostsForTab();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-foreground">커뮤니티</h1>
        <button className="flex items-center gap-2 px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md">
          <Send className="w-4 h-4" /> 포스트 작성
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 border-b border-border mb-6 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 text-sm whitespace-nowrap border-b-2 ${
              activeTab === tab.key
                ? "border-primary text-foreground font-medium"
                : "border-transparent text-muted-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="space-y-4">
        {/* Inline Post Form (only on Feed tab) */}
        {activeTab === "feed" && <InlinePostForm />}

        {/* Posts */}
        {currentPosts.map((post) => (
          <FeedPost key={post.id} post={post} />
        ))}

        {/* Load More */}
        <div className="text-center py-4">
          <button className="px-6 py-2 text-sm border border-border rounded-md text-muted-foreground bg-background">
            더 불러오기
          </button>
        </div>
      </div>
    </div>
  );
}
