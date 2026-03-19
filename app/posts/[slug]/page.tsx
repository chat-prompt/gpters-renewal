"use client";

import Link from "next/link";
import { BookOpen } from "lucide-react";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { CommentTree, type CommentData } from "@/components/site/comment";
import { TagList } from "@/components/site/tag-list";
import { PostActionsSidebar } from "@/components/site/post-actions-sidebar";
import { CommentInput } from "@/components/site/comment-input";
import { PostCard } from "@/components/site/post-card";
import { PostAuthorMeta } from "@/components/site/post-author-meta";
import { PostDetailCTA } from "@/components/site/post-detail-cta";

/* ─── Mock Data ─── */

const post = {
  title: "Claude로 마케팅 자동화 구축기",
  category: "AI 활용법",
  tags: ["Claude", "마케팅", "자동화", "중급"],
  author: "홍길동",
  username: "honggildong",
  time: "3시간 전",
  views: 1234,
  votes: 142,
  comments: 23,
};

const comments: CommentData[] = [
  {
    id: "1",
    author: "이수진",
    time: "2시간 전",
    text: "좋은 글 감사합니다! Claude API 비용은 어느 정도 나오나요?",
    votes: 5,
    replies: [
      {
        id: "1-1",
        author: "홍길동",
        isOP: true,
        time: "1시간 전",
        text: "월 약 $30 정도 나옵니다. 사용량에 따라 다르지만, 마케팅 이메일 100건 기준으로는 충분합니다.",
        votes: 3,
      },
      {
        id: "1-2",
        author: "박영수",
        time: "30분 전",
        text: "저는 비슷한 규모로 $20 정도 나와요. Haiku 모델 쓰면 더 저렴합니다.",
        votes: 2,
      },
    ],
  },
  {
    id: "2",
    author: "박민수",
    time: "1시간 전",
    text: "n8n이랑 연동하면 더 좋을 것 같아요! 혹시 n8n 워크플로우도 공유 가능하신가요?",
    votes: 8,
    replies: [],
  },
  {
    id: "3",
    author: "김다혜",
    time: "45분 전",
    text: "마케팅 팀에서 바로 적용해볼 수 있을 것 같네요. 템플릿 프롬프트 부분이 특히 유용했습니다.",
    votes: 4,
    replies: [
      {
        id: "3-1",
        author: "홍길동",
        isOP: true,
        time: "20분 전",
        text: "감사합니다! 템플릿은 글 하단에 GitHub 링크로 전체 공유해두었으니 참고해주세요.",
        votes: 6,
      },
    ],
  },
  {
    id: "4",
    author: "정수현",
    time: "30분 전",
    text: "오픈율 15% 개선은 대단하네요. A/B 테스트도 자동화하셨나요?",
    votes: 3,
    replies: [],
  },
  {
    id: "5",
    author: "최재호",
    time: "10분 전",
    text: "저도 비슷한 프로젝트 진행 중인데, 개인화 부분에서 많이 배웠습니다. 감사합니다!",
    votes: 1,
    replies: [],
  },
];

// Series info for this post (the mock post "Claude로 마케팅 자동화 구축기" is part of series "맘스만 개발기")
const seriesInfo = {
  id: "1",
  title: "맘스만 개발기",
  currentPosition: 2,
  totalPosts: 3,
  prevPost: { slug: "moms-dev-1", title: "아이디어 구상기 — AI로 육아 도우미 만들기" },
  nextPost: { slug: "moms-dev-3", title: "런칭 후기 — 첫 사용자 100명 달성" },
};

const relatedPosts = [
  {
    slug: "claude-api-cases",
    title: "Claude API 활용 사례 모음",
    category: "AI 활용법",
    author: "이수진",
    time: "2일 전",
    tags: ["Claude", "API"],
    excerpt: "Claude API를 실무에 적용한 다양한 사례를 정리했습니다. 고객 응대부터 콘텐츠 생성까지.",
    votes: 67,
    comments: 12,
  },
  {
    slug: "automation-workflow",
    title: "자동화 워크플로우 설계 가이드",
    category: "자동화",
    author: "박민수",
    time: "3일 전",
    tags: ["n8n", "자동화"],
    excerpt: "업무 자동화 워크플로우를 설계하는 단계별 가이드. 반복 작업을 줄이는 실전 팁.",
    votes: 54,
    comments: 8,
    thumbnailUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=240&h=160&fit=crop",
  },
  {
    slug: "marketing-ai-tools",
    title: "마케팅 AI 도구 비교 리뷰",
    category: "비즈니스",
    author: "김다혜",
    time: "5일 전",
    tags: ["마케팅", "비교"],
    excerpt: "2025년 마케팅 팀이 알아야 할 AI 도구 10가지를 직접 사용해보고 비교했습니다.",
    votes: 89,
    comments: 15,
  },
];

