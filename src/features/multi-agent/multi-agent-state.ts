import { AgentRole } from "./agent-role";
import { AgentResult } from "./agent-result";

export interface MultiAgentState {
  readonly currentActiveAgent: AgentRole;
  readonly agentHistory: readonly AgentResult[];
  readonly lastActiveAgent: AgentRole | null;
}
