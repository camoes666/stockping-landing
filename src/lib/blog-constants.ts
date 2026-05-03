export const CATEGORY_LABELS: Record<string, string> = {
  etf: "ETF",
  "news-rumor": "뉴스/루머",
  "analyst-report": "애널리스트",
  "insider-congress": "내부자/의원",
  "stock-data": "종목데이터",
};

export const CATEGORY_OPTIONS = [
  { value: "etf", label: "ETF" },
  { value: "news-rumor", label: "뉴스/루머" },
  { value: "analyst-report", label: "애널리스트" },
  { value: "insider-congress", label: "내부자/의원" },
  { value: "stock-data", label: "종목데이터" },
] as const;

export function formatKoreanDate(dateStr: string): string {
  const [year, month, day] = dateStr.split("-");
  return `${year}년 ${month}월 ${day}일`;
}
