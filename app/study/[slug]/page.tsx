"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Calendar,
  Users,
  MapPin,
  Coins,
  Star,
  ExternalLink,
  Clock,
} from "lucide-react";
import { Tabs } from "@/components/ui/tabs";
import { Accordion } from "@/components/ui/accordion";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const curriculum = [
  {
    key: "week-1",
    title: "1주차: AI 자동화 개요와 도구 선택",
    children: (
      <ul className="space-y-1 text-sm text-muted-foreground">
        <li>- 자동화가 필요한 업무 분석 프레임워크</li>
        <li>- n8n vs Make vs Zapier 비교</li>
        <li>- 실습: 첫 번째 워크플로우 만들기</li>
      </ul>
    ),
  },
  {
    key: "week-2",
    title: "2주차: Claude API 기초와 연동",
    children: (
      <ul className="space-y-1 text-sm text-muted-foreground">
        <li>- Claude API 키 발급 및 기본 호출</li>
        <li>- 프롬프트 최적화 기법</li>
        <li>- 실습: 텍스트 요약 자동화</li>
      </ul>
    ),
  },
  {
    key: "week-3",
    title: "3주차: 이메일/문서 자동화",
    children: (
      <ul className="space-y-1 text-sm text-muted-foreground">
        <li>- Gmail API 연동</li>
        <li>- 문서 자동 생성 파이프라인</li>
        <li>- 실습: 주간 리포트 자동 발송</li>
      </ul>
    ),
  },
  {
    key: "week-4",
    title: "4주차: 최종 프로젝트 및 발표",
    children: (
      <ul className="space-y-1 text-sm text-muted-foreground">
        <li>- 개인 자동화 프로젝트 완성</li>
        <li>- 동료 피드백 및 개선</li>
        <li>- 최종 발표 및 수료</li>
      </ul>
    ),
  },
];

const reviews = [
  {
    name: "김민지",
    cohort: "20기 수료생",
    rating: 5,
    text: "실제 업무에 바로 적용할 수 있어서 좋았습니다. 매주 과제가 실전적이라 많이 배웠어요.",
  },
  {
    name: "이준혁",
    cohort: "20기 수료생",
    rating: 5,
    text: "스터디장님 피드백이 꼼꼼하고, 동기들과 함께 배우니 동기부여가 잘 됩니다.",
  },
  {
    name: "박소연",
    cohort: "19기 수료생",
    rating: 4,
    text: "n8n을 처음 접했는데 4주 만에 실무에서 쓸 수 있게 되었어요.",
  },
  {
    name: "최동현",
    cohort: "19기 수료생",
    rating: 5,
    text: "동기들과의 네트워킹이 가장 큰 자산이었습니다. 수료 후에도 계속 교류 중이에요.",
  },
  {
    name: "정하윤",
    cohort: "18기 수료생",
    rating: 4,
    text: "비개발자도 충분히 따라갈 수 있는 커리큘럼이 좋았습니다.",
  },
];

const faqs = [
  {
    key: "faq-1",
    title: "코딩 경험이 없어도 참여할 수 있나요?",
    children: (
      <p className="text-sm text-muted-foreground">
        네, 이 스터디는 비개발자를 위해 설계되었습니다. n8n과 같은 노코드 도구를
        중심으로 진행하며, 코딩 경험이 전혀 없어도 참여 가능합니다.
      </p>
    ),
  },
  {
    key: "faq-2",
    title: "스터디 일정에 빠지면 어떻게 되나요?",
    children: (
      <p className="text-sm text-muted-foreground">
        모든 세션은 녹화되어 다시보기를 제공합니다. 다만 과제 제출 기한은
        유지되며, 주차별 과제를 제출해야 다시보기 권한이 부여됩니다.
      </p>
    ),
  },
  {
    key: "faq-3",
    title: "수료 기준은 무엇인가요?",
    children: (
      <p className="text-sm text-muted-foreground">
        4주 중 3주 이상 출석하고, 사례 게시글(과제)을 3개 이상 작성하면
        수료됩니다. 수료 시 수료증이 자동 발급됩니다.
      </p>
    ),
  },
  {
    key: "faq-4",
    title: "환불 정책은 어떻게 되나요?",
    children: (
      <p className="text-sm text-muted-foreground">
        스터디 시작 7일 전까지 100% 환불 가능합니다. 시작 후 1주 이내 50% 환불,
        2주 이후에는 환불이 불가합니다.
      </p>
    ),
  },
  {
    key: "faq-5",
    title: "버디 제도는 무엇인가요?",
    children: (
      <p className="text-sm text-muted-foreground">
        함께 신청하는 친구/동료를 버디로 등록하면 두 분 모두 추가 할인을
        받으실 수 있습니다. 체크아웃 시 버디 정보를 입력해주세요.
      </p>
    ),
  },
];

const tabItems = [
  { key: "intro", label: "소개" },
  { key: "curriculum", label: "커리큘럼" },
  { key: "leader", label: "스터디장" },
  { key: "reviews", label: "후기" },
  { key: "faq", label: "FAQ" },
];

const avgRating =
  reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

