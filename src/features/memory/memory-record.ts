export type MemoryCategory = "compensation" | "motivation" | "flexibility" | "experience" | "general";

export interface MemoryRecord {
  readonly id: string;
  readonly candidateId: string;
  readonly category: MemoryCategory;
  readonly fact: string;
  readonly timestamp: string;
}
