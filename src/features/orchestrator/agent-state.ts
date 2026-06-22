import {
  CompanyContext,
  RecruiterPersona,
  CandidateIntelligence,
  PlannerState,
  ConversationMessage,
} from "@/types";

export interface AgentState {
  readonly companyContext: CompanyContext | null;
  readonly recruiterPersona: RecruiterPersona | null;
  readonly candidateIntelligence: CandidateIntelligence;
  readonly plannerState: PlannerState;
  readonly conversationHistory: readonly ConversationMessage[];
}
