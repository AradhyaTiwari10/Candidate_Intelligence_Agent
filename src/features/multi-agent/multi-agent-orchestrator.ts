import { CandidateIntelligence, PlannerState } from "../../types";
import { ConfidenceResult } from "../confidence/confidence-result";
import { AgentResult } from "./agent-result";
import { generateSourcerRecommendation } from "./sourcer-agent";
import { generateQualifierRecommendation } from "./qualifier-agent";
import { generateEngagementRecommendation } from "./engagement-agent";
import { generateCoordinatorRecommendation, CoordinatorRecommendation } from "./coordinator-agent";

/**
 * Runs a passive review loop over all agent roles in order: SOURCER, QUALIFIER, ENGAGEMENT, COORDINATOR.
 */
export function runMultiAgentReview(
  candidate: CandidateIntelligence,
  planner: PlannerState,
  confidence: ConfidenceResult
): readonly (AgentResult | CoordinatorRecommendation)[] {
  let sourcerResult: AgentResult;
  try {
    sourcerResult = generateSourcerRecommendation(candidate);
  } catch (err: any) {
    console.error("Sourcer agent failed:", err);
    sourcerResult = {
      agent: "SOURCER",
      recommendationType: "CONTINUE_DISCOVERY",
      recommendationText: "Sourcer review failed.",
      confidence: 0,
    };
  }

  let qualifierResult: AgentResult;
  try {
    qualifierResult = generateQualifierRecommendation(candidate, planner);
  } catch (err: any) {
    console.error("Qualifier agent failed:", err);
    qualifierResult = {
      agent: "QUALIFIER",
      recommendationType: "CONTINUE_DISCOVERY",
      recommendationText: "Qualifier review failed.",
      confidence: 0,
    };
  }

  let engagementResult: AgentResult;
  try {
    engagementResult = generateEngagementRecommendation(candidate);
  } catch (err: any) {
    console.error("Engagement agent failed:", err);
    engagementResult = {
      agent: "ENGAGEMENT",
      recommendationType: "CONTINUE_DISCOVERY",
      recommendationText: "Engagement review failed.",
      confidence: 0,
    };
  }

  let coordinatorResult: AgentResult | CoordinatorRecommendation;
  try {
    coordinatorResult = generateCoordinatorRecommendation(
      sourcerResult,
      qualifierResult,
      engagementResult,
      planner,
      confidence
    );
  } catch (err: any) {
    console.error("Coordinator agent failed:", err);
    coordinatorResult = {
      agent: "COORDINATOR",
      recommendationType: "CONTINUE_DISCOVERY",
      recommendationText: "Consensus review failed.",
      confidence: 0,
      rationale: "Coordinator consensus generation failed.",
      detectedDisagreements: [],
      priorityReason: "CRITICAL_MISSING_INFO",
      selectedBy: "COORDINATOR",
      tieBreakRule: "FIRST_ENCOUNTERED",
      rankedCandidates: [],
    };
  }

  return [
    sourcerResult,
    qualifierResult,
    engagementResult,
    coordinatorResult,
  ];
}