/* ─── Page ─── */

export default function PostDetailPage() {
  return (
    <div className="overflow-x-clip">
      <div className="mx-auto max-w-[640px] px-6 py-page">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Breadcrumb
          items={[
            { label: "탐색", href: "/explore/feed" },
            { label: post.category, href: `/explore/feed?category=ai-usage` },
            { label: post.title },
          ]}
        />
      </div>

      <div className="relative">
        {/* Main Content */}
        <article>
          {/* Series Label */}
          <Link
            href={`/series/${seriesInfo.id}`}
            className="flex items-center gap-1.5 mb-3 text-sm text-sub-foreground hover:text-primary transition-colors w-fit"
          >
            <BookOpen className="w-3.5 h-3.5 shrink-0" strokeWidth={1.5} />
            <span>{seriesInfo.title}</span>
            <span>·</span>
            <span>{seriesInfo.currentPosition}/{seriesInfo.totalPosts}화</span>
          </Link>

          <h1 className="text-2xl font-semibold text-foreground mb-4">
            {post.title}
          </h1>

          <PostAuthorMeta
            author={{
              name: post.author,
              href: `/profile/${post.username}`,
            }}
            date={post.time}
            viewCount={post.views}
            className="mb-4"
          />

          {/* Article Body */}
          <div className="space-y-6 font-regular text-foreground leading-relaxed mb-8">
            <h2 className="text-lg font-semibold text-foreground">배경</h2>
            <p className="text-secondary-foreground">
              마케팅 팀에서 매주 반복적으로 보내는 이메일 캠페인을 Claude API를
              활용해 자동화한 경험을 공유합니다. 매주 3시간 이상 소요되던 작업을
              30분으로 줄인 과정을 상세히 설명하겠습니다.
            </p>

            <h2 className="text-lg font-semibold text-foreground">구축 과정</h2>
            <ol className="list-decimal list-inside space-y-2 text-secondary-foreground">
              <li>데이터 수집 파이프라인 설계</li>
              <li>Claude API 연동 및 프롬프트 설계</li>
              <li>이메일 템플릿 자동 생성</li>
              <li>A/B 테스트 자동화</li>
              <li>테스트 및 배포</li>
            </ol>

            <h2 className="text-lg font-semibold text-foreground">1. 데이터 수집 파이프라인</h2>
            <p className="text-secondary-foreground">
              먼저 Google Sheets에서 고객 데이터를 자동으로 수집하는 파이프라인을
              구축했습니다. n8n을 활용해 스프레드시트 변경 감지 시 자동으로
              트리거되도록 설정했습니다.
            </p>

            <div className="bg-muted rounded-md p-4 text-sm font-mono text-sub-foreground overflow-x-auto">
              <pre>{`// Claude API 호출 예시
const response = await anthropic.messages.create({
  model: "claude-sonnet-4-20250514",
  max_tokens: 1024,
  messages: [{ role: "user", content: prompt }],
});`}</pre>
            </div>

            <h2 className="text-lg font-semibold text-foreground">2. 프롬프트 설계</h2>
            <p className="text-secondary-foreground">
              고객의 구매 이력, 관심사, 최근 활동 데이터를 기반으로 개인화된
              이메일을 생성하는 시스템 프롬프트를 설계했습니다. 핵심은 톤앤매너를
              일관되게 유지하면서도 각 고객에게 맞춤화된 내용을 생성하는 것이었습니다.
            </p>

            <h2 className="text-lg font-semibold text-foreground">3. 결과</h2>
            <p className="text-secondary-foreground">
              자동화 파이프라인 도입 후 주당 3시간의 반복 작업을 30분으로 줄일 수
              있었습니다. 이메일 개인화 수준도 크게 향상되어 오픈율이 15%
              개선되었습니다.
            </p>
          </div>

          <TagList tags={post.tags} className="mb-8" />

          {/* Inline CTA (for non-members) */}
          <PostDetailCTA className="my-8" />

          {/* Comments */}
          <section>
            <h3 className="font-semibold text-foreground mb-4">
              댓글 ({post.comments}개)
            </h3>

            <CommentTree comments={comments} />

            <CommentInput className="mt-6" />
          </section>

          {/* Related Posts */}
          <section className="mt-8">
            <h3 className="font-semibold text-foreground mb-4">관련 글 추천</h3>
            <div className="divide-y divide-border">
              {relatedPosts.map((rp) => (
                <PostCard key={rp.slug} {...rp} />
              ))}
            </div>
          </section>
        </article>

        {/* Sticky Sidebar (Desktop) */}
        <div className="absolute left-full top-0 ml-8">
          <PostActionsSidebar votes={post.votes} comments={post.comments} />
        </div>
      </div>
      </div>
    </div>
  );
}
