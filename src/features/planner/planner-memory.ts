export interface PlannerMemory {
  readonly completedObjectives: readonly string[];
  readonly activeObjective: string;
  readonly previousActions: readonly string[];
}
