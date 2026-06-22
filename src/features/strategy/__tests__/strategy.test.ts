import { getStrategy } from "../strategy-engine";
import { buildStrategy } from "../strategy-builder";
import { buildPrompt } from "../../generation/prompt-builder";
import { CandidateIntelligence, PlannerState, CompanyContext, RecruiterPersona } from "../../../types";

export function runStrategyEngineTests() {
  console.log("Running StrategyEngine tests...");

  // 1. Check all strategy mappings
  const discoveryMotivation = getStrategy("ASK_MOTIVATION");
  if (discoveryMotivation.strategy !== "DISCOVERY" || discoveryMotivation.expectedOutcome !== "Understand candidate motivation") {
    throw new Error("ASK_MOTIVATION strategy mapping mismatch");
  }
  if (!discoveryMotivation.communicationRules.includes("ask open ended questions")) {
    throw new Error("ASK_MOTIVATION missing storytelling rules");
  }

  const qualExperience = getStrategy("QUALIFY_EXPERIENCE");
  if (qualExperience.strategy !== "QUALIFICATION" || !qualExperience.communicationRules.includes("gather evidence")) {
    throw new Error("QUALIFY_EXPERIENCE strategy mapping mismatch");
  }

  const objectionHandling = getStrategy("ADDRESS_CONCERN");
  if (objectionHandling.strategy !== "OBJECTION_HANDLING" || !objectionHandling.communicationRules.includes("acknowledge concern")) {
    throw new Error("ADDRESS_CONCERN strategy mapping mismatch");
  }

  const conversionCall = getStrategy("BOOK_CALL");
  if (conversionCall.strategy !== "CONVERSION" || !conversionCall.communicationRules.includes("create urgency")) {
    throw new Error("BOOK_CALL strategy mapping mismatch");
  }

  console.log("✓ Strategy mapping and rules verification passed.");

  // 2. Check Prompt Builder Integration
  console.log("Checking Prompt Builder integration...");
  const mockCandidate: CandidateIntelligence = {
    id: "test",
    name: "Alex Rivera",
    title: "Staff Systems Engineer",
    interestScore: 80,
    roleFit: 80,
    startupAppetite: 80,
    missionAlignment: 80,
    salarySensitivity: 50,
    dropoutRisk: 20,
    observations: ["Desires autonomy"],
    hypotheses: ["Equity appeal"],
    motivations: [],
    concerns: [],
  };

  const mockPlanner: PlannerState = {
    stage: "DISCOVERY",
    currentObjective: "Discovery motivation",
    missingInformation: [],
    reasoning: "Assessing candidate drivers.",
    nextAction: "ASK_MOTIVATION",
    confidence: 80,
  };

  const mockCompany: CompanyContext = {
    companyName: "Stripe",
    industry: "Payments",
    mission: "Grow internet GDP",
    cultureTraits: ["Ownership"],
    hiringGoals: ["Lead APIs"],
    communicationTone: "Direct",
  };

  const mockPersona: RecruiterPersona = {
    name: "Aria",
    role: "Recruiter Agent",
    traits: ["Analytical"],
    communicationStyle: "Technical",
    objective: "Hire lead developers",
  };

  const promptCtx = buildPrompt({
    companyContext: mockCompany,
    recruiterPersona: mockPersona,
    candidateIntelligence: mockCandidate,
    plannerState: mockPlanner,
    selectedAction: "ASK_MOTIVATION",
    conversationHistory: [],
  });

  if (!promptCtx.fullPrompt.includes("# COMMUNICATION STRATEGY")) {
    throw new Error("Prompt context fullPrompt does not contain COMMUNICATION STRATEGY section");
  }

  if (!promptCtx.fullPrompt.includes("Strategy: DISCOVERY")) {
    throw new Error("Prompt context fullPrompt does not mention DISCOVERY strategy");
  }

  if (!promptCtx.communicationStrategyBlock.includes("Strategy: DISCOVERY")) {
    throw new Error("communicationStrategyBlock does not contain DISCOVERY");
  }

  console.log("✓ Prompt Builder strategy integration passed.");
}
