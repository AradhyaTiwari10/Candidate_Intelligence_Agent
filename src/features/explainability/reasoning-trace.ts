import { ExecutionResult } from "@/features/orchestrator/execution-result";
import { ReasoningTrace } from "./explanation-result";

export function generateReasoningTrace(result: ExecutionResult): ReasoningTrace {
  return {
    observations: result.observations,
    inferences: result.inferences,
    hypotheses: result.hypotheses,
    plannerDecision: `Planner objective set to: '${result.plannerUpdates.currentObjective}' in stage: ${result.plannerUpdates.stage}`,
    selectedAction: result.selectedAction,
  };
}
