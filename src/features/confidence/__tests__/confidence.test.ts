import { CandidateIntelligence, PlannerState } from "../../../types";
import { ReasoningTrace } from "../../explainability/explanation-result";
import { calculateConfidence } from "../confidence-engine";

export function runConfidenceEngineTests() {
  console.log("Running confidence engine tests...");

  // Mock trace
  const mockTrace: ReasoningTrace = {
    observations: [],
    inferences: [],
    hypotheses: [],
    plannerDecision: "Decision",
    selectedAction: "ASK_MOTIVATION",
  };

  // 1. High Confidence Scenario
  const highConfidenceCandidate: CandidateIntelligence = {
    id: "cand-high",
    name: "John Doe",
    title: "Senior Lead Architect",
    interestScore: 90,
    roleFit: 95,
    startupAppetite: 85,
    missionAlignment: 90,
    salarySensitivity: 30,
    dropoutRisk: 10,
    observations: ["Appetite is high", "Culture fits", "Expressed role interest"],
    hypotheses: ["Hypothesis 1", "Hypothesis 2"],
    motivations: ["Equity growth", "Autonomy"],
    concerns: [],
  };

  const highConfidencePlanner: PlannerState = {
    stage: "ENGAGEMENT",
    currentObjective: "Setup call",
    missingInformation: [],
    reasoning: "Candidate is highly qualified and ready to convert.",
    nextAction: "BOOK_CALL",
    confidence: 0.9,
  };

  const highResult = calculateConfidence(highConfidenceCandidate, highConfidencePlanner, mockTrace);
  console.log(`High Confidence Score: ${highResult.confidence}`);
  if (highResult.confidence < 80) {
    throw new Error(`Expected high confidence score (>=80), got ${highResult.confidence}`);
  }
  if (!highResult.strengths.includes("Strong role fit")) {
    throw new Error("Expected strength 'Strong role fit' for high confidence candidate");
  }
  if (highResult.uncertainties.length > 0) {
    throw new Error("Expected zero uncertainties for high confidence candidate");
  }
  console.log("✓ High confidence scenario passed.");

  // 2. Medium Confidence Scenario
  const medConfidenceCandidate: CandidateIntelligence = {
    id: "cand-med",
    name: "Jane Smith",
    title: "Fullstack Developer",
    interestScore: 70,
    roleFit: 75,
    startupAppetite: 70,
    missionAlignment: 80,
    salarySensitivity: 50,
    dropoutRisk: 30,
    observations: ["Prefers fast paced environment"],
    hypotheses: ["Appears open to negotiation"],
    motivations: ["Wants growth"],
    concerns: [],
  };

  const medConfidencePlanner: PlannerState = {
    stage: "QUALIFICATION",
    currentObjective: "Verify remote preferences",
    missingInformation: ["Jane's remote/hybrid requirements"],
    reasoning: "Jane has good metrics but we need remote specifics.",
    nextAction: "ASK_REMOTE",
    confidence: 0.65,
  };

  const medResult = calculateConfidence(medConfidenceCandidate, medConfidencePlanner, mockTrace);
  console.log(`Medium Confidence Score: ${medResult.confidence}`);
  if (medResult.confidence < 40 || medResult.confidence > 80) {
    throw new Error(`Expected medium confidence score (40-80), got ${medResult.confidence}`);
  }
  if (!medResult.uncertainties.includes("Remote preference unknown")) {
    throw new Error("Expected uncertainty 'Remote preference unknown' for medium candidate");
  }
  console.log("✓ Medium confidence scenario passed.");

  // 3. Low Confidence Scenario
  const lowConfidenceCandidate: CandidateIntelligence = {
    id: "cand-low",
    name: "Bob Johnson",
    title: "Junior Dev",
    interestScore: 40,
    roleFit: 45,
    startupAppetite: 35,
    missionAlignment: 50,
    salarySensitivity: 90,
    dropoutRisk: 80,
    observations: [],
    hypotheses: [],
    motivations: [],
    concerns: ["Apprehensive about runway"],
  };

  const lowConfidencePlanner: PlannerState = {
    stage: "DISCOVERY",
    currentObjective: "Qualify overall interest",
    missingInformation: [
      "Bob's compensation range",
      "Bob's core motivations",
      "Bob's relocation flexibility",
    ],
    reasoning: "Bob is a low fit and has high salary sensitivity with many unknown drivers.",
    nextAction: "ASK_MOTIVATION",
    confidence: 0.3,
  };

  const lowResult = calculateConfidence(lowConfidenceCandidate, lowConfidencePlanner, mockTrace);
  console.log(`Low Confidence Score: ${lowResult.confidence}`);
  if (lowResult.confidence > 40) {
    throw new Error(`Expected low confidence score (<=40), got ${lowResult.confidence}`);
  }
  if (!lowResult.uncertainties.includes("Compensation expectations unknown")) {
    throw new Error("Expected low confidence to flag compensation unknown");
  }
  if (!lowResult.uncertainties.includes("Motivation expectations unknown")) {
    throw new Error("Expected low confidence to flag motivation unknown");
  }
  console.log("✓ Low confidence scenario passed.");
}
