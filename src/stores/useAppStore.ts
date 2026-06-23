import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  CompanyContext,
  RecruiterPersona,
  CandidateIntelligence,
  PlannerState,
  ConversationMessage,
  JournalEntry,
  ActionExplanation,
} from "@/types";
import { generatePersona as runGeneratePersona } from "@/features/setup/persona-generator";
import { generateStrategy as runGenerateStrategy } from "@/features/setup/strategy-generator";
import { bootstrapAgent as runBootstrapAgent } from "@/features/setup/agent-bootstrap";
import { runOrchestrator } from "@/features/orchestrator/agent-orchestrator";
import { AgentState } from "@/features/orchestrator/agent-state";
import { generateActionExplanation } from "@/features/explainability/action-explanation-engine";
import { generateReasoningTrace } from "@/features/explainability/reasoning-trace";
import { ReasoningTrace } from "@/features/explainability/explanation-result";
import { ConfidenceResult } from "@/features/confidence/confidence-result";
import { calculateConfidence } from "@/features/confidence/confidence-engine";
import { runResponsePipeline } from "@/features/response/response-pipeline";
import { MemoryRecord } from "@/features/memory/memory-record";
import { extractMemory } from "@/features/memory/memory-extractor";
import { deduplicateRecords, filterMemoryByCandidate } from "@/features/memory/memory-store";
import { runMultiAgentReview } from "@/features/multi-agent/multi-agent-orchestrator";
import { AgentResult } from "@/features/multi-agent/agent-result";
import { CoordinatorRecommendation } from "@/features/multi-agent/coordinator-agent";
import { trackEvent } from "@/features/analytics/analytics";


interface AppState {
  companyContext: CompanyContext | null;
  recruiterPersona: RecruiterPersona | null;
  candidates: readonly CandidateIntelligence[];
  activeCandidateId: string | null;
  plannerState: PlannerState | null;
  messages: readonly ConversationMessage[];
  journalEntries: readonly JournalEntry[];
   actionExplanation: ActionExplanation | null;
  activeReasoningTrace: ReasoningTrace | null;
  activeConfidenceResult: ConfidenceResult | null;
  generatedResponse: string | null;
  conversationMemories: readonly MemoryRecord[];
  multiAgentResults: readonly AgentResult[];
  coordinatorRecommendation: CoordinatorRecommendation | null;
  analysisError: boolean;

  // Actions
  setCompanyContext: (context: CompanyContext) => void;
  setRecruiterPersona: (persona: RecruiterPersona) => void;
  setCandidates: (candidates: readonly CandidateIntelligence[]) => void;
  setActiveCandidateId: (id: string | null) => void;
  setPlannerState: (state: Partial<PlannerState>) => void;
  addMessage: (message: ConversationMessage) => void;
  clearMessages: () => void;
  addJournalEntry: (entry: JournalEntry) => void;
  setActionExplanation: (explanation: ActionExplanation | null) => void;

  // Milestone 2 actions
  generatePersona: () => void;
  generateStrategy: () => void;
  bootstrapAgent: (context: CompanyContext) => void;

  // Milestone 3 & 4 & 5 actions implementation
  processCandidateMessage: (candidateId: string, message: string) => Promise<void>;

  // Milestone 7 actions implementation
  generateExplanation: () => void;
}

// Sample Company Mock Data
export const sampleCompanies: Record<string, CompanyContext> = {
  Stripe: {
    companyName: "Stripe",
    industry: "Financial Infrastructure",
    mission: "To grow the GDP of the internet by building financial tools and payment infrastructure.",
    cultureTraits: ["High ownership", "Fast execution", "Direct communication", "User-first design"],
    hiringGoals: ["Hire Lead Payment API Engineer", "Scale Risk Mitigation platform"],
    communicationTone: "Technical, direct, high-bandwidth",
  },
  Notion: {
    companyName: "Notion",
    industry: "Productivity & Collaboration Software",
    mission: "To make toolmaking ubiquitous, allowing anyone to shape the tools they need.",
    cultureTraits: ["Detail oriented", "Product craft", "User centricity", "Aesthetic focus"],
    hiringGoals: ["Hire Principal Product Engineer (Craft)", "Design Lead (Editor UI)"],
    communicationTone: "Thoughtful, craft-focused, detail-oriented",
  },
  OpenAI: {
    companyName: "OpenAI",
    industry: "Artificial Intelligence Research",
    mission: "To ensure that artificial general intelligence benefits all of humanity.",
    cultureTraits: ["Research excellence", "AGI safety alignment", "Strategic foresight", "Scientific rigor"],
    hiringGoals: ["Hire Lead AGI Safety Researcher", "Scale Distributed Systems Team"],
    communicationTone: "Visionary, safety-aligned, strategic, rigorous",
  },
};

