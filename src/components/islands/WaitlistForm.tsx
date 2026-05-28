import { useState } from "react";

interface Props {
  section?: string;
}

export function WaitlistForm({ section = "hero" }: Props) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error" | "duplicate">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, section }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else if (data.error === "duplicate") {
        setStatus("duplicate");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-[#c2ef4e]/30 bg-[#c2ef4e]/10 px-6 py-4">
        <span className="text-2xl">🎉</span>
        <div>
          <p className="font-bold text-[#c2ef4e]">출시 알림 신청 완료!</p>
          <p className="text-sm text-[#e5e7eb]/60">앱 출시 시 이메일로 알려드릴게요.</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="이메일 주소를 입력하세요"
          required
          className="flex-1 rounded-xl border border-[#362d59] bg-[#1f1633] px-4 py-3.5 text-base text-white placeholder-[#e5e7eb]/30 outline-none focus:border-[#c2ef4e]/50 focus:ring-2 focus:ring-[#c2ef4e]/20 transition"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="rounded-xl bg-[#c2ef4e] px-6 py-3.5 text-base font-bold text-[#150f23] transition hover:bg-[#d4f76a] disabled:opacity-60 whitespace-nowrap"
        >
          {status === "loading" ? "신청 중..." : "출시 알림 신청"}
        </button>
      </div>

      {status === "duplicate" && (
        <p className="mt-2 text-sm text-[#c2ef4e]/80">이미 신청된 이메일이에요 ✓</p>
      )}
      {status === "error" && (
        <p className="mt-2 text-sm text-red-400">오류가 발생했어요. 다시 시도해주세요.</p>
      )}

      <p className="mt-3 text-xs text-[#e5e7eb]/30">
        스팸 없음 · 출시 알림 1회만 발송 · 언제든 취소 가능
      </p>
    </form>
  );
}
