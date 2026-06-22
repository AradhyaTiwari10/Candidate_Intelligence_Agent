import { CompanyContext, PlannerState } from "@/types";

export function generateStrategy(context: CompanyContext): PlannerState {
  const nameLower = context.companyName.toLowerCase();
  const primaryGoal = context.hiringGoals[0] || "General Technical Talent";

  if (nameLower.includes("stripe")) {
    return {
      stage: "DISCOVERY",
      currentObjective: `Identify engineers with strong ownership capabilities for the goal: ${primaryGoal}.`,
      missingInformation: [
        "ownership expectations",
        "remote preferences",
        "system architecture scaling capabilities",
      ],
      reasoning: `Stripe's culture emphasizes ${context.cultureTraits.slice(0, 3).join(", ")}. We need to verify if the candidate runs toward hard problems and values high velocity.`,
      nextAction: "Scan recent public open-source contributions for complex systems design and ask about career ownership goals.",
      confidence: 85,
    };
  }

  if (nameLower.includes("notion")) {
    return {
      stage: "QUALIFICATION",
      currentObjective: `Evaluate craft and tool-building passion for the goal: ${primaryGoal}.`,
      missingInformation: [
        "product craft alignment",
        "experience with interactive/collaborative client state",
        "aesthetic detail sensibility",
      ],
      reasoning: `Notion prioritizes craft and detail orientation. Candidates must show a high degree of care for user experience and interface consistency.`,
      nextAction: "Review design-focused writing or portfolio projects and initiate conversation about design details in tool building.",
      confidence: 90,
    };
  }

  if (nameLower.includes("openai")) {
    return {
      stage: "ENGAGEMENT",
      currentObjective: `Verify mission alignment and deep technical rigor for the goal: ${primaryGoal}.`,
      missingInformation: [
        "AGI mission alignment commitment",
        "large-scale compute/distributed systems depth",
        "safety engineering perspective",
      ],
      reasoning: `OpenAI's hiring goals focus on frontier systems. Aligning with safe AGI is a critical gate; we must probe for safety alignment and high intellectual capacity.`,
      nextAction: "Introduce the safety research vision and ask about views on safe artificial intelligence bounds.",
      confidence: 95,
    };
  }

  // Fallback / default strategy
  return {
    stage: "DISCOVERY",
    currentObjective: `Formulate initial qualification bounds for: ${primaryGoal}.`,
    missingInformation: [
      "general career motivations",
      "compensation range baseline",
      "cultural suitability traits",
    ],
    reasoning: `Initiating recruiting strategy for ${context.companyName}. We must first map the base alignment against goals.`,
    nextAction: "Prepare outreach messages focusing on company mission.",
    confidence: 80,
  };
}
