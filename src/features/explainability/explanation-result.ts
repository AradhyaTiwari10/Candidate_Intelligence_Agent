export interface ActionExplanation {
  readonly goal: string;
  readonly reasoning: string;
  readonly expectedOutcome: string;
}

export interface ReasoningTrace {
  readonly observations: readonly string[];
  readonly inferences: readonly string[];
  readonly hypotheses: readonly string[];
  readonly plannerDecision: string;
  readonly selectedAction: string;
}
