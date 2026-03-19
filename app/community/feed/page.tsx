"use client";

import { useState } from "react";
import { InlinePostForm } from "@/components/site/inline-post-form";
import { FeedPost } from "@/components/site/feed-post";
import { SortTabs } from "@/components/site/sort-tabs";

/* ─── Mock Data ─── */

const tabs = [
  { key: "feed", label: "피드" },
  { key: "qna", label: "Q&A" },
];

const feedPosts = [
  {
    id: "1",
    author: "다혜",
    username: "dahye",
    time: "30분 전",
    content:
      "바이브코딩으로 만든 스터디 대시보드가 드디어 완성! 에어테이블 + n8n + Cursor로 3일 만에 구현했습니다. 코딩 경험 거의 없는 상태에서 시작했는데 정말 가능하더라구요.",
    imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop",
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
    imageUrl: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&h=400&fit=crop",
    tags: ["ChatGPT", "챗봇", "자동화"],
    votes: 67,
    comments: 18,
  },
  {
    id: "f1",
    author: "소연",
    username: "soyeon",
    time: "1시간 전",
    content:
      "GPTers 모임 후기! 오프라인에서 만나니 더 좋았어요. 다음 모임도 기대됩니다.",
    tags: [],
    votes: 12,
    comments: 3,
  },
  {
    id: "f2",
    author: "현우",
    username: "hyunwoo",
    time: "3시간 전",
    content:
      "AI 스터디 21기 같이 하실 분 계신가요? 버디로 함께 시작하면 할인도 된다고 하더라구요.",
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
    content:
      "Claude API에서 시스템 프롬프트 길이 제한이 있나요? 8000토큰 정도 넣으려는데 가능할까요?",
    tags: ["Claude", "질문"],
    votes: 5,
    comments: 4,
  },
  {
    id: "q2",
    author: "은서",
    username: "eunseo",
    time: "5시간 전",
    content:
      "n8n과 Make 중 어떤 걸 먼저 배우는 게 좋을까요? 비개발자 입장에서 추천 부탁드립니다.",
    tags: ["n8n", "Make", "질문"],
    votes: 15,
    comments: 9,
  },
];

const extraFeedPosts = [
  [
    {
      id: "f3",
      author: "재호",
      username: "jaeho",
      time: "6시간 전",
      content:
        "Notion AI로 팀 회의록을 자동 정리하고 액션아이템을 추출하는 워크플로우를 만들었어요. 회의 끝나면 바로 Slack으로 요약이 날아옵니다.",
      tags: ["Notion", "자동화", "슬랙"],
      votes: 34,
      comments: 7,
    },
    {
      id: "f4",
      author: "지은",
      username: "jieun",
      time: "8시간 전",
      content:
        "Midjourney v7 써보신 분? 프롬프트 스타일이 많이 바뀐 것 같은데 팁 공유해요. 특히 --style 파라미터가 새로 생겼더라고요.",
      tags: ["Midjourney", "이미지생성"],
      votes: 19,
      comments: 4,
    },
    {
      id: "f5",
      author: "성국",
      username: "sungkuk",
      time: "10시간 전",
      content:
        "ChatGPT로 엑셀 매크로를 만들어봤는데 VBA 코드를 거의 완벽하게 짜주네요. 비개발자도 업무 자동화 충분히 가능합니다.",
      tags: ["ChatGPT", "엑셀", "업무자동화"],
      votes: 28,
      comments: 9,
    },
  ],
  [
    {
      id: "f6",
      author: "미나",
      username: "mina",
      time: "12시간 전",
      content:
        "Claude Code로 개인 블로그를 하루 만에 만들었습니다. Next.js + Vercel 배포까지 전부 AI가 도와줬어요. 코딩 경험 제로에서 시작!",
      tags: ["Claude Code", "바이브코딩", "블로그"],
      votes: 41,
      comments: 11,
    },
    {
      id: "f7",
      author: "용준",
      username: "yongjun",
      time: "14시간 전",
      content:
        "AI 스터디 20기 수료 후기입니다. 4주 동안 매주 사례 게시글 쓰면서 성장한 게 체감돼요. 특히 피어러닝 방식이 좋았습니다.",
      tags: ["AI스터디", "후기"],
      votes: 52,
      comments: 15,
    },
    {
      id: "f8",
      author: "은비",
      username: "eunbi",
      time: "16시간 전",
      content:
        "Cursor + Claude로 사내 CRM 대시보드를 만들어서 팀에 공유했더니 반응이 뜨거워요. 이게 바이브코딩의 힘인가 봅니다.",
      tags: ["Cursor", "CRM", "바이브코딩"],
      votes: 37,
      comments: 8,
    },
  ],
];

/* ─── Page ─── */

export default function CommunityFeedPage() {
  const [activeTab, setActiveTab] = useState("feed");
  const [sort, setSort] = useState<"latest" | "popular">("latest");
  const [posts, setPosts] = useState(feedPosts);
  const [loadCount, setLoadCount] = useState(0);

  const currentPosts = activeTab === "qna" ? qnaPosts : posts;
  const placeholderText =
    activeTab === "qna"
      ? "질문이 있으신가요?"
      : "무슨 AI 이야기를 나누고 싶으신가요?";

  return (
    <div className="mx-auto max-w-[680px] px-6 py-page space-y-5">
      {/* Tab Navigation */}
      <div className="flex gap-1 border-b border-border overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2.5 text-sm whitespace-nowrap border-b-2 ${
              activeTab === tab.key
                ? "border-primary text-primary font-medium"
                : "border-transparent text-sub-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Inline Post Form */}
      <InlinePostForm placeholder={placeholderText} />

      {/* Sort Toggle */}
      <SortTabs
        options={[
          { label: "최신", value: "latest" },
          { label: "인기", value: "popular" },
        ]}
        value={sort}
        onChange={(v) => setSort(v as "latest" | "popular")}
      />

      {/* Posts */}
      <div className="divide-y divide-border">
        {currentPosts.map((post) => (
          <FeedPost key={post.id} {...post} />
        ))}
      </div>

      {/* Load More */}
      {activeTab === "feed" && loadCount < extraFeedPosts.length && (
        <button
          onClick={() => {
            setPosts((prev) => [...prev, ...extraFeedPosts[loadCount]]);
            setLoadCount((prev) => prev + 1);
          }}
          className="w-full py-3 text-sm text-sub-foreground border border-border rounded-lg"
        >
          더 불러오기
        </button>
      )}
    </div>
  );
}
