import Link from "next/link";
import { ArrowLeft, Heart, MessageSquare, Share2 } from "lucide-react";
import { notFound } from "next/navigation";

interface Comment {
  id: string;
  author: string;
  username: string;
  time: string;
  content: string;
  likes: number;
  replies?: Comment[];
}

interface Post {
  id: string;
  author: string;
  username: string;
  time: string;
  content: string;
  hasImage: boolean;
  tags: string[];
  likes: number;
  comments: Comment[];
}

const postsMap: Record<string, Post> = {
  "1": {
    id: "1",
    author: "다혜",
    username: "dahye",
    time: "30분 전",
    content:
      "바이브코딩으로 만든 스터디 대시보드가 드디어 완성! 에어테이블 + n8n + Cursor로 3일 만에 구현했습니다. 코딩 경험 거의 없는 상태에서 시작했는데 정말 가능하더라구요.\n\n처음엔 막막했는데 ChatGPT한테 하나씩 물어보면서 만들었어요. 에러가 나도 에러 메시지를 그대로 붙여넣으면 해결해주더라고요. 이게 바이브코딩의 힘인 것 같습니다.",
    hasImage: true,
    tags: ["바이브코딩", "n8n", "자동화"],
    likes: 23,
    comments: [
      {
        id: "c1",
        author: "수현",
        username: "suhyun",
        time: "20분 전",
        content: "대박! n8n 세팅 과정 좀 더 자세히 알려주세요!",
        likes: 3,
        replies: [
          {
            id: "c1-1",
            author: "다혜",
            username: "dahye",
            time: "15분 전",
            content: "네! 다음 글에서 자세히 다룰게요",
            likes: 1,
          },
        ],
      },
      {
        id: "c2",
        author: "민호",
        username: "minho",
        time: "10분 전",
        content: "Cursor로 하셨으면 어떤 모델 쓰셨어요?",
        likes: 2,
      },
      {
        id: "c3",
        author: "지은",
        username: "jieun",
        time: "5분 전",
        content: "저도 해보고 싶어요. 초보도 따라할 수 있을까요?",
        likes: 1,
      },
    ],
  },
  "2": {
    id: "2",
    author: "수현",
    username: "suhyun",
    time: "2시간 전",
    content:
      "Claude로 마케팅 리포트 자동화를 구축해봤습니다. 매주 수동으로 2~3시간 걸리던 작업이 이제 10분으로 줄었어요.\n\nGA4 데이터 → Sheets → Claude API → 슬랙 알림 파이프라인인데, 프롬프트 설계가 핵심이었습니다. 단순히 요약 말고 인사이트를 뽑아주도록 프롬프팅했더니 결과물 퀄리티가 확 달라졌어요.",
    hasImage: false,
    tags: ["Claude", "마케팅자동화", "프롬프트엔지니어링"],
    likes: 31,
    comments: [
      {
        id: "c1",
        author: "재호",
        username: "jaeho",
        time: "1시간 전",
        content: "GA4 연동 부분이 궁금해요. API 사용하신 건가요?",
        likes: 4,
      },
      {
        id: "c2",
        author: "미나",
        username: "mina",
        time: "45분 전",
        content: "슬랙 알림까지! 완벽한 자동화네요. 템플릿 공유 가능할까요?",
        likes: 5,
      },
    ],
  },
  "3": {
    id: "3",
    author: "민호",
    username: "minho",
    time: "3시간 전",
    content:
      "GPT-4o로 사내 챗봇을 만들었습니다. FAQ 문서를 업로드하면 임직원들이 자연어로 질문할 수 있는 시스템이에요.\n\nRAG 방식으로 구현했는데 Supabase pgvector를 써봤어요. 처음에 임베딩 비용 걱정했는데 생각보다 많이 안 나오더라고요. 응답 품질도 꽤 만족스럽습니다.",
    hasImage: true,
    tags: ["GPT-4o", "챗봇", "RAG"],
    likes: 18,
    comments: [
      {
        id: "c1",
        author: "다혜",
        username: "dahye",
        time: "2시간 전",
        content: "pgvector 처음 써봤는데 어떠셨어요? 러닝커브가 있나요?",
        likes: 2,
        replies: [
          {
            id: "c1-1",
            author: "민호",
            username: "minho",
            time: "1시간 40분 전",
            content: "공식 문서 보면서 하면 생각보다 쉬워요. Supabase 대시보드가 친절하게 되어 있어서요.",
            likes: 3,
          },
        ],
      },
      {
        id: "c2",
        author: "은서",
        username: "eunseo",
        time: "1시간 전",
        content: "청강생도 이런 거 만들 수 있을까요? 코딩 경험이 거의 없는데...",
        likes: 1,
      },
    ],
  },
  "q1": {
    id: "q1",
    author: "정민",
    username: "jungmin",
    time: "1시간 전",
    content:
      "Claude API 사용할 때 system prompt를 어떻게 설계하시나요?\n\n저는 지금 고객 응대 챗봇을 만들고 있는데, system prompt가 너무 길어지면 성능이 떨어지는 것 같더라고요. 적절한 길이나 구조화 방법이 있을까요? 경험 있으신 분들 조언 부탁드립니다!",
    hasImage: false,
    tags: ["Claude", "API", "프롬프트엔지니어링"],
    likes: 12,
    comments: [
      {
        id: "c1",
        author: "수현",
        username: "suhyun",
        time: "50분 전",
        content:
          "XML 태그로 섹션을 구분하면 훨씬 낫더라고요. <role>, <context>, <rules> 이런 식으로요. 길이보다는 구조화가 더 중요한 것 같아요.",
        likes: 8,
      },
      {
        id: "c2",
        author: "민호",
        username: "minho",
        time: "30분 전",
        content:
          "저는 2000토큰 이하로 유지하려고 노력해요. 그 이상 넘어가면 핵심 지시사항을 놓치는 경우가 있더라고요.",
        likes: 5,
      },
    ],
  },
  "q2": {
    id: "q2",
    author: "은서",
    username: "eunseo",
    time: "4시간 전",
    content:
      "n8n vs Make 어떤 걸 쓰시나요? 초보자 입장에서 어느 쪽이 더 배우기 쉬운지 여쭤보고 싶어요.\n\n저는 블로그 글 자동 발행 + SNS 공유 파이프라인을 만들려고 하는데, 무료 플랜 한도 내에서 쓰려면 어느 쪽이 나을까요?",
    hasImage: false,
    tags: ["n8n", "Make", "자동화"],
    likes: 19,
    comments: [
      {
        id: "c1",
        author: "다혜",
        username: "dahye",
        time: "3시간 전",
        content:
          "초보자라면 Make가 UI가 더 직관적이에요. n8n은 자유도가 높지만 그만큼 배워야 할 게 많아요.",
        likes: 7,
      },
      {
        id: "c2",
        author: "재호",
        username: "jaeho",
        time: "2시간 전",
        content:
          "무료 플랜 한도는 Make가 더 넉넉해요. 월 1000 operations 무료인데 개인 프로젝트는 충분하더라고요.",
        likes: 6,
      },
      {
        id: "c3",
        author: "지은",
        username: "jieun",
        time: "1시간 전",
        content: "저도 Make로 시작했는데 나중에 n8n으로 옮겼어요. 둘 다 배워두면 좋아요!",
        likes: 3,
      },
    ],
  },
};

