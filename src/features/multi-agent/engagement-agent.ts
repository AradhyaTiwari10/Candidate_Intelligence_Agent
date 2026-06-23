import { CandidateIntelligence } from "../../types";
import { AgentResult } from "./agent-result";

/**
 * Generates recommendation for the Engagement Agent role.
 */
export function generateEngagementRecommendation(
  candidate: CandidateIntelligence
): AgentResult {
  let recommendationType: AgentResult["recommendationType"] = "CONTINUE_DISCOVERY";
  let recommendationText = "Maintain baseline engagement.";
  let confidence = 70;

  const hasObjections = candidate.concerns && candidate.concerns.length > 0;

  if (candidate.interestScore > 80) {
    recommendationType = "BOOK_CALL";
    recommendationText = "Candidate interest is high; deepen conversation and share company mission.";
    confidence = 90;
  } else if (hasObjections) {
    recommendationType = "ADDRESS_OBJECTION";
    recommendationText = `Objections detected; address concerns regarding ${candidate.concerns.join(", ")}.`;
    confidence = 85;
  }

  return {
    agent: "ENGAGEMENT",
    recommendationType,
    recommendationText,
    confidence,
  };
}
