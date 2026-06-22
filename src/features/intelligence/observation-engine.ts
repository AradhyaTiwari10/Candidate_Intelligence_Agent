export function extractObservations(message: string): string[] {
  const observations: string[] = [];
  const msgLower = message.toLowerCase();

  if (
    msgLower.includes("ownership") ||
    msgLower.includes("autonomy") ||
    msgLower.includes("decision") ||
    msgLower.includes("responsibility")
  ) {
    observations.push("Candidate values ownership");
  }

  if (
    msgLower.includes("remote") ||
    msgLower.includes("flexibility") ||
    msgLower.includes("work from home") ||
    msgLower.includes("wfh") ||
    msgLower.includes("flexible")
  ) {
    observations.push("Candidate values flexibility");
  }

  if (
    msgLower.includes("compensation") ||
    msgLower.includes("salary") ||
    msgLower.includes("equity") ||
    msgLower.includes("package") ||
    msgLower.includes("pay")
  ) {
    observations.push("Candidate is compensation sensitive");
  }

  if (
    msgLower.includes("growth") ||
    msgLower.includes("career") ||
    msgLower.includes("scale") ||
    msgLower.includes("learn") ||
    msgLower.includes("mentorship")
  ) {
    observations.push("Candidate values growth and learning");
  }

  if (observations.length === 0) {
    observations.push("Candidate shared general conversation feedback");
  }

  return observations;
}
