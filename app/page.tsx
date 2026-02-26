import Link from "next/link";
import {
  ChevronRight,
  Flame,
  Clock,
  TrendingUp,
  Lightbulb,
  Sparkles,
  Zap,
  Code,
  Briefcase,
  Newspaper,
  Users,
  FileText,
  Calendar,
} from "lucide-react";
import { PostCard } from "@/components/site/post-card";
import { InlinePostForm } from "@/components/site/inline-post-form";
import { StudyCard } from "@/components/site/study-card";

/* ─── Mock Data ─── */

const announcement = {
  text: "21기 AI 스터디 모집 중 — 3/15 시작, 얼리버드 할인 진행 중",
  href: "/study/ai-automation",
};

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
  {
    slug: "midjourney-branding",
    category: "AI 활용법",
    title: "Midjourney로 브랜드 이미지 만들기",
    author: "이수현",
    time: "2일 전",
    tags: ["Midjourney", "디자인"],
    excerpt:
      "로고, 배너, SNS 콘텐츠까지 Midjourney로 일관된 브랜드 아이덴티티를 구축한 과정입니다.",
    votes: 65,
    comments: 8,
    thumbnail: true,
  },
  {
    slug: "n8n-workflow",
    category: "자동화",
    title: "n8n으로 업무 자동화 시작하기 — 슬랙 알림부터 데이터 수집까지",
    author: "박영호",
    time: "2일 전",
    tags: ["n8n", "자동화", "노코드"],
    excerpt:
      "n8n 셀프호스팅 후 슬랙 알림, 구글시트 동기화, RSS 수집 워크플로우를 만든 과정을 정리했습니다.",
    votes: 54,
    comments: 14,
    thumbnail: false,
  },
  {
    slug: "chatgpt-email",
    category: "AI 활용법",
    title: "ChatGPT로 이메일 자동 분류하기",
    author: "김영호",
    time: "3일 전",
    tags: ["ChatGPT", "자동화"],
    excerpt:
      "하루 100통 넘는 이메일을 ChatGPT API로 자동 분류하고 우선순위를 매기는 시스템을 구축했습니다.",
    votes: 24,
    comments: 5,
    thumbnail: false,
  },
  {
    slug: "system-prompt",
    category: "프롬프트",
    title: "시스템 프롬프트 설계 패턴 5가지",
    author: "박민수",
    time: "3일 전",
    tags: ["Claude", "고급"],
    excerpt:
      "역할 부여, 제약 조건, 출력 포맷, 예시 주입, 체인 오브 쏘트. 실무에서 검증된 5가지 패턴을 소개합니다.",
    votes: 67,
    comments: 18,
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

/* ─── Sort Tabs ─── */

const sortOptions = [
  { label: "인기", icon: Flame },
  { label: "최신", icon: Clock },
  { label: "추천", icon: TrendingUp },
];

/* ─── Page ─── */

export default function Home() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-4 space-y-4">
      {/* Announcement Bar */}
      <Link
        href={announcement.href}
        className="flex items-center justify-between px-4 py-2.5 rounded-lg bg-primary/10 text-sm"
      >
        <span className="text-primary font-medium">{announcement.text}</span>
        <ChevronRight className="w-4 h-4 text-primary shrink-0" />
      </Link>

      {/* Two-Column Layout */}
      <div className="flex gap-6 items-start">
        {/* ── Main Feed ── */}
        <div className="flex-1 min-w-0 space-y-4">
          {/* Inline Compose */}
          <InlinePostForm />

          {/* Sort Tabs */}
          <div className="flex items-center gap-1 border-b border-border pb-0">
            {sortOptions.map((opt, i) => (
              <button
                key={opt.label}
                className={`flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                  i === 0
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground"
                }`}
              >
                <opt.icon className="w-4 h-4" />
                {opt.label}
              </button>
            ))}
          </div>

          {/* Post Feed */}
          <div className="border border-border rounded-lg bg-background divide-y divide-border">
            {posts.map((post) => (
              <PostCard key={post.slug} {...post} />
            ))}
          </div>

          {/* Load More */}
          <button className="w-full py-3 text-sm text-muted-foreground border border-border rounded-lg bg-background">
            더 보기
          </button>
        </div>

        {/* ── Sidebar ── */}
        <aside className="w-80 hidden lg:flex flex-col gap-4 shrink-0">
          {/* Community Info */}
          <div className="border border-border rounded-lg bg-background overflow-hidden">
            <div className="bg-primary px-4 py-3">
              <h2 className="text-sm font-bold text-primary-foreground">
                GPTers 커뮤니티
              </h2>
            </div>
            <div className="p-4 space-y-3">
              <p className="text-sm text-muted-foreground">
                AI 활용에 관심 있는 사람들이 모여 인사이트를 나누는 커뮤니티
              </p>
              <div className="flex gap-4 text-sm">
                <div>
                  <p className="font-bold text-foreground">12.4k</p>
                  <p className="text-xs text-muted-foreground">멤버</p>
                </div>
                <div>
                  <p className="font-bold text-foreground">342</p>
                  <p className="text-xs text-muted-foreground">온라인</p>
                </div>
                <div>
                  <p className="font-bold text-foreground">1.2k</p>
                  <p className="text-xs text-muted-foreground">게시글/주</p>
                </div>
              </div>
              <button className="w-full py-2 text-sm bg-primary text-primary-foreground rounded-md font-medium">
                가입하기
              </button>
            </div>
          </div>

          {/* Categories */}
          <div className="border border-border rounded-lg bg-background">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <h3 className="text-sm font-bold text-foreground">카테고리</h3>
              <Link
                href="/explore/feed"
                className="text-xs text-muted-foreground"
              >
                전체보기
              </Link>
            </div>
            <div className="p-2">
              {categories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/explore/feed?category=${cat.slug}`}
                  className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-foreground"
                >
                  <cat.icon className="w-4 h-4 text-primary shrink-0" />
                  <span className="flex-1">{cat.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {cat.count}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Recruiting Studies */}
          <div className="border border-border rounded-lg bg-background">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <h3 className="text-sm font-bold text-foreground">
                모집 중인 스터디
              </h3>
              <Link href="/study" className="text-xs text-muted-foreground">
                전체보기
              </Link>
            </div>
            <div className="p-3 space-y-3">
              {studies.map((study) => (
                <Link
                  key={study.slug}
                  href={`/study/${study.slug}`}
                  className="block p-3 border border-border rounded-md space-y-2"
                >
                  <p className="text-sm font-medium text-foreground">
                    {study.title}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {study.date}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Users className="w-3 h-3" />
                      {study.enrolled}/{study.capacity}명
                    </span>
                    <span className="text-primary font-medium">
                      {study.price}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Community Rules */}
          <div className="border border-border rounded-lg bg-background">
            <div className="px-4 py-3 border-b border-border">
              <h3 className="text-sm font-bold text-foreground">
                커뮤니티 규칙
              </h3>
            </div>
            <div className="p-4 space-y-2 text-xs text-muted-foreground">
              <p>1. 서로 존중하기</p>
              <p>2. AI 관련 주제만 게시</p>
              <p>3. 홍보/스팸 금지</p>
              <p>4. 출처 명시하기</p>
              <p>5. 개인정보 보호</p>
            </div>
          </div>

          {/* Footer Links */}
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
