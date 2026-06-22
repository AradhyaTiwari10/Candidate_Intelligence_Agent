import { CandidateIntelligence, PlannerState, JournalEntry } from "@/types";

export interface ExecutionResult {
  readonly observations: readonly string[];
  readonly inferences: readonly string[];
  readonly hypotheses: readonly string[];
  readonly plannerUpdates: PlannerState;
  readonly selectedAction: string;
  readonly journalEntry: JournalEntry;
  readonly updatedCandidate: CandidateIntelligence;
}
