# Project Context: Candidate Intelligence Agent

## M1 Foundation
Established project setup with Next.js 15, Zustand store, and responsive dark-theme shell.

## M2 Agent Configuration Engine
Implemented recruiter persona and strategy generation.

## M3 Candidate Intelligence Engine
Implemented deterministic message analysis (observations, inferences, hypotheses, scoring updates).

## M4 Planner Engine
Added planner architecture.
Planner now determines:
* current objective
* missing information
* next action
* confidence

Planner executes before language generation.

## M5 Agent Orchestrator
Added Observe → Reason → Plan → Act execution model.
All future language generation must operate through the orchestrator.

## M6 Prompt Builder
Language generation separated from reasoning.
Prompts now consume planner outputs rather than raw messages.
