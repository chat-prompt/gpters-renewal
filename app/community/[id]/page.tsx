"use client";

import { useState } from "react";
import { useParams, useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Heart, MessageSquare, Share2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { Avatar } from "@/components/ui/avatar";
import { TagList } from "@/components/site/tag-list";

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
  imageUrl?: string;
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
    imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop",
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
    imageUrl: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&h=400&fit=crop",
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

function CommentItem({ comment, isReply = false }: { comment: Comment; isReply?: boolean }) {
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const requireLogin = () => {
    if (!isLoggedIn) {
      router.push(`/login?from=${encodeURIComponent(pathname)}`);
      return true;
    }
    return false;
  };

  return (
    <div className={isReply ? "ml-10" : ""}>
      <div className="flex gap-3 py-4">
        <Avatar fallback={comment.author[0]} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium text-foreground">{comment.author}</span>
            <span className="text-sm font-regular text-sub-foreground">· {comment.time}</span>
          </div>
          <p className="text-sm font-regular text-foreground leading-relaxed">{comment.content}</p>
          <div className="flex items-center gap-4 mt-2">
            <button
              onClick={() => { if (requireLogin()) return; }}
              className="flex items-center gap-1 text-sm text-sub-foreground hover:text-primary transition-colors"
            >
              <Heart className="w-5 h-5" strokeWidth={1.5} />
              <span>{comment.likes}</span>
            </button>
            <button
              onClick={() => { if (requireLogin()) return; }}
              className="text-sm text-sub-foreground hover:text-foreground transition-colors"
            >
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

export default function CommunityDetailPage() {
  const { id } = useParams<{ id: string }>();
  const post = postsMap[id];
  const [liked, setLiked] = useState(false);
  const [copied, setCopied] = useState(false);
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const requireLogin = () => {
    if (!isLoggedIn) {
      router.push(`/login?from=${encodeURIComponent(pathname)}`);
      return true;
    }
    return false;
  };

  if (!post) {
    return (
      <div className="max-w-[680px] mx-auto px-6 py-page">
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
    <div className="max-w-[680px] mx-auto px-6 py-page">
      {/* Back link */}
      <Link
        href="/community/feed"
        className="inline-flex items-center gap-1.5 text-sm text-sub-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
        <span>커뮤니티</span>
      </Link>

      {/* Post */}
      <div className="mb-6">
        {/* Author */}
        <div className="flex items-center gap-3 mb-4">
          <Avatar size="lg" fallback={post.author[0]} />
          <div>
            <span className="text-sm font-medium text-foreground">{post.author}</span>
            <span className="text-sm text-sub-foreground">{post.time}</span>
          </div>
        </div>

        {/* Content */}
        <div className="text-[15px] font-regular text-foreground leading-relaxed whitespace-pre-line mb-4">
          {post.content}
        </div>

        {/* Image */}
        {post.imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={post.imageUrl} alt="" className="w-full h-56 object-cover rounded-lg mb-4" />
        )}

        {/* Tags */}
        <TagList tags={post.tags} className="mb-4" />

        {/* Actions */}
        <div className="flex items-center gap-5 pt-3 border-t border-border">
          <button
            onClick={() => { if (requireLogin()) return; setLiked((prev) => !prev); }}
            className={`flex items-center gap-1.5 text-sm transition-colors ${
              liked ? "text-primary" : "text-sub-foreground hover:text-primary"
            }`}
          >
            <Heart className="w-5 h-5" strokeWidth={1.5} fill={liked ? "currentColor" : "none"} />
            <span>{liked ? post.likes + 1 : post.likes}</span>
          </button>
          <button className="flex items-center gap-1.5 text-sm text-sub-foreground hover:text-foreground transition-colors">
            <MessageSquare className="w-5 h-5" strokeWidth={1.5} />
            <span>{totalComments}</span>
          </button>
          <button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            className={`flex items-center gap-1.5 text-sm transition-colors ml-auto ${
              copied ? "text-primary" : "text-sub-foreground hover:text-foreground"
            }`}
          >
            <Share2 className="w-5 h-5" strokeWidth={1.5} />
            <span>{copied ? "복사됨" : "공유"}</span>
          </button>
        </div>
      </div>

      {/* Comments section */}
      <div>
        <h2 className="text-sm font-medium text-sub-foreground mb-4">
          댓글 {totalComments}개
        </h2>

        {/* Comment input */}
        <div
          className="flex gap-3 mb-4 cursor-text"
          onClick={!isLoggedIn ? () => router.push(`/login?from=${encodeURIComponent(pathname)}`) : undefined}
        >
          <div className="w-8 h-8 rounded-full bg-muted shrink-0" />
          <div className="flex-1 border border-border rounded-lg px-3 py-2 text-sm text-sub-foreground">
            {isLoggedIn ? "댓글을 남겨주세요..." : "로그인하고 자유롭게 의견을 남겨주세요"}
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
