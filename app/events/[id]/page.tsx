import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Monitor,
  Users,
  Share2,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";

/* ─── Mock Data ─── */

const eventsMap: Record<string, Event> = {
  "1": {
    id: 1,
    title: "무료 AI 토크: Claude Code 활용법",
    category: "토크",
    type: "online",
    date: "3월 15일 (토)",
    time: "19:00 - 20:30",
    location: "온라인 (Zoom)",
    description:
      "AI 코드 에디터 Claude Code의 실전 활용법을 알려드립니다. 비개발자도 참여 가능!",
    longDescription: `AI 코딩 도구가 빠르게 발전하고 있습니다. 그 중에서도 Claude Code는 터미널 기반의 에이전틱 코딩 도구로, 코드 작성부터 디버깅, 리팩토링까지 다양한 작업을 자연어로 처리할 수 있습니다.

이번 토크에서는 Claude Code를 실무에 활용하는 방법을 다룹니다. 프로젝트 세팅, 코드 리뷰, 테스트 작성, 문서화 등 실전 워크플로우를 시연과 함께 보여드립니다.

개발자는 물론, 코딩에 관심 있는 비개발자도 편하게 참여하실 수 있습니다.`,
    agenda: [
      { time: "19:00", title: "오프닝 & Claude Code 소개" },
      { time: "19:15", title: "실전 데모: 프로젝트 세팅부터 배포까지" },
      { time: "19:45", title: "팁 & 트릭: 생산성을 높이는 활용법" },
      { time: "20:00", title: "Q&A" },
      { time: "20:30", title: "마무리" },
    ],
    host: { name: "GPTers", avatar: "" },
    speakers: [
      { name: "김현수", role: "AI 엔지니어", avatar: "" },
      { name: "이다혜", role: "프로덕트 매니저", avatar: "" },
    ],
    attendees: 84,
    capacity: 200,
    free: true,
  },
  "2": {
    id: 2,
    title: "모각AI — 강남역 위워크",
    category: "모임",
    type: "offline",
    date: "3월 20일 (목)",
    time: "14:00 - 18:00",
    location: "강남역 위워크 10층",
    description: "각자 AI 프로젝트를 진행하며 네트워킹하는 모임입니다.",
    longDescription: `모각AI(모여서 각자 AI)는 GPTers의 정기 오프라인 모임입니다. 카페에서 각자 공부하듯, AI 프로젝트를 가지고 모여서 함께 작업하는 시간입니다.

자유로운 분위기에서 각자의 AI 프로젝트를 진행하고, 중간중간 서로의 작업을 공유하며 피드백을 나눕니다. 처음 오시는 분도 부담 없이 참여하실 수 있습니다.

음료와 간단한 다과가 제공됩니다.`,
    agenda: [
      { time: "14:00", title: "체크인 & 네트워킹" },
      { time: "14:30", title: "각자 작업 시간 (1차)" },
      { time: "16:00", title: "중간 공유 & 휴식" },
      { time: "16:30", title: "각자 작업 시간 (2차)" },
      { time: "17:30", title: "마무리 공유 & 네트워킹" },
    ],
    host: { name: "GPTers 서울", avatar: "" },
    speakers: [],
    attendees: 18,
    capacity: 30,
    free: true,
  },
  "3": {
    id: 3,
    title: "AI 자동화 웨비나",
    category: "웨비나",
    type: "online",
    date: "3월 22일 (토)",
    time: "20:00 - 21:30",
    location: "온라인 (Zoom)",
    description: "n8n과 Make를 활용한 업무 자동화 실전 노하우를 공유합니다.",
    longDescription: `반복적인 업무에 지치셨나요? n8n과 Make(구 Integromat)를 활용하면 코딩 없이도 강력한 자동화 워크플로우를 만들 수 있습니다.

이번 웨비나에서는 실제 업무에 바로 적용할 수 있는 자동화 사례를 다룹니다. 이메일 자동 분류, Slack 알림, 데이터 수집/정리 등 실전 워크플로우를 라이브로 시연합니다.

초보자도 따라할 수 있도록 기초부터 차근차근 설명합니다.`,
    agenda: [
      { time: "20:00", title: "자동화 도구 비교: n8n vs Make" },
      { time: "20:20", title: "실전 데모 1: 이메일 자동 분류" },
      { time: "20:40", title: "실전 데모 2: Slack + 스프레드시트 연동" },
      { time: "21:00", title: "나만의 워크플로우 설계 팁" },
      { time: "21:15", title: "Q&A" },
    ],
    host: { name: "김영호", avatar: "" },
    speakers: [{ name: "김영호", role: "자동화 컨설턴트", avatar: "" }],
    attendees: 132,
    capacity: 300,
    free: true,
  },
  "4": {
    id: 4,
    title: "GPTers 네트워킹 데이",
    category: "네트워킹",
    type: "offline",
    date: "4월 5일 (토)",
    time: "15:00 - 19:00",
    location: "서울 성수동",
    description:
      "AI에 관심 있는 분들의 대규모 오프라인 네트워킹 행사입니다. 다양한 분야의 AI 실무자를 만나보세요.",
    longDescription: `GPTers 커뮤니티 최대 규모의 오프라인 네트워킹 행사입니다. 마케터, 개발자, 기획자, 디자이너 등 다양한 분야에서 AI를 활용하는 실무자들이 모입니다.

라이트닝 토크, 네트워킹 세션, 쇼케이스 등 다양한 프로그램으로 구성됩니다. AI를 통해 실제 성과를 만들어낸 분들의 이야기를 직접 들을 수 있는 기회입니다.

음식과 음료가 제공되며, 참가비가 있습니다.`,
    agenda: [
      { time: "15:00", title: "체크인 & 웰컴 드링크" },
      { time: "15:30", title: "라이트닝 토크 (5분 x 6명)" },
      { time: "16:30", title: "네트워킹 세션" },
      { time: "17:30", title: "AI 프로젝트 쇼케이스" },
      { time: "18:30", title: "자유 네트워킹 & 마무리" },
    ],
    host: { name: "GPTers", avatar: "" },
    speakers: [
      { name: "신연권", role: "GPTers 대표", avatar: "" },
      { name: "박소연", role: "AI 마케터", avatar: "" },
      { name: "김재호", role: "풀스택 개발자", avatar: "" },
    ],
    attendees: 56,
    capacity: 150,
    free: false,
    price: "10,000원",
  },
};

