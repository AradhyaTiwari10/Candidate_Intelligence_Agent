import { extractObservations } from "@/features/intelligence/observation-engine";
import { makeInferences } from "@/features/intelligence/inference-engine";
import { formulateHypotheses } from "@/features/intelligence/hypothesis-engine";
import { updateCandidateIntelligence } from "@/features/intelligence/candidate-updater";
import { planNextSteps } from "@/features/planner/planner-engine";
import { JournalEntry } from "@/types";
import { ExecutionResult } from "./execution-result";
import { AgentState } from "./agent-state";

export function runAgentLoop(message: string, state: AgentState): ExecutionResult {
  const candidate = state.candidateIntelligence;
  const currentPlanner = state.plannerState;

  // 1. Observe
  const observations = extractObservations(message);

  // 2. Reason
  const inferences = makeInferences(observations);
  const hypotheses = formulateHypotheses(observations, inferences);

  // Update candidate scores and context
  const updatedCandidate = updateCandidateIntelligence(candidate, observations, hypotheses);

  // 3. Plan
  const plannerUpdates = planNextSteps(updatedCandidate, currentPlanner);

  // 4. Act
  const selectedAction = plannerUpdates.nextAction;

  // Create journal entry
  const journalEntry: JournalEntry = {
    id: `j-orpa-${Date.now()}`,
    observation: observations.join("; ") || "No significant topic observed.",
    inference: inferences.join("; ") || "No new inferences drawn.",
    hypothesis: hypotheses.join("; ") || "No new hypotheses formulated.",
    action:
      selectedAction === "BOOK_CALL"
        ? `Flagged candidate ${updatedCandidate.name} as ready for booking. Selected BOOK_CALL.`
        : `Planner selected action: ${selectedAction} under objective: ${plannerUpdates.currentObjective}`,
    timestamp: new Date().toISOString(),
  };

  return {
    observations,
    inferences,
    hypotheses,
    plannerUpdates,
    selectedAction,
    journalEntry,
    updatedCandidate,
  };
}
