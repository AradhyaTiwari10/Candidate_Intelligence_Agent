import { CandidateIntelligence } from "@/types";

const clamp = (val: number) => Math.min(100, Math.max(0, val));

export function updateCandidateIntelligence(
  candidate: CandidateIntelligence,
  observations: string[],
  hypotheses: string[]
): CandidateIntelligence {
  let interestScore = candidate.interestScore;
  let startupAppetite = candidate.startupAppetite;
  let salarySensitivity = candidate.salarySensitivity;
  let dropoutRisk = candidate.dropoutRisk;
  let roleFit = candidate.roleFit;

  for (const obs of observations) {
    if (obs === "Candidate values ownership") {
      interestScore += 5;
      startupAppetite += 15;
      roleFit += 5;
    }
    if (obs === "Candidate values flexibility") {
      startupAppetite += 5;
      dropoutRisk += 10; // Remote requirements increase risk until qualified
    }
    if (obs === "Candidate is compensation sensitive") {
      salarySensitivity += 25;
      dropoutRisk += 15;
      interestScore -= 5;
    }
    if (obs === "Candidate values growth and learning") {
      interestScore += 10;
      startupAppetite += 10;
      roleFit += 5;
    }
  }

  // Deduplicate and append
  const updatedObs = Array.from(new Set([...candidate.observations, ...observations]));
  const updatedHyp = Array.from(new Set([...candidate.hypotheses, ...hypotheses]));

  return {
    ...candidate,
    interestScore: clamp(interestScore),
    startupAppetite: clamp(startupAppetite),
    salarySensitivity: clamp(salarySensitivity),
    dropoutRisk: clamp(dropoutRisk),
    roleFit: clamp(roleFit),
    observations: updatedObs,
    hypotheses: updatedHyp,
  };
}