// Initial Default Mock Data (Vanguard AI)
const defaultCompanyContext: CompanyContext = {
  companyName: "Vanguard AI",
  industry: "Autonomous Robotics & Agents",
  mission: "To accelerate human capability by deploying context-aware mechanical intelligence in complex industrial environments.",
  cultureTraits: ["Radical transparency", "Extreme ownership", "High velocity", "Scientific rigor"],
  hiringGoals: ["Hire Lead Robotics System Engineer", "Scale ML platform team", "Secure principal control engineer"],
  communicationTone: "Technical, highly transparent, direct, and mission-aligned",
};

const defaultRecruiterPersona: RecruiterPersona = {
  name: "Aria Mercer",
  role: "Autonomous Recruiting Agent (Technical Specialist)",
  traits: ["Analytical", "High-integrity", "Extremely responsive", "Candid"],
  communicationStyle: "Direct and concise with deep technical understanding of the roles she represents.",
  objective: "Discover and qualify candidates capable of building hardware/software co-designs under tight timelines.",
};

const mockCandidates: readonly CandidateIntelligence[] = [
  {
    id: "cand-1",
    name: "Alex Rivera",
    title: "Senior Staff Robotics Engineer",
    company: "Boston Dynamics",
    interestScore: 82,
    roleFit: 94,
    startupAppetite: 88,
    missionAlignment: 91,
    salarySensitivity: 45,
    dropoutRisk: 20,
    observations: [
      "Frustrated with large-company bureaucracy and slow release cycles.",
      "Demonstrated exceptional system architectural knowledge during recent tech blogs.",
      "Highly motivated by working on physical systems rather than pure software.",
    ],
    hypotheses: [
      "Can be incentivized with high-equity packages despite taking a slight base salary cut.",
      "Will thrive in the flat engineering hierarchy of Vanguard AI.",
    ],
    motivations: [
      "Desire to deploy physical products rapidly.",
      "Autonomy over control system architecture decisions.",
    ],
    concerns: [
      "Vanguard AI's runway and hardware capital expenditure costs.",
      "Relocation needs if lab work is strictly on-site.",
    ],
  },
  {
    id: "cand-2",
    name: "Elena Rostova",
    title: "Principal Machine Learning Engineer",
    company: "Meta AI",
    interestScore: 65,
    roleFit: 89,
    startupAppetite: 55,
    missionAlignment: 70,
    salarySensitivity: 85,
    dropoutRisk: 60,
    observations: [
      "Loves cutting-edge generative physical AI models.",
      "Extremely high current cash compensation.",
      "Expressed concern over work-life balance at early-stage companies.",
    ],
    hypotheses: [
      "Likely to decline if equity value cannot clear a significant target valuation in 3 years.",
      "Needs high-touch technical peer dialogue to move the needle on interest.",
    ],
    motivations: [
      "Wants to work on real-world actuation rather than advertising/LLM serving.",
      "Desire to publish research or open-source models.",
    ],
    concerns: [
      "Early-stage work-life balance expectations.",
      "Lack of compute infrastructure compared to Meta AI.",
    ],
  },
];

const defaultPlannerState: PlannerState = {
  stage: "ENGAGEMENT",
  currentObjective: "Qualify Alex Rivera's control loops experience and assess his appetite for high-equity startup trade-offs.",
  missingInformation: [
    "Alex's exact expectations on remote vs on-site laboratory presence",
    "Specific compensation boundaries",
  ],
  reasoning: "Alex has demonstrated high mission alignment and technical capabilities. His startup appetite is strong, but we need to resolve relocation and runway questions to mitigate dropout risk.",
  nextAction: "Send customized engagement note focusing on Vanguard's hardware runway and the autonomous systems roadmap.",
  confidence: 90,
};

const mockMessages: readonly ConversationMessage[] = [
  {
    id: "msg-1",
    role: "system",
    content: "Session initialized. Loaded recruiter persona 'Aria Mercer' and context for 'Vanguard AI'.",
    timestamp: "2026-06-22T19:00:00Z",
  },
  {
    id: "msg-2",
    role: "user",
    content: "Aria, what is our focus for today?",
    timestamp: "2026-06-22T19:01:00Z",
  },
  {
    id: "msg-3",
    role: "assistant",
    content: "Focus is qualifying Alex Rivera (Staff Robotics Engineer). His technical match is high, and he's looking for fast-shipping roles. I've formulated a hypothesis that high-equity will offset salary concerns.",
    timestamp: "2026-06-22T19:01:30Z",
  },
];

