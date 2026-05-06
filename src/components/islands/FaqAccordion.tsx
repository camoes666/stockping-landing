import { useState } from "react";

const faqs = [
  {
    q: "이 앱은 특정 종목을 추천하나요?",
    a: "아닙니다. 스톡핑은 미국주식 관련 뉴스·루머·리포트·ETF 분석·내부자 거래 데이터를 한곳에 정리해 드리는 정보 제공 앱입니다. 매수·매도 추천이나 수익 보장과는 전혀 다릅니다.",
  },
  {
    q: "앱은 무료로 사용할 수 있나요?",
    a: "기본 기능은 무료로 이용할 수 있습니다. 애널리스트 리포트 상세 보기, 내부자 거래 전체 데이터 등 일부 심화 기능은 앱 내 결제로 이용할 수 있습니다. 먼저 무료로 다운로드해 확인해 보세요.",
  },
  {
    q: "어떤 정보를 확인할 수 있나요?",
    a: "미국주식 뉴스 번역, 오늘의 이슈 레이더(확인된 사실·시장 관측·루머 분류), 애널리스트 리포트·목표가, ETF 보유 종목·배당·수수료 분석, 내부자 거래, 미국 상하원 의원 매매 데이터 등을 한곳에서 확인할 수 있습니다.",
  },
  {
    q: "이슈 레이더는 매일 업데이트되나요?",
    a: "네, 미국 주식 시장 흐름에 맞춰 매일 3~5개의 핵심 이슈를 정리해 업데이트합니다. 확인된 사실·시장 관측·루머를 구분해 제공하므로 SNS에서 보이는 정보를 그대로 믿는 일을 줄일 수 있습니다.",
  },
  {
    q: "'확인된 사실'과 '시장 관측'은 어떻게 다른가요?",
    a: "'확인된 사실'은 공식 발표·공시·실적 데이터 등 검증된 정보입니다. '시장 관측'은 이를 기반으로 한 시장의 해석과 전망입니다. '루머'는 아직 공식 확인이 안 된 정보입니다. 세 가지를 나눠 볼 수 있어 정보의 신뢰도를 스스로 판단하기 쉽습니다.",
  },
  {
    q: "앱은 어디서 다운로드하나요?",
    a: "현재 구글 플레이 스토어에서 다운로드할 수 있습니다. 검색창에 '스톡핑'을 검색하거나 이 페이지의 다운로드 버튼을 눌러 바로 이동할 수 있습니다.",
  },
  {
    q: "iOS 버전은 언제 나오나요?",
    a: "iOS(애플 앱스토어) 버전을 준비 중입니다. 현재는 안드로이드(구글 플레이) 버전만 이용 가능합니다. iOS 출시 시 별도 안내드리겠습니다.",
  },
];

export function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-2">
      {faqs.map((faq, i) => (
        <div
          key={i}
          className="overflow-hidden rounded-xl border border-[#362d59] bg-[#150f23] transition-colors duration-150 hover:border-[#584674]"
        >
          <button
            className="flex w-full items-center justify-between px-6 py-4 text-left transition-colors hover:bg-[#1f1633]"
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
          >
            <span className="pr-4 font-semibold text-white">{faq.q}</span>
            <svg
              className={`h-5 w-5 flex-shrink-0 text-[#6a5fc1] transition-transform duration-200 ${openIndex === i ? "rotate-180" : ""}`}
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
            <div className="border-t border-[#362d59] px-6 pb-5 pt-4 text-base leading-8 text-[#e5e7eb]/60">
              {faq.a}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
