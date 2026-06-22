export interface ResponseResult {
  readonly success: boolean;
  readonly message: string;
  readonly validationPassed: boolean;
  readonly latencyMs: number;
  readonly model: string;
}
