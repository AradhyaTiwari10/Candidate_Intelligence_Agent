import { AgentRole } from "./agent-role";
import { RecommendationType } from "./recommendation-types";

export interface AgentResult {
  readonly agent: AgentRole;
  readonly recommendationType: RecommendationType;
  readonly recommendationText: string;
  readonly confidence: number;
}