interface Event {
  id: number;
  title: string;
  category: string;
  type: string;
  date: string;
  time: string;
  location: string;
  description: string;
  longDescription: string;
  agenda: { time: string; title: string }[];
  host: { name: string; avatar: string };
  speakers: { name: string; role: string; avatar: string }[];
  attendees: number;
  capacity: number;
  free: boolean;
  price?: string;
}

/* ─── Page ─── */

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const event = eventsMap[id];

  if (!event) {
    return (
      <div className="max-w-[1080px] mx-auto px-6 py-16 text-center">
        <p className="text-muted-foreground">이벤트를 찾을 수 없습니다.</p>
        <Link href="/events" className="text-sm text-primary mt-4 inline-block">
          이벤트 목록으로 돌아가기
        </Link>
      </div>
    );
  }

  const spotsLeft = event.capacity - event.attendees;
  const fillPercent = Math.round((event.attendees / event.capacity) * 100);

  return (
    <div className="max-w-[1080px] mx-auto px-6 py-8">
      {/* Back */}
      <Link
        href="/events"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        이벤트 목록
      </Link>

      {/* Cover Image */}
      <div className="w-full h-56 md:h-72 bg-muted rounded-xl mb-8" />

      <div className="flex gap-8 items-start">
        {/* Left: Content */}
        <div className="flex-1 min-w-0">
          {/* Category + Type Badge */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-medium text-primary">
              {event.category}
            </span>
            <span
              className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
                event.type === "online"
                  ? "bg-blue-50 text-blue-600"
                  : "bg-green-50 text-green-600"
              }`}
            >
              {event.type === "online" ? "온라인" : "오프라인"}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-foreground mb-4">
            {event.title}
          </h1>

          {/* Meta */}
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-6">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {event.date}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {event.time}
            </span>
            <span className="flex items-center gap-1.5">
              {event.type === "online" ? (
                <Monitor className="w-4 h-4" />
              ) : (
                <MapPin className="w-4 h-4" />
              )}
              {event.location}
            </span>
          </div>

          {/* Host */}
          <div className="flex items-center gap-3 pb-6 mb-6 border-b border-border">
            <div className="w-10 h-10 rounded-full bg-muted" />
            <div>
              <p className="text-xs text-muted-foreground">주최</p>
              <p className="text-sm font-medium text-foreground">
                {event.host.name}
              </p>
            </div>
          </div>

          {/* Description */}
          <div className="mb-8">
            <h2 className="text-base font-bold text-foreground mb-3">소개</h2>
            <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
              {event.longDescription}
            </div>
          </div>

          {/* Agenda */}
          {event.agenda.length > 0 && (
            <div className="mb-8">
              <h2 className="text-base font-bold text-foreground mb-3">
                프로그램
              </h2>
              <div className="space-y-3">
                {event.agenda.map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <span className="text-sm font-medium text-muted-foreground w-14 shrink-0">
                      {item.time}
                    </span>
                    <span className="text-sm text-foreground">{item.title}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Speakers */}
          {event.speakers.length > 0 && (
            <div className="mb-8">
              <h2 className="text-base font-bold text-foreground mb-3">
                연사
              </h2>
              <div className="flex flex-wrap gap-4">
                {event.speakers.map((speaker) => (
                  <div
                    key={speaker.name}
                    className="flex items-center gap-3 p-3 border border-border rounded-lg"
                  >
                    <div className="w-10 h-10 rounded-full bg-muted shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {speaker.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {speaker.role}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Registration Card (sticky) */}
        <aside className="w-72 shrink-0 hidden lg:block sticky top-20">
          <div className="border border-border rounded-xl p-5 space-y-4">
            {/* Price */}
            <div className="text-center pb-4 border-b border-border">
              <p className="text-2xl font-bold text-foreground">
                {event.free ? "무료" : event.price}
              </p>
            </div>

            {/* Capacity Bar */}
            <div>
              <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
                <span className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {event.attendees}명 참여
                </span>
                <span>{spotsLeft}자리 남음</span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all"
                  style={{ width: `${fillPercent}%` }}
                />
              </div>
            </div>

            {/* Attendee Avatars */}
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {[...Array(Math.min(5, event.attendees))].map((_, i) => (
                  <div
                    key={i}
                    className="w-7 h-7 rounded-full bg-muted border-2 border-background"
                  />
                ))}
              </div>
              {event.attendees > 5 && (
                <span className="text-xs text-muted-foreground">
                  +{event.attendees - 5}
                </span>
              )}
            </div>

            {/* CTA */}
            <Button className="w-full">신청하기</Button>

            {/* Share */}
            <button
              type="button"
              className="flex items-center justify-center gap-1.5 w-full py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Share2 className="w-4 h-4" />
              공유하기
            </button>
          </div>
        </aside>
      </div>

      {/* Mobile CTA (sticky bottom) */}
      <div className="fixed bottom-0 left-0 right-0 lg:hidden border-t border-border bg-background px-4 py-3">
        <div className="flex items-center justify-between max-w-[1080px] mx-auto">
          <div>
            <p className="text-base font-bold text-foreground">
              {event.free ? "무료" : event.price}
            </p>
            <p className="text-xs text-muted-foreground">
              {spotsLeft}자리 남음
            </p>
          </div>
          <Button>신청하기</Button>
        </div>
      </div>
    </div>
  );
}
