"use client";

import Link from "next/link";
import { BookOpen, ChevronRight } from "lucide-react";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { CommentTree, type CommentData } from "@/components/site/comment";
import { TagList } from "@/components/site/tag-list";
import { PostActionsSidebar } from "@/components/site/post-actions-sidebar";
import { CommentInput } from "@/components/site/comment-input";
import { RelatedPostCard } from "@/components/site/related-post-card";
import { PostAuthorMeta } from "@/components/site/post-author-meta";
import { PostDetailCTA } from "@/components/site/post-detail-cta";
import { ReaderStatsCard } from "@/components/site/reader-stats-card";
import { StudyPromoCard } from "@/components/site/study-promo-card";

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

const readerStats = [
  { label: "마케터", percentage: 35 },
  { label: "개발자", percentage: 28 },
  { label: "기획자", percentage: 20 },
  { label: "기타", percentage: 17 },
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
  },
  {
    slug: "automation-workflow",
    title: "자동화 워크플로우 설계 가이드",
    category: "자동화",
  },
  {
    slug: "marketing-ai-tools",
    title: "마케팅 AI 도구 비교 리뷰",
    category: "비즈니스",
  },
];

/* ─── Page ─── */

export default function PostDetailPage() {
  return (
    <div className="mx-auto max-w-[1080px] px-4 py-8">
      {/* Breadcrumb + Tags */}
      <div className="mb-6 space-y-2">
        <Breadcrumb
          items={[
            { label: "탐색", href: "/explore/feed" },
            { label: post.category, href: `/explore/feed?category=ai-usage` },
            { label: post.title },
          ]}
        />
        <TagList tags={post.tags} />
      </div>

      {/* Series Banner */}
      <Link
        href={`/series/${seriesInfo.id}`}
        className="flex items-center gap-2 px-4 py-2.5 mb-6 rounded-lg border border-border bg-accent text-sm hover:bg-accent/80 transition-colors"
      >
        <BookOpen className="w-4 h-4 text-primary shrink-0" />
        <span className="font-medium text-foreground">{seriesInfo.title}</span>
        <span className="text-muted-foreground">·</span>
        <span className="text-muted-foreground">{seriesInfo.currentPosition}/{seriesInfo.totalPosts}화</span>
        <ChevronRight className="w-4 h-4 text-muted-foreground ml-auto" />
      </Link>

      <div className="flex gap-8">
        {/* Main Content */}
        <article className="flex-1 min-w-0 max-w-3xl">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            {post.title}
          </h1>

          <PostAuthorMeta
            author={{
              name: post.author,
              href: `/profile/${post.username}`,
            }}
            date={post.time}
            viewCount={post.views}
            className="mb-8"
          />

          {/* Article Body */}
          <div className="space-y-6 text-foreground leading-relaxed mb-8">
            <h2 className="text-lg font-bold">배경</h2>
            <p className="text-muted-foreground">
              마케팅 팀에서 매주 반복적으로 보내는 이메일 캠페인을 Claude API를
              활용해 자동화한 경험을 공유합니다. 매주 3시간 이상 소요되던 작업을
              30분으로 줄인 과정을 상세히 설명하겠습니다.
            </p>

            <h2 className="text-lg font-bold">구축 과정</h2>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
              <li>데이터 수집 파이프라인 설계</li>
              <li>Claude API 연동 및 프롬프트 설계</li>
              <li>이메일 템플릿 자동 생성</li>
              <li>A/B 테스트 자동화</li>
              <li>테스트 및 배포</li>
            </ol>

            <h2 className="text-lg font-bold">1. 데이터 수집 파이프라인</h2>
            <p className="text-muted-foreground">
              먼저 Google Sheets에서 고객 데이터를 자동으로 수집하는 파이프라인을
              구축했습니다. n8n을 활용해 스프레드시트 변경 감지 시 자동으로
              트리거되도록 설정했습니다.
            </p>

            <div className="bg-muted rounded-md p-4 text-sm font-mono text-muted-foreground overflow-x-auto">
              <pre>{`// Claude API 호출 예시
const response = await anthropic.messages.create({
  model: "claude-sonnet-4-20250514",
  max_tokens: 1024,
  messages: [{ role: "user", content: prompt }],
});`}</pre>
            </div>

            <h2 className="text-lg font-bold">2. 프롬프트 설계</h2>
            <p className="text-muted-foreground">
              고객의 구매 이력, 관심사, 최근 활동 데이터를 기반으로 개인화된
              이메일을 생성하는 시스템 프롬프트를 설계했습니다. 핵심은 톤앤매너를
              일관되게 유지하면서도 각 고객에게 맞춤화된 내용을 생성하는 것이었습니다.
            </p>

            <h2 className="text-lg font-bold">3. 결과</h2>
            <p className="text-muted-foreground">
              자동화 파이프라인 도입 후 주당 3시간의 반복 작업을 30분으로 줄일 수
              있었습니다. 이메일 개인화 수준도 크게 향상되어 오픈율이 15%
              개선되었습니다.
            </p>
          </div>

          {/* Inline CTA (for non-members) */}
          <PostDetailCTA className="my-8" />

          {/* Reader Stats */}
          <ReaderStatsCard stats={readerStats} className="mb-8" />

          {/* Related Study */}
          <StudyPromoCard
            study={{
              title: "21기 AI 자동화 스터디",
              date: "3/15 ~ 4/26",
              price: "150,000원",
              href: "/study/ai-automation",
            }}
            className="mb-8"
          />

          {/* Series Navigation */}
          <nav className="flex items-stretch gap-4 my-8 py-4 border-y border-border">
            {seriesInfo.prevPost ? (
              <Link href={`/posts/${seriesInfo.prevPost.slug}`} className="flex-1 group">
                <p className="text-xs text-muted-foreground mb-1">이전 화</p>
                <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-1">
                  {seriesInfo.prevPost.title}
                </p>
              </Link>
            ) : <div className="flex-1" />}
            {seriesInfo.nextPost ? (
              <Link href={`/posts/${seriesInfo.nextPost.slug}`} className="flex-1 text-right group">
                <p className="text-xs text-muted-foreground mb-1">다음 화</p>
                <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-1">
                  {seriesInfo.nextPost.title}
                </p>
              </Link>
            ) : <div className="flex-1" />}
          </nav>

          {/* Comments */}
          <section>
            <h3 className="font-bold text-foreground mb-4">
              댓글 ({post.comments}개)
            </h3>

            <CommentTree comments={comments} />

            <CommentInput className="mt-6" />
          </section>

          {/* Related Posts */}
          <section className="mt-8">
            <h3 className="font-bold text-foreground mb-4">관련 글 추천</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {relatedPosts.map((rp) => (
                <RelatedPostCard
                  key={rp.slug}
                  slug={rp.slug}
                  title={rp.title}
                  category={rp.category}
                />
              ))}
            </div>
          </section>
        </article>

        {/* Sticky Sidebar (Desktop) */}
        <PostActionsSidebar votes={post.votes} comments={post.comments} />
      </div>
    </div>
  );
}
