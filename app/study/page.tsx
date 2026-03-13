"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronRight, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/* ── Mock Data ── */

type CohortStatus = "recruiting" | "waitlist";

const cohort = {
  number: 21,
  title: "GPTers 21기 바이브코딩 스터디",
  tagline: "AI한테 질문하는 시대는\n끝났습니다.",
  description:
    "이제는 시키세요.\n웹 서비스 배포, 영상 제작, 에이전트 만들기까지\n개발을 해보지 않았어도 1달이면 충분합니다.",
  startDate: "3/16",
  duration: "4주 과정",
  format: "온라인 (1주차 오프라인 포함)",
  waitlistCount: 237,
  status: "recruiting" as CohortStatus,
};

const categories = ["개발&자동화", "업무&비즈니스", "콘텐츠&지식"] as const;

const programs = [
  // 개발&자동화
  { slug: "dev-env-setup", title: "바이브코딩 입문자를 위한, 실수가 자유로운 개발 연습장 만들기", category: "개발&자동화", instructor: "이재엽", level: "입문", day: "화" },
  { slug: "monetize-mvp", title: "개발자 없이 직접 만드는, 결제·SEO까지 완성된 수익형 웹 MVP 4주 런칭", category: "개발&자동화", instructor: "김혜련", level: "입문", day: "수" },
  { slug: "weekly-build", title: "아이디어만 가져오세요. 4주. 서비스 4개. — Claude Code + bkit으로 매주 쳐내는 스터디", category: "개발&자동화", instructor: "황인준", level: "입문", day: "수" },
  { slug: "thanks-claude-code", title: "Claude Code로 가족과 동료에게 도움주고 \"고마워\"를 받아보기!", category: "개발&자동화", instructor: "진여진", level: "중급", day: "화" },
  { slug: "cto", title: "직장인 사이드프로젝트러·인디해커를 위한, 4주만에 웹 MVP 직접 배포하기", category: "개발&자동화", instructor: "개발자F & 댕댕이멍멍", level: "중급", day: "수" },
  { slug: "life-automation", title: "얼리어답터를 위한 OpenClaw로 내 삶 자동화 비서 만들기", category: "개발&자동화", instructor: "박정기 & 디디DD", level: "중급", day: "목" },
  // 업무&비즈니스
  { slug: "startup-lab", title: "스타트업실험실: 퍼스널 브랜딩편 나만의 프로필 웹페이지", category: "업무&비즈니스", instructor: "여행가J & 타이칸", level: "입문", day: "수" },
  { slug: "manus-skills", title: "Manus Agent Skills로 나에게 꼭 맞는 맞춤형 AI 워크플로우 완성", category: "업무&비즈니스", instructor: "브라이언 & 무니", level: "입문", day: "목" },
  { slug: "social-impact", title: "운영에서 해방, 미션에 집중 — 바이브코딩으로 소셜임팩트 증폭하기", category: "업무&비즈니스", instructor: "닿", level: "입문", day: "목" },
  { slug: "blog-to-fan", title: "블로그 방문자를 팬으로 전환하는 퍼널 마케팅 시스템, 4주 만에 직접 구축하기", category: "업무&비즈니스", instructor: "박카스", level: "중급", day: "화" },
  { slug: "ai-workspace", title: "AI 워크스페이스 2.0 — 비개발자 업무를 처음부터 끝까지 다루는 AI 업무자동화 팀 만들기", category: "업무&비즈니스", instructor: "안상영", level: "중급", day: "수" },
  { slug: "chat-apt", title: "Chat APT 시즌2: Claude Code로 부동산 AI 분석 워크스페이스 만들기", category: "업무&비즈니스", instructor: "GPTaku & 정케빈", level: "중급", day: "목" },
  // 콘텐츠&지식
  { slug: "kkulim-video", title: "영상 입문자를 위한 Remotion + AI로 나만의 끌리는 영상 만들기", category: "콘텐츠&지식", instructor: "물결2", level: "입문", day: "화" },
  { slug: "sns-automation", title: "콘텐츠 하나로 5개 SNS 발행 및 댓글 수집·분석을 Antigravity로 자동화하기", category: "콘텐츠&지식", instructor: "코아_AI작가", level: "입문", day: "화" },
  { slug: "ai-shortform-drama", title: "1인 창작자를 위한 Claude Code로 AI 숏폼 드라마/시리즈 파이프라인 구축", category: "콘텐츠&지식", instructor: "허세임", level: "입문", day: "수" },
  { slug: "edu-app-build", title: "IT 강사를 위한 Antigravity로 교육용 앱 4주만에 완성하기", category: "콘텐츠&지식", instructor: "EasyoungEdu & 엘리1004", level: "입문", day: "목" },
  { slug: "ebook-publish", title: "AI만 배우다 지친 당신을 위한 Claude Code로 전자책 출판하기", category: "콘텐츠&지식", instructor: "송아영", level: "입문", day: "목" },
  { slug: "obsidian", title: "옵시디언 유저를 위한 오픈클로 + 클로드코드로 AI 에이전트 워크플로우 만들기", category: "콘텐츠&지식", instructor: "구요한 & 이태극", level: "중급", day: "화" },
];

