"use client";

import Link from "next/link";
import { Award, BookOpen, Sparkles } from "lucide-react";
import { Accordion } from "@/components/ui/accordion";
import { StatGrid } from "@/components/site/stat-grid";
import { SkillBarList, type SkillItem } from "@/components/site/skill-bar";
import { ProfileHeader } from "@/components/site/profile-header";
import { StudyHistoryList } from "@/components/site/study-history-card";
import { BadgeDetailCard } from "@/components/site/badge-detail-card";
import { PostCard } from "@/components/site/post-card";
import {
  Medal,
  GraduationCap,
  Star,
  Handshake,
  Crown,
  PenLine,
  Rocket,
  MessageCircle,
} from "lucide-react";

/* ─── Mock Data ─── */

const stats = [
  { label: "스터디 수료", value: 3 },
  { label: "작성 글", value: 27 },
  { label: "받은 투표", value: "1,234" },
  { label: "댓글", value: 156 },
  { label: "포인트", value: "2,450" },
];

const skills: SkillItem[] = [
  { name: "자동화/노코드", level: 100, note: "스터디 2회 수료" },
  { name: "프롬프트", level: 80, note: "스터디 1회 수료" },
  { name: "마케팅 AI", level: 60, note: "게시글 12건" },
  { name: "개발/코딩", level: 40, note: "게시글 5건" },
];

const studyHistory = [
  {
    title: "21기 AI 자동화 스터디",
    period: "2026.01.15 ~ 2026.02.26",
    leader: "김영호",
    posts: 3,
    project: "마케팅 이메일 자동화 파이프라인",
    badge: "AI 자동화 전문가",
  },
  {
    title: "20기 프롬프트 엔지니어링",
    period: "2025.11.01 ~ 2025.12.13",
    leader: "이수진",
    posts: 2,
    project: "고급 프롬프트 체이닝 가이드",
    badge: "프롬프트 마스터",
  },
  {
    title: "19기 AI 기초",
    period: "2025.09.01 ~ 2025.10.12",
    leader: "박민수",
    posts: 1,
    project: "AI 도구 활용 실습 포트폴리오",
    badge: "AI 입문자",
  },
];

const interestTags = [
  "AI 자동화",
  "프롬프트 엔지니어링",
  "마케팅 AI",
  "n8n",
  "Claude",
];

const featuredBadges = [
  { icon: Medal, label: "AI 자동화 전문가" },
  { icon: Star, label: "베스트 사례 3회" },
  { icon: Crown, label: "기여왕" },
];

const allBadges = [
  {
    icon: Medal,
    name: "AI 자동화 전문가",
    earnedDate: "2026.02.26",
    description: "AI 자동화 스터디를 수료하고 최종 프로젝트를 완성하여 획득",
  },
  {
    icon: GraduationCap,
    name: "3기 수료",
    earnedDate: "2026.02.26",
    description: "3개 기수 연속으로 스터디를 수료하여 획득",
  },
  {
    icon: Star,
    name: "베스트 사례 3회",
    earnedDate: "2026.01.20",
    description: "작성한 AI 활용 사례가 3회 베스트로 선정되어 획득",
  },
  {
    icon: Handshake,
    name: "모각AI 리더",
    earnedDate: "2025.12.15",
    description: "모각AI 세션을 5회 이상 리드하여 획득",
  },
  {
    icon: Crown,
    name: "기여왕",
    earnedDate: "2025.11.30",
    description: "월간 기여 포인트 Top 3에 진입하여 획득",
  },
  {
    icon: PenLine,
    name: "프롬프트 마스터",
    earnedDate: "2025.12.13",
    description: "프롬프트 엔지니어링 스터디를 수료하여 획득",
  },
  {
    icon: Rocket,
    name: "AI 입문자",
    earnedDate: "2025.10.12",
    description: "첫 번째 AI 스터디를 성공적으로 수료하여 획득",
  },
  {
    icon: MessageCircle,
    name: "소통왕",
    earnedDate: "2025.10.01",
    description: "댓글 100개 이상 작성하여 획득",
  },
];

