import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { AuthProviderWrapper } from "@/lib/auth-provider-wrapper";

export const metadata: Metadata = {
  title: "GPTers - AI 커뮤니티",
  description: "AI 활용 능력을 한 단계 올려보세요",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css" />

      </head>
      <body className="bg-background text-foreground min-h-screen flex flex-col">
        <AuthProviderWrapper>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </AuthProviderWrapper>
      </body>
    </html>
  );
}
