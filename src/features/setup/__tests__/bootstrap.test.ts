import { generatePersona } from "../persona-generator";
import { generateStrategy } from "../strategy-generator";
import { bootstrapAgent } from "../agent-bootstrap";
import { CompanyContext } from "@/types";

// Mock contexts
const mockStripe: CompanyContext = {
  companyName: "Stripe",
  industry: "Finance",
  mission: "GDP of the internet",
  cultureTraits: ["High ownership", "Fast execution"],
  hiringGoals: ["Backend Engineer"],
  communicationTone: "direct",
};

const mockNotion: CompanyContext = {
  companyName: "Notion",
  industry: "Productivity",
  mission: "Ubiquitous toolmaking",
  cultureTraits: ["Craft-focused", "Detail-oriented"],
  hiringGoals: ["Frontend Craft Engineer"],
  communicationTone: "thoughtful",
};

const mockOpenAI: CompanyContext = {
  companyName: "OpenAI",
  industry: "AI Research",
  mission: "AGI benefits humanity",
  cultureTraits: ["AGI safety alignment", "Scientific rigor"],
  hiringGoals: ["Safety Researcher"],
  communicationTone: "rigorous",
};

export function runPersonaTests() {
  console.log("Running Persona Generator tests...");

  const stripePersona = generatePersona(mockStripe);
  if (stripePersona.name !== "Sarah Chen") throw new Error("Stripe name mismatch");
  if (!stripePersona.traits.includes("Fast execution")) throw new Error("Stripe traits mismatch");

  const notionPersona = generatePersona(mockNotion);
  if (notionPersona.name !== "Elena Rostova") throw new Error("Notion name mismatch");
  if (!notionPersona.traits.includes("Product focused")) throw new Error("Notion traits mismatch");

  const openaiPersona = generatePersona(mockOpenAI);
  if (openaiPersona.name !== "Dr. Marcus Vance") throw new Error("OpenAI name mismatch");
  if (!openaiPersona.traits.includes("Research minded")) throw new Error("OpenAI traits mismatch");

  console.log("✓ Persona Generator tests passed.");
}

export function runStrategyTests() {
  console.log("Running Strategy Generator tests...");

  const stripeStrategy = generateStrategy(mockStripe);
  if (stripeStrategy.stage !== "DISCOVERY") throw new Error("Stripe stage mismatch");
  if (!stripeStrategy.missingInformation.includes("ownership expectations"))
    throw new Error("Stripe missing info mismatch");

  const notionStrategy = generateStrategy(mockNotion);
  if (notionStrategy.stage !== "QUALIFICATION") throw new Error("Notion stage mismatch");
  if (!notionStrategy.missingInformation.includes("product craft alignment"))
    throw new Error("Notion missing info mismatch");

  const openaiStrategy = generateStrategy(mockOpenAI);
  if (openaiStrategy.stage !== "ENGAGEMENT") throw new Error("OpenAI stage mismatch");
  if (!openaiStrategy.missingInformation.includes("AGI mission alignment commitment"))
    throw new Error("OpenAI missing info mismatch");

  console.log("✓ Strategy Generator tests passed.");
}

export function runBootstrapTests() {
  console.log("Running Agent Bootstrap tests...");

  const stripeAgent = bootstrapAgent(mockStripe);
  if (stripeAgent.persona.name !== "Sarah Chen") throw new Error("Bootstrap Stripe persona mismatch");
  if (stripeAgent.planner.stage !== "DISCOVERY") throw new Error("Bootstrap Stripe planner mismatch");

  const notionAgent = bootstrapAgent(mockNotion);
  if (notionAgent.persona.name !== "Elena Rostova") throw new Error("Bootstrap Notion persona mismatch");
  if (notionAgent.planner.stage !== "QUALIFICATION") throw new Error("Bootstrap Notion planner mismatch");

  console.log("✓ Agent Bootstrap tests passed.");
}