const userSeries = [
  {
    id: "1",
    title: "맘스만 개발기",
    description: "육아와 개발을 병행하는 엄마 개발자의 AI 활용 여정",
    category: "AI활용법",
    status: "진행중" as const,
    postCount: 3,
    totalVotes: 89,
  },
  {
    id: "2",
    title: "자동화 마스터 클래스",
    description: "업무 자동화의 A to Z, n8n과 Claude API를 활용한 실전 가이드",
    category: "자동화",
    status: "완결" as const,
    postCount: 4,
    totalVotes: 156,
  },
];

const userPosts = [
  {
    slug: "moms-dev-3",
    title: "런칭 후기 — 첫 사용자 100명 달성",
    excerpt:
      "드디어 맘스만 서비스를 런칭했습니다. 첫 달 100명의 사용자를 달성하기까지의 마케팅 전략과 AI 활용 경험을 공유합니다.",
    category: "AI활용법",
    time: "2026.03.01",
    votes: 45,
    comments: 12,
    tags: ["ChatGPT", "육아"],
    seriesId: "1",
    seriesTitle: "맘스만 개발기",
    positionInSeries: 3,
  },
  {
    slug: "ai-tools-review",
    title: "2026년 AI 도구 비교 리뷰",
    excerpt:
      "ChatGPT, Claude, Gemini를 실무에서 3개월간 사용한 비교 리뷰. 각 도구의 장단점과 최적 사용 시나리오를 정리했습니다.",
    category: "AI활용법",
    time: "2026.03.05",
    votes: 89,
    comments: 23,
    tags: ["ChatGPT", "Claude", "Gemini"],
  },
  {
    slug: "prompt-tips",
    title: "프롬프트 엔지니어링 실전 팁 10가지",
    excerpt:
      "현업에서 바로 활용할 수 있는 프롬프트 작성 노하우. 역할 부여, 체이닝, Few-shot 등 실전에서 검증된 기법들을 소개합니다.",
    category: "프롬프트",
    time: "2026.02.28",
    votes: 67,
    comments: 18,
    tags: ["프롬프트", "ChatGPT"],
  },
  {
    slug: "claude-marketing",
    title: "Claude로 마케팅 자동화 구축기",
    excerpt:
      "마케팅 팀에서 매주 반복적으로 보내는 이메일 캠페인을 Claude API를 활용해 자동화한 경험을 공유합니다.",
    category: "AI활용법",
    time: "2026.02.22",
    votes: 142,
    comments: 23,
    tags: ["Claude", "마케팅", "자동화"],
    seriesId: "1",
    seriesTitle: "맘스만 개발기",
    positionInSeries: 2,
  },
  {
    slug: "no-code-automation",
    title: "비개발자를 위한 노코드 자동화 입문",
    excerpt:
      "n8n, Zapier, Make를 활용한 업무 자동화 시작하기. 코딩 없이 이메일 알림부터 데이터 수집까지 자동화하는 방법을 안내합니다.",
    category: "자동화",
    time: "2026.02.20",
    votes: 56,
    comments: 15,
    tags: ["n8n", "노코드", "자동화"],
  },
  {
    slug: "moms-dev-1",
    title: "아이디어 구상기 — AI로 육아 도우미 만들기",
    excerpt:
      "육아와 개발을 병행하면서 느낀 불편함을 AI로 해결하려는 첫 시도. 아이디어 구상부터 기술 스택 선정까지의 과정을 기록합니다.",
    category: "AI활용법",
    time: "2026.02.15",
    votes: 34,
    comments: 8,
    tags: ["AI", "육아"],
    seriesId: "1",
    seriesTitle: "맘스만 개발기",
    positionInSeries: 1,
  },
  {
    slug: "ai-email-newsletter",
    title: "AI로 뉴스레터 자동 작성하기",
    excerpt:
      "매주 보내는 뉴스레터 작성에 Claude를 활용한 워크플로우. 주제 선정부터 발송까지 반자동화한 경험을 공유합니다.",
    category: "자동화",
    time: "2026.02.10",
    votes: 41,
    comments: 9,
    tags: ["Claude", "뉴스레터"],
  },
  {
    slug: "n8n-webhook-guide",
    title: "n8n 웹훅 활용 완전 가이드",
    excerpt:
      "n8n의 웹훅 노드를 활용해 슬랙 알림, 구글 시트 연동, API 자동 호출 등 실전 워크플로우를 구축하는 방법을 정리했습니다.",
    category: "자동화",
    time: "2026.01.28",
    votes: 78,
    comments: 21,
    tags: ["n8n", "자동화", "웹훅"],
  },
];