function AvatarPlaceholder({ name }: { name: string }) {
  return (
    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-sm font-medium text-muted-foreground shrink-0">
      {name[0]}
    </div>
  );
}

function SmallAvatarPlaceholder({ name }: { name: string }) {
  return (
    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground shrink-0">
      {name[0]}
    </div>
  );
}

function CommentItem({ comment, isReply = false }: { comment: Comment; isReply?: boolean }) {
  return (
    <div className={isReply ? "ml-10" : ""}>
      <div className="flex gap-3 py-4">
        <SmallAvatarPlaceholder name={comment.author} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium text-foreground">{comment.author}</span>
            <span className="text-xs text-muted-foreground">@{comment.username}</span>
            <span className="text-xs text-muted-foreground">·</span>
            <span className="text-xs text-muted-foreground">{comment.time}</span>
          </div>
          <p className="text-sm text-foreground leading-relaxed">{comment.content}</p>
          <div className="flex items-center gap-4 mt-2">
            <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors">
              <Heart className="w-3.5 h-3.5" />
              <span>{comment.likes}</span>
            </button>
            <button className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              답글
            </button>
          </div>
        </div>
      </div>
      {comment.replies?.map((reply) => (
        <CommentItem key={reply.id} comment={reply} isReply />
      ))}
    </div>
  );
}

export default async function CommunityDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = postsMap[id];

  if (!post) {
    return (
      <div className="max-w-[680px] mx-auto px-6 py-8">
        <p className="text-foreground mb-4">게시글을 찾을 수 없습니다.</p>
        <Link href="/community/feed" className="text-primary text-sm hover:underline">
          커뮤니티로 돌아가기
        </Link>
      </div>
    );
  }

  const totalComments = post.comments.reduce(
    (acc, c) => acc + 1 + (c.replies?.length ?? 0),
    0
  );

  return (
    <div className="max-w-[680px] mx-auto px-6 py-8">
      {/* Back link */}
      <Link
        href="/community/feed"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>커뮤니티</span>
      </Link>

      {/* Post */}
      <div className="border border-border rounded-xl p-5 mb-6">
        {/* Author */}
        <div className="flex items-center gap-3 mb-4">
          <AvatarPlaceholder name={post.author} />
          <div>
            <span className="text-sm font-medium text-foreground">{post.author}</span>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-muted-foreground">@{post.username}</span>
              <span className="text-xs text-muted-foreground">·</span>
              <span className="text-xs text-muted-foreground">{post.time}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="text-[15px] text-foreground leading-relaxed whitespace-pre-line mb-4">
          {post.content}
        </div>

        {/* Image placeholder */}
        {post.hasImage && (
          <div className="bg-muted h-56 rounded-lg mb-4" />
        )}

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs text-primary bg-accent px-2.5 py-1 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-5 pt-3 border-t border-border">
          <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors">
            <Heart className="w-4 h-4" />
            <span>{post.likes}</span>
          </button>
          <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <MessageSquare className="w-4 h-4" />
            <span>{totalComments}</span>
          </button>
          <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors ml-auto">
            <Share2 className="w-4 h-4" />
            <span>공유</span>
          </button>
        </div>
      </div>

      {/* Comments section */}
      <div>
        <h2 className="text-sm font-medium text-muted-foreground mb-4">
          댓글 {totalComments}개
        </h2>

        {/* Comment input */}
        <div className="flex gap-3 mb-2 pb-4 border-b border-border">
          <div className="w-8 h-8 rounded-full bg-muted shrink-0" />
          <div className="flex-1 border border-border rounded-lg px-3 py-2 text-sm text-muted-foreground cursor-text">
            댓글을 남겨주세요...
          </div>
        </div>

        {/* Comment list */}
        <div>
          {post.comments.map((comment, index) => (
            <div key={comment.id}>
              <CommentItem comment={comment} />
              {index < post.comments.length - 1 && (
                <div className="border-b border-border" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
