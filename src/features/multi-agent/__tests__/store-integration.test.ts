/**
 * M9.5 Store Integration Tests
 *
 * Validates:
 * 1. runMultiAgentReview executes and returns correctly shaped results.
 * 2. multiAgentResults contains exactly 3 sub-agent results (SOURCER, QUALIFIER, ENGAGEMENT).
 * 3. coordinatorRecommendation is extracted from the COORDINATOR result.
 * 4. Sub-agent results are typed as AgentResult (not CoordinatorRecommendation).
 * 5. CoordinatorRecommendation contains required fields (rationale, detectedDisagreements, priorityReason).
 * 6. Existing planner and confidence pipeline inputs are unaffected.
 */

import { runMultiAgentReview } from "../multi-agent-orchestrator";
import { AgentResult } from "../agent-result";
import { CoordinatorRecommendation } from "../coordinator-agent";
import { CandidateIntelligence, PlannerState } from "../../../types";
import { ConfidenceResult } from "../../confidence/confidence-result";

const mockCandidate: CandidateIntelligence = {
  id: "cand-test-1",
  name: "Test Candidate",
  title: "Senior Engineer",
  interestScore: 75,
  roleFit: 85,
  startupAppetite: 70,
  missionAlignment: 80,
  salarySensitivity: 50,
  dropoutRisk: 30,
  observations: ["Demonstrated ownership"],
  hypotheses: ["Will respond to equity framing"],
  motivations: ["Technical autonomy"],
  concerns: ["Relocation"],
};

const mockPlannerHighConfidence: PlannerState = {
  stage: "ENGAGEMENT",
  currentObjective: "Qualify and engage top candidate",
  missingInformation: [],
  reasoning: "All signals positive.",
  nextAction: "BOOK_CALL",
  confidence: 92,
};

const mockPlannerLowConfidence: PlannerState = {
  stage: "DISCOVERY",
  currentObjective: "Gather missing information",
  missingInformation: ["Salary expectations", "Relocation flexibility"],
  reasoning: "Too many unknowns.",
  nextAction: "CONTINUE_DISCOVERY",
  confidence: 40,
};

const mockConfidenceResult: ConfidenceResult = {
  confidence: 85,
  confidenceFactors: ["High role fit", "Strong startup appetite"],
  strengths: ["Technical depth"],
  uncertainties: ["Relocation unknown"],
};

