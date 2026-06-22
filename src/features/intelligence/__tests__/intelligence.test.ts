import { runIntelligencePipeline } from "../intelligence-pipeline";
import { CandidateIntelligence } from "@/types";

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

export function runOwnershipTest() {
  console.log("Running ownership message test...");
  const msg = "I want more ownership and decision making responsibility in my next role";
  const result = runIntelligencePipeline(msg, baseCandidate);

  if (!result.observations.includes("Candidate values ownership")) {
    throw new Error("Ownership observation missing");
  }
  if (!result.inferences.some((i) => i.includes("seeking more authority"))) {
    throw new Error("Ownership inference missing");
  }
  if (result.updatedCandidate.startupAppetite !== 65) {
    throw new Error("Startup appetite score not updated correctly");
  }
  console.log("✓ Ownership test passed.");
}

export function runRemoteTest() {
  console.log("Running remote work message test...");
  const msg = "I prefer remote work and require flexible hours";
  const result = runIntelligencePipeline(msg, baseCandidate);

  if (!result.observations.includes("Candidate values flexibility")) {
    throw new Error("Flexibility observation missing");
  }
  if (result.updatedCandidate.dropoutRisk !== 60) {
    throw new Error("Dropout risk score not updated correctly");
  }
  console.log("✓ Remote work test passed.");
}

export function runSalaryTest() {
  console.log("Running salary message test...");
  const msg = "I care about the compensation package and base salary details";
  const result = runIntelligencePipeline(msg, baseCandidate);

  if (!result.observations.includes("Candidate is compensation sensitive")) {
    throw new Error("Salary observation missing");
  }
  if (result.updatedCandidate.salarySensitivity !== 75) {
    throw new Error("Salary sensitivity score not updated correctly");
  }
  if (result.updatedCandidate.dropoutRisk !== 65) {
    throw new Error("Dropout risk score not updated correctly for salary focus");
  }
  console.log("✓ Salary test passed.");
}

export function runGrowthTest() {
  console.log("Running growth message test...");
  const msg = "I am seeking professional growth, scale, and learning opportunities";
  const result = runIntelligencePipeline(msg, baseCandidate);

  if (!result.observations.includes("Candidate values growth and learning")) {
    throw new Error("Growth observation missing");
  }
  if (result.updatedCandidate.interestScore !== 60) {
    throw new Error("Interest score not updated correctly for growth");
  }
  console.log("✓ Growth test passed.");
}
