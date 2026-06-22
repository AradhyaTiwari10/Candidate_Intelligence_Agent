import { GenerationInput } from "./generation-input";
import { PromptContext } from "./prompt-context";
import { buildStrategy } from "../strategy/strategy-builder";
import { buildMemoryBlock } from "../memory/memory-builder";

export function buildPrompt(input: GenerationInput): PromptContext {
  const company = input.companyContext;
  const persona = input.recruiterPersona;
  const candidate = input.candidateIntelligence;
  const planner = input.plannerState;
  const action = input.selectedAction;

  // Build individual blocks
  const companyContextBlock = company
    ? `COMPANY: ${company.companyName}
INDUSTRY: ${company.industry}
MISSION: ${company.mission}
CULTURE: ${company.cultureTraits.join(", ")}
GOALS: ${company.hiringGoals.join("; ")}
TONE: ${company.communicationTone}`
    : "COMPANY: N/A";

  const recruiterPersonaBlock = persona
    ? `AGENT NAME: ${persona.name}
ROLE: ${persona.role}
TRAITS: ${persona.traits.join(", ")}
STYLE: ${persona.communicationStyle}
OBJECTIVE: ${persona.objective}`
    : "AGENT: N/A";

  const candidateIntelligenceBlock = `CANDIDATE: ${candidate.name}
TITLE: ${candidate.title}
COMPANY: ${candidate.company || "N/A"}
METRICS:
- interestScore: ${candidate.interestScore}%
- roleFit: ${candidate.roleFit}%
- startupAppetite: ${candidate.startupAppetite}%
- missionAlignment: ${candidate.missionAlignment}%
- salarySensitivity: ${candidate.salarySensitivity}%
- dropoutRisk: ${candidate.dropoutRisk}%
OBSERVATIONS:
${candidate.observations.map((o) => `* ${o}`).join("\n")}
HYPOTHESES:
${candidate.hypotheses.map((h) => `* ${h}`).join("\n")}`;

  const conversationMemoryBlock = buildMemoryBlock(input.conversationMemories || []);

  const plannerStateBlock = `STAGE: ${planner.stage}
OBJECTIVE: ${planner.currentObjective}
MISSING INFO: ${planner.missingInformation.join("; ")}
REASONING: ${planner.reasoning}`;

  const selectedActionBlock = `ACTION: ${action}`;

  // Map expected outcome based on selected action
  let expectedOutcome = "Increase candidate engagement and progress recruiting stage.";
  if (action === "ASK_MOTIVATION") expectedOutcome = "Candidate explains their primary career drivers and current role alignment.";
  if (action === "ASK_OWNERSHIP") expectedOutcome = "Candidate describes their decision-making experiences and engineering autonomy needs.";
  if (action === "ASK_REMOTE") expectedOutcome = "Candidate provides remote presence expectations and location boundaries.";
  if (action === "ASK_COMPENSATION") expectedOutcome = "Candidate outlines salary bounds and cash/equity trade-off expectations.";
  if (action === "QUALIFY_EXPERIENCE") expectedOutcome = "Candidate details technical scale and shipping experience.";
  if (action === "ADDRESS_CONCERN") expectedOutcome = "Candidate feels reassured regarding concerns (e.g. runway, compute infrastructure).";
  if (action === "BOOK_CALL") expectedOutcome = "Candidate confirms availability for a 30-minute introductory call.";

  const expectedOutcomeBlock = `EXPECTED OUTCOME: ${expectedOutcome}`;

  const strategy = buildStrategy(candidate, planner, action);
  const communicationStrategyBlock = `Strategy: ${strategy.strategy}
Rules:
${strategy.communicationRules.map((r) => `* ${r}`).join("\n")}
Avoid:
${strategy.forbiddenPatterns.map((f) => `* ${f}`).join("\n")}
Expected Outcome: ${strategy.expectedOutcome}`;

  // Assemble full prompt
  const fullPrompt = `# WHO AM I?
${recruiterPersonaBlock}

# WHAT DO I KNOW?
${companyContextBlock}

${candidateIntelligenceBlock}

${conversationMemoryBlock}

# WHAT IS MY GOAL?
${plannerStateBlock}

# COMMUNICATION STRATEGY
${communicationStrategyBlock}

# WHAT SHOULD I DO?
${selectedActionBlock}
${expectedOutcomeBlock}

# WHAT SHOULD I AVOID?
* Avoid generic recruiting phrases like "hope this message finds you well" or "great fit for this role".
* Avoid planning or deciding next steps. Stick strictly to executing the assigned action.
* Match the communication style and objective assigned to your @persona.`;

  return {
    companyContextBlock,
    recruiterPersonaBlock,
    candidateIntelligenceBlock,
    conversationMemoryBlock,
    plannerStateBlock,
    selectedActionBlock,
    expectedOutcomeBlock,
    communicationStrategyBlock,
    fullPrompt,
  };
}
