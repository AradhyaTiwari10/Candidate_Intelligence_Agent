import { CompanyContext, RecruiterPersona, PlannerState } from "@/types";
import { generatePersona } from "./persona-generator";
import { generateStrategy } from "./strategy-generator";

export interface BootstrapResult {
  readonly persona: RecruiterPersona;
  readonly planner: PlannerState;
}

export function bootstrapAgent(context: CompanyContext): BootstrapResult {
  const persona = generatePersona(context);
  const planner = generateStrategy(context);
  return {
    persona,
    planner,
  };
}
