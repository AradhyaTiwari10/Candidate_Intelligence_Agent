export function makeInferences(observations: string[]): string[] {
  const inferences: string[] = [];

  for (const obs of observations) {
    if (obs === "Candidate values ownership") {
      inferences.push("Current role may be restrictive; seeking more authority");
    }
    if (obs === "Candidate values flexibility") {
      inferences.push("Remote work and schedule control are likely important");
    }
    if (obs === "Candidate is compensation sensitive") {
      inferences.push("Competitive base salary or clear equity upside is a primary factor");
    }
    if (obs === "Candidate values growth and learning") {
      inferences.push("Seeking fast-growing environments with high impact and mentorship");
    }
    if (obs === "Candidate shared general conversation feedback") {
      inferences.push("Needs high-touch engagement to uncover specific motivations");
    }
  }

  return inferences;
}
