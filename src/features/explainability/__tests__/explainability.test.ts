import { generateActionExplanation } from "../action-explanation-engine";
import { generateReasoningTrace } from "../reasoning-trace";
import { CandidateIntelligence, PlannerState } from "@/types";
import { ExecutionResult } from "@/features/orchestrator/execution-result";

const mockCandidate: CandidateIntelligence = {
  id: "test",
  name: "Alex",
  title: "Robotics",
  interestScore: 80,
  roleFit: 80,
  startupAppetite: 50,
  missionAlignment: 50,
  salarySensitivity: 50,
  dropoutRisk: 50,
  observations: ["Candidate values ownership"],
  hypotheses: [],
  motivations: [],
  concerns: ["runway"],
};

const mockPlanner: PlannerState = {
  stage: "DISCOVERY",
  currentObjective: "Understand motivations",
  missingInformation: [],
  reasoning: "",
  nextAction: "ASK_MOTIVATION",
  confidence: 80,
};

const mockExecutionResult: ExecutionResult = {
  observations: ["Candidate values ownership"],
  inferences: ["Current role may be restrictive"],
  hypotheses: ["Startup culture will appeal"],
  plannerUpdates: mockPlanner,
  selectedAction: "ASK_MOTIVATION",
  journalEntry: {
    id: "j-1",
    observation: "",
    inference: "",
    hypothesis: "",
    action: "",
    timestamp: "",
  },
  updatedCandidate: mockCandidate,
};

export function runExplanationEngineTest() {
  console.log("Running explanation engine tests...");
  const explanation = generateActionExplanation(mockCandidate, mockPlanner, "ASK_MOTIVATION");

  if (explanation.goal !== "Understand candidate motivations") {
    throw new Error("Explanation goal mismatch");
  }
  if (!explanation.reasoning.includes("ownership")) {
    throw new Error("Explanation reasoning mismatch");
  }
  if (!explanation.expectedOutcome.includes("career drivers")) {
    throw new Error("Explanation outcome mismatch");
  }

  console.log("✓ Explanation engine tests passed.");
}

export function runReasoningTraceTest() {
  console.log("Running reasoning trace builder tests...");
  const trace = generateReasoningTrace(mockExecutionResult);

  if (!trace.observations.includes("Candidate values ownership")) {
    throw new Error("Trace observations mismatch");
  }
  if (!trace.inferences.includes("Current role may be restrictive")) {
    throw new Error("Trace inferences mismatch");
  }
  if (!trace.hypotheses.includes("Startup culture will appeal")) {
    throw new Error("Trace hypotheses mismatch");
  }
  if (!trace.plannerDecision.includes("Understand motivations")) {
    throw new Error("Trace planner decision mismatch");
  }
  if (trace.selectedAction !== "ASK_MOTIVATION") {
    throw new Error("Trace selected action mismatch");
  }

  console.log("✓ Reasoning trace builder tests passed.");
}
