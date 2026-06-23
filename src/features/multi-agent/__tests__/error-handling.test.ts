import * as sourcerAgent from "../sourcer-agent";
import * as qualifierAgent from "../qualifier-agent";
import * as engagementAgent from "../engagement-agent";
import * as coordinatorAgent from "../coordinator-agent";
import * as orchestrator from "../multi-agent-orchestrator";
import { useAppStore } from "../../../stores/useAppStore";
import { CandidateIntelligence, PlannerState } from "../../../types";
import { ConfidenceResult } from "../../confidence/confidence-result";

const mockCandidate: CandidateIntelligence = {
  id: "cand-err-1",
  name: "Error Test Candidate",
  title: "DevOps Engineer",
  interestScore: 70,
  roleFit: 80,
  startupAppetite: 70,
  missionAlignment: 75,
  salarySensitivity: 60,
  dropoutRisk: 40,
  observations: [],
  hypotheses: [],
  motivations: [],
  concerns: [],
};

const mockPlanner: PlannerState = {
  stage: "DISCOVERY",
  currentObjective: "Discovery loop",
  missingInformation: [],
  reasoning: "Discovery active",
  nextAction: "CONTINUE_DISCOVERY",
  confidence: 60,
};

const mockConfidence: ConfidenceResult = {
  confidence: 70,
  confidenceFactors: [],
  strengths: [],
  uncertainties: [],
};

