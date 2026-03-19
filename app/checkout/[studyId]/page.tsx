"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, Users, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { PriceBreakdown } from "@/components/site/price-breakdown";

export default function CheckoutPage() {
  const router = useRouter();
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [buddyName, setBuddyName] = useState("");
  const [buddyContact, setBuddyContact] = useState("");
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [privacyAgreed, setPrivacyAgreed] = useState(false);
  const [refundAgreed, setRefundAgreed] = useState(false);

  const regularPrice = 299000;
  const earlyBirdDiscount = 30000;
  const couponDiscount = couponApplied ? 10000 : 0;
  const finalPrice = regularPrice - earlyBirdDiscount - couponDiscount;
  const allAgreed = termsAgreed && privacyAgreed && refundAgreed;

  const handleApplyCoupon = () => {
    if (couponCode.trim()) {
      setCouponApplied(true);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-page">
      <Link
        href="/study/ai-automation"
        className="flex items-center gap-1 text-sm text-sub-foreground mb-6"
      >
        <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
        스터디 상세로 돌아가기
      </Link>

      <h1 className="text-xl font-semibold text-foreground mb-8">결제하기</h1>

      {/* Study Summary */}
      <section className="border border-border rounded-lg p-6 mb-6 space-y-3">
        <h2 className="font-semibold text-foreground">21기 AI 자동화 스터디</h2>
        <div className="flex flex-wrap gap-4 text-sm text-sub-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="w-4 h-4" strokeWidth={1.5} /> 2026.03.15 ~ 04.12 (4주)
          </span>
          <span className="flex items-center gap-1">
            <Users className="w-4 h-4" strokeWidth={1.5} /> 12/20명
          </span>
        </div>
        <Badge variant="active">얼리버드 할인 적용중</Badge>
      </section>

      {/* Price Breakdown */}
      <section className="border border-border rounded-lg p-6 mb-6">
        <h2 className="font-semibold text-foreground mb-4">가격 정보</h2>
        <PriceBreakdown
          originalPrice={regularPrice}
          discountLabel="슈퍼얼리버드 할인 (10%)"
          discountAmount={earlyBirdDiscount}
          couponDiscount={couponDiscount}
          finalPrice={finalPrice}
        />
      </section>

      {/* Coupon */}
      <section className="border border-border rounded-lg p-6 mb-6 space-y-3">
        <h2 className="font-semibold text-foreground mb-2">쿠폰 적용</h2>
        <div className="flex gap-2">
          <Input
            placeholder="쿠폰 코드를 입력하세요"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            disabled={couponApplied}
          />
          <Button
            variant={couponApplied ? "secondary" : "default"}
            onClick={handleApplyCoupon}
            disabled={couponApplied || !couponCode.trim()}
            className="shrink-0"
          >
            {couponApplied ? "적용됨" : "적용"}
          </Button>
        </div>
        {couponApplied && (
          <p className="text-sm text-primary flex items-center gap-1">
            <Check className="w-4 h-4" strokeWidth={1.5} /> 10,000원 할인 쿠폰이 적용되었습니다.
          </p>
        )}
      </section>

      {/* Buddy Registration */}
      <section className="border border-border rounded-lg p-6 mb-6 space-y-3">
        <div className="flex items-center gap-2 mb-2">
          <h2 className="font-semibold text-foreground">버디 등록</h2>
          <span className="text-sm text-sub-foreground">(선택사항)</span>
        </div>
        <p className="text-sm text-sub-foreground mb-3">
          함께 신청하는 분이 있으면 버디 정보를 입력하세요. 추가 할인이
          적용됩니다.
        </p>
        <div className="space-y-2">
          <Input
            placeholder="버디 이름"
            value={buddyName}
            onChange={(e) => setBuddyName(e.target.value)}
          />
          <Input
            placeholder="버디 연락처 (전화번호 또는 이메일)"
            value={buddyContact}
            onChange={(e) => setBuddyContact(e.target.value)}
          />
        </div>
      </section>

      {/* Terms Agreement */}
      <section className="border border-border rounded-lg p-6 mb-6 space-y-3">
        <h2 className="font-semibold text-foreground mb-2">약관 동의</h2>
        <label className="flex items-center gap-2 cursor-pointer">
          <Checkbox
            checked={termsAgreed}
            onCheckedChange={(checked) => setTermsAgreed(checked as boolean)}
          />
          <span className="text-sm text-foreground">
            이용약관에 동의합니다 (필수)
          </span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <Checkbox
            checked={privacyAgreed}
            onCheckedChange={(checked) => setPrivacyAgreed(checked as boolean)}
          />
          <span className="text-sm text-foreground">
            개인정보 수집/이용에 동의합니다 (필수)
          </span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <Checkbox
            checked={refundAgreed}
            onCheckedChange={(checked) => setRefundAgreed(checked as boolean)}
          />
          <span className="text-sm text-foreground">
            환불 정책에 동의합니다 (필수)
          </span>
        </label>
      </section>

      {/* CTA */}
      <Button
        size="lg"
        className="w-full"
        disabled={!allAgreed}
        onClick={() => router.push("/checkout/complete")}
      >
        {finalPrice.toLocaleString()}원 결제하기
      </Button>
    </div>
  );
}
