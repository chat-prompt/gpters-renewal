"use client";

import { useRef, useState } from "react";
import { Check } from "lucide-react";
import { Tabs } from "@/components/ui/tabs";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { List, ListItem } from "@/components/ui/list";
import { Toggle } from "@/components/ui/toggle";

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

const interestTags = [
  "AI 자동화",
  "프롬프트 엔지니어링",
  "n8n",
  "ChatGPT",
  "노코드",
];

const tabItems = [
  { key: "profile", label: "내 정보" },
  { key: "purchases", label: "구매내역" },
  { key: "coupons", label: "쿠폰" },
  { key: "notifications", label: "알림" },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [emailNoti, setEmailNoti] = useState(true);
  const [studyNoti, setStudyNoti] = useState(true);
  const [commentNoti, setCommentNoti] = useState(true);
  const [marketingNoti, setMarketingNoti] = useState(false);

  const [profileForm, setProfileForm] = useState({
    name: "김철수",
    bio: "AI를 활용한 업무 자동화에 관심이 많은 마케터입니다.",
    link: "https://linkedin.com/in/chulsu",
  });
  const [saved, setSaved] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarUrl(URL.createObjectURL(file));
    }
  };

  return (
    <div className="mx-auto max-w-[1080px] px-4 py-8">
      <h1 className="text-xl font-bold text-foreground mb-6">계정 설정</h1>

      <Tabs
        items={tabItems}
        activeKey={activeTab}
        onTabChange={setActiveTab}
        className="mb-8"
      />

      {/* Profile Tab */}
      {activeTab === "profile" && (
        <section className="space-y-6 max-w-xl">
          <div className="flex items-center gap-4">
            <Avatar size="lg">
              {avatarUrl && <AvatarImage src={avatarUrl} />}
            </Avatar>
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
              <Button
                variant="secondary"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
              >
                사진 변경
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                이름
              </label>
              <Input
                value={profileForm.name}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, name: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                이메일
              </label>
              <Input defaultValue="chulsu@example.com" disabled />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                소개
              </label>
              <textarea
                className="w-full border border-input rounded-md px-4 py-2 text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                rows={3}
                value={profileForm.bio}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, bio: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                관심 분야
              </label>
              <div className="flex flex-wrap gap-2">
                {interestTags.map((tag) => (
                  <Badge key={tag} variant="pill">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                외부 링크
              </label>
              <Input
                value={profileForm.link}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, link: e.target.value })
                }
              />
            </div>
          </div>

          <Button onClick={handleSave}>
            {saved ? (
              <>
                <Check className="w-3.5 h-3.5" />
                저장됨
              </>
            ) : (
              "저장"
            )}
          </Button>
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
                  <p className="text-xs text-muted-foreground">
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
                  <p className="text-xs text-muted-foreground">
                    {coupon.discount}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
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
            <p className="text-center text-muted-foreground py-12">
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
                <p className="text-xs text-muted-foreground">
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
                <p className="text-xs text-muted-foreground">
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
                <p className="text-xs text-muted-foreground">
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
                <p className="text-xs text-muted-foreground">
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
