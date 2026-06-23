// Mock localStorage and window BEFORE importing useAppStore
let storeStorage: Record<string, string> = {};
const mockLocalStorage = {
  getItem: (key: string) => storeStorage[key] || null,
  setItem: (key: string, value: string) => {
    storeStorage[key] = value;
  },
  removeItem: (key: string) => {
    delete storeStorage[key];
  },
  clear: () => {
    storeStorage = {};
  },
  length: 0,
  key: (index: number) => null,
};

Object.defineProperty(global, "localStorage", {
  value: mockLocalStorage,
  writable: true,
});

Object.defineProperty(global, "window", {
  value: {
    localStorage: mockLocalStorage,
  },
  writable: true,
});

import { useAppStore } from "../useAppStore";
import { CompanyContext, CandidateIntelligence, ConversationMessage, JournalEntry } from "@/types";
import { AgentResult } from "@/features/multi-agent/agent-result";
import { CoordinatorRecommendation } from "@/features/multi-agent/coordinator-agent";
import { MemoryRecord } from "@/features/memory/memory-record";

export function runStorePersistenceTests() {
  console.log("Running store persistence tests...");

  // Reset storage and store state
  localStorage.clear();

  const companyContext: CompanyContext = {
    companyName: "TestCorp",
    industry: "Software",
    mission: "Test mission",
    cultureTraits: ["Trait1"],
    hiringGoals: ["Goal1"],
    communicationTone: "Casual",
  };

  const candidate: CandidateIntelligence = {
    id: "cand-persist-1",
    name: "Persist Candidate",
    title: "Lead Developer",
    interestScore: 90,
    roleFit: 85,
    startupAppetite: 95,
    missionAlignment: 80,
    salarySensitivity: 60,
    dropoutRisk: 10,
    observations: [],
    hypotheses: [],
    motivations: [],
    concerns: [],
  };

  const message: ConversationMessage = {
    id: "msg-persist",
    role: "user",
    content: "Persistence test",
    timestamp: new Date().toISOString(),
  };

  const journalEntry: JournalEntry = {
    id: "j-persist",
    observation: "obs",
    inference: "inf",
    hypothesis: "hyp",
    action: "act",
    timestamp: new Date().toISOString(),
  };

  const memory: MemoryRecord = {
    id: "mem-persist",
    candidateId: "cand-persist-1",
    category: "general",
    fact: "likes typescript",
    timestamp: new Date().toISOString(),
  };

  const agentResults: AgentResult[] = [
    {
      agent: "SOURCER",
      recommendationType: "QUALIFY_EXPERIENCE",
      recommendationText: "Verify background",
      confidence: 80,
    }
  ];

  const coordinatorRec: CoordinatorRecommendation = {
    agent: "COORDINATOR",
    recommendationType: "QUALIFY_EXPERIENCE",
    recommendationText: "Verify background",
    confidence: 85,
    priorityReason: "LOW_CONFIDENCE",
    rationale: "Rationale text",
    detectedDisagreements: [],
    selectedBy: "SOURCER",
    tieBreakRule: "PRIORITY_RANK",
    rankedCandidates: []
  };

  // 1. Set values in store
  useAppStore.setState({
    companyContext,
    candidates: [candidate],
    activeCandidateId: "cand-persist-1",
    messages: [message],
    journalEntries: [journalEntry],
    conversationMemories: [memory],
    multiAgentResults: agentResults,
    coordinatorRecommendation: coordinatorRec,
    // set runtime state to make sure they are NOT persisted
    generatedResponse: "Runtime response",
    actionExplanation: {
      goal: "Run test",
      reasoning: "Reasoning test",
      expectedOutcome: "Outcome test",
      confidence: 100,
      confidenceFactors: []
    }
  });

  // Verify Zustand serialized it to localStorage
  const serialized = localStorage.getItem("candidate-intelligence-agent");
  if (!serialized) {
    throw new Error("Store state was not saved to localStorage");
  }

  const parsed = JSON.parse(serialized);
  const state = parsed.state;

  // 2. Verify persisted state survives rehydration (checking parsed state from localStorage)
  if (state.companyContext?.companyName !== "TestCorp") {
    throw new Error("companyContext did not persist correctly");
  }
  if (state.activeCandidateId !== "cand-persist-1") {
    throw new Error("activeCandidateId did not persist correctly");
  }
  if (!state.messages || state.messages[0].id !== "msg-persist") {
    throw new Error("messages did not persist correctly");
  }
  if (!state.journalEntries || state.journalEntries[0].id !== "j-persist") {
    throw new Error("journalEntries did not persist correctly");
  }

  // 3. Verify runtime fields are excluded
  if (state.generatedResponse !== undefined) {
    throw new Error("generatedResponse (runtime) was persisted but should be excluded");
  }
  if (state.actionExplanation !== undefined) {
    throw new Error("actionExplanation (runtime) was persisted but should be excluded");
  }

  // 4. Verify multi-agent state persists
  if (!state.multiAgentResults || state.multiAgentResults.length !== 1 || state.multiAgentResults[0].agent !== "SOURCER") {
    throw new Error("multiAgentResults did not persist correctly");
  }
  if (!state.coordinatorRecommendation || state.coordinatorRecommendation.agent !== "COORDINATOR") {
    throw new Error("coordinatorRecommendation did not persist correctly");
  }

  // 5. Verify conversation memories persist
  if (!state.conversationMemories || state.conversationMemories.length !== 1 || state.conversationMemories[0].id !== "mem-persist") {
    throw new Error("conversationMemories did not persist correctly");
  }

  // 6. Verify bootstrap reset still functions correctly
  useAppStore.getState().bootstrapAgent(companyContext);
  
  const postBootstrapState = useAppStore.getState();
  if (postBootstrapState.multiAgentResults.length !== 0) {
    throw new Error("bootstrapAgent did not clear multiAgentResults");
  }
  if (postBootstrapState.coordinatorRecommendation !== null) {
    throw new Error("bootstrapAgent did not clear coordinatorRecommendation");
  }
  if (postBootstrapState.conversationMemories.length !== 0) {
    throw new Error("bootstrapAgent did not clear conversationMemories");
  }

  console.log("✓ Store persistence tests passed.");
}
