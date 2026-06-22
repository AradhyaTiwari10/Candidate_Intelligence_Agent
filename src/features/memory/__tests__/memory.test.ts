import { extractMemory } from "../memory-extractor";
import { deduplicateRecords, filterMemoryByCandidate } from "../memory-store";
import { buildMemoryBlock } from "../memory-builder";
import { MemoryRecord } from "../memory-record";
import { buildPrompt } from "../../generation/prompt-builder";
import { CandidateIntelligence, PlannerState, CompanyContext, RecruiterPersona } from "../../../types";

export function runMemoryTests() {
  console.log("Running Memory Layer unit tests...");

  const candidateId = "cand-test-1";

  // 1. Test Memory Extractor
  console.log("1. Testing Memory Extractor...");
  
  // Flexibility
  const msgFlex = "I prefer a hybrid setup, working 2 days from home.";
  const flexMem = extractMemory(candidateId, msgFlex);
  if (flexMem.length !== 1 || flexMem[0].category !== "flexibility") {
    throw new Error("Failed to extract flexibility memory category");
  }
  if (!flexMem[0].fact.includes("Location & Presence:")) {
    throw new Error("Failed to format flexibility fact prefix");
  }

  // Compensation
  const msgComp = "My salary target is 180k base with equity upside.";
  const compMem = extractMemory(candidateId, msgComp);
  if (compMem.length !== 1 || compMem[0].category !== "compensation") {
    throw new Error("Failed to extract compensation memory category");
  }
  if (!compMem[0].fact.includes("Compensation Bounds:")) {
    throw new Error("Failed to format compensation fact prefix");
  }

  // Motivation
  const msgMot = "I want a high autonomy culture with flat structure.";
  const motMem = extractMemory(candidateId, msgMot);
  if (motMem.length !== 1 || motMem[0].category !== "motivation") {
    throw new Error("Failed to extract motivation memory category");
  }
  if (!motMem[0].fact.includes("Workplace Motivation:")) {
    throw new Error("Failed to format motivation fact prefix");
  }

  // Experience
  const msgExp = "I have experience with complex distributed systems and control loops.";
  const expMem = extractMemory(candidateId, msgExp);
  if (expMem.length !== 1 || expMem[0].category !== "experience") {
    throw new Error("Failed to extract experience memory category");
  }
  if (!expMem[0].fact.includes("Technical Domain Experience:")) {
    throw new Error("Failed to format experience fact prefix");
  }

  // General fallback
  const msgGen = "I have a cat named Whiskers.";
  const genMem = extractMemory(candidateId, msgGen);
  if (genMem.length !== 1 || genMem[0].category !== "general") {
    throw new Error("Failed to extract general fallback memory category");
  }
  if (!genMem[0].fact.includes("Dialogue Insight:")) {
    throw new Error("Failed to format general fact prefix");
  }

  console.log("✓ Memory Extractor tests passed.");

  // 2. Test Memory Store Filter and Deduplication
  console.log("2. Testing Memory Store Filter & Deduplication...");
  const existingRecords: readonly MemoryRecord[] = [
    {
      id: "mem-1",
      candidateId,
      category: "compensation",
      fact: "Compensation Bounds: My salary target is 180k base with equity upside.",
      timestamp: "2026-06-23T02:00:00Z"
    },
    {
      id: "mem-2",
      candidateId: "other-candidate",
      category: "flexibility",
      fact: "Location & Presence: Remote only",
      timestamp: "2026-06-23T02:01:00Z"
    }
  ];

  // Filtering
  const filtered = filterMemoryByCandidate(existingRecords, candidateId);
  if (filtered.length !== 1 || filtered[0].id !== "mem-1") {
    throw new Error("filterMemoryByCandidate did not filter correctly");
  }

  // Deduplication
  const duplicateIncoming: readonly MemoryRecord[] = [
    {
      id: "mem-3",
      candidateId,
      category: "compensation",
      fact: "Compensation Bounds: my salary target is 180k base with equity upside.", // test case insensitivity in duplicate check
      timestamp: "2026-06-23T02:05:00Z"
    },
    {
      id: "mem-4",
      candidateId,
      category: "flexibility",
      fact: "Location & Presence: Hybrid 3 days",
      timestamp: "2026-06-23T02:06:00Z"
    }
  ];

  const merged = deduplicateRecords(existingRecords, duplicateIncoming);
  if (merged.length !== 3) {
    throw new Error(`deduplicateRecords failed to deduplicate. Expected length 3, got ${merged.length}`);
  }
  if (!merged.some(r => r.id === "mem-4")) {
    throw new Error("deduplicateRecords missed inserting unique incoming record");
  }

  console.log("✓ Memory Store Filter & Deduplication tests passed.");

  // 3. Test Memory Builder & Prompt Builder Integration
  console.log("3. Testing Memory Builder & Prompt Builder Integration...");
  const recordsToBuild: readonly MemoryRecord[] = [
    {
      id: "mem-1",
      candidateId,
      category: "compensation",
      fact: "Compensation Bounds: My salary target is 180k base with equity upside.",
      timestamp: "2026-06-23T02:00:00Z"
    }
  ];

  const memoryBlock = buildMemoryBlock(recordsToBuild);
  if (!memoryBlock.includes("# CONVERSATION MEMORY")) {
    throw new Error("Memory block missing header");
  }
  if (!memoryBlock.includes("[COMPENSATION]")) {
    throw new Error("Memory block missing category label");
  }
  if (!memoryBlock.includes("Compensation Bounds:")) {
    throw new Error("Memory block missing fact");
  }

  const mockCandidate: CandidateIntelligence = {
    id: candidateId,
    name: "Alex Rivera",
    title: "Staff Systems Engineer",
    interestScore: 80,
    roleFit: 80,
    startupAppetite: 80,
    missionAlignment: 80,
    salarySensitivity: 50,
    dropoutRisk: 20,
    observations: [],
    hypotheses: [],
    motivations: [],
    concerns: [],
  };

  const mockPlanner: PlannerState = {
    stage: "DISCOVERY",
    currentObjective: "Understand motivations",
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
    conversationMemories: recordsToBuild
  });

  if (!promptCtx.fullPrompt.includes("# CONVERSATION MEMORY")) {
    throw new Error("Full prompt does not include '# CONVERSATION MEMORY'");
  }
  if (!promptCtx.fullPrompt.includes("[COMPENSATION]")) {
    throw new Error("Full prompt does not include memory categories");
  }
  if (!promptCtx.conversationMemoryBlock.includes("[COMPENSATION]")) {
    throw new Error("conversationMemoryBlock does not include memory categories");
  }

  console.log("✓ Memory Builder & Prompt Builder integration tests passed.");
}
