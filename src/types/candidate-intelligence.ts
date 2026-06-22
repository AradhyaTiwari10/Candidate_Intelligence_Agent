export interface CandidateIntelligence {
  readonly id: string;
  readonly name: string;
  readonly title: string;
  readonly company?: string;
  
  // Understanding metrics (0 to 100)
  readonly interestScore: number;
  readonly roleFit: number;
  readonly startupAppetite: number;
  readonly missionAlignment: number;
  readonly salarySensitivity: number;
  readonly dropoutRisk: number;

  // Agent thoughts and context
  readonly observations: readonly string[];
  readonly hypotheses: readonly string[];
  readonly motivations: readonly string[];
  readonly concerns: readonly string[];
}
