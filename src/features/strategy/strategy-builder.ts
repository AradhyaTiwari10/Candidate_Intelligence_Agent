import { CandidateIntelligence, PlannerState } from "../../types";
import { MessageStrategy } from "./strategy-types";
import { getStrategy } from "./strategy-engine";

export function buildStrategy(
  _candidate: CandidateIntelligence,
  _planner: PlannerState,
  action: string
): MessageStrategy {
  return getStrategy(action);
}
