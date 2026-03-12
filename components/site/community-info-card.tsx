interface CommunityInfoCardProps {
  members: string;
  online: string;
  postsPerWeek: string;
}

export function CommunityInfoCard({
  members,
  online,
  postsPerWeek,
}: CommunityInfoCardProps) {
  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <div className="bg-primary px-4 py-3">
        <h2 className="text-sm font-semibold text-primary-foreground">
          GPTers 커뮤니티
        </h2>
      </div>
      <div className="p-4 space-y-3">
        <p className="text-sm text-sub-foreground">
          AI 활용에 관심 있는 사람들이 모여 인사이트를 나누는 커뮤니티
        </p>
        <div className="flex gap-4 text-sm">
          <div>
            <p className="font-semibold text-foreground">{members}</p>
            <p className="text-sm text-sub-foreground">멤버</p>
          </div>
          <div>
            <p className="font-semibold text-foreground">{online}</p>
            <p className="text-sm text-sub-foreground">온라인</p>
          </div>
          <div>
            <p className="font-semibold text-foreground">{postsPerWeek}</p>
            <p className="text-sm text-sub-foreground">게시글/주</p>
          </div>
        </div>
        <button className="w-full py-2 text-sm bg-primary text-primary-foreground rounded-md font-medium">
          가입하기
        </button>
      </div>
    </div>
  );
}
