export interface ConfidenceResult {
  readonly confidence: number;
  readonly confidenceFactors: readonly string[];
  readonly strengths: readonly string[];
  readonly uncertainties: readonly string[];
}
