import { createClient } from "@supabase/supabase-js";
import type { DailyIssue, IssueCategory } from "../data/daily-issues";

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY ?? "";

export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

export interface DailyIssueRow {
  id: number;
  created_at: string;
  headline: string;
  category: IssueCategory;
  related_symbols: string[];
  confirmed_facts: string;
  market_observation: string;
  watch_points: string[];
  app_data_points: string[];
  is_published: boolean;
  display_order: number;
}

export function rowToIssue(row: DailyIssueRow): DailyIssue {
  return {
    headline: row.headline,
    category: row.category,
    relatedSymbols: row.related_symbols,
    confirmedFacts: row.confirmed_facts,
    marketObservation: row.market_observation,
    watchPoints: row.watch_points,
    appDataPoints: row.app_data_points,
    updatedAt: row.created_at,
  };
}
