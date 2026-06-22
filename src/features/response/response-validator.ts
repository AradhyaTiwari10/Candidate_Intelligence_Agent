export function validateResponse(text: string): { valid: boolean; issues: string[] } {
  const issues: string[] = [];

  // 1. Not empty or pure whitespace
  if (!text || text.trim().length === 0) {
    issues.push("Response is empty");
    return { valid: false, issues };
  }

  const cleaned = text.trim();

  // 2. Minimum length (e.g. 10 characters)
  if (cleaned.length < 10) {
    issues.push(`Response is too short (${cleaned.length} characters, min 10)`);
  }

  // 3. Maximum length (e.g. 500 characters)
  if (cleaned.length > 500) {
    issues.push(`Response exceeds maximum length (${cleaned.length} characters, max 500)`);
  }

  // 4. No compensation promises
  const compPromises = [
    "promise to match",
    "guaranteed salary of",
    "will pay you at least",
    "we guarantee salary",
    "promise a compensation",
  ];
  const lowerText = cleaned.toLowerCase();
  for (const pattern of compPromises) {
    if (lowerText.includes(pattern)) {
      issues.push(`Contains compensation promise: "${pattern}"`);
    }
  }

  // 5. No guaranteed hiring language
  const hireGuarantees = [
    "guarantee a job offer",
    "we will hire you",
    "offer is guaranteed",
    "guaranteed to get the job",
    "promise you an offer",
  ];
  for (const pattern of hireGuarantees) {
    if (lowerText.includes(pattern)) {
      issues.push(`Contains guaranteed hiring language: "${pattern}"`);
    }
  }

  // 6. No repeated sentences
  const sentences = cleaned
    .split(/[.!?]+/)
    .map((s) => s.trim().toLowerCase())
    .filter((s) => s.length > 5);

  const seen = new Set<string>();
  for (const sentence of sentences) {
    if (seen.has(sentence)) {
      issues.push(`Contains repeated sentence: "${sentence}"`);
      break;
    }
    seen.add(sentence);
  }

  return {
    valid: issues.length === 0,
    issues,
  };
}
