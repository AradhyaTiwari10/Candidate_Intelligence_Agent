import { PlannerState } from "../../types";
import { ConfidenceResult } from "../confidence/confidence-result";
import { AgentResult, RecommendationPriorityReason, RecommendationType } from "./recommendation-types";
import { selectRecommendation, RankedCandidate, TieBreakRule } from "./recommendation-selector";
import { AgentRole } from "./agent-role";

export interface CoordinatorRecommendation {
  readonly agent: "COORDINATOR";
  readonly recommendationType: RecommendationType;
  readonly recommendationText: string;
  readonly confidence: number;
  readonly rationale: string;
  readonly detectedDisagreements: readonly string[];
  readonly priorityReason: RecommendationPriorityReason;
  readonly selectedBy: AgentRole;
  readonly tieBreakRule: TieBreakRule;
  readonly rankedCandidates: readonly RankedCandidate[];
}

/**
 * Generates recommendation for the Coordinator Agent role.
 * Evaluates sub-agent results, detects disagreements, and aggregates using the priority selector.
 */
export function generateCoordinatorRecommendation(
  sourcerResult: AgentResult,
  qualifierResult: AgentResult,
  engagementResult: AgentResult,
  planner: PlannerState,
  _confidenceResult: ConfidenceResult
): CoordinatorRecommendation {
  // 1. Generate Coordinator's own baseline recommendation
  let coordRecType: RecommendationType = "CONTINUE_DISCOVERY";
  let coordRecText = "Continue discovery and qualification loops.";
  let coordConfidence = 70;

  if (planner.confidence > 80) {
    coordRecType = "BOOK_CALL";
    coordRecText = "Confidence is high; recommend booking a call.";
    coordConfidence = 90;
  } else if (planner.confidence < 50) {
    coordRecType = "CONTINUE_DISCOVERY";
    coordRecText = "Confidence is low; continue discovery phase to gather intelligence.";
    coordConfidence = 75;
  }

  const coordinatorResult: AgentResult = {
    agent: "COORDINATOR",
    recommendationType: coordRecType,
    recommendationText: coordRecText,
    confidence: coordConfidence,
  };

  // 2. Detect Disagreements
  const disagreements: string[] = [];
  if (sourcerResult.recommendationType !== qualifierResult.recommendationType) {
    disagreements.push(
      `Sourcer recommends ${sourcerResult.recommendationType} but Qualifier recommends ${qualifierResult.recommendationType}.`
    );
  }
  if (qualifierResult.recommendationType !== engagementResult.recommendationType) {
    disagreements.push(
      `Qualifier recommends ${qualifierResult.recommendationType} but Engagement recommends ${engagementResult.recommendationType}.`
    );
  }

  // 3. Run Selection Algorithm
  const allResults = [sourcerResult, qualifierResult, engagementResult, coordinatorResult];
  const selection = selectRecommendation(allResults);

  return {
    agent: "COORDINATOR",
    recommendationType: selection.selected.recommendationType,
    recommendationText: selection.selected.recommendationText,
    confidence: selection.selected.confidence,
    rationale: selection.rationale,
    detectedDisagreements: disagreements,
    priorityReason: selection.reason,
    selectedBy: selection.selectedBy,
    tieBreakRule: selection.tieBreakRule,
    rankedCandidates: selection.rankedCandidates,
  };
}
