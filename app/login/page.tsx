"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isLoggedIn, toggle } = useAuth();
  const from = searchParams.get("from") || "/";

  useEffect(() => {
    if (isLoggedIn) router.replace(from);
  }, [isLoggedIn, from, router]);

  if (isLoggedIn) return null;

  return (
    <div className="flex flex-col items-center justify-center py-page px-6">
      <div className="w-full max-w-sm flex flex-col gap-group">
        <div className="text-center mb-section">
          <Link href="/">
            <img src="/logo.svg" alt="GPTers" className="h-8 mx-auto mb-4" />
          </Link>
          <h1 className="text-xl font-semibold text-foreground">로그인</h1>
          <p className="text-sm text-sub-foreground mt-2">
            GPTers 커뮤니티에 로그인하세요
          </p>
        </div>

        {/* 카카오 로그인 */}
        <button
          onClick={() => {
            toggle();
            router.replace(from);
          }}
          className="w-full flex items-center justify-center gap-2 py-3 text-sm font-medium bg-[#FEE500] text-[#191919] rounded-md hover:bg-[#FEE500]/90 transition-colors"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path fillRule="evenodd" clipRule="evenodd" d="M9 1C4.58 1 1 3.79 1 7.21c0 2.17 1.45 4.08 3.64 5.18-.16.56-.58 2.03-.67 2.35-.1.39.14.39.3.28.12-.08 1.95-1.32 2.74-1.86.64.09 1.3.14 1.99.14 4.42 0 8-2.79 8-6.21S13.42 1 9 1Z" fill="#191919"/>
          </svg>
          카카오로 시작하기
        </button>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-border" />
          <span className="text-sm text-muted-foreground">또는</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* 이메일 로그인 */}
        <div className="space-y-3">
          <input
            type="email"
            placeholder="이메일 주소"
            className="w-full h-10 px-4 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <input
            type="password"
            placeholder="비밀번호"
            className="w-full h-10 px-4 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <button
            onClick={() => {
              toggle();
              router.replace(from);
            }}
            className="w-full py-3 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            이메일로 로그인
          </button>
        </div>

        <div className="flex items-center justify-between text-sm">
          <Link href="/signup" className="text-sub-foreground hover:text-foreground transition-colors">
            회원가입
          </Link>
          <Link href="/forgot-password" className="text-sub-foreground hover:text-foreground transition-colors">
            비밀번호 찾기
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  );
}
