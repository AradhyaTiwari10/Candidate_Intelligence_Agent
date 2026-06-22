export interface JournalEntry {
  readonly id: string;
  readonly observation: string;
  readonly inference: string;
  readonly hypothesis: string;
  readonly action: string;
  readonly timestamp: string; // ISO-8601 string
}
