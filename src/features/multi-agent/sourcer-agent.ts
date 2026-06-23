import { CandidateIntelligence } from "../../types";
import { AgentResult } from "./agent-result";

/**
 * Generates recommendation for the Sourcer Agent role based on candidate details.
 */
export function generateSourcerRecommendation(
  candidate: CandidateIntelligence
): AgentResult {
  let recommendationType: AgentResult["recommendationType"] = "CONTINUE_DISCOVERY";
  let recommendationText = "Source additional background profiles.";
  let confidence = 70;

  if (candidate.roleFit < 70) {
    recommendationType = "QUALIFY_EXPERIENCE";
    recommendationText = "Gather more experience data to clarify role fit.";
    confidence = 80;
  } else if (candidate.observations.length === 0) {
    recommendationType = "QUALIFY_EXPERIENCE";
    recommendationText = "Identify missing competencies and core skill alignment.";
    confidence = 75;
  }

  return {
    agent: "SOURCER",
    recommendationType,
    recommendationText,
    confidence,
  };
}
