"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Mail,
  Bell,
  Send,
  MessageSquare,
  CreditCard,
  Calendar,
  UserPlus,
  Megaphone,
  PenSquare,
} from "lucide-react";

const receivedMessages = [
  {
    from: "김영호",
    username: "kimyoungho",
    subject: "스터디 자동화 관련 질문이요!",
    preview:
      "안녕하세요! 올려주신 Claude 마케팅 자동화 글 보고 연락드립니다. 혹시 n8n 연동 부분에서...",
    time: "2시간 전",
    unread: true,
  },
  {
    from: "이수진",
    username: "leesujin",
    subject: "모각AI 같이 하실 분?",
    preview:
      "다음 주 토요일에 모각AI 하려고 하는데, 관심 있으시면 같이...",
    time: "5시간 전",
    unread: true,
  },
  {
    from: "박민수",
    username: "parkminsu",
    subject: "21기 스터디 후기 작성 부탁",
    preview:
      "안녕하세요 스터디장 박민수입니다. 수료 후기를 작성해주시면...",
    time: "1일 전",
    unread: false,
  },
  {
    from: "다혜",
    username: "dahye",
    subject: "베스트 사례 선정 축하드립니다!",
    preview:
      "작성하신 '마케팅 이메일 자동화' 게시글이 이번 달 베스트 사례로...",
    time: "3일 전",
    unread: false,
  },
];

const autoNotifications = [
  {
    text: "GPTers에 오신 것을 환영합니다! 사용 가이드를 확인해보세요.",
    time: "가입 시",
    type: "welcome",
  },
  {
    text: "21기 AI 자동화 스터디 결제가 완료되었습니다.",
    time: "2주 전",
    type: "payment",
  },
  {
    text: "이번 주 AI토크: 'Claude 실전 활용법' 설명회가 내일 열립니다.",
    time: "3일 전",
    type: "event",
  },
  {
    text: "작성하신 게시글에 새 댓글이 달렸습니다.",
    time: "5시간 전",
    type: "comment",
  },
  {
    text: "뉴스레터 구독이 완료되었습니다.",
    time: "1주 전",
    type: "system",
  },
];

const sentMessages = [
  { to: "박민수", subject: "스터디 과제 관련 질문", time: "2일 전" },
  { to: "김영호", subject: "re: 자동화 파이프라인 공유", time: "1주 전" },
];

const tabs = ["받은 메시지", "자동 알림", "보낸 메시지"];

function NotificationIcon({ type }: { type: string }) {
  switch (type) {
    case "welcome":
      return <UserPlus className="w-4 h-4" />;
    case "payment":
      return <CreditCard className="w-4 h-4" />;
    case "event":
      return <Calendar className="w-4 h-4" />;
    case "comment":
      return <MessageSquare className="w-4 h-4" />;
    case "system":
      return <Megaphone className="w-4 h-4" />;
    default:
      return <Bell className="w-4 h-4" />;
  }
}

export default function MessagesPage() {
  const [activeTab, setActiveTab] = useState("받은 메시지");

  const unreadCount = receivedMessages.filter((m) => m.unread).length;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Mail className="w-6 h-6 text-foreground" />
          <h1 className="text-xl font-bold text-foreground">메시지</h1>
          {unreadCount > 0 && (
            <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium rounded-full bg-primary text-primary-foreground">
              {unreadCount}
            </span>
          )}
        </div>
        <button className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-md bg-primary text-primary-foreground">
          <PenSquare className="w-4 h-4" />
          새 메시지
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 border-b border-border mb-6">
        {tabs.map((tab) => {
          const icon =
            tab === "받은 메시지" ? (
              <Mail className="w-4 h-4" />
            ) : tab === "자동 알림" ? (
              <Bell className="w-4 h-4" />
            ) : (
              <Send className="w-4 h-4" />
            );

          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`inline-flex items-center gap-1.5 px-4 py-2 text-sm whitespace-nowrap border-b-2 ${
                activeTab === tab
                  ? "border-primary text-foreground font-medium"
                  : "border-transparent text-muted-foreground"
              }`}
            >
              {icon}
              {tab}
            </button>
          );
        })}
      </div>

      {/* "받은 메시지" Tab Content */}
      {activeTab === "받은 메시지" && (
        <div className="border border-border rounded-lg divide-y divide-border bg-background">
          {receivedMessages.map((message) => (
            <Link
              key={message.subject}
              href={`/messages/${message.username}`}
              className={`flex items-start gap-3 p-4 ${
                message.unread ? "bg-accent" : ""
              }`}
            >
              {/* Avatar */}
              <div className="w-10 h-10 rounded-full bg-muted shrink-0" />

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span
                    className={`text-sm ${
                      message.unread
                        ? "font-bold text-foreground"
                        : "font-medium text-foreground"
                    }`}
                  >
                    {message.from}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    @{message.username}
                  </span>
                </div>
                <p
                  className={`text-sm mb-0.5 ${
                    message.unread
                      ? "font-semibold text-foreground"
                      : "text-foreground"
                  }`}
                >
                  {message.subject}
                </p>
                <p className="text-sm text-muted-foreground truncate">
                  {message.preview}
                </p>
              </div>

              {/* Time and Unread Indicator */}
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs text-muted-foreground">
                  {message.time}
                </span>
                {message.unread && (
                  <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
                )}
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* "자동 알림" Tab Content */}
      {activeTab === "자동 알림" && (
        <div className="space-y-3">
          <p className="text-xs text-muted-foreground mb-4">
            자동으로 발송된 알림 메시지입니다. 실제 사용자 메시지는 &ldquo;받은
            메시지&rdquo; 탭에서 확인하세요.
          </p>
          <div className="border border-border rounded-lg divide-y divide-border bg-background">
            {autoNotifications.map((notification) => (
              <div
                key={notification.text}
                className="flex items-center gap-3 p-4"
              >
                <span className="text-muted-foreground">
                  <NotificationIcon type={notification.type} />
                </span>
                <span className="flex-1 text-sm text-muted-foreground">
                  {notification.text}
                </span>
                <span className="text-xs text-muted-foreground shrink-0">
                  {notification.time}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* "보낸 메시지" Tab Content */}
      {activeTab === "보낸 메시지" && (
        <div className="border border-border rounded-lg divide-y divide-border bg-background">
          {sentMessages.map((message) => (
            <Link
              key={message.subject}
              href={`/messages/sent`}
              className="flex items-center gap-3 p-4"
            >
              <div className="w-10 h-10 rounded-full bg-muted shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-sm font-medium text-foreground">
                    To: {message.to}
                  </span>
                </div>
                <p className="text-sm text-foreground">{message.subject}</p>
              </div>
              <span className="text-xs text-muted-foreground shrink-0">
                {message.time}
              </span>
            </Link>
          ))}

          {sentMessages.length === 0 && (
            <div className="p-8 text-center text-sm text-muted-foreground">
              보낸 메시지가 없습니다.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
