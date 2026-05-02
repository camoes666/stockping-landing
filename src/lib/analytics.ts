import { supabase } from "./supabase";

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

export async function trackCtaClick(
  eventType: string,
  page: string,
  ctaLabel: string
): Promise<void> {
  if (!supabase) return;
  try {
    await supabase.from("cta_events").insert({
      event_type: eventType,
      page,
      cta_label: ctaLabel,
    });
  } catch {
    // analytics failure should never break UX
  }
}
