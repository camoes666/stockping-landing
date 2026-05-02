export type CtaType = "landing" | "today" | "etf" | "report" | "insider" | "congress";

export const ctaCopy: Record<CtaType, { headline: string; button: string }> = {
  landing: { headline: "앱 하나로 미국장 핵심 정보를 한국어로", button: "플레이스토어에서 무료 다운로드" },
  today: { headline: "오늘의 미국장 이슈를 앱에서 더 자세히 확인하세요", button: "앱에서 이슈 레이더 보기" },
  etf: { headline: "ETF 보유 종목·자금 흐름을 앱에서 실시간으로", button: "앱에서 ETF 분석 보기" },
  report: { headline: "애널리스트 목표가와 리포트를 앱에서 확인하세요", button: "앱에서 리포트 보기" },
  insider: { headline: "내부자 거래·의원 매매 데이터를 앱에서 바로", button: "앱에서 내부자 거래 보기" },
  congress: { headline: "상하원 의원 주식 매매를 앱에서 바로 확인", button: "앱에서 의원 매매 보기" },
};
