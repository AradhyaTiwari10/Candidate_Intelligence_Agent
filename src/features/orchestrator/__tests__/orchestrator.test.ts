import { runOrchestrator } from "../agent-orchestrator";
import { AgentState } from "../agent-state";

const baseState: AgentState = {
  companyContext: {
    companyName: "Stripe",
    industry: "Finance",
    mission: "GDP of the internet",
    cultureTraits: ["High ownership", "Fast execution"],
    hiringGoals: ["Backend Engineer"],
    communicationTone: "direct",
  },
  recruiterPersona: {
    name: "Sarah Chen",
    role: "Principal Recruiting Partner",
    traits: ["Direct"],
    communicationStyle: "direct",
    objective: "Hire core developers",
  },
  candidateIntelligence: {
    id: "cand-test",
    name: "Alex Rivera",
    title: "Software Engineer",
    interestScore: 50,
    roleFit: 50,
    startupAppetite: 50,
    missionAlignment: 50,
    salarySensitivity: 50,
    dropoutRisk: 50,
    observations: [],
    hypotheses: [],
    motivations: [],
    concerns: [],
  },
  plannerState: {
    stage: "DISCOVERY",
    currentObjective: "Understand motivations",
    missingInformation: [],
    reasoning: "",
    nextAction: "ASK_MOTIVATION",
    confidence: 70,
  },
  conversationHistory: [],
};

export function runOrchestrationTest() {
  console.log("Running orchestrator ORPA flow test...");
  const msg = "I prefer remote work and require flexible hours";
  const result = runOrchestrator(msg, baseState);

  // Verify Observation extraction
  if (!result.observations.includes("Candidate values flexibility")) {
    throw new Error("Orchestration observation missing");
  }

  // Verify Inference and Hypothesis reasoning
  if (result.hypotheses.length === 0) {
    throw new Error("Orchestration hypotheses missing");
  }

  // Verify scoring updates
  if (result.updatedCandidate.dropoutRisk !== 60) {
    throw new Error("Orchestration candidate score update mismatch");
  }

  // Verify planner state updates
  if (result.plannerUpdates.stage !== "DISCOVERY") {
    throw new Error("Orchestration planner stage mismatch");
  }

  // Verify selected action
  if (result.selectedAction !== "ASK_MOTIVATION") {
    throw new Error("Orchestration selected action mismatch");
  }

  // Verify journal entry generation
  if (!result.journalEntry.observation.includes("flexibility")) {
    throw new Error("Orchestration journal entry observation mismatch");
  }

  console.log("✓ Orchestrator ORPA flow test passed.");
}
