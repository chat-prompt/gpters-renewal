import Link from "next/link";
import {
  Lightbulb,
  Sparkles,
  Zap,
  Code,
  Briefcase,
  Newspaper,
} from "lucide-react";
import { PostCard } from "@/components/site/post-card";
import { InlinePostForm } from "@/components/site/inline-post-form";
import { AnnouncementBar } from "@/components/site/announcement-bar";
import { SortTabs } from "@/components/site/sort-tabs";
import { CommunityInfoCard } from "@/components/site/community-info-card";
import { CategoryList } from "@/components/site/category-list";
import { SidebarStudyList } from "@/components/site/sidebar-study-list";
import { CommunityRules } from "@/components/site/community-rules";

/* ─── Mock Data ─── */

const posts = [
  {
    slug: "claude-marketing",
    category: "AI 활용법",
    title: "Claude로 마케팅 자동화 구축기 — 광고 카피부터 성과 분석까지",
    author: "홍길동",
    time: "3시간 전",
    tags: ["Claude", "마케팅", "자동화"],
    excerpt:
      "Claude API를 활용해 광고 카피 생성, A/B 테스트 문구 비교, 주간 성과 리포트까지 자동으로 돌아가는 파이프라인을 만들었습니다.",
    votes: 142,
    comments: 23,
    thumbnail: true,
  },
  {
    slug: "gpt4o-prompt",
    category: "프롬프트",
    title: "GPT-4o 프롬프트 작성법 완전 가이드",
    author: "이영희",
    time: "5시간 전",
    tags: ["GPT-4o", "프롬프트", "입문"],
    excerpt:
      "시스템 프롬프트 설계부터 체이닝, 구조화된 출력까지. 비개발자도 따라할 수 있는 프롬프트 작성 가이드입니다.",
    votes: 98,
    comments: 15,
    thumbnail: false,
  },
  {
    slug: "cursor-fullstack",
    category: "개발/코딩",
    title: "Cursor로 풀스택 앱 만들기 — 기획부터 배포까지 3일 완성",
    author: "박철수",
    time: "1일 전",
    tags: ["Cursor", "바이브코딩", "풀스택"],
    excerpt:
      "Cursor + Supabase + Vercel 조합으로 3일 만에 SaaS를 배포한 경험을 공유합니다. 코드 한 줄도 직접 안 쳤습니다.",
    votes: 87,
    comments: 31,
    thumbnail: true,
  },
  {
    slug: "ai-business-plan",
    category: "비즈니스",
    title: "AI로 사업계획서 작성하는 법",
    author: "김민지",
    time: "1일 전",
    tags: ["비즈니스", "ChatGPT"],
    excerpt:
      "투자자 미팅용 사업계획서를 ChatGPT와 함께 작성했습니다. 시장 분석, 재무 모델링, 피치덱까지.",
    votes: 76,
    comments: 19,
    thumbnail: false,
  },
];

const categories = [
  { name: "AI 활용법", slug: "ai-usage", count: 234, icon: Lightbulb },
  { name: "프롬프트", slug: "prompt", count: 156, icon: Sparkles },
  { name: "자동화", slug: "automation", count: 89, icon: Zap },
  { name: "개발/코딩", slug: "dev", count: 121, icon: Code },
  { name: "비즈니스", slug: "business", count: 78, icon: Briefcase },
  { name: "AI 뉴스", slug: "news", count: 203, icon: Newspaper },
];

const studies = [
  {
    slug: "ai-automation",
    title: "21기 AI 자동화 스터디",
    date: "3/15 ~ 4/26 (6주)",
    enrolled: 12,
    capacity: 20,
    price: "150,000원",
  },
  {
    slug: "prompt-engineering",
    title: "21기 프롬프트 엔지니어링",
    date: "3/22 ~ 5/3 (6주)",
    enrolled: 8,
    capacity: 15,
    price: "120,000원",
  },
  {
    slug: "vibe-coding",
    title: "21기 바이브 코딩 스터디",
    date: "4/1 ~ 5/10 (6주)",
    enrolled: 5,
    capacity: 20,
    price: "130,000원",
  },
];

/* ─── Page ─── */

export default function Home() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-6 space-y-5">
      <AnnouncementBar
        text="21기 AI 스터디 모집 중 — 3/15 시작, 얼리버드 할인 진행 중"
        href="/study/ai-automation"
      />

      <div className="flex gap-6 items-start">
        {/* Main Feed */}
        <div className="flex-1 min-w-0 space-y-5">
          <InlinePostForm />
          <SortTabs />
          <div className="border border-border rounded-lg divide-y divide-border">
            {posts.map((post) => (
              <PostCard key={post.slug} {...post} />
            ))}
          </div>
          <button className="w-full py-3 text-sm text-muted-foreground border border-border rounded-lg">
            더 보기
          </button>
        </div>

        {/* Sidebar */}
        <aside className="w-72 hidden lg:flex flex-col gap-5 shrink-0">
          <CommunityInfoCard
            members="12.4k"
            online="342"
            postsPerWeek="1.2k"
          />
          <CategoryList categories={categories} />
          <SidebarStudyList studies={studies} />
          <CommunityRules />
          <div className="text-xs text-muted-foreground space-y-2 px-2">
            <div className="flex flex-wrap gap-x-3 gap-y-1">
              <Link href="#">이용약관</Link>
              <Link href="#">개인정보처리방침</Link>
              <Link href="#">문의하기</Link>
            </div>
            <p>GPTers &copy; 2025</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
