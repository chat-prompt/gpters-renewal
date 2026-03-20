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

        {/* 데모용 로그인 버튼 */}
        <button
          onClick={() => {
            toggle();
            router.replace(from);
          }}
          className="w-full py-3 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          데모 로그인 (홍길동)
        </button>

        <p className="text-sm text-center text-muted-foreground">
          실제 로그인은 Supabase Auth 연결 후 활성화됩니다
        </p>
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