export function runErrorHandlingTests() {
  console.log("Running M10.2 Error Handling tests...");

  // Save original functions
  const origSourcer = sourcerAgent.generateSourcerRecommendation;
  const origQualifier = qualifierAgent.generateQualifierRecommendation;
  const origEngagement = engagementAgent.generateEngagementRecommendation;
  const origCoordinator = coordinatorAgent.generateCoordinatorRecommendation;
  const origOrchestratorRun = orchestrator.runMultiAgentReview;

  // Helper to restore all
  const restoreAll = () => {
    (sourcerAgent as any).generateSourcerRecommendation = origSourcer;
    (qualifierAgent as any).generateQualifierRecommendation = origQualifier;
    (engagementAgent as any).generateEngagementRecommendation = origEngagement;
    (coordinatorAgent as any).generateCoordinatorRecommendation = origCoordinator;
    (orchestrator as any).runMultiAgentReview = origOrchestratorRun;
  };

  // ----------------------------------------------------------------
  // Test 1: Sourcer Throws
  // ----------------------------------------------------------------
  try {
    restoreAll();
    (sourcerAgent as any).generateSourcerRecommendation = () => {
      throw new Error("Sourcer failed intentionally");
    };

    const results = orchestrator.runMultiAgentReview(mockCandidate, mockPlanner, mockConfidence);
    const sourcerRes = results.find((r) => r.agent === "SOURCER");
    if (!sourcerRes) {
      throw new Error("[T1] Sourcer result missing");
    }
    if (sourcerRes.confidence !== 0 || sourcerRes.recommendationText !== "Sourcer review failed.") {
      throw new Error(`[T1] Expected fallback Sourcer result, got: ${JSON.stringify(sourcerRes)}`);
    }

    // Qualifier and Engagement should still have succeeded normally (confidence > 0)
    const qualRes = results.find((r) => r.agent === "QUALIFIER");
    const engRes = results.find((r) => r.agent === "ENGAGEMENT");
    if (!qualRes || qualRes.confidence === 0) {
      throw new Error("[T1] Qualifier failed or returned fallback due to Sourcer error");
    }
    if (!engRes || engRes.confidence === 0) {
      throw new Error("[T1] Engagement failed or returned fallback due to Sourcer error");
    }
    console.log("✓ Test Case 1: Sourcer agent throws handled cleanly.");
  } catch (e: any) {
    restoreAll();
    throw new Error(`Test Case 1 failed: ${e.message}`);
  }

  // ----------------------------------------------------------------
  // Test 2: Qualifier Throws
  // ----------------------------------------------------------------
  try {
    restoreAll();
    (qualifierAgent as any).generateQualifierRecommendation = () => {
      throw new Error("Qualifier failed intentionally");
    };

    const results = orchestrator.runMultiAgentReview(mockCandidate, mockPlanner, mockConfidence);
    const qualRes = results.find((r) => r.agent === "QUALIFIER");
    if (!qualRes || qualRes.confidence !== 0 || qualRes.recommendationText !== "Qualifier review failed.") {
      throw new Error("[T2] Expected fallback Qualifier result");
    }
    console.log("✓ Test Case 2: Qualifier agent throws handled cleanly.");
  } catch (e: any) {
    restoreAll();
    throw new Error(`Test Case 2 failed: ${e.message}`);
  }

  // ----------------------------------------------------------------
  // Test 3: Engagement Throws
  // ----------------------------------------------------------------
  try {
    restoreAll();
    (engagementAgent as any).generateEngagementRecommendation = () => {
      throw new Error("Engagement failed intentionally");
    };

    const results = orchestrator.runMultiAgentReview(mockCandidate, mockPlanner, mockConfidence);
    const engRes = results.find((r) => r.agent === "ENGAGEMENT");
    if (!engRes || engRes.confidence !== 0 || engRes.recommendationText !== "Engagement review failed.") {
      throw new Error("[T3] Expected fallback Engagement result");
    }
    console.log("✓ Test Case 3: Engagement agent throws handled cleanly.");
  } catch (e: any) {
    restoreAll();
    throw new Error(`Test Case 3 failed: ${e.message}`);
  }

  // ----------------------------------------------------------------
  // Test 4: Coordinator Throws
  // ----------------------------------------------------------------
  try {
    restoreAll();
    (coordinatorAgent as any).generateCoordinatorRecommendation = () => {
      throw new Error("Coordinator failed intentionally");
    };

    const results = orchestrator.runMultiAgentReview(mockCandidate, mockPlanner, mockConfidence);
    const coordRes = results.find((r) => r.agent === "COORDINATOR");
    if (!coordRes || coordRes.confidence !== 0 || coordRes.recommendationText !== "Consensus review failed.") {
      throw new Error("[T4] Expected fallback Coordinator result");
    }
    console.log("✓ Test Case 4: Coordinator agent throws handled cleanly.");
  } catch (e: any) {
    restoreAll();
    throw new Error(`Test Case 4 failed: ${e.message}`);
  }

  // ----------------------------------------------------------------
  // Test 5: Store survives runMultiAgentReview throwing
  // ----------------------------------------------------------------
  try {
    restoreAll();
    (orchestrator as any).runMultiAgentReview = () => {
      throw new Error("Orchestrator threw completely");
    };

    // We trigger processCandidateMessage. It runs in a promise, but we can call it.
    // To avoid hitting the live API or network calls, we can verify that the store state 
    // has analysisError = true and multiAgentResults = [] after it finishes.
    const store = useAppStore.getState();
    
    // We mock response pipeline to not run full LLM fetches
    // Actually, processCandidateMessage is async and calls runResponsePipeline which we already mock in store-integration or response.test.
    // Let's run a candidate message block
    
    // Make sure we have candidates populated
    useAppStore.setState({
      candidates: [mockCandidate],
      activeCandidateId: "cand-err-1",
      analysisError: false,
    });

    // Call processCandidateMessage and check state
    useAppStore.getState().processCandidateMessage("cand-err-1", "Hello")
      .then(() => {
        const state = useAppStore.getState();
        if (state.analysisError !== true) {
          throw new Error("Expected analysisError to be true after orchestrator failure");
        }
        if (state.multiAgentResults.length !== 0) {
          throw new Error("Expected multiAgentResults to be empty");
        }
        if (state.coordinatorRecommendation !== null) {
          throw new Error("Expected coordinatorRecommendation to be null");
        }
        console.log("✓ Test Case 5: Store processing survives orchestrator throw.");
        restoreAll();
      })
      .catch((err) => {
        restoreAll();
        console.error("Test Case 5 failed inside promise:", err);
      });

  } catch (e: any) {
    restoreAll();
    throw new Error(`Test Case 5 failed: ${e.message}`);
  }
}
