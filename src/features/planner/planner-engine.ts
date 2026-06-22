import { CandidateIntelligence, PlannerState } from "@/types";
import { getCompletedObjectives, determineStageAndObjective } from "./objective-manager";
import { selectAction } from "./action-selector";

export function planNextSteps(
  candidate: CandidateIntelligence,
  currentState: PlannerState
): PlannerState {
  const completed = getCompletedObjectives(candidate);
  const { stage, activeObjective } = determineStageAndObjective(completed);
  const nextAction = selectAction(activeObjective);

  // Compute missing information based on current stage/objective
  const missingInformation: string[] = [];
  if (!completed.includes("Understand motivations")) {
    missingInformation.push("Candidate general career motivations");
  }
  if (!completed.includes("Understand ownership expectations")) {
    missingInformation.push("Candidate autonomy & decision-making expectations");
  }
  if (!completed.includes("Understand remote preferences")) {
    missingInformation.push("Candidate flexibility and remote work preferences");
  }

  if (stage === "QUALIFICATION") {
    if (!completed.includes("Validate role fit")) {
      missingInformation.push("Technical alignment on core platform tools");
    }
    if (!completed.includes("Validate experience")) {
      missingInformation.push("Detailed history of shipping complex platform systems");
    }
  }

  if (stage === "ENGAGEMENT") {
    if (candidate.concerns.length > 0) {
      missingInformation.push(
        ...candidate.concerns.map((c) => `Resolution for candidate concern: "${c}"`)
      );
    }
  }

  // Generate dynamic reasoning
  const reasoning = `Candidate progress evaluated. Current stage is ${stage}. Active objective is to '${activeObjective}'. Completed objectives: [${completed.join(", ")}]. Next action determined is ${nextAction}.`;

  // Compute confidence (e.g. baseline + completed count * factor)
  const baseConfidence = 70;
  const completedCount = completed.length;
  const confidence = Math.min(100, baseConfidence + completedCount * 4);

  return {
    stage,
    currentObjective: activeObjective,
    missingInformation,
    reasoning,
    nextAction,
    confidence,
  };
}