const mockJournalEntries: readonly JournalEntry[] = [
  {
    id: "j-1",
    observation: "Candidate Alex Rivera posted about legacy architectures hindering deployment speed.",
    inference: "He is feeling stifled by larger organizational process bloat.",
    hypothesis: "Direct emphasis on Vanguard's 2-week iteration cycle will trigger high engagement.",
    action: "Draft email copy highlighting current dev cycles.",
    timestamp: "2026-06-22T19:00:00Z",
  },
  {
    id: "j-2",
    observation: "Elena Rostova asked about compute hardware scale in initial response.",
    inference: "She is concerned that she won't have the tools to train physical AI agents.",
    hypothesis: "She will drop out unless we show our Nvidia H100 reservation pipeline.",
    action: "Schedule follow-up highlighting GPU allocation.",
    timestamp: "2026-06-22T19:10:00Z",
  },
];

const mockActionExplanation: ActionExplanation = {
  goal: "Schedule initial technical screening with Alex Rivera",
  reasoning: "Confirming Alex's hands-on experience with hardware-in-the-loop testing will validate our roleFit hypothesis. Addressing this early avoids wasting cycles later.",
  expectedOutcome: "Alex accepts a 30-minute introductory call, and we resolve his on-site lab expectations.",
  confidence: 90,
  confidenceFactors: ["High role fit (94%)", "Strong readiness for startup environment"],
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
  companyContext: defaultCompanyContext,
  recruiterPersona: defaultRecruiterPersona,
  candidates: mockCandidates,
  activeCandidateId: "cand-1",
  plannerState: defaultPlannerState,
  messages: mockMessages,
  journalEntries: mockJournalEntries,
  actionExplanation: mockActionExplanation,
  activeReasoningTrace: null,
  activeConfidenceResult: null,
  generatedResponse: null,
  conversationMemories: [],
  multiAgentResults: [],
  coordinatorRecommendation: null,
  analysisError: false,

  setCompanyContext: (companyContext) => set({ companyContext }),
  setRecruiterPersona: (recruiterPersona) => set({ recruiterPersona }),
  setCandidates: (candidates) => set({ candidates }),
  setActiveCandidateId: (activeCandidateId) => set({ activeCandidateId }),
  setPlannerState: (state) =>
    set((store) => ({
      plannerState: store.plannerState ? { ...store.plannerState, ...state } : null,
    })),
  addMessage: (message) =>
    set((store) => ({
      messages: [...store.messages, message],
    })),
  clearMessages: () => set({ messages: [] }),
  addJournalEntry: (entry) =>
    set((store) => ({
      journalEntries: [entry, ...store.journalEntries],
    })),
  setActionExplanation: (actionExplanation) => set({ actionExplanation }),

  // Milestone 2 actions implementation
  generatePersona: () =>
    set((store) => {
      if (!store.companyContext) return {};
      return { recruiterPersona: runGeneratePersona(store.companyContext) };
    }),

  generateStrategy: () =>
    set((store) => {
      if (!store.companyContext) return {};
      return { plannerState: runGenerateStrategy(store.companyContext) };
    }),

  bootstrapAgent: (context) =>
    set(() => {
      const { persona, planner } = runBootstrapAgent(context);
      return {
        companyContext: context,
        recruiterPersona: persona,
        plannerState: planner,
        actionExplanation: null,
        activeReasoningTrace: null,
        activeConfidenceResult: null,
        generatedResponse: null,
        conversationMemories: [],
        multiAgentResults: [],
        coordinatorRecommendation: null,
        analysisError: false,
        messages: [
          {
            id: `msg-bootstrap-${Date.now()}`,
            role: "system",
            content: `Bootstrap initialized for ${context.companyName}. Recruiter Agent persona '${persona.name}' and initial strategy loaded.`,
            timestamp: new Date().toISOString(),
          },
        ],
      };
    }),

  // Milestone 3 & 4 & 5 actions implementation
  processCandidateMessage: async (candidateId, message) => {
    const store = useAppStore.getState();
    const candidate = store.candidates.find((c) => c.id === candidateId);
    if (!candidate) return;

    // Build AgentState snapshot
    const agentState: AgentState = {
      companyContext: store.companyContext,
      recruiterPersona: store.recruiterPersona,
      candidateIntelligence: candidate,
      plannerState: store.plannerState || {
        stage: "DISCOVERY",
        currentObjective: "Understand motivations",
        missingInformation: [],
        reasoning: "",
        nextAction: "",
        confidence: 70,
      },
      conversationHistory: store.messages,
    };

    // Run ORPA cycle (Observe -> Reason -> Plan -> Act) through the Orchestrator
    const executionResult = runOrchestrator(message, agentState);
    const {
      observations,
      inferences,
      hypotheses,
      plannerUpdates,
      selectedAction,
      journalEntry,
      updatedCandidate,
    } = executionResult;

    // Compile ActionExplanation, ReasoningTrace and Confidence
    const reasoningTrace = generateReasoningTrace(executionResult);
    const confidenceResult = calculateConfidence(updatedCandidate, plannerUpdates, reasoningTrace);
    const explanation = generateActionExplanation(
      updatedCandidate,
      plannerUpdates,
      selectedAction,
      confidenceResult.confidence,
      confidenceResult.confidenceFactors
    );

    // Run Multi-Agent Review (passive — does not alter planner or response pipeline)
    let multiAgentResults: readonly AgentResult[] = [];
    let coordinatorRecommendation: CoordinatorRecommendation | null = null;
    let analysisError = false;
    try {
      const multiAgentRaw = runMultiAgentReview(updatedCandidate, plannerUpdates, confidenceResult);
      multiAgentResults = multiAgentRaw.filter(
        (r): r is AgentResult => r.agent !== "COORDINATOR"
      ) as readonly AgentResult[];
      coordinatorRecommendation = multiAgentRaw.find(
        (r): r is CoordinatorRecommendation => r.agent === "COORDINATOR"
      ) ?? null;

      trackEvent("multi_agent_review_completed", {
        resultCount: multiAgentResults.length,
      });

      if (coordinatorRecommendation) {
        trackEvent("recommendation_selected", {
          type: coordinatorRecommendation.recommendationType,
        });

        if (coordinatorRecommendation.detectedDisagreements.length > 0) {
          trackEvent("coordinator_disagreement_detected", {
            count: coordinatorRecommendation.detectedDisagreements.length,
          });
        }
      }
    } catch (err: any) {
      console.error("Multi-Agent Review failed:", err);
      multiAgentResults = [];
      coordinatorRecommendation = null;
      analysisError = true;
    }

    // Extract and merge conversation memory
    let updatedMemories = store.conversationMemories;
    let candidateMemories: readonly MemoryRecord[] = [];
    try {
      const newMemories = extractMemory(candidateId, message);
      updatedMemories = deduplicateRecords(store.conversationMemories, newMemories);
      candidateMemories = filterMemoryByCandidate(updatedMemories, candidateId);
    } catch (err: any) {
      console.error("Memory extraction failed:", err);
      candidateMemories = filterMemoryByCandidate(store.conversationMemories, candidateId);
    }

    // Run Response Pipeline
    const generationInput = {
      companyContext: store.companyContext!,
      recruiterPersona: store.recruiterPersona!,
      candidateIntelligence: updatedCandidate,
      plannerState: plannerUpdates,
      selectedAction,
      conversationHistory: store.messages,
      conversationMemories: candidateMemories,
    };

    const responseResult = await runResponsePipeline(generationInput);

    // Add messages
    const userMessage: ConversationMessage = {
      id: `msg-usr-${Date.now()}`,
      role: "candidate",
      content: message,
      timestamp: new Date().toISOString(),
    };

    const agentReply: ConversationMessage = {
      id: `msg-agent-${Date.now() + 1}`,
      role: "assistant",
      content: responseResult.message,
      timestamp: new Date().toISOString(),
    };

    // Update candidates list
    const updatedCandidates = store.candidates.map((c) =>
      c.id === candidateId ? updatedCandidate : c
    );

    useAppStore.setState({
      candidates: updatedCandidates,
      plannerState: plannerUpdates,
      actionExplanation: explanation,
      activeReasoningTrace: reasoningTrace,
      activeConfidenceResult: confidenceResult,
      generatedResponse: responseResult.message,
      journalEntries: [journalEntry, ...store.journalEntries],
      messages: [...store.messages, userMessage, agentReply],
      conversationMemories: updatedMemories,
      multiAgentResults,
      coordinatorRecommendation,
      analysisError,
    });

    trackEvent("candidate_processed");
  },

  // Milestone 7 actions implementation
  generateExplanation: () =>
    set((store) => {
      const activeCandidate = store.candidates.find((c) => c.id === store.activeCandidateId);
      if (!activeCandidate || !store.plannerState) return {};
      const explanation = generateActionExplanation(
        activeCandidate,
        store.plannerState,
        store.plannerState.nextAction
      );
      return { actionExplanation: explanation };
    }),
    }),
    {
      name: "candidate-intelligence-agent",
      partialize: (state) => ({
        companyContext: state.companyContext,
        candidates: state.candidates,
        activeCandidateId: state.activeCandidateId,
        messages: state.messages,
        journalEntries: state.journalEntries,
        conversationMemories: state.conversationMemories,
        multiAgentResults: state.multiAgentResults,
        coordinatorRecommendation: state.coordinatorRecommendation,
      }),
      onRehydrateStorage: (state) => {
        return (state, error) => {
          if (error) {
            console.error("Rehydration failed:", error);
          }
        };
      },
    }
  )
);
