import { use } from "react";
import Link from "next/link";
import { BookOpen, Heart } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { PostCard } from "@/components/site/post-card";

/* ─── Types ─── */

interface SeriesPost {
  number: number;
  title: string;
  slug: string;
  excerpt: string;
  date: string;
  votes: number;
  comments: number;
  tags: string[];
}

interface Series {
  id: string;
  title: string;
  description: string;
  author: string;
  username: string;
  category: string;
  status: "진행중" | "완결";
  postCount: number;
  totalVotes: number;
  createdAt: string;
  posts: SeriesPost[];
}

/* ─── Mock Data ─── */

const allSeries: Series[] = [
  {
    id: "1",
    title: "맘스만 개발기",
    description: "육아와 개발을 병행하는 엄마 개발자의 AI 활용 여정",
    author: "홍길동",
    username: "honggildong",
    category: "AI활용법",
    status: "진행중",
    postCount: 3,
    totalVotes: 89,
    createdAt: "2026.02.15",
    posts: [
      {
        number: 1,
        title: "아이디어 구상기 — AI로 육아 도우미 만들기",
        slug: "moms-dev-1",
        excerpt: "육아와 개발을 병행하면서 느낀 문제들을 AI로 해결해보기로 했습니다. 아이 수면 패턴 분석부터 식단 추천까지, 첫 번째 프로젝트의 기획 과정을 공유합니다.",
        date: "2026.02.15",
        votes: 34, comments: 8, tags: ["AI", "육아"],
      },
      {
        number: 2,
        title: "Claude로 마케팅 자동화 구축기",
        slug: "claude-marketing",
        excerpt: "이번에 Claude를 활용해서 마케팅 이메일 자동화 파이프라인을 구축한 경험을 공유합니다. 매주 3시간 걸리던 작업이 30분으로 줄었어요.",
        date: "2026.02.22",
        votes: 142, comments: 23, tags: ["Claude", "자동화"],
      },
      {
        number: 3,
        title: "런칭 후기 — 첫 사용자 100명 달성",
        slug: "moms-dev-3",
        excerpt: "드디어 서비스를 런칭하고 첫 사용자 100명을 달성했습니다. 런칭 과정에서 겪은 시행착오와 초기 사용자 피드백을 정리했습니다.",
        date: "2026.03.01",
        votes: 45, comments: 12, tags: ["ChatGPT", "육아"],
      },
    ],
  },
  {
    id: "2",
    title: "자동화 마스터 클래스",
    description:
      "업무 자동화의 A to Z, n8n과 Claude API를 활용한 실전 가이드",
    author: "김영호",
    username: "kimyoungho",
    category: "자동화",
    status: "완결",
    postCount: 4,
    totalVotes: 156,
    createdAt: "2026.01.10",
    posts: [
      {
        number: 1,
        title: "자동화가 필요한 순간들",
        slug: "auto-master-1",
        excerpt: "반복 업무에 지친 당신을 위한 자동화 입문기. 어떤 업무를 자동화해야 하는지, 우선순위는 어떻게 정하는지 알아봅니다.",
        date: "2026.01.10",
        votes: 52, comments: 14, tags: ["자동화", "n8n"],
      },
      {
        number: 2,
        title: "n8n 워크플로우 설계의 기초",
        slug: "auto-master-2",
        excerpt: "n8n의 기본 개념부터 첫 워크플로우 만들기까지. 노코드 자동화 도구의 강력한 기능을 실습합니다.",
        date: "2026.01.17",
        votes: 38, comments: 9, tags: ["n8n", "노코드"],
      },
      {
        number: 3,
        title: "Claude API와 n8n 연동하기",
        slug: "auto-master-3",
        excerpt: "n8n에 Claude API를 연동하여 지능형 자동화를 구현합니다. HTTP 노드 설정부터 프롬프트 최적화까지.",
        date: "2026.01.24",
        votes: 67, comments: 21, tags: ["Claude", "n8n"],
      },
      {
        number: 4,
        title: "실전 프로젝트: 고객 응대 자동화",
        slug: "auto-master-4",
        excerpt: "실제 고객 문의를 자동으로 분류하고 응답하는 시스템을 구축합니다. 시리즈의 마지막 편으로, 전체 파이프라인을 완성합니다.",
        date: "2026.01.31",
        votes: 89, comments: 27, tags: ["Claude", "자동화"],
      },
    ],
  },
];

/* ─── Page ─── */

export default function SeriesDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const series = allSeries.find((s) => s.id === id);

  if (!series) {
    return (
      <div className="max-w-[680px] mx-auto px-6 py-page">
        <p className="text-sm text-sub-foreground">
          존재하지 않는 시리즈입니다.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-[680px] mx-auto px-6 py-page">
      {/* Cover Section */}
      <div className="mb-8">
        {/* Category */}
        <div className="mb-3">
          <Badge>{series.category}</Badge>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-semibold text-foreground mb-2">
          {series.title}
        </h1>

        {/* Description */}
        <p className="text-sm text-sub-foreground mb-4">
          {series.description}
        </p>

        {/* Author Meta */}
        <div className="flex items-center gap-3 text-sm text-sub-foreground">
          <Avatar size="sm" />
          <Link href={`/profile/${series.username}`} className="font-medium text-foreground hover:underline">
            {series.author}
          </Link>
          <span className="text-border">·</span>
          <span className="flex items-center gap-1">
            <BookOpen className="w-4 h-4" strokeWidth={1.5} />{series.postCount}편
          </span>
          <span className="text-border">·</span>
          <span className="flex items-center gap-1">
            <Heart className="w-4 h-4" strokeWidth={1.5} />{series.totalVotes}
          </span>
        </div>
      </div>

      {/* Posts List */}
      <div className="divide-y divide-border">
        {series.posts.map((post) => (
          <PostCard
            key={post.slug}
            slug={post.slug}
            category={series.category}
            title={post.title}
            author={series.author}
            username={series.username}
            time={post.date}
            tags={post.tags}
            excerpt={post.excerpt}
            votes={post.votes}
            comments={post.comments}
            showAuthor={false}
            seriesId={series.id}
            seriesTitle={series.title}
            positionInSeries={post.number}
          />
        ))}
      </div>
    </div>
  );
}
