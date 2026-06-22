export interface GenerationResult {
  readonly success: boolean;
  readonly content?: string;
  readonly error?: string;
  readonly latencyMs: number;
  readonly model: string;
}
