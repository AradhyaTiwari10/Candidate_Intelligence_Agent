import { CandidateIntelligence, PlannerState } from "../../types";
import { ActionExplanation, ReasoningTrace } from "./explanation-result";
import { calculateConfidence } from "../confidence/confidence-engine";

export function generateActionExplanation(
  candidate: CandidateIntelligence,
  planner: PlannerState,
  action: string,
  confidence?: number,
  confidenceFactors?: readonly string[]
): ActionExplanation {
  let goal = "Progress candidate recruitment lifecycle.";
  let reasoning = "Determining candidate interest signals and role suitability.";
  let expectedOutcome = "Update candidate intelligence and active goals.";

  switch (action) {
    case "ASK_MOTIVATION":
      goal = "Understand candidate motivations";
      reasoning = candidate.observations.includes("Candidate values ownership")
        ? "Candidate expressed ownership interest, but motivations remain unclear."
        : "Candidate general career drivers have not been qualified yet.";
      expectedOutcome = "Identify primary career drivers.";
      break;

    case "ASK_OWNERSHIP":
      goal = "Assess ownership expectations";
      reasoning = "Candidate values autonomy and flat structures. We need to verify exact decision-making capabilities.";
      expectedOutcome = "Verify developer's autonomy boundary expectations.";
      break;

    case "ASK_REMOTE":
      goal = "Clarify remote and flexibility expectations";
      reasoning = "Candidate values flexibility. We must identify exact presence requirements and relocation constraints.";
      expectedOutcome = "Resolve remote presence boundaries and relocate constraints.";
      break;

    case "ASK_COMPENSATION":
      goal = "Qualify salary expectations and package alignment";
      reasoning = "Candidate concerns detected.";
      expectedOutcome = "Confirm salary expectations and cash/equity trade-off boundaries.";
      break;

    case "QUALIFY_EXPERIENCE":
      goal = "Verify technical systems depth";
      reasoning = "Transitioning to qualification. We need to verify candidate's history of shipping complex systems.";
      expectedOutcome = "Confirm candidate's hardware/software or distributed systems architectural proficiency.";
      break;

    case "ADDRESS_CONCERN":
      goal = "Reduce candidate uncertainty";
      reasoning = "Candidate concerns detected.";
      expectedOutcome = "Increase engagement confidence.";
      break;

    case "BOOK_CALL":
      goal = "Schedule call and book technical introduction";
      reasoning = "Engagement targets achieved. Candidate interest is high, fit is qualified, and concerns have been addressed.";
      expectedOutcome = "Candidate confirms availability for a 30-minute introductory sync call.";
      break;
  }

  let finalConfidence = confidence;
  let finalConfidenceFactors = confidenceFactors;

  if (finalConfidence === undefined || finalConfidenceFactors === undefined) {
    const trace: ReasoningTrace = {
      observations: candidate.observations,
      inferences: [],
      hypotheses: candidate.hypotheses,
      plannerDecision: planner.reasoning,
      selectedAction: action,
    };
    const confRes = calculateConfidence(candidate, planner, trace);
    finalConfidence = confRes.confidence;
    finalConfidenceFactors = confRes.confidenceFactors;
  }

  return {
    goal,
    reasoning,
    expectedOutcome,
    confidence: finalConfidence,
    confidenceFactors: finalConfidenceFactors,
  };
}
