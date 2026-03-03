interface PriceBreakdownProps {
  originalPrice: number;
  discountLabel?: string;
  discountAmount?: number;
  couponDiscount?: number;
  finalPrice: number;
}

export function PriceBreakdown({
  originalPrice,
  discountLabel,
  discountAmount,
  couponDiscount,
  finalPrice,
}: PriceBreakdownProps) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">정상가</span>
        <span className="text-foreground">
          {originalPrice.toLocaleString()}원
        </span>
      </div>
      {discountLabel && discountAmount != null && discountAmount > 0 && (
        <div className="flex justify-between text-sm">
          <span className="text-primary">{discountLabel}</span>
          <span className="text-primary">
            -{discountAmount.toLocaleString()}원
          </span>
        </div>
      )}
      {couponDiscount != null && couponDiscount > 0 && (
        <div className="flex justify-between text-sm">
          <span className="text-primary">쿠폰 할인</span>
          <span className="text-primary">
            -{couponDiscount.toLocaleString()}원
          </span>
        </div>
      )}
      <div className="border-t border-border pt-3 flex justify-between">
        <span className="font-bold text-foreground">최종 결제금액</span>
        <span className="font-bold text-foreground text-lg">
          {finalPrice.toLocaleString()}원
        </span>
      </div>
    </div>
  );
}
