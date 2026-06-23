import { CandidateIntelligence, PlannerState } from "../../types";
import { AgentResult } from "./agent-result";

/**
 * Generates recommendation for the Qualifier Agent role.
 */
export function generateQualifierRecommendation(
  _candidate: CandidateIntelligence,
  planner: PlannerState
): AgentResult {
  let recommendationType: AgentResult["recommendationType"] = "CONTINUE_DISCOVERY";
  let recommendationText = "Continue qualification of experience.";
  let confidence = 70;

  const missingInfo = (planner.missingInformation || []).map((i) => i.toLowerCase());
  const hasMissingComp = missingInfo.some((i) => i.includes("compensation") || i.includes("salary") || i.includes("bounds"));
  const hasMissingRemote = missingInfo.some((i) => i.includes("remote") || i.includes("location") || i.includes("presence"));

  if (hasMissingComp) {
    recommendationType = "ASK_COMPENSATION";
    recommendationText = "Ask candidate about their compensation boundaries.";
    confidence = 85;
  } else if (hasMissingRemote) {
    recommendationType = "ASK_REMOTE";
    recommendationText = "Ask candidate about remote/hybrid workspace preferences.";
    confidence = 80;
  }

  return {
    agent: "QUALIFIER",
    recommendationType,
    recommendationText,
    confidence,
  };
}
