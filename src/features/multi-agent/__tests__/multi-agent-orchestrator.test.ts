import { runMultiAgentReview } from "../multi-agent-orchestrator";
import { CandidateIntelligence, PlannerState } from "../../../types";
import { ConfidenceResult } from "../../confidence/confidence-result";

export function runOrchestratorTests() {
  console.log("Running Multi-Agent Orchestrator tests...");

  const mockCandidate: CandidateIntelligence = {
    id: "cand-1",
    name: "Elena Rostova",
    title: "ML Lead",
    interestScore: 70,
    roleFit: 90,
    startupAppetite: 60,
    missionAlignment: 80,
    salarySensitivity: 60,
    dropoutRisk: 30,
    observations: ["High scale experience"],
    hypotheses: [],
    motivations: [],
    concerns: []
  };

  const mockPlanner: PlannerState = {
    stage: "QUALIFICATION",
    currentObjective: "Qualify engineering skills",
    missingInformation: ["runway expectations"],
    reasoning: "Checking alignment",
    nextAction: "QUALIFY_EXPERIENCE",
    confidence: 85
  };

  const mockConfidence: ConfidenceResult = {
    confidence: 85,
    confidenceFactors: ["High fit"],
    strengths: [],
    uncertainties: []
  };

  const results = runMultiAgentReview(mockCandidate, mockPlanner, mockConfidence);

  // 1. returns exactly four results
  if (results.length !== 4) {
    throw new Error(`Expected exactly 4 results, got ${results.length}`);
  }

  // 2. preserves ordering
  if (results[0].agent !== "SOURCER") throw new Error("Order mismatch: Index 0 should be SOURCER");
  if (results[1].agent !== "QUALIFIER") throw new Error("Order mismatch: Index 1 should be QUALIFIER");
  if (results[2].agent !== "ENGAGEMENT") throw new Error("Order mismatch: Index 2 should be ENGAGEMENT");
  if (results[3].agent !== "COORDINATOR") throw new Error("Order mismatch: Index 3 should be COORDINATOR");

  // 3. no duplicate agent roles
  const rolesSet = new Set(results.map((r) => r.agent));
  if (rolesSet.size !== 4) {
    throw new Error("Duplicate agent roles detected in review results");
  }

  // 4. each agent result exists
  for (const res of results) {
    if (!res.recommendationText) {
      throw new Error(`Agent ${res.agent} is missing recommendationText`);
    }
    if (!res.recommendationType) {
      throw new Error(`Agent ${res.agent} is missing recommendationType`);
    }
    if (typeof res.confidence !== "number") {
      throw new Error(`Agent ${res.agent} is missing confidence score`);
    }
  }

  console.log("✓ Multi-Agent Orchestrator tests passed.");
}
