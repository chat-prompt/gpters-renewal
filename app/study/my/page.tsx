import Link from "next/link";
import {
  PenSquare,
  Video,
  MessageCircle,
  Trophy,
  Calendar,
  BookOpen,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ActionItemCard } from "@/components/lms/action-item-card";
import { AssignmentGuide } from "@/components/lms/assignment-guide";

// -- Mock Data --

const actionItems = [
  {
    icon: <PenSquare className="w-5 h-5" />,
    title: "사례 게시글 작성",
    description: "2주차 과제 미제출",
    href: "/write?type=case&studyId=21-ai-automation&week=2",
    ctaLabel: "글쓰기",
  },
  {
    icon: <Video className="w-5 h-5" />,
    title: "AI토크 참여",
    description: '화 7PM "n8n 자동화"',
    href: "/community/feed",
    ctaLabel: "참여하기",
  },
  {
    icon: <Video className="w-5 h-5" />,
    title: "AI토크 다시보기",
    description: "1주차 세션 녹화본 등록됨",
    href: "/study/21-ai-automation/learn/vod",
    ctaLabel: "시청하기",
  },
  {
    icon: <MessageCircle className="w-5 h-5" />,
    title: "찐친챌린지 인증",
    description: "2주차 카카오톡 인증하기",
    href: "/study/my/posts",
    ctaLabel: "인증하기",
  },
];

const sessions = [
  { title: "핵심강의", time: "월 9-11PM", status: "종료" as const },
  { title: "Week 2: 사례 공유 + 스터디", time: "화 9-11PM", status: "오늘" as const },
  { title: "베스트 발표회", time: "다음 주 월 9PM", status: "예정" as const },
];

const challengeProgress = {
  completed: 1,
  total: 3,
  dDay: 18,
  totalParticipants: 142,
};

const myStudyStat = {
  title: "21기 AI 자동화 스터디",
  assignment: { done: 0, total: 3 },
  attendance: { done: 1, total: 4 },
  bookmarks: 0,
};

const leaderboard = [
  { rank: 1, name: "김민지", posts: 8 },
  { rank: 2, name: "이준혁", posts: 7 },
  { rank: 3, name: "박소연", posts: 6 },
  { rank: 4, name: "최동현", posts: 5 },
  { rank: 5, name: "정하윤", posts: 5 },
  { rank: 6, name: "윤서진", posts: 4 },
  { rank: 7, name: "강민호", posts: 4 },
  { rank: 8, name: "홍길동", posts: 3, isMe: true },
  { rank: 9, name: "임지수", posts: 3 },
  { rank: 10, name: "배준영", posts: 2 },
];

export default function MyStudyPage() {
  return (
    <div className="space-y-6">
      {/* 2x2 대시보드 그리드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card 1: 이번 주 세션 */}
        <section className="rounded-lg border border-border">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
            <Calendar className="w-4 h-4 text-primary" />
            <h2 className="text-sm font-bold text-foreground">이번 주 세션</h2>
          </div>
          <div className="divide-y divide-border">
            {sessions.map((session) => (
              <div key={session.title} className="flex items-center justify-between px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-foreground">{session.title}</p>
                  <p className="text-xs text-sub-foreground">{session.time}</p>
                </div>
                <Badge variant={session.status === "오늘" ? "active" : "default"}>
                  {session.status}
                </Badge>
              </div>
            ))}
          </div>
        </section>

        {/* Card 2: 찐친챌린지 */}
        <section className="rounded-lg border border-border p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-primary" />
              <h2 className="text-sm font-bold text-foreground">찐친챌린지</h2>
            </div>
            <Badge variant="active">D-{challengeProgress.dDay}</Badge>
          </div>
          <div className="flex gap-2">
            {Array.from({ length: challengeProgress.total }).map((_, i) => (
              <div
                key={i}
                className={`flex-1 h-2 rounded-full ${
                  i < challengeProgress.completed ? "bg-primary" : "bg-muted"
                }`}
              />
            ))}
          </div>
          <div className="flex items-center justify-between text-xs text-sub-foreground">
            <span>{challengeProgress.completed}/{challengeProgress.total}주 완료</span>
            <span>총 {challengeProgress.totalParticipants}명 참여중</span>
          </div>
          <p className="text-xs text-sub-foreground">
            매주 카카오톡 스크린샷 인증으로 찐친이 됩니다!
          </p>
        </section>

        {/* Card 3: 내 스터디 바로가기 */}
        <section className="rounded-lg border border-border p-4 space-y-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-primary" />
            <h2 className="text-sm font-bold text-foreground">내 스터디 바로가기</h2>
          </div>
          <p className="text-sm font-medium text-foreground">{myStudyStat.title}</p>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="rounded-lg bg-muted p-2">
              <p className="text-xs text-sub-foreground">과제</p>
              <p className="text-sm font-bold text-foreground">
                {myStudyStat.assignment.done}/{myStudyStat.assignment.total}
              </p>
            </div>
            <div className="rounded-lg bg-muted p-2">
              <p className="text-xs text-sub-foreground">출석</p>
              <p className="text-sm font-bold text-foreground">
                {myStudyStat.attendance.done}/{myStudyStat.attendance.total}
              </p>
            </div>
            <div className="rounded-lg bg-muted p-2">
              <p className="text-xs text-sub-foreground">북마크</p>
              <p className="text-sm font-bold text-foreground">{myStudyStat.bookmarks}개</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href="/study/21-ai-automation/learn/tasks">과제</Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href="/study/21-ai-automation/learn/vod">다시보기</Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href="/study/my/posts">게시글</Link>
            </Button>
          </div>
        </section>

        {/* Card 4: 활동왕 리더보드 */}
        <section className="rounded-lg border border-border overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
            <Trophy className="w-4 h-4 text-primary" />
            <h2 className="text-sm font-bold text-foreground">활동왕 TOP 10</h2>
          </div>
          <div className="divide-y divide-border">
            {leaderboard.map((entry) => (
              <div
                key={entry.rank}
                className={`flex items-center gap-3 px-4 py-2 ${entry.isMe ? "bg-accent" : ""}`}
              >
                <span
                  className={`w-5 text-center text-xs font-bold ${
                    entry.rank === 1
                      ? "text-yellow-500"
                      : entry.rank === 2
                      ? "text-slate-400"
                      : entry.rank === 3
                      ? "text-amber-700"
                      : "text-sub-foreground"
                  }`}
                >
                  {entry.rank}
                </span>
                <span className={`flex-1 text-sm ${entry.isMe ? "font-medium text-foreground" : "text-foreground"}`}>
                  {entry.name}
                  {entry.isMe && (
                    <span className="ml-1 text-xs text-primary font-normal">(나)</span>
                  )}
                </span>
                <span className="text-xs text-sub-foreground">{entry.posts}개</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* 이번 주 할 일 */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-foreground">이번 주 할 일</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {actionItems.map((item) => (
            <ActionItemCard key={item.title} {...item} />
          ))}
        </div>
      </section>

      {/* 과제 연동 안내 */}
      <AssignmentGuide />
    </div>
  );
}
