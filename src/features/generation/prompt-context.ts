export interface PromptContext {
  readonly companyContextBlock: string;
  readonly recruiterPersonaBlock: string;
  readonly candidateIntelligenceBlock: string;
  readonly plannerStateBlock: string;
  readonly selectedActionBlock: string;
  readonly expectedOutcomeBlock: string;
  readonly fullPrompt: string;
}
