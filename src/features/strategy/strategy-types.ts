export type StrategyType =
  | "DISCOVERY"
  | "QUALIFICATION"
  | "ENGAGEMENT"
  | "OBJECTION_HANDLING"
  | "CONVERSION";

export interface MessageStrategy {
  readonly strategy: StrategyType;
  readonly objective: string;
  readonly communicationRules: readonly string[];
  readonly forbiddenPatterns: readonly string[];
  readonly expectedOutcome: string;
}
