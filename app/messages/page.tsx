"use client";

import { useState } from "react";
import { PenSquare, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs } from "@/components/ui/tabs";
import { MessageRow } from "@/components/site/message-row";
import { NotificationRow } from "@/components/site/notification-row";
import { Avatar } from "@/components/ui/avatar";
import Link from "next/link";

/* ─── Mock Data ─── */

const notifications = [
  {
    type: "comment",
    actor: "이수진",
    actorUsername: "leesujin",
    text: "좋은 글 감사합니다! Claude API 비용은 어느 정도 나오나요?",
    targetTitle: "Claude로 마케팅 자동화 구축기",
    href: "/posts/claude-marketing",
    time: "2시간 전",
    unread: true,
  },
  {
    type: "like",
    actor: "박민수",
    actorUsername: "parkminsu",
    text: "",
    targetTitle: "Claude로 마케팅 자동화 구축기",
    href: "/posts/claude-marketing",
    time: "3시간 전",
    unread: true,
  },
  {
    type: "reply",
    actor: "박영수",
    actorUsername: "parkyoungsu",
    text: "저는 비슷한 규모로 $20 정도 나와요. Haiku 모델 쓰면 더 저렴합니다.",
    targetTitle: "Claude로 마케팅 자동화 구축기",
    href: "/posts/claude-marketing",
    time: "1시간 전",
    unread: true,
  },
  {
    type: "follow",
    actor: "김다혜",
    actorUsername: "kimdahye",
    text: "",
    targetTitle: "",
    href: "/profile/kimdahye",
    time: "4시간 전",
    unread: false,
  },
  {
    type: "like",
    actor: "최준혁",
    actorUsername: "choijunhyeok",
    text: "",
    targetTitle: "n8n 워크플로우 자동화 실전 가이드",
    href: "/posts/n8n-automation",
    time: "1일 전",
    unread: false,
  },
  {
    type: "study",
    text: "21기 AI 자동화 스터디가 3월 15일에 시작됩니다. 오리엔테이션에 참여해주세요.",
    time: "3일 전",
    unread: false,
  },
  {
    type: "event",
    text: "이번 주 AI토크: 'Claude 실전 활용법' 설명회가 내일 열립니다.",
    time: "4일 전",
    unread: false,
  },
  {
    type: "payment",
    text: "21기 AI 자동화 스터디 결제가 완료되었습니다. (150,000원)",
    time: "2주 전",
    unread: false,
  },
];

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

const initialSentMessages = [
  { to: "박민수", username: "parkminsu", subject: "스터디 과제 관련 질문", time: "2일 전" },
  { to: "김영호", username: "kimyoungho", subject: "re: 자동화 파이프라인 공유", time: "1주 전" },
];

const tabItems = [
  { key: "notifications", label: "알림" },
  { key: "received", label: "받은 메시지" },
  { key: "sent", label: "보낸 메시지" },
];

/* ─── Page ─── */

export default function MessagesPage() {
  const [activeTab, setActiveTab] = useState("notifications");
  const [composing, setComposing] = useState(false);
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [sentMessages, setSentMessages] = useState(initialSentMessages);

  const unreadNotifications = notifications.filter((n) => n.unread).length;
  const unreadMessages = receivedMessages.filter((m) => m.unread).length;

  function handleSend() {
    setSentMessages(prev => [{ to, username: to, subject, time: "방금 전" }, ...prev]);
    setActiveTab("sent");
    setComposing(false);
    setTo("");
    setSubject("");
    setBody("");
  }

  return (
    <div className="mx-auto max-w-[680px] px-6 py-page">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-foreground">알림 & 메시지</h1>
        <Button size="sm" onClick={() => setComposing(true)}>
          <PenSquare className="w-4 h-4" strokeWidth={1.5} />
          새 메시지
        </Button>
      </div>

      {/* Compose Form */}
      {composing && (
        <div className="mb-6 border border-border rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-foreground">새 메시지</span>
            <button
              type="button"
              onClick={() => setComposing(false)}
              className="text-sub-foreground hover:text-foreground transition-colors"
            >
              <X className="w-4 h-4" strokeWidth={1.5} />
            </button>
          </div>
          <Input
            placeholder="받는 사람 (사용자명)"
            value={to}
            onChange={(e) => setTo(e.target.value)}
          />
          <Input
            placeholder="제목"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
          <Textarea
            placeholder="메시지를 입력하세요..."
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={5}
          />
          <div className="flex justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={() => setComposing(false)}>
              취소
            </Button>
            <Button size="sm" onClick={handleSend} disabled={!to || !subject || !body}>
              보내기
            </Button>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <Tabs
        items={tabItems.map((t) => ({
          ...t,
          label:
            t.key === "notifications" && unreadNotifications > 0
              ? `알림 ${unreadNotifications}`
              : t.key === "received" && unreadMessages > 0
              ? `받은 메시지 ${unreadMessages}`
              : t.label,
        }))}
        activeKey={activeTab}
        onTabChange={setActiveTab}
        className="mb-2"
      />

      {/* 알림 */}
      {activeTab === "notifications" && (
        <div className="divide-y divide-border">
          {notifications.map((n, i) => (
            <NotificationRow key={i} {...n} />
          ))}
        </div>
      )}

      {/* 받은 메시지 */}
      {activeTab === "received" && (
        <div className="divide-y divide-border">
          {receivedMessages.map((message) => (
            <MessageRow
              key={message.subject}
              from={message.from}
              username={message.username}
              subject={message.subject}
              preview={message.preview}
              time={message.time}
              unread={message.unread}
              href={`/profile/${message.username}`}
            />
          ))}
        </div>
      )}

      {/* 보낸 메시지 */}
      {activeTab === "sent" && (
        <div className="divide-y divide-border">
          {sentMessages.map((message) => (
            <Link
              key={message.subject}
              href={`/profile/${message.username}`}
              className="flex items-center gap-3 py-4 hover:bg-muted/50 transition-colors"
            >
              <Avatar size="sm" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground mb-0.5">
                  To: {message.to}
                </p>
                <p className="text-sm font-regular text-secondary-foreground">{message.subject}</p>
              </div>
              <span className="text-sm font-regular text-sub-foreground shrink-0">
                {message.time}
              </span>
            </Link>
          ))}

          {sentMessages.length === 0 && (
            <div className="py-12 text-center text-sm text-sub-foreground">
              보낸 메시지가 없습니다.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
