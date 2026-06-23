import { RecommendationType, RecommendationPriorityReason } from "./recommendation-types";

interface PriorityConfig {
  readonly rank: number;
  readonly reason: RecommendationPriorityReason;
}

export const PRIORITY_MAP: Record<RecommendationType, PriorityConfig> = {
  ADDRESS_OBJECTION:  { rank: 1, reason: "OBJECTION_RISK" },
  ASK_COMPENSATION:   { rank: 2, reason: "MISSING_COMPENSATION" },
  ASK_REMOTE:         { rank: 3, reason: "MISSING_REMOTE" },
  QUALIFY_EXPERIENCE: { rank: 4, reason: "LOW_CONFIDENCE" },
  BOOK_CALL:          { rank: 5, reason: "HIGH_BUYING_SIGNAL" },
  CONTINUE_DISCOVERY: { rank: 6, reason: "LOW_CONFIDENCE" },
};
