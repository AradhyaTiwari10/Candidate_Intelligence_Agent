import { runAgentLoop } from "./agent-loop";
import { ExecutionResult } from "./execution-result";
import { AgentState } from "./agent-state";

export function runOrchestrator(message: string, state: AgentState): ExecutionResult {
  return runAgentLoop(message, state);
}
