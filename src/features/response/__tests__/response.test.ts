import { runResponsePipeline } from "../response-pipeline";
import { GenerationInput } from "../../generation/generation-input";
import { GenerationService } from "../../llm/generation-service";
import { GroqClient } from "../../llm/groq-client";
import { CandidateIntelligence, PlannerState, CompanyContext, RecruiterPersona } from "../../../types";

export async function runResponsePipelineTests() {
  console.log("Running Response Pipeline tests...");

  const mockCandidate: CandidateIntelligence = {
    id: "test",
    name: "Alex Rivera",
    title: "Robotics Lead",
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
    currentObjective: "Assessment",
    missingInformation: [],
    reasoning: "Discovery phase active.",
    nextAction: "ASK_MOTIVATION",
    confidence: 80,
  };

  const mockCompany: CompanyContext = {
    companyName: "Stripe",
    industry: "Payments",
    mission: "GDP Internet",
    cultureTraits: ["Ownership"],
    hiringGoals: [],
    communicationTone: "Direct",
  };

  const mockPersona: RecruiterPersona = {
    name: "Aria",
    role: "Recruiter Agent",
    traits: ["Analytical"],
    communicationStyle: "Technical",
    objective: "Hire talent",
  };

  const mockInput: GenerationInput = {
    companyContext: mockCompany,
    recruiterPersona: mockPersona,
    candidateIntelligence: mockCandidate,
    plannerState: mockPlanner,
    selectedAction: "ASK_MOTIVATION",
    conversationHistory: [],
  };

  // Helper response builder
  const createMockResponse = (status: number, ok: boolean, body: any): Response => {
    return {
      status,
      ok,
      json: async () => body,
      text: async () => typeof body === "string" ? body : JSON.stringify(body),
    } as Response;
  };

  // 1. Successful Generation and Validation Pass
  {
    console.log("Test Case 1: Successful Generation");
    const mockFetch = async () => {
      return createMockResponse(200, true, {
        choices: [{ message: { content: "Could you tell me more about your experience shipping system loops?" } }]
      });
    };
    const client = new GroqClient(mockFetch as any);
    const service = new GenerationService(client);

    const res = await runResponsePipeline(mockInput, service);
    if (!res.success) {
      throw new Error(`Expected success true, got false. Error: ${res.message}`);
    }
    if (!res.validationPassed) {
      throw new Error("Expected validationPassed to be true");
    }
    if (!res.message.includes("shipping system loops")) {
      throw new Error("Expected content mismatch");
    }
    console.log("✓ Successful generation passed.");
  }

  // 2. Failed Generation (Fallback triggered)
  {
    console.log("Test Case 2: Failed Generation Fallback");
    const mockFetch = async () => {
      return createMockResponse(500, false, "Internal Server Error");
    };
    const client = new GroqClient(mockFetch as any);
    const service = new GenerationService(client);

    const res = await runResponsePipeline(mockInput, service);
    if (res.success) {
      throw new Error("Expected success false on 500 error");
    }
    if (res.validationPassed) {
      throw new Error("Expected validationPassed false");
    }
    // Fallback for ASK_MOTIVATION (DISCOVERY strategy) should be triggered
    if (res.message !== "Could you share more about what you're looking for in your next opportunity?") {
      throw new Error(`Expected DISCOVERY fallback, got: "${res.message}"`);
    }
    console.log("✓ Failed generation fallback passed.");
  }

  // 3. Validator Rejection (Fallback triggered due to policy violation)
  {
    console.log("Test Case 3: Rejection Fallback (Policy Violation)");
    const mockFetch = async () => {
      return createMockResponse(200, true, {
        choices: [{ message: { content: "We promise to match your current salary and we will hire you immediately!" } }]
      });
    };
    const client = new GroqClient(mockFetch as any);
    const service = new GenerationService(client);

    const res = await runResponsePipeline(mockInput, service);
    if (res.success) {
      throw new Error("Expected success false on policy violation");
    }
    if (res.validationPassed) {
      throw new Error("Expected validationPassed false on policy violation");
    }
    // Fallback should be triggered
    if (res.message !== "Could you share more about what you're looking for in your next opportunity?") {
      throw new Error("Expected fallback due to policy rejection");
    }
    console.log("✓ Rejection policy fallback passed.");
  }

  // 4. Validator Rejection (Repeated Sentence)
  {
    console.log("Test Case 4: Rejection Fallback (Repeated Sentence)");
    const mockFetch = async () => {
      return createMockResponse(200, true, {
        choices: [{ message: { content: "This is a great engineering team. This is a great engineering team." } }]
      });
    };
    const client = new GroqClient(mockFetch as any);
    const service = new GenerationService(client);

    const res = await runResponsePipeline(mockInput, service);
    if (res.success) {
      throw new Error("Expected failure due to repetition");
    }
    if (res.validationPassed) {
      throw new Error("Expected validationPassed false on repetition");
    }
    console.log("✓ Repetition fallback passed.");
  }
}
