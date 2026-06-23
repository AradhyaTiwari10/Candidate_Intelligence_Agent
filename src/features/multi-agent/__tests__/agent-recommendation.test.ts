import { generateSourcerRecommendation } from "../sourcer-agent";
import { generateQualifierRecommendation } from "../qualifier-agent";
import { generateEngagementRecommendation } from "../engagement-agent";
import { generateCoordinatorRecommendation } from "../coordinator-agent";
import { CandidateIntelligence, PlannerState } from "../../../types";
import { ConfidenceResult } from "../../confidence/confidence-result";

export function runAgentRecommendationTests() {
  console.log("Running Multi-Agent Recommendation Engine tests...");

  // Mock data setup
  const mockCandidateBase: CandidateIntelligence = {
    id: "cand-1",
    name: "Alex Rivera",
    title: "Senior Engineer",
    interestScore: 60,
    roleFit: 85,
    startupAppetite: 70,
    missionAlignment: 80,
    salarySensitivity: 50,
    dropoutRisk: 20,
    observations: ["Values startup autonomy"],
    hypotheses: [],
    motivations: [],
    concerns: []
  };

  const mockPlannerBase: PlannerState = {
    stage: "DISCOVERY",
    currentObjective: "Discovery phase",
    missingInformation: [],
    reasoning: "Assessing candidate details",
    nextAction: "ASK_MOTIVATION",
    confidence: 70
  };

  const mockConfidence: ConfidenceResult = {
    confidence: 70,
    confidenceFactors: [],
    strengths: [],
    uncertainties: []
  };

  // 1. SOURCER
  console.log("Testing Sourcer Agent rules...");
  const sourcerFitRes = generateSourcerRecommendation({
    ...mockCandidateBase,
    roleFit: 50
  });
  if (sourcerFitRes.recommendationType !== "QUALIFY_EXPERIENCE") {
    throw new Error("Sourcer low roleFit recommendationType mismatch");
  }

  const sourcerObsRes = generateSourcerRecommendation({
    ...mockCandidateBase,
    observations: []
  });
  if (sourcerObsRes.recommendationType !== "QUALIFY_EXPERIENCE") {
    throw new Error("Sourcer missing observations recommendationType mismatch");
  }

  // 2. QUALIFIER
  console.log("Testing Qualifier Agent rules...");
  const qualCompRes = generateQualifierRecommendation(mockCandidateBase, {
    ...mockPlannerBase,
    missingInformation: ["Compensation expectations"]
  });
  if (qualCompRes.recommendationType !== "ASK_COMPENSATION") {
    throw new Error("Qualifier missing compensation recommendationType mismatch");
  }

  const qualRemoteRes = generateQualifierRecommendation(mockCandidateBase, {
    ...mockPlannerBase,
    missingInformation: ["Remote presence preferences"]
  });
  if (qualRemoteRes.recommendationType !== "ASK_REMOTE") {
    throw new Error("Qualifier missing remote recommendationType mismatch");
  }

  // 3. ENGAGEMENT
  console.log("Testing Engagement Agent rules...");
  const engIntRes = generateEngagementRecommendation({
    ...mockCandidateBase,
    interestScore: 90
  });
  if (engIntRes.recommendationType !== "BOOK_CALL") {
    throw new Error("Engagement high interest recommendationType mismatch");
  }

  const engConcRes = generateEngagementRecommendation({
    ...mockCandidateBase,
    concerns: ["runway scale"]
  });
  if (engConcRes.recommendationType !== "ADDRESS_OBJECTION") {
    throw new Error("Engagement concern/objection recommendationType mismatch");
  }

  // 4. COORDINATOR (Orchestrated review call)
  console.log("Testing Coordinator Agent orchestration selection...");
  const sourcerResult = generateSourcerRecommendation(mockCandidateBase);
  const qualifierResult = generateQualifierRecommendation(mockCandidateBase, mockPlannerBase);
  const engagementResult = generateEngagementRecommendation({
    ...mockCandidateBase,
    concerns: ["runway scale"]
  });

  const coordResObjection = generateCoordinatorRecommendation(
    sourcerResult,
    qualifierResult,
    engagementResult, // holds ADDRESS_OBJECTION (Rank 1)
    mockPlannerBase,
    mockConfidence
  );

  if (coordResObjection.recommendationType !== "ADDRESS_OBJECTION") {
    throw new Error(`Coordinator did not select ADDRESS_OBJECTION precedence, got ${coordResObjection.recommendationType}`);
  }

  console.log("✓ All Agent Recommendation Engine tests passed.");
}
