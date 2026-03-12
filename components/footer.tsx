import Link from "next/link";

export function Footer() {
  return (
    <footer className="py-6 mt-12">
      <p className="text-sm text-sub-foreground text-center">
        <Link href="#">콘텐츠 규정</Link>
        {" · "}
        <Link href="#">개인정보 처리방침</Link>
        {" · "}
        <Link href="#">이용 약관</Link>
        {" · "}
        <Link href="#">문의</Link>
        {" · "}
        GPTers, Inc. &copy; 2025. All rights reserved.
      </p>
    </footer>
  );
}
