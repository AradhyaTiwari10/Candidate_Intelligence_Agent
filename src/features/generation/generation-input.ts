import {
  CompanyContext,
  RecruiterPersona,
  CandidateIntelligence,
  PlannerState,
  ConversationMessage,
} from "@/types";

export interface GenerationInput {
  readonly companyContext: CompanyContext | null;
  readonly recruiterPersona: RecruiterPersona | null;
  readonly candidateIntelligence: CandidateIntelligence;
  readonly plannerState: PlannerState;
  readonly selectedAction: string;
  readonly conversationHistory: readonly ConversationMessage[];
}
