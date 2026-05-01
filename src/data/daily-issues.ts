export type IssueCategory = "확인된 사실" | "시장 관측" | "루머";

export interface DailyIssue {
  headline: string;
  category: IssueCategory;
  relatedSymbols: string[];
  confirmedFacts: string;
  marketObservation: string;
  watchPoints: string[];
  appDataPoints: string[];
}

export const dailyIssues: DailyIssue[] = [
  {
    headline: "반도체 대형주 실적 기대가 기술주 전체 심리에 미치는 영향",
    category: "시장 관측",
    relatedSymbols: ["NVDA", "AMD", "SMH"],
    confirmedFacts: "주요 반도체 종목을 중심으로 실적 발표 일정과 시장 관심이 집중되고 있다.",
    marketObservation: "단기 수급이 실적 기대감에 선반영되며 섹터 전반 변동성이 커질 수 있다는 해석이 나온다.",
    watchPoints: [
      "실적 일정 전후 ETF 자금 흐름을 확인한다.",
      "섹터 동반 움직임이 지속되는지 장중에 체크한다.",
    ],
    appDataPoints: ["뉴스 번역", "관련 ETF 흐름", "종목별 이슈 묶음"],
  },
  {
    headline: "정책 발언 이후 금리 민감 성장주의 반응 체크",
    category: "확인된 사실",
    relatedSymbols: ["QQQ", "TSLA", "AAPL"],
    confirmedFacts: "정책 발언과 경제 일정이 공개되어 시장 금리 기대에 영향을 주고 있다.",
    marketObservation: "성장주 밸류에이션 부담이 다시 부각될 수 있다는 관측이 있다.",
    watchPoints: [
      "장 초반 금리 방향성이 장중에 유지되는지 확인한다.",
      "기술주 반응이 섹터 전반으로 번지는지 체크한다.",
    ],
    appDataPoints: ["거시 이슈 요약", "관련 종목 뉴스", "ETF 흐름"],
  },
  {
    headline: "특정 종목 공급 계약설이 관련 밸류체인에 미치는 파급",
    category: "루머",
    relatedSymbols: ["PLTR", "MSFT"],
    confirmedFacts: "공식 공시나 회사 발표 기준 확정된 계약 내용은 아직 확인되지 않았다.",
    marketObservation: "시장에서는 수혜 가능 업종과 연관 종목을 묶어 먼저 반응하려는 움직임이 보인다.",
    watchPoints: [
      "거래량 급증 여부를 먼저 확인한다.",
      "후속 확인 보도 유무를 루머와 분리해서 본다.",
    ],
    appDataPoints: ["실시간 이슈 요약", "관련 뉴스 묶음", "종목 관심 등록"],
  },
];
