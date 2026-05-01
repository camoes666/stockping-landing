export interface CtaEvent {
  sourcePage: string;
  sourceSection: string;
  campaign?: string;
}

export function buildCtaEvent(event: CtaEvent): CtaEvent {
  return {
    sourcePage: event.sourcePage,
    sourceSection: event.sourceSection,
    campaign: event.campaign,
  };
}