const pricing = [
  { period: "2/24 ~ 3/2", tier: "슈퍼얼리버드", discount: 10, price: 269000, original: 299000, highlight: true },
  { period: "3/3 ~ 3/9", tier: "얼리버드", discount: 5, price: 284000, original: 299000, highlight: false },
  { period: "3/10 ~ 3/12", tier: "정가", discount: 0, price: 299000, original: 299000, highlight: false },
];

const reviews = [
  { name: "펙트형", color: "bg-amber-400", cohort: "16기 Canva", text: "내가 이것도 가능하지 않을까? 머리속으로 생각에만 머물렀던 것들을 실제로 구현하는 분들, 생각하지도 못했던 것들을 시도하는 분들을 보면서 AI 가능성에 확신을 갖게 되었습니다." },
  { name: "흥곰이", color: "bg-orange-400", cohort: "16기 GPT업무도우미", text: "처음 AI를 시작해서 긴장도 되고 걱정도 많았는데, 천천히 하나씩 따라가다보니 즐겁게 배울 수 있었습니다. 어느순간 직접 사례게시글도 작성해보고 발표도 하는 자신을 발견해서 신기하기도 했고요." },
  { name: "글로우제이", color: "bg-pink-400", cohort: "16기 UXer", text: "내가 배우고자 하는걸 같이 즐겁게 배울 수 있는 사람들이 모인 곳이라서 가장 좋아요!" },
  { name: "안성국", color: "bg-blue-400", cohort: "16기 전자책", text: "누구나 갖고 있는 스토리를 쉽게 풀어내고, 본인이 좋아하는 주제를 찾을 뿐 아니라 초안까지 쉽게 작성할 수 있었어요." },
  { name: "조용준", color: "bg-green-400", cohort: "15기 옵시디언", text: "지피터스에 배움과 공유를 즐기시는 분들이 정말 많다는 것을 느꼈습니다. 다양한 분야의 분들을 만나게 되었어요. 서로가 가진 지식의 깊이가 놀라웠고, 스터디 활동을 통해 여러 분야의 전문 지식을 경험할 수 있어서 매우 뜻깊었습니다." },
  { name: "푸르공", color: "bg-purple-400", cohort: "14기 노션자동화", text: "현장의 생생한 피드백과 경험들을 제 서비스에 바로 반영할 수 있었고, 덕분에 서비스가 한 단계 더 성장할 수 있는 좋은 계기가 되었습니다!" },
];

