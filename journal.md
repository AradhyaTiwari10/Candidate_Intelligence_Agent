# Journal: Candidate Intelligence Agent

## M4 Planner Engine
Date: 2026-06-22

Milestone:
M4

Epic:
E4.1 Planner Engine

Objective:
Implement deterministic planner layer.

Files Created:
* src/features/planner/planner-engine.ts
* src/features/planner/objective-manager.ts
* src/features/planner/action-selector.ts
* src/features/planner/planner-memory.ts
* src/features/planner/__tests__/planner.test.ts
* src/features/planner/__tests__/run-tests.ts

Files Modified:
* src/stores/useAppStore.ts

Architectural Decisions:
Planner introduced between intelligence and generation.

Challenges:
Designing a robust stage transition logic that advances objectives systematically based on candidate observations and scores without relying on heuristic parsing errors.

Resolutions:
Created a clean rule mapping inside `objective-manager.ts` checking for existence of key observations or target roleFit/interestScore values.

Technical Debt:
The objective-to-action selection table is currently flat and may need hierarchal context as dialog branches grow.

Risks:
Overlapping observations can lead to multiple concurrent stages if transitions are not guarded strictly.

Lessons Learned:
Strict separation between candidate understanding and recruiter objectives makes the planner state cleaner and much easier to debug.

Next Step:
E4.2 Action Selection

## M5 Agent Orchestrator
Date: 2026-06-22

Milestone:
M5

Epic:
E5.1 Agent Orchestrator

Objective:
Create centralized execution layer.

Files Created:
* src/features/orchestrator/agent-state.ts
* src/features/orchestrator/execution-result.ts
* src/features/orchestrator/agent-loop.ts
* src/features/orchestrator/agent-orchestrator.ts
* src/features/orchestrator/__tests__/orchestrator.test.ts
* src/features/orchestrator/__tests__/run-tests.ts

Files Modified:
* src/stores/useAppStore.ts

Architectural Decisions:
Consolidate all independent engines (Observation, Inference, Hypothesis, Planner, Action Selector) under a single entry point representing the Observe-Reason-Plan-Act execution lifecycle.

Challenges:
Coordinating multiple disjoint state changes and mutations deterministically without triggering race conditions or stale state in the global Zustand store.

Resolutions:
Encapsulated the entire pipeline execution into a pure function taking a snapshot `AgentState` and returning a single, unified `ExecutionResult`, allowing the Zustand store to make a single atomic update.

Technical Debt:
The conversation history is currently passed as a passive log, and will need active semantic search or context window management when LLMs are integrated.

Risks:
Over-dependence on structural type checks; any changes to sub-engine interfaces will propagate and require updates across the orchestrator adapters.

Lessons Learned:
Enforcing a strict functional loop (ORPA) dramatically reduces state management bugs and makes testing agent transitions trivial.

Next Step:
Groq Client

## M6 Prompt Builder
Date: 2026-06-22

Milestone:
M6

Epic:
E6.1 Prompt Builder

Objective:
Prepare structured prompts for Groq.

Files Created:
* src/features/generation/generation-input.ts
* src/features/generation/prompt-context.ts
* src/features/generation/prompt-builder.ts
* src/features/generation/__tests__/generation.test.ts
* src/features/generation/__tests__/run-tests.ts

Files Modified:
* None

Architectural Decisions:
Language generation is completely separated from planning. The Prompt Builder consumes structured outputs from the Planner and compiles it into a markdown prompt context, preventing the LLM from making routing decisions.

Challenges:
Balancing the prompt variables to avoid bloating the context window while providing complete candidate observations and hypotheses.

Resolutions:
Separated the prompt into distinct sections (WHO AM I, WHAT DO I KNOW, WHAT IS MY GOAL, WHAT SHOULD I DO) and defined clear negative constraints to prevent generic messages.

Technical Debt:
Expected outcomes are currently statically mapped based on the selected action, and will need dynamic variables as actions grow in variety.

Risks:
Future LLM integration might violate negative constraints if prompt variables are too verbose or formatting is parsed incorrectly.

Lessons Learned:
Defining negative constraints directly in the compiled prompt is highly effective at forcing targeted recruiter tones.

Next Step:
Groq Client


