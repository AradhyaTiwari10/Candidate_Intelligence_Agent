import { CandidateIntelligence, PlannerState } from "../../types";
import { ReasoningTrace } from "../explainability/explanation-result";
import { ConfidenceResult } from "./confidence-result";

export function calculateConfidence(
  candidate: CandidateIntelligence,
  planner: PlannerState,
  _trace: ReasoningTrace
): ConfidenceResult {
  let score = 0;
  const strengths: string[] = [];
  const uncertainties: string[] = [];
  const confidenceFactors: string[] = [];

  // 1. Role Fit Contribution (Weight: up to 30 points)
  const roleFitContribution = Math.round((candidate.roleFit / 100) * 30);
  score += roleFitContribution;
  if (candidate.roleFit >= 80) {
    strengths.push("Strong role fit");
    confidenceFactors.push(`High technical role alignment (${candidate.roleFit}%)`);
  } else if (candidate.roleFit < 50) {
    uncertainties.push("Low role suitability");
  }

  // 2. Interest Score Contribution (Weight: up to 25 points)
  const interestContribution = Math.round((candidate.interestScore / 100) * 25);
  score += interestContribution;
  if (candidate.interestScore >= 80) {
    strengths.push("High candidate interest");
    confidenceFactors.push("Candidate shows strong proactive interest");
  } else if (candidate.interestScore < 50) {
    uncertainties.push("Low candidate engagement level");
  }

  // 3. Startup Appetite Contribution (Weight: up to 25 points)
  const startupContribution = Math.round((candidate.startupAppetite / 100) * 25);
  score += startupContribution;
  if (candidate.startupAppetite >= 80) {
    strengths.push("High startup appetite");
    confidenceFactors.push("Strong readiness for startup environment");
  } else if (candidate.startupAppetite < 50) {
    uncertainties.push("Low risk appetite for early-stage company");
  }

  // 4. Observation Count (Weight: up to 10 points, 2 points per observation)
  const obsBonus = Math.min(candidate.observations.length * 2, 10);
  score += obsBonus;
  if (candidate.observations.length >= 3) {
    strengths.push("Rich observation history");
    confidenceFactors.push(`Multiple verified candidate observations (${candidate.observations.length})`);
  }

  // 5. Hypothesis Count (Weight: up to 10 points, 2 points per hypothesis)
  const hypBonus = Math.min(candidate.hypotheses.length * 2, 10);
  score += hypBonus;
  if (candidate.hypotheses.length >= 2) {
    strengths.push("Valid validation hypotheses");
  }

  // Reductions / Deductions
  
  // A. Missing information general penalty
  if (planner.missingInformation.length > 0) {
    const penalty = Math.min(planner.missingInformation.length * 5, 20);
    score -= penalty;
    uncertainties.push(`${planner.missingInformation.length} missing information data points`);
    confidenceFactors.push(`Deduction for missing planner information (-${penalty} pts)`);
  }

  // B. Unknown compensation
  const missingInfoStr = planner.missingInformation.map(i => i.toLowerCase());
  const hasCompMissing = missingInfoStr.some(i => i.includes("compensation") || i.includes("salary") || i.includes("pay")) || candidate.salarySensitivity === 0;
  if (hasCompMissing) {
    score -= 10;
    uncertainties.push("Compensation expectations unknown");
    confidenceFactors.push("Missing salary alignment profile (-10 pts)");
  }

  // C. Unknown motivation
  const hasMotivationMissing = candidate.motivations.length === 0 || missingInfoStr.some(i => i.includes("motivation") || i.includes("driver"));
  if (hasMotivationMissing) {
    score -= 10;
    uncertainties.push("Motivation expectations unknown");
    confidenceFactors.push("Candidate drivers/motivations are not fully qualified (-10 pts)");
  }

  // D. Unknown remote preference
  const hasRemoteMissing = missingInfoStr.some(i => i.includes("remote") || i.includes("hybrid") || i.includes("on-site") || i.includes("location") || i.includes("relocation"));
  if (hasRemoteMissing) {
    score -= 10;
    uncertainties.push("Remote preference unknown");
    confidenceFactors.push("Work location expectations are unclear (-10 pts)");
  }

  // Cap final score to 0 - 100 range
  const confidence = Math.max(0, Math.min(100, score));

  // If confidence is extremely high, add a summarizing factor
  if (confidence >= 80 && confidenceFactors.length === 0) {
    confidenceFactors.push("Solid candidates metrics across all dimensions");
  }

  return {
    confidence,
    confidenceFactors,
    strengths,
    uncertainties,
  };
}
