export function formulateHypotheses(observations: string[], inferences: string[]): string[] {
  const hypotheses: string[] = [];

  const hasObs = (val: string) => observations.includes(val);

  if (hasObs("Candidate values ownership")) {
    hypotheses.push("Startup culture and flat engineering hierarchy will appeal strongly");
  }
  if (hasObs("Candidate values flexibility")) {
    hypotheses.push("Offering remote/flexible schedules will mitigate candidate dropout risk");
  }
  if (hasObs("Candidate is compensation sensitive")) {
    hypotheses.push("High risk of candidate disengagement if compensation matches are not addressed early");
  }
  if (hasObs("Candidate values growth and learning")) {
    hypotheses.push("Candidate will prioritize teams with fast shipping cycles and technical scale");
  }

  if (hypotheses.length === 0) {
    hypotheses.push("Risk of disengagement is low, but active motivations require deeper discovery");
  }

  return hypotheses;
}