export default function StudyDetailPage() {
  const [activeTab, setActiveTab] = useState("intro");

  const enrolled = 12;
  const capacity = 20;
  const progress = Math.round((enrolled / capacity) * 100);
  const deadline = "2026.03.10";

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* Hero */}
      <section className="border border-border rounded-lg p-8 mb-8 bg-background">
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="active">모집중</Badge>
          <span className="text-sm text-muted-foreground">21기</span>
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">
          21기 AI 자동화 스터디
        </h1>
        <p className="text-muted-foreground mb-6">
          반복 업무를 AI로 자동화하는 4주 실전 과정
        </p>

        <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="w-4 h-4" /> 2026.03.15 ~ 04.12 (4주)
          </span>
          <span className="flex items-center gap-1">
            <Users className="w-4 h-4" /> {enrolled}/{capacity}명
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="w-4 h-4" /> 온라인 (Zoom)
          </span>
          <span className="flex items-center gap-1">
            <Coins className="w-4 h-4" /> 150,000원
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" /> 마감 {deadline}
          </span>
        </div>
      </section>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <Tabs
            items={tabItems}
            activeKey={activeTab}
            onTabChange={setActiveTab}
            className="mb-8"
          />

          {/* Intro Tab */}
          {activeTab === "intro" && (
            <section className="space-y-8">
              <div>
                <h3 className="font-bold text-foreground mb-2">스터디 소개</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  AI 자동화 스터디는 반복적인 업무를 AI와 노코드 도구를 활용해
                  자동화하는 방법을 배우는 4주 과정입니다. n8n, Claude API,
                  Gmail API 등을 활용하여 실제 업무에 적용 가능한 자동화
                  파이프라인을 구축합니다.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-foreground mb-3">
                  이런 분께 추천합니다
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs shrink-0 mt-0.5">
                      1
                    </span>
                    반복 업무에 시간을 빼앗기는 직장인
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs shrink-0 mt-0.5">
                      2
                    </span>
                    AI 자동화에 관심 있지만 어디서 시작할지 모르는 분
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs shrink-0 mt-0.5">
                      3
                    </span>
                    n8n, Make 등 노코드 자동화 도구를 배우고 싶은 분
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-foreground mb-3">기대 효과</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>- 실제 업무에 적용 가능한 자동화 파이프라인 3개 이상</li>
                  <li>- Claude API를 활용한 텍스트 처리 자동화 역량</li>
                  <li>- 동료들과의 피어 러닝을 통한 실전 노하우</li>
                  <li>- GPTers AI 이력서에 수료 이력 자동 반영</li>
                </ul>
              </div>
            </section>
          )}

          {/* Curriculum Tab */}
          {activeTab === "curriculum" && (
            <section>
              <Accordion items={curriculum} defaultOpen={["week-1"]} />
            </section>
          )}

          {/* Leader Tab */}
          {activeTab === "leader" && (
            <section className="border border-border rounded-lg p-6 bg-background">
              <div className="flex items-start gap-4">
                <Avatar size="md" />
                <div className="space-y-2">
                  <p className="font-bold text-foreground">홍길동</p>
                  <p className="text-sm text-muted-foreground">
                    AI 자동화 전문가
                  </p>
                  <div className="flex gap-2">
                    <Badge>GPTers 19기 수료</Badge>
                    <Badge>n8n Expert</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    5년간 마케팅 자동화를 전문적으로 해왔습니다. n8n과 Claude
                    API를 결합한 업무 자동화 파이프라인을 50개 이상 구축한
                    경험이 있으며, 실무에서 바로 쓸 수 있는 자동화 노하우를
                    전달합니다.
                  </p>
                  <Link
                    href="/profile/honggildong"
                    className="text-sm text-primary flex items-center gap-1"
                  >
                    AI 이력서 보기 <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </section>
          )}

          {/* Reviews Tab */}
          {activeTab === "reviews" && (
            <section className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.round(avgRating)
                          ? "text-primary fill-primary"
                          : "text-muted"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {avgRating.toFixed(1)} ({reviews.length}개 후기)
                </span>
              </div>

              <div className="space-y-4">
                {reviews.map((review, i) => (
                  <div
                    key={i}
                    className="border border-border rounded-lg p-4 bg-background space-y-2"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar size="sm" />
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {review.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {review.cohort}
                        </p>
                      </div>
                      <div className="flex gap-0.5 ml-auto">
                        {Array.from({ length: 5 }).map((_, j) => (
                          <Star
                            key={j}
                            className={`w-3 h-3 ${
                              j < review.rating
                                ? "text-primary fill-primary"
                                : "text-muted"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-foreground">{review.text}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* FAQ Tab */}
          {activeTab === "faq" && (
            <section>
              <Accordion items={faqs} />
            </section>
          )}
        </div>

        {/* Desktop Sticky CTA */}
        <aside className="hidden lg:block w-72 shrink-0">
          <div className="sticky top-8 border border-border rounded-lg p-6 bg-background space-y-4">
            <div>
              <p className="text-xs text-muted-foreground line-through">
                200,000원
              </p>
              <p className="text-xl font-bold text-foreground">150,000원</p>
              <Badge variant="active" className="mt-1">
                얼리버드 25% 할인
              </Badge>
            </div>
            <div className="space-y-1">
              <Progress value={progress} />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{enrolled}/{capacity}명</span>
                <span>{progress}% 모집</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="w-3 h-3" /> 모집 마감: {deadline}
            </p>
            <Link href="/checkout/ai-automation-21">
              <Button size="lg" className="w-full">
                스터디 신청하기
              </Button>
            </Link>
          </div>
        </aside>
      </div>

      {/* Mobile Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-border bg-background p-4 lg:hidden z-50">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div>
            <p className="text-foreground font-bold">150,000원</p>
            <p className="text-xs text-muted-foreground">
              잔여 {capacity - enrolled}석 / 마감 {deadline}
            </p>
          </div>
          <Link href="/checkout/ai-automation-21">
            <Button size="md">스터디 신청하기</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
