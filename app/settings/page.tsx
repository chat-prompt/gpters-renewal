"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Tabs } from "@/components/ui/tabs";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { List, ListItem } from "@/components/ui/list";
import { Toggle } from "@/components/ui/toggle";
import { useAuth } from "@/lib/auth-context";

const purchaseHistory = [
  {
    name: "21기 AI 자동화 스터디",
    date: "2026.02.20",
    amount: "150,000원",
    status: "결제완료",
  },
  {
    name: "20기 프롬프트 엔지니어링",
    date: "2025.12.10",
    amount: "120,000원",
    status: "수료완료",
  },
  {
    name: "19기 ChatGPT 활용",
    date: "2025.09.05",
    amount: "100,000원",
    status: "수료완료",
  },
];

const coupons = [
  {
    code: "WELCOME2026",
    discount: "10,000원 할인",
    expiry: "2026.06.30",
    used: false,
  },
  {
    code: "EARLYBIRD21",
    discount: "20% 할인",
    expiry: "2026.03.10",
    used: true,
  },
];

const tabItems = [
  { key: "profile", label: "내 정보" },
  { key: "purchases", label: "구매내역" },
  { key: "coupons", label: "쿠폰" },
  { key: "notifications", label: "알림" },
];

export default function SettingsPage() {
  const { isLoggedIn } = useAuth();
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState("profile");
  const [emailNoti, setEmailNoti] = useState(true);
  const [studyNoti, setStudyNoti] = useState(true);
  const [commentNoti, setCommentNoti] = useState(true);
  const [marketingNoti, setMarketingNoti] = useState(false);


  if (!isLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center py-page gap-group">
        <p className="text-lg font-semibold text-foreground">로그인이 필요합니다</p>
        <p className="text-sm text-sub-foreground">이 페이지를 보려면 로그인해주세요.</p>
        <Link href={`/login?from=${encodeURIComponent(pathname)}`} className="inline-flex items-center px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
          로그인
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[680px] px-6 py-page">
      <h1 className="text-xl font-semibold text-foreground mb-6">계정 설정</h1>

      <Tabs
        items={tabItems}
        activeKey={activeTab}
        onTabChange={setActiveTab}
        className="mb-8"
      />

      {/* Profile Tab */}
      {activeTab === "profile" && (
        <section className="max-w-xl space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">이메일</label>
            <Input defaultValue="chulsu@example.com" disabled />
            <p className="text-sm text-sub-foreground mt-1">이메일은 변경할 수 없습니다.</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">비밀번호</label>
            <Button variant="secondary" size="sm">비밀번호 변경</Button>
          </div>
          <p className="text-sm text-sub-foreground pt-2">
            이름, 소개, 프로필 사진, 외부 링크는{" "}
            <a href="/profile/me" className="text-primary hover:underline">내 프로필</a>에서 변경할 수 있습니다.
          </p>
        </section>
      )}

      {/* Purchases Tab */}
      {activeTab === "purchases" && (
        <section>
          <List>
            {purchaseHistory.map((purchase) => (
              <ListItem
                key={purchase.name}
                className="flex-wrap sm:flex-nowrap"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">
                    {purchase.name}
                  </p>
                  <p className="text-sm text-sub-foreground">
                    {purchase.date}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-foreground whitespace-nowrap">
                    {purchase.amount}
                  </span>
                  <Badge
                    variant={
                      purchase.status === "결제완료" ? "active" : "default"
                    }
                  >
                    {purchase.status}
                  </Badge>
                </div>
              </ListItem>
            ))}
          </List>
        </section>
      )}

      {/* Coupons Tab */}
      {activeTab === "coupons" && (
        <section>
          <List>
            {coupons.map((coupon) => (
              <ListItem key={coupon.code} className="flex-wrap sm:flex-nowrap">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-mono font-medium text-foreground">
                    {coupon.code}
                  </p>
                  <p className="text-sm text-sub-foreground">
                    {coupon.discount}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-sub-foreground whitespace-nowrap">
                    ~{coupon.expiry}
                  </span>
                  <Badge variant={coupon.used ? "completed" : "active"}>
                    {coupon.used ? "사용완료" : "사용가능"}
                  </Badge>
                </div>
              </ListItem>
            ))}
          </List>
          {coupons.length === 0 && (
            <p className="text-center text-sub-foreground py-12">
              보유한 쿠폰이 없습니다.
            </p>
          )}
        </section>
      )}

      {/* Notifications Tab */}
      {activeTab === "notifications" && (
        <section className="max-w-xl">
          <List>
            <ListItem className="justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">
                  이메일 알림
                </p>
                <p className="text-sm text-sub-foreground">
                  주요 공지사항을 이메일로 받습니다
                </p>
              </div>
              <Toggle checked={emailNoti} onChange={setEmailNoti} />
            </ListItem>
            <ListItem className="justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">
                  스터디 알림
                </p>
                <p className="text-sm text-sub-foreground">
                  스터디 일정, 과제 마감 등 알림을 받습니다
                </p>
              </div>
              <Toggle checked={studyNoti} onChange={setStudyNoti} />
            </ListItem>
            <ListItem className="justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">
                  댓글/답글 알림
                </p>
                <p className="text-sm text-sub-foreground">
                  내 글에 댓글이나 답글이 달리면 알림을 받습니다
                </p>
              </div>
              <Toggle checked={commentNoti} onChange={setCommentNoti} />
            </ListItem>
            <ListItem className="justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">
                  마케팅 알림
                </p>
                <p className="text-sm text-sub-foreground">
                  새 스터디, 프로모션 등 마케팅 정보를 받습니다
                </p>
              </div>
              <Toggle checked={marketingNoti} onChange={setMarketingNoti} />
            </ListItem>
          </List>
        </section>
      )}
    </div>
  );
}