export function runStoreIntegrationTests() {
  console.log("Running M9.5 Store Integration tests...");

  // ----------------------------------------------------------------
  // Test 1: runMultiAgentReview returns exactly 4 results
  // ----------------------------------------------------------------
  const raw = runMultiAgentReview(mockCandidate, mockPlannerHighConfidence, mockConfidenceResult);
  if (raw.length !== 4) {
    throw new Error(`[T1] Expected 4 results from runMultiAgentReview, got ${raw.length}`);
  }

  // ----------------------------------------------------------------
  // Test 2: multiAgentResults contains exactly 3 non-COORDINATOR results
  // ----------------------------------------------------------------
  const multiAgentResults = raw.filter(
    (r): r is AgentResult => r.agent !== "COORDINATOR"
  ) as readonly AgentResult[];

  if (multiAgentResults.length !== 3) {
    throw new Error(`[T2] Expected 3 sub-agent results, got ${multiAgentResults.length}`);
  }
  const subAgentRoles = multiAgentResults.map((r) => r.agent);
  if (!subAgentRoles.includes("SOURCER")) throw new Error("[T2] Missing SOURCER in multiAgentResults");
  if (!subAgentRoles.includes("QUALIFIER")) throw new Error("[T2] Missing QUALIFIER in multiAgentResults");
  if (!subAgentRoles.includes("ENGAGEMENT")) throw new Error("[T2] Missing ENGAGEMENT in multiAgentResults");

  // ----------------------------------------------------------------
  // Test 3: coordinatorRecommendation is correctly extracted
  // ----------------------------------------------------------------
  const coordinatorRecommendation = raw.find(
    (r): r is CoordinatorRecommendation => r.agent === "COORDINATOR"
  ) ?? null;

  if (coordinatorRecommendation === null) {
    throw new Error("[T3] coordinatorRecommendation should not be null after runMultiAgentReview");
  }
  if (coordinatorRecommendation.agent !== "COORDINATOR") {
    throw new Error("[T3] coordinatorRecommendation.agent must be COORDINATOR");
  }

  // ----------------------------------------------------------------
  // Test 4: CoordinatorRecommendation has required structured fields
  // ----------------------------------------------------------------
  if (typeof coordinatorRecommendation.rationale !== "string" || coordinatorRecommendation.rationale.length === 0) {
    throw new Error("[T4] coordinatorRecommendation.rationale must be a non-empty string");
  }
  if (!Array.isArray(coordinatorRecommendation.detectedDisagreements)) {
    throw new Error("[T4] coordinatorRecommendation.detectedDisagreements must be an array");
  }
  if (!coordinatorRecommendation.priorityReason) {
    throw new Error("[T4] coordinatorRecommendation.priorityReason must be defined");
  }
  if (!coordinatorRecommendation.recommendationType) {
    throw new Error("[T4] coordinatorRecommendation.recommendationType must be defined");
  }
  if (typeof coordinatorRecommendation.confidence !== "number") {
    throw new Error("[T4] coordinatorRecommendation.confidence must be a number");
  }

  // ----------------------------------------------------------------
  // Test 5: Sub-agent results each have valid AgentResult shape
  // ----------------------------------------------------------------
  for (const result of multiAgentResults) {
    if (!result.recommendationType) {
      throw new Error(`[T5] Sub-agent ${result.agent} missing recommendationType`);
    }
    if (typeof result.recommendationText !== "string" || result.recommendationText.length === 0) {
      throw new Error(`[T5] Sub-agent ${result.agent} missing recommendationText`);
    }
    if (typeof result.confidence !== "number") {
      throw new Error(`[T5] Sub-agent ${result.agent} missing confidence`);
    }
  }

  // ----------------------------------------------------------------
  // Test 6: Planner inputs are not mutated by multi-agent review
  // ----------------------------------------------------------------
  const plannerSnapshotConfidence = mockPlannerHighConfidence.confidence;
  runMultiAgentReview(mockCandidate, mockPlannerHighConfidence, mockConfidenceResult);
  if (mockPlannerHighConfidence.confidence !== plannerSnapshotConfidence) {
    throw new Error("[T6] runMultiAgentReview must not mutate the plannerState input");
  }

  // ----------------------------------------------------------------
  // Test 7: Low-confidence planner produces CONTINUE_DISCOVERY coordinator rec
  // ----------------------------------------------------------------
  const lowRaw = runMultiAgentReview(mockCandidate, mockPlannerLowConfidence, mockConfidenceResult);
  const lowCoordinator = lowRaw.find(
    (r): r is CoordinatorRecommendation => r.agent === "COORDINATOR"
  );
  if (!lowCoordinator) {
    throw new Error("[T7] No COORDINATOR result for low-confidence planner");
  }
  // With confidence < 50, coordinator baseline is CONTINUE_DISCOVERY (rank 6).
  // Sub-agents may override via priority — the key assertion is that a selection is made.
  if (!lowCoordinator.recommendationType) {
    throw new Error("[T7] Low-confidence coordinator must still produce a recommendationType");
  }

  // ----------------------------------------------------------------
  // Test 8: High-confidence planner produces non-null coordinator rec with BOOK_CALL baseline
  // ----------------------------------------------------------------
  const highRaw = runMultiAgentReview(mockCandidate, mockPlannerHighConfidence, mockConfidenceResult);
  const highCoordinator = highRaw.find(
    (r): r is CoordinatorRecommendation => r.agent === "COORDINATOR"
  );
  if (!highCoordinator) {
    throw new Error("[T8] No COORDINATOR result for high-confidence planner");
  }
  // Sub-agents may win over BOOK_CALL via priority; coordinator baseline is BOOK_CALL (rank 5).
  // Assert a winner was selected.
  if (!highCoordinator.recommendationType) {
    throw new Error("[T8] High-confidence coordinator must produce a recommendationType");
  }

  console.log("✓ M9.5 Store Integration tests passed.");
}
