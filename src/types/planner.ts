export type PlannerStage = 'DISCOVERY' | 'QUALIFICATION' | 'ENGAGEMENT' | 'BOOKING';

export interface PlannerState {
  readonly stage: PlannerStage;
  readonly currentObjective: string;
  readonly missingInformation: readonly string[];
  readonly reasoning: string;
  readonly nextAction: string;
  readonly confidence: number; // 0.0 to 1.0 representation
}
