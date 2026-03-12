const rules = [
  "서로 존중하기",
  "AI 관련 주제만 게시",
  "홍보/스팸 금지",
  "출처 명시하기",
  "개인정보 보호",
];

export function CommunityRules() {
  return (
    <div className="border border-border rounded-lg">
      <div className="px-4 py-3 border-b border-border">
        <h3 className="text-sm font-semibold text-foreground">커뮤니티 규칙</h3>
      </div>
      <div className="p-4 space-y-2 text-sm text-sub-foreground">
        {rules.map((rule, i) => (
          <p key={i}>
            {i + 1}. {rule}
          </p>
        ))}
      </div>
    </div>
  );
}
