export interface CompanyContext {
  readonly companyName: string;
  readonly industry: string;
  readonly mission: string;
  readonly cultureTraits: readonly string[];
  readonly hiringGoals: readonly string[];
  readonly communicationTone: string;
}