const faqs = [
  { q: "지피터스 AI스터디는 무엇이며, 다른 강의와는 어떤 차이점이 있나요?", a: "지피터스 AI스터디는 강사 없이 멤버들이 각자 AI를 써보고 공유하며 학습하는 방식으로 진행됩니다. 멤버들이 AI 사례게시글을 사전에 업로드하고, 서로 공유하는 피어러닝 방식입니다." },
  { q: "AI스터디를 여러 개 듣고 싶은데 가능한가요?", a: "네, 가능합니다. AI 스터디를 구매하시면 구매하신 기수 전체 스터디에 실시간 참여가 가능합니다. (단, 신청하신 스터디와 같은 요일에 진행되는 스터디 제외)" },
  { q: "AI에 대해 들어만 봤을 뿐, 아무것도 모르는데 저 같은 사람도 수강할 수 있나요?", a: "AI 입문자를 위한 스터디도 준비되어 있습니다. AI를 거의 써보지 않았어도 충분히 스터디장을 따라서 실습하면서 배울 수 있어요. 입문 태그 스터디를 둘러보세요." },
  { q: "스터디 주제 선택은 어떻게 하나요?", a: "스터디 구매 완료 후 스터디 주제를 선택할 수 있습니다. (각 스터디 별 정원 30명) 사전구매자는 공식 판매기간 시작일에 수강신청 안내를 받게 되며, 스터디 주제를 택1 하게 됩니다. 이후 1주차 OT 기간에 스터디 주제를 변경할 수 있습니다." },
  { q: "수강신청 기간에, 원하는 스터디 모집이 마감되면 어떻게 하나요?", a: "주제별 스터디의 정원은 최대 30명입니다. 원하는 스터디가 있다면 가급적 빠르게 수강신청하시는 것을 권장합니다. 모집이 마감되었어도 '청강'을 통해 스터디에 참여하실 수 있습니다." },
  { q: "실시간 참여를 못하는데, 추후에 다시 볼 수 있나요?", a: "1주차 일정의 다시보기는 모두 제공됩니다. 수강 스터디의 다시보기는 게시글 작성 여부와 무관하게 제공됩니다. 게시글을 작성한 주차에는 해당 주간의 오픈된 스터디 전체 다시보기를 드립니다." },
  { q: "AI 스터디에 강의는 아예 없나요?", a: "AI에 낯선 분들이 스터디에 잘 적응하실 수 있도록, 1~2주차 월요일 9PM-11PM에는 AI 핵심강의가 제공됩니다." },
  { q: "스터디를 결제한 뒤, 환불받을 수 있나요?", a: "21기 시작일(26.03.16) 00시 이전 환불 요청 시 전체 금액 100% 자동 환불. 시작일 이후 결제일 기준 7일 이내인 경우 구매 금액의 75% 환불 가능. 7일이 지났다면 환불 불가." },
  { q: "수강신청한 스터디가 모집 미달이 되면 어떻게 되나요?", a: "스터디 모집 마감일 다음 날 오후 3시에 스터디의 진행 여부를 알려드립니다. 최소 모집 인원(12명)이 모이지 않으면 해당 스터디는 진행되지 않으며, 1주차 금요일 오후 3시까지 주제를 변경하실 수 있습니다." },
  { q: "수료증은 어떻게 받을 수 있나요?", a: "수료증은 기수별 우수활동자가 되시면 스터디 종료 후 발급해드립니다. 우수활동자 기준: 수강 스터디에서 2개 이상 사례 게시글 작성 + 2회 이상 ZOOM 라이브 참여." },
];

/* ── Page ── */