/* ─── Page ─── */

export default function ProfilePage() {
  return (
    <div className="mx-auto max-w-[1080px] px-4 py-8 space-y-8">
      {/* Profile Header + Featured Badges */}
      <ProfileHeader
        user={{
          name: "홍길동",
          username: "honggildong",
          bio: "AI 자동화 전문가 · 마케터",
          joinDate: "2025.03",
          quote: "AI로 반복 업무를 자동화하는 것에 관심이 많습니다.",
          points: "2,450",
          interestTags,
          links: [
            { label: "GitHub", href: "#" },
            { label: "LinkedIn", href: "#" },
            { label: "블로그", href: "#" },
          ],
        }}
        featuredBadges={featuredBadges}
      />

      {/* Stats */}
      <StatGrid items={stats} columns={5} />

      {/* AI Usage Auto-Summary */}
      <section className="border border-border rounded-lg bg-accent p-5 space-y-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          <h3 className="font-bold text-foreground">
            AI 활용 요약 (자동 생성)
          </h3>
        </div>
        <p className="text-sm text-foreground italic leading-relaxed">
          &ldquo;이 사용자는 주로 Claude와 n8n을 활용하여 마케팅 자동화
          분야에서 활동합니다. 19기~21기까지 3개 스터디를 수료했으며, AI 활용
          사례 게시글 27건을 작성했습니다.&rdquo;
        </p>
        <p className="text-xs text-muted-foreground flex items-center gap-1">
          <Sparkles className="w-3 h-3" />
          AI가 자동 생성한 요약입니다
        </p>
      </section>

      {/* Series */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="w-4 h-4 text-muted-foreground" />
          <h3 className="font-bold text-foreground">시리즈</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {userSeries.map((series) => (
            <Link
              key={series.id}
              href={`/series/${series.id}`}
              className="block border border-border rounded-lg p-4 hover:bg-accent transition"
            >
              <h4 className="font-bold text-foreground mb-1">
                {series.title}
              </h4>
              <p className="text-sm text-muted-foreground line-clamp-1 mb-3">
                {series.description}
              </p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{series.postCount}편</span>
                <span
                  className={`px-2 py-0.5 rounded ${
                    series.status === "완결"
                      ? "bg-primary/10 text-primary"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {series.status}
                </span>
                <span>{series.category}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Post Feed (Main Content) */}
      <section>
        <h3 className="font-bold text-foreground mb-2">작성글</h3>
        <div className="divide-y divide-border">
          {userPosts.map((post) => (
            <PostCard
              key={post.slug}
              slug={post.slug}
              category={post.category}
              title={post.title}
              author="홍길동"
              time={post.time}
              tags={post.tags}
              excerpt={post.excerpt}
              votes={post.votes}
              comments={post.comments}
              showAuthor={false}
              seriesId={post.seriesId}
              seriesTitle={post.seriesTitle}
              positionInSeries={post.positionInSeries}
            />
          ))}
        </div>
      </section>

      {/* Collapsible Sections */}
      <Accordion
        items={[
          {
            key: "study-history",
            title: `스터디 이력 (${studyHistory.length})`,
            children: (
              <div className="space-y-4">
                <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-accent border border-border">
                  <Award className="w-5 h-5 text-primary" />
                  <span className="text-sm font-semibold text-foreground">
                    3기 연속 수료
                  </span>
                  <span className="text-xs text-muted-foreground">
                    — 꾸준한 학습 의지를 보여주는 뱃지입니다
                  </span>
                </div>
                <StudyHistoryList
                  studies={studyHistory}
                  className="border-0 rounded-none"
                />
              </div>
            ),
          },
          {
            key: "skill-map",
            title: "AI 스킬 맵",
            children: (
              <SkillBarList
                skills={skills}
                className="border-0 rounded-none"
              />
            ),
          },
          {
            key: "all-badges",
            title: `뱃지 전체 (${allBadges.length})`,
            children: (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {allBadges.map((badge) => (
                  <BadgeDetailCard key={badge.name} badge={badge} />
                ))}
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}
