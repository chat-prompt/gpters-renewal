import { ProfileView } from "@/components/site/profile-view";

// TODO: username으로 유저 정보 조회
const otherUser = {
  name: "홍길동",
  username: "honggildong",
  bio: "AI 자동화 전문가 · 마케터",
  joinDate: "2025.03",
  links: [
    { label: "GitHub", href: "https://github.com/honggildong" },
    { label: "LinkedIn", href: "https://linkedin.com/in/honggildong" },
    { label: "블로그", href: "https://honggildong.tistory.com" },
  ],
};

export default function OtherProfilePage() {
  return <ProfileView isOwn={false} user={otherUser} />;
}
