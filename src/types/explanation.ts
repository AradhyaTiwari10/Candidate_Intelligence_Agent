export interface ActionExplanation {
  readonly goal: string;
  readonly reasoning: string;
  readonly expectedOutcome: string;
  readonly confidence: number;
  readonly confidenceFactors: readonly string[];
}
