import { buildPrompt } from "../prompt-builder";
import { GenerationInput } from "../generation-input";
import { MemoryRecord } from "../../memory/memory-record";

const mockInput: GenerationInput = {
  companyContext: {
    companyName: "Stripe",
    industry: "Finance",
    mission: "GDP of the internet",
    cultureTraits: ["High ownership", "Fast execution"],
    hiringGoals: ["Backend Engineer"],
    communicationTone: "direct",
  },
  recruiterPersona: {
    name: "Sarah Chen",
    role: "Principal Recruiting Partner",
    traits: ["Direct"],
    communicationStyle: "direct",
    objective: "Hire core developers",
  },
  candidateIntelligence: {
    id: "cand-test",
    name: "Alex Rivera",
    title: "Software Engineer",
    interestScore: 50,
    roleFit: 50,
    startupAppetite: 50,
    missionAlignment: 50,
    salarySensitivity: 50,
    dropoutRisk: 50,
    observations: ["Candidate values ownership"],
    hypotheses: ["Startup culture will appeal"],
    motivations: [],
    concerns: [],
  },
  plannerState: {
    stage: "DISCOVERY",
    currentObjective: "Understand motivations",
    missingInformation: ["ownership expectations"],
    reasoning: "Discovery phase evaluation",
    nextAction: "ASK_OWNERSHIP",
    confidence: 70,
  },
  selectedAction: "ASK_OWNERSHIP",
  conversationHistory: [],
};

export function runPromptBuilderTest() {
  console.log("Running Prompt Builder compilation tests...");
  const result = buildPrompt(mockInput);

  // Check prompt blocks
  if (!result.companyContextBlock.includes("Stripe")) {
    throw new Error("Company context block missing details");
  }
  if (!result.recruiterPersonaBlock.includes("Sarah Chen")) {
    throw new Error("Recruiter persona block missing details");
  }
  if (!result.candidateIntelligenceBlock.includes("Alex Rivera")) {
    throw new Error("Candidate intelligence block missing details");
  }
  if (!result.plannerStateBlock.includes("DISCOVERY")) {
    throw new Error("Planner state block missing details");
  }
  if (!result.selectedActionBlock.includes("ASK_OWNERSHIP")) {
    throw new Error("Selected action block missing details");
  }

  // Check full prompt structure
  const full = result.fullPrompt;
  if (!full.includes("# WHO AM I?")) throw new Error("WHO AM I section missing");
  if (!full.includes("# WHAT DO I KNOW?")) throw new Error("WHAT DO I KNOW section missing");
  if (!full.includes("# WHAT IS MY GOAL?")) throw new Error("WHAT IS MY GOAL section missing");
  if (!full.includes("# WHAT SHOULD I DO?")) throw new Error("WHAT SHOULD I DO section missing");
  if (!full.includes("# WHAT SHOULD I AVOID?")) throw new Error("WHAT SHOULD I AVOID section missing");

  // Check context completeness
  if (
    !full.includes("Sarah Chen") ||
    !full.includes("Alex Rivera") ||
    !full.includes("Stripe") ||
    !full.includes("ASK_OWNERSHIP")
  ) {
    throw new Error("Prompt context compilation is incomplete");
  }

  // Integration assertions for memories
  console.log("Checking getRelevantMemories integration in Prompt Builder...");
  const mockMemories: readonly MemoryRecord[] = [
    { id: "1", candidateId: "cand-test", category: "flexibility", fact: "Flexibility Info", timestamp: "now" },
    { id: "2", candidateId: "cand-test", category: "compensation", fact: "Compensation Info", timestamp: "now" },
    { id: "3", candidateId: "cand-test", category: "motivation", fact: "Motivation Info", timestamp: "now" }
  ];

  const remotePrompt = buildPrompt({
    ...mockInput,
    selectedAction: "ASK_REMOTE",
    conversationMemories: mockMemories
  });

  if (!remotePrompt.fullPrompt.includes("Flexibility Info")) {
    throw new Error("ASK_REMOTE prompt missing flexibility memory record");
  }
  if (remotePrompt.fullPrompt.includes("Compensation Info")) {
    throw new Error("ASK_REMOTE prompt contains unrelated compensation memory record");
  }

  const compPrompt = buildPrompt({
    ...mockInput,
    selectedAction: "ASK_COMPENSATION",
    conversationMemories: mockMemories
  });

  if (!compPrompt.fullPrompt.includes("Compensation Info")) {
    throw new Error("ASK_COMPENSATION prompt missing compensation memory record");
  }
  if (compPrompt.fullPrompt.includes("Flexibility Info")) {
    throw new Error("ASK_COMPENSATION prompt contains unrelated flexibility memory record");
  }

  console.log("✓ Prompt Builder compilation tests passed.");
}
