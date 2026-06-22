import { planNextSteps } from "../planner-engine";
import { CandidateIntelligence, PlannerState } from "@/types";

const baseCandidate: CandidateIntelligence = {
  id: "test-cand",
  name: "Test Candidate",
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
};

const basePlanner: PlannerState = {
  stage: "DISCOVERY",
  currentObjective: "Understand motivations",
  missingInformation: [],
  reasoning: "",
  nextAction: "",
  confidence: 70,
};

export function runDiscoveryFlowTest() {
  console.log("Running Discovery stage flow test...");
  const result = planNextSteps(baseCandidate, basePlanner);
  if (result.stage !== "DISCOVERY") throw new Error("Should be in DISCOVERY stage");
  if (result.currentObjective !== "Understand motivations")
    throw new Error("Active objective should be 'Understand motivations'");
  if (result.nextAction !== "ASK_MOTIVATION") throw new Error("Next action should be ASK_MOTIVATION");
  console.log("✓ Discovery stage flow test passed.");
}

export function runQualificationFlowTest() {
  console.log("Running Qualification stage flow test...");
  const candidate: CandidateIntelligence = {
    ...baseCandidate,
    observations: [
      "Candidate values ownership",
      "Candidate values flexibility",
      "Candidate values growth and learning",
    ],
  };

  const result = planNextSteps(candidate, basePlanner);
  if (result.stage !== "QUALIFICATION") throw new Error("Should be in QUALIFICATION stage");
  if (result.currentObjective !== "Validate role fit")
    throw new Error("Active objective should be 'Validate role fit'");
  if (result.nextAction !== "ASK_COMPENSATION") throw new Error("Next action should be ASK_COMPENSATION");
  console.log("✓ Qualification stage flow test passed.");
}

export function runEngagementFlowTest() {
  console.log("Running Engagement stage flow test...");
  const candidate: CandidateIntelligence = {
    ...baseCandidate,
    roleFit: 85,
    observations: [
      "Candidate values ownership",
      "Candidate values flexibility",
      "Candidate values growth and learning",
      "Candidate values detail",
    ],
  };

  const result = planNextSteps(candidate, basePlanner);
  if (result.stage !== "ENGAGEMENT") throw new Error("Should be in ENGAGEMENT stage");
  if (result.currentObjective !== "Build excitement")
    throw new Error("Active objective should be 'Build excitement'");
  if (result.nextAction !== "ASK_MOTIVATION") throw new Error("Next action should be ASK_MOTIVATION");
  console.log("✓ Engagement stage flow test passed.");
}

export function runBookingFlowTest() {
  console.log("Running Booking stage flow test...");
  const candidate: CandidateIntelligence = {
    ...baseCandidate,
    roleFit: 85,
    interestScore: 85,
    observations: [
      "Candidate values ownership",
      "Candidate values flexibility",
      "Candidate values growth and learning",
      "Candidate values detail",
    ],
    hypotheses: ["mitigate concerns"],
  };

  const result = planNextSteps(candidate, basePlanner);
  if (result.stage !== "BOOKING") throw new Error("Should be in BOOKING stage");
  if (result.currentObjective !== "Schedule call")
    throw new Error("Active objective should be 'Schedule call'");
  if (result.nextAction !== "BOOK_CALL") throw new Error("Next action should be BOOK_CALL");
  console.log("✓ Booking stage flow test passed.");
}
