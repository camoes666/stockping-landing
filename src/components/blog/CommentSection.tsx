import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";

interface Comment {
  id: number;
  created_at: string;
  author_name: string;
  content: string;
}

interface Props {
  postSlug: string;
}

export function CommentSection({ postSlug }: Props) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [authorName, setAuthorName] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComments();
  }, [postSlug]);

  async function fetchComments() {
    if (!supabase) return;
    setLoading(true);
    const { data } = await supabase
      .from("comments")
      .select("id, created_at, author_name, content")
      .eq("post_slug", postSlug)
      .eq("is_approved", true)
      .order("created_at", { ascending: true });
    setComments(data ?? []);
    setLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!supabase || !authorName.trim() || !content.trim()) return;
    setStatus("submitting");
    const { error } = await supabase.from("comments").insert({
      post_slug: postSlug,
      author_name: authorName.trim(),
      content: content.trim(),
    });
    if (error) {
      setStatus("error");
    } else {
      setStatus("done");
      setAuthorName("");
      setContent("");
    }
  }

  function formatDate(dateStr: string) {
    const d = new Date(dateStr);
    return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
  }

  return (
    <div className="mt-12 border-t border-warm-border pt-10">
      <h2 className="text-warm-text text-lg font-bold mb-6">댓글</h2>

      {/* 댓글 목록 */}
      {loading ? (
        <p className="text-warm-subtle text-sm">불러오는 중...</p>
      ) : comments.length === 0 ? (
        <p className="text-warm-subtle text-sm mb-8">아직 댓글이 없습니다. 첫 번째 댓글을 남겨보세요.</p>
      ) : (
        <div className="space-y-4 mb-8">
          {comments.map((c) => (
            <div key={c.id} className="bg-warm-surface border border-warm-border rounded-lg px-5 py-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-warm-text text-sm font-semibold">{c.author_name}</span>
                <span className="text-warm-subtle text-xs">{formatDate(c.created_at)}</span>
              </div>
              <p className="text-warm-text text-sm leading-relaxed">{c.content}</p>
            </div>
          ))}
        </div>
      )}

      {/* 댓글 작성 폼 */}
      {status === "done" ? (
        <div className="bg-warm-surface border border-warm-border rounded-lg p-5 text-center">
          <p className="text-warm-primary text-sm font-semibold">댓글이 등록되었습니다 ✓</p>
          <p className="text-warm-subtle text-xs mt-1">검토 후 게시됩니다.</p>
          <button
            onClick={() => setStatus("idle")}
            className="mt-3 text-xs text-warm-primary underline"
          >
            댓글 더 달기
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-warm-muted text-xs font-bold mb-1">이름</label>
            <input
              type="text"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder="닉네임"
              maxLength={30}
              required
              className="w-full border border-warm-border rounded px-3 py-2 text-sm text-warm-text bg-white focus:outline-none focus:border-warm-primary"
            />
          </div>
          <div>
            <label className="block text-warm-muted text-xs font-bold mb-1">
              댓글 <span className="font-normal text-warm-subtle">({content.length}/500)</span>
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="투자 관련 의견이나 질문을 남겨주세요."
              maxLength={500}
              required
              rows={3}
              className="w-full border border-warm-border rounded px-3 py-2 text-sm text-warm-text bg-white focus:outline-none focus:border-warm-primary resize-none"
            />
          </div>
          {status === "error" && (
            <p className="text-red-500 text-xs">오류가 발생했습니다. 다시 시도해주세요.</p>
          )}
          <button
            type="submit"
            disabled={status === "submitting"}
            className="bg-warm-primary text-white rounded px-5 py-2 text-sm font-semibold hover:bg-warm-primary-dark transition disabled:opacity-50"
          >
            {status === "submitting" ? "등록 중..." : "댓글 달기"}
          </button>
          <p className="text-warm-subtle text-xs">댓글은 검토 후 게시됩니다.</p>
        </form>
      )}
    </div>
  );
}
