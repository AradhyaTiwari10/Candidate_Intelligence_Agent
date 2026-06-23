# Candidate Intelligence Agent

An autonomous, multi-agent recruiting and candidate engagement platform designed to automate, analyze, and explain talent interactions. Built as a Founding Engineer technical assessment for PSVIEW, this application enables recruiting teams to define company context, bootstrap custom recruiter personas, simulate live candidate conversations, and inspect real-time agent reasoning traces, confidence scoring, and multi-agent consensus recommendations.

## Live Demo

The live deployment of the application is available at:
[https://candidate-intelligence-agent.vercel.app](https://candidate-intelligence-agent.vercel.app)

## Features

### Company Context Configuration
Recruiting managers can load pre-configured profiles or define custom parameters for company name, industry, mission statement, core culture traits, active hiring goals, and communication tone.

### Dynamic Recruiter Persona Generation
The system dynamically derives a tailored recruiting specialist persona from the active company context, complete with specific role definitions, behavioral guidelines, and strategic goals.

### Candidate Conversation Simulator
An interactive chat interface that simulates real-time conversations with candidates. The conversational agent adapts its responses dynamically based on the recruiter persona and the state of the conversation.

### Multi-Agent System
A specialized crew of independent agents evaluates candidate messages in parallel. The system includes:
* **Sourcer Agent**: Determines role alignment, profile matches, and basic candidacy fit.
* **Qualifier Agent**: Focuses on discovering missing qualifications, compensation expectations, and availability.
* **Engagement Agent**: Identifies risk signals, candidate motivation, and opportunities to highlight company culture.
* **Coordinator Agent**: Ranks recommendations, detects conflicts, and generates the final response strategy.

### Recommendation Selection Engine
An internal routing engine that processes structured agent suggestions, resolves conflicts using a strict hierarchy, and executes tie-breaking algorithms.

### Explainability Layer
Surfaces the complete internal decision path of the recommendation selection process, showing which agent recommendations were considered, which rule resolved conflicts, and the rationale behind the final decision.

### Confidence Scoring
A rules-based scoring engine that evaluates conversation quality and data completeness, returning a scaled score (0 to 100) indicating the level of alignment.

### Reasoning Traces
Displays step-by-step logs of the system's execution pipeline, detailing observations, internal reasoning, planning steps, and planned actions.

### Candidate Memory System
An extraction system that identifies, parses, deduplicates, and stores candidate-specific observations (e.g., compensation requirements, relocation flexibility) persistently across conversation turns.

### Persistence Layer
Utilizes state persistence to preserve company context, candidate lists, chat history, extracted memory logs, and analytics metrics across browser refreshes.

### Error Recovery Layer
Features isolated execution blocks for all sub-agents, preventing network or API failures in one agent from crashing the pipeline and ensuring graceful degradation.

### Analytics Dashboard
Renders live metrics (Candidates Processed, Reviews Completed, Disagreements Logged, Book Calls Scheduled) to track the performance and efficacy of the autonomous recruiting system.

## Architecture

The system operates as a uni-directional flow from context initialization to candidate response:

```text
Company Context 
   → Persona Generation 
   → Agent Orchestration 
   → Multi-Agent Review 
   → Coordinator Recommendation 
   → Explainability Layer 
   → Candidate Response
```

1. **Company Context**: Establishes the foundational company profile, values, and objectives.
2. **Persona Generation**: Derives the recruiter persona's behavioral guidelines and tone.
3. **Agent Orchestration**: Initiates the processing cycle when a new message is received from a candidate.
4. **Multi-Agent Review**: Spawns parallel, isolated evaluation tasks for the Sourcer, Qualifier, and Engagement agents.
5. **Coordinator Recommendation**: Evaluates sub-agent recommendations through the selection engine to choose a target action.
6. **Explainability Layer**: Compiles reasoning logs, confidence statistics, selection criteria, and coordinator rationale.
7. **Candidate Response**: Invokes the response generation pipeline using the selected strategy, conversation memory, and validation rules.

## Multi-Agent System

To deliver high-fidelity evaluations, the platform separates concerns across four specialized agents:

* **Sourcer**: Responsible for mapping the candidate's career history and title fit to the company's hiring goals. It flags mismatch concerns early in the process.
* **Qualifier**: Responsible for checking the candidate's responses against strict requirements (e.g. salary range, tech stack, location). It actively aims to gather missing facts.
* **Engagement**: Responsible for assessing candidate interest, velocity, and motivation. It suggests tailored selling points (e.g. equity, culture) to prevent candidate drop-out.
* **Coordinator**: Responsible for processing the output of the three sub-agents. It applies a prioritization matrix to resolve conflicting recommendations and writes the final strategy.

## Explainability

Every decision made by the system is transparent and traceable, exposing:

* **Reasoning Trace**: The internal steps showing observations, intermediate thoughts, plans, and actions.
* **Confidence Analysis**: A detailed breakdown of factors contributing to or detracting from the system's overall confidence score.
* **Recommendation Selection Trace**: The structured ranking of recommendations from the Sourcer, Qualifier, and Engagement agents, highlighting the winning agent and the tie-breaking rules applied.
* **Coordinator Rationale**: The explicit reasoning explaining why a specific action (e.g. booking a call or continuing discovery) was selected over alternative recommendations.

## Analytics

The system logs user and agent events locally to compile real-time metrics:

* **Candidates Processed**: Total count of unique candidate interactions initiated.
* **Multi-Agent Reviews Completed**: Number of successful parallel consensus loops executed.
* **Disagreements Logged**: Instances where sub-agents recommended conflicting courses of action, requiring coordinator resolution.
* **Book Call Signals**: The number of times the agent successfully drove the conversation to a call scheduling recommendation.

## Tech Stack

| Layer | Technology | Purpose |
| --- | --- | --- |
| Core Framework | Next.js 15 (App Router) | Server-side rendering, routing, and API endpoint hosting |
| UI Library | React | Declarative, component-based user interface management |
| State Management | Zustand | Global application state management |
| Persistence | Zustand Persist Middleware | LocalStorage synchronization for state persistence |
| Styling | Tailwind CSS | Modern, utility-first styling with custom dark-mode aesthetics |
| Architecture | Multi-Agent Architecture | Distributed reasoning and consensus pipeline |
| Language | TypeScript | Static typing and structural contract enforcement |
| Deployment | Vercel | Production hosting, optimization, and continuous deployment |

## Getting Started

### Installation
Clone the repository and install project dependencies:
```bash
npm install
```

### Environment Setup
Copy the environment template file:
```bash
cp .env.example .env.local
```
Add your `GROQ_API_KEY` inside `.env.local` to enable the LLM engine.

### Development
Start the local development server:
```bash
npm run dev
```
Open `http://localhost:3000` to view the application in your browser.

### Production
Compile and build the application for production:
```bash
npm run build
```

## Project Structure

```text
src/
├── app/                  # Next.js pages and API route handlers
├── features/             # Domain-specific logic and UI components
│   ├── analytics/        # Event tracking and analytics metric collection
│   ├── confidence/       # Rules-based confidence scoring pipeline
│   ├── explainability/   # Reasoning traces and coordinator rationale builders
│   ├── explainability-ui/# UI panels for visualizing agent consensus and logs
│   ├── llm/              # LLM client wrappers and providers
│   ├── memory/           # Candidate memory extraction and history retrievers
│   ├── multi-agent/      # Sub-agent definitions, selection rules, and test suites
│   ├── orchestrator/     # Core loop orchestrator (ORPA pipeline)
│   ├── response/         # Candidate response generator and validation rules
│   └── setup/            # Recruiter persona builder and initial context config
├── stores/               # Zustand global stores and persistence configurations
└── types/                # Shared TypeScript types and interface definitions
```

## Design Decisions

### Why a Multi-Agent Architecture?
A single LLM call is prone to instruction drift, prompt dilution, and unpredictable output formats when tasked with simultaneously evaluating fit, checking qualifications, monitoring candidate engagement, and planning a response strategy. 

By utilizing a multi-agent architecture, the system enforces:
1. **Separation of Concerns**: Each sub-agent functions as an independent specialist with a narrow, highly optimized prompt.
2. **Deterministic Aggregation**: Instead of relying on the LLM to perform conflict resolution, the coordinator uses a deterministic, rules-based priority map to resolve disagreements.
3. **Traceability**: Decisions can be dissected to see exactly which specialist agent triggered a recommendation, making the system auditable.
4. **Resiliency**: Failures in individual sub-agents are handled gracefully, allowing the rest of the pipeline to run using fallback defaults.

## What Makes This Agent Intelligent And Not Just An LLM Call?

* **Parallel Specialized Analysis**: The agent does not generate text directly. It executes parallel evaluations through specialized sub-agents (Sourcer, Qualifier, Engagement) that focus on specific dimensions of the interaction.
* **Structured Recommendations**: Sub-agents output structured data structures containing typed enums rather than free-form text.
* **Prioritization and Conflict Resolution**: A centralized Coordinator Agent evaluates recommendations, resolves conflicts using a deterministic priority hierarchy, and documents disagreements.
* **Stateful Memory Management**: The agent continuously extracts candidate information (salary expectations, notice periods, relocation details) into structured memories and retrieves them dynamically to guide future turns.
* **Auditable Reasoning and Explainability**: Every conversation turn generates a detailed audit trail including internal reasoning traces, confidence scoring metrics, and conflict rationales.
* **Dynamic Context Adaptability**: The recruiter's persona, strategic goals, and conversational tone adapt dynamically based on the company's culture and current hiring mandates.

## Future Improvements

1. **Vector-Based Semantic Memory**: Transition from keywords and substring-based local memory retrieval to a vector database (e.g. pgvector, Pinecone) for semantic long-term memory.
2. **Dynamic Priority Mapping**: Enable the Coordinator Agent to dynamically adjust priority thresholds based on candidate motivation levels or role urgency.
3. **Automated Red-Teaming**: Integrate a passive reviewer agent that checks drafted responses for compliance with HR policies, culture rules, and bias guidelines before sending them.
4. **Multi-Channel Integration**: Extend the agent's interfaces to support active email delivery and SMS integration.
5. **Batch Candidate Evaluation**: Add support for importing and processing lists of candidate resumes to run parallel screenings.
6. **Agent Performance Benchmarking**: Develop a test harness to run historic conversations against new prompts to detect behavioral regressions.

## Author

**Aradhya Tiwari**