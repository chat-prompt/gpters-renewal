import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted py-6 mt-12">
      <div className="mx-auto max-w-6xl px-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          GPTers - AI 커뮤니티
        </p>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <Link href="#">소개</Link>
          <Link href="#">이용약관</Link>
          <Link href="#">개인정보처리방침</Link>
          <Link href="#">문의</Link>
        </div>
      </div>
    </footer>
  );
}
