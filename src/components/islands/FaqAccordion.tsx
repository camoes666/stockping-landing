import { useState } from "react";

const faqs = [
  {
    q: "이 사이트는 특정 종목을 추천하나요?",
    a: "아닙니다. 이슈 레이더는 투자 판단을 돕기 위한 정보 제공 목적이며, 특정 종목의 매수·매도 추천을 제공하지 않습니다. 확인된 사실과 시장 관측을 구분해 보여드릴 뿐입니다.",
  },
  {
    q: "이슈 레이더는 매일 업데이트되나요?",
    a: "네, 미국 주식 시장 마감 이후 매일 3~5개의 핵심 이슈를 정리해 업데이트합니다.",
  },
  {
    q: "'확인된 사실'과 '시장 관측'은 어떻게 다른가요?",
    a: "'확인된 사실'은 공식 발표, 공시, 실적 데이터 등 검증된 정보입니다. '시장 관측'은 이를 기반으로 한 시장의 해석과 전망입니다. '루머'는 아직 공식 확인이 안 된 정보입니다.",
  },
  {
    q: "앱은 어디서 다운로드하나요?",
    a: "현재 Google Play Store에서 다운로드할 수 있습니다. iOS 버전은 준비 중입니다.",
  },
  {
    q: "앱을 꼭 다운로드해야 하나요?",
    a: "이슈 레이더 페이지는 앱 없이도 웹에서 바로 볼 수 있습니다. 앱에서는 관련 종목 데이터, ETF 흐름, 뉴스 번역 등 더 자세한 정보를 확인할 수 있습니다.",
  },
];

export function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-2">
      {faqs.map((faq, i) => (
        <div
          key={i}
          className="overflow-hidden rounded-xl border border-slate-200 bg-white"
        >
          <button
            className="flex w-full items-center justify-between px-6 py-4 text-left transition-colors hover:bg-slate-50"
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
          >
            <span className="pr-4 font-semibold text-slate-900">{faq.q}</span>
            <svg
              className={`h-5 w-5 flex-shrink-0 text-slate-400 transition-transform duration-200 ${openIndex === i ? "rotate-180" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          {openIndex === i && (
            <div className="border-t border-slate-100 px-6 pb-5 pt-4 text-sm leading-7 text-slate-600">
              {faq.a}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