export default function StudyLandingPage() {
  const [openFaqs, setOpenFaqs] = useState<Set<number>>(new Set());
  const [openCategories, setOpenCategories] = useState<Set<string>>(
    new Set(categories)
  );

  const toggleFaq = (idx: number) => {
    setOpenFaqs((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  const toggleCategory = (cat: string) => {
    setOpenCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  };

  const isRecruiting = cohort.status === "recruiting";

  return (
    <div>
      {/* ── Section 1: Hero ── */}
      <section className="bg-gradient-to-b from-primary/10 via-primary/5 to-transparent py-20">
        <div className="mx-auto max-w-[1080px] px-6 text-center">
          <span className="block w-fit mx-auto px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            {cohort.waitlistCount}명이 스터디를 기다리고 있어요!
          </span>
          <h1 className="text-3xl md:text-5xl font-bold text-foreground leading-tight whitespace-pre-line mb-6">
            {cohort.tagline}
          </h1>
          <div className="w-fit mx-auto rounded-xl bg-background/60 backdrop-blur-sm border border-border/50 px-8 py-6 mb-8">
            <p className="text-sm md:text-base font-regular text-sub-foreground leading-relaxed whitespace-pre-line">
              {cohort.description}
            </p>
          </div>
          <div className="mb-4">
            {isRecruiting ? (
              <Link href="/checkout/21">
                <Button size="lg" className="text-base px-8 py-3">
                  {cohort.number}기 AI 스터디 신청하기
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            ) : (
              <Button size="lg" className="text-base px-8 py-3">
                다음 기수 알림 받기
              </Button>
            )}
          </div>
          <p className="text-sm text-sub-foreground">
            {cohort.startDate} 시작 | {cohort.duration} | {cohort.format}
          </p>
        </div>
      </section>

      {/* ── Section 2: Programs ── */}
      <section className="mx-auto max-w-[1080px] px-6 py-16">
        <div className="text-center mb-10">
          <p className="text-sm text-primary font-medium mb-2">Programs</p>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            {cohort.number}기 AI 스터디 프로그램
          </h2>
          <p className="text-sm text-sub-foreground">
            3개 카테고리, 총 {programs.length}개 스터디에서 나에게 맞는 주제를
            찾아보세요
          </p>
        </div>

        <div className="space-y-6">
          {categories.map((cat) => {
            const catPrograms = programs.filter((p) => p.category === cat);
            const isOpen = openCategories.has(cat);
            return (
              <div key={cat}>
                <button
                  onClick={() => toggleCategory(cat)}
                  className="flex items-center gap-2 mb-3 group"
                >
                  <ChevronDown
                    className={cn(
                      "w-4 h-4 text-sub-foreground transition-transform",
                      !isOpen && "-rotate-90"
                    )}
                  />
                  <span className="text-sm font-bold text-foreground">
                    {cat}
                  </span>
                  <span className="text-xs text-sub-foreground">
                    {catPrograms.length}
                  </span>
                </button>
                {isOpen && (
                  <div className="divide-y divide-border rounded-lg border border-border">
                    {catPrograms.map((p) => (
                      <Link
                        key={p.slug}
                        href={`/study/${p.slug}`}
                        className="flex items-center gap-4 px-4 py-3.5 hover:bg-muted/50 transition-colors group"
                      >
                        {/* Thumbnail placeholder */}
                        <div className="w-12 h-12 rounded-lg bg-muted shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span
                              className={cn(
                                "text-xs px-1.5 py-0.5 rounded font-medium",
                                p.level === "입문"
                                  ? "bg-green-50 text-green-700"
                                  : "bg-blue-50 text-blue-700"
                              )}
                            >
                              {p.level}
                            </span>
                          </div>
                          <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
                            {p.title}
                          </p>
                          <p className="text-xs text-sub-foreground mt-0.5">
                            {p.instructor}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-xs text-sub-foreground font-medium">
                            {p.day}
                          </span>
                          <ChevronRight className="w-4 h-4 text-sub-foreground" />
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <p className="text-center text-sm text-sub-foreground mt-6">
          {cohort.number}기에는 총{" "}
          <strong className="text-foreground">{programs.length}개</strong>{" "}
          스터디가 진행됩니다
        </p>
      </section>

      {/* ── Section 3: Pricing ── */}
      {isRecruiting && (
        <section className="bg-muted/30 py-16">
          <div className="mx-auto max-w-[1080px] px-6">
            <div className="text-center mb-10">
              <p className="text-sm text-primary font-medium mb-2">
                특별 혜택가
              </p>
              <h2 className="text-2xl font-bold text-foreground">
                {cohort.waitlistCount}명이 기다린 {cohort.number}기 AI 스터디
                <br />
                가장 좋은 혜택으로 &lsquo;지금&rsquo; 만나보세요
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {pricing.map((tier) => (
                <div
                  key={tier.tier}
                  className={cn(
                    "rounded-xl border p-6 text-center",
                    tier.highlight
                      ? "border-primary bg-primary/5"
                      : "border-border"
                  )}
                >
                  <p className="text-xs text-sub-foreground mb-2">
                    {tier.period}
                  </p>
                  {tier.discount > 0 && (
                    <span className="inline-block px-2 py-0.5 rounded-full bg-primary text-white text-xs font-bold mb-2">
                      {tier.discount}%
                    </span>
                  )}
                  <p className="text-sm font-bold text-foreground mb-1">
                    {tier.tier}
                  </p>
                  {tier.discount > 0 && (
                    <p className="text-xs text-sub-foreground line-through">
                      {tier.original.toLocaleString()}원
                    </p>
                  )}
                  <p className="text-xl font-bold text-foreground">
                    {tier.price.toLocaleString()}원
                  </p>
                </div>
              ))}
            </div>

            <div className="rounded-xl border border-border p-6 text-center space-y-3">
              <p className="text-sm text-sub-foreground">
                사전판매 구매 시 수강신청 오픈 리마인드 제공 · 주제별 정원 30명
                선착순
              </p>
              <div className="flex justify-center gap-6 text-sm">
                <span className="text-foreground">
                  연속참여{" "}
                  <strong className="text-primary">10만원 할인</strong>
                </span>
                <span className="text-foreground">
                  설명회 참여{" "}
                  <strong className="text-primary">1만원 추가 할인</strong>
                </span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Section 4: Reviews ── */}
      <section className="mx-auto max-w-[1080px] px-6 py-16">
        <div className="text-center mb-10">
          <p className="text-sm text-primary font-medium mb-2">
            AI스터디 미리보기
          </p>
          <h2 className="text-2xl font-bold text-foreground">
            AI스터디를 직접 경험한
            <br />
            멤버들의 이야기를 들어보세요.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reviews.map((review) => (
            <div
              key={review.name}
              className="rounded-xl border border-border p-5 space-y-3"
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold",
                    review.color
                  )}
                >
                  {review.name[0]}
                </div>
                <span className="text-sm font-medium text-foreground">
                  {review.name}
                </span>
              </div>
              <p className="text-sm font-regular text-sub-foreground leading-relaxed line-clamp-4">
                {review.text}
              </p>
              <span className="inline-block text-xs text-sub-foreground bg-muted px-2 py-0.5 rounded-full">
                {review.cohort}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Section 5: FAQ ── */}
      <section className="bg-muted/30 py-16">
        <div className="mx-auto max-w-[1080px] px-6">
          <h2 className="text-2xl font-bold text-foreground text-center mb-2">
            자주 묻는 질문
          </h2>
          <p className="text-sm text-sub-foreground text-center mb-10">
            궁금한 점이 있으신가요? 아래에서 답을 찾아보세요
          </p>

          <div className="rounded-lg border border-border divide-y divide-border bg-background">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqs.has(idx);
              return (
                <div key={idx}>
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full flex items-center justify-between p-4 text-sm text-foreground hover:bg-muted/50 transition-colors"
                  >
                    <span className="font-medium text-left">{faq.q}</span>
                    <ChevronDown
                      className={cn(
                        "w-4 h-4 text-sub-foreground shrink-0 ml-4 transition-transform",
                        isOpen && "rotate-180"
                      )}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4">
                      <p className="text-sm font-regular text-sub-foreground leading-relaxed">
                        {faq.a}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Section 6: Footer CTA ── */}
      <section className="py-20">
        <div className="mx-auto max-w-[1080px] px-6 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            빠르게 변화하는 AI 시대,
            <br />
            필요한 것은 기술이 아니라 첫 걸음입니다.
          </h2>
          <p className="text-sm text-sub-foreground mb-8">
            {isRecruiting
              ? `스터디 시작: ${cohort.startDate} | ${cohort.duration}`
              : "다음 기수 오픈 알림을 받아보세요"}
          </p>
          {isRecruiting ? (
            <Link href="/checkout/21">
              <Button size="lg" className="text-base px-8 py-3">
                지금 바로 시작하기
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          ) : (
            <Button size="lg" className="text-base px-8 py-3">
              다음 기수 알림 받기
            </Button>
          )}
        </div>
      </section>
    </div>
  );
}
