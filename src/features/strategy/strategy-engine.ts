import { MessageStrategy } from "./strategy-types";

export function getStrategy(action: string): MessageStrategy {
  switch (action) {
    case "ASK_MOTIVATION":
      return {
        strategy: "DISCOVERY",
        objective: "Understand candidate motivations",
        communicationRules: ["ask open ended questions", "encourage storytelling", "avoid assumptions"],
        forbiddenPatterns: ["Generic recruiting language", "Multiple questions at once"],
        expectedOutcome: "Understand candidate motivation",
      };

    case "ASK_OWNERSHIP":
      return {
        strategy: "DISCOVERY",
        objective: "Assess ownership expectations",
        communicationRules: ["explore autonomy preferences", "explore decision making style", "avoid assumptions"],
        forbiddenPatterns: ["Generic recruiting language", "Multiple questions at once"],
        expectedOutcome: "Understand candidate autonomy needs",
      };

    case "ASK_REMOTE":
      return {
        strategy: "DISCOVERY",
        objective: "Clarify remote and flexibility expectations",
        communicationRules: ["clarify remote presence expectations", "clarify relocation constraints", "avoid assumptions"],
        forbiddenPatterns: ["Making location assumptions", "Multiple questions at once"],
        expectedOutcome: "Understand location preferences",
      };

    case "ASK_COMPENSATION":
      return {
        strategy: "DISCOVERY",
        objective: "Qualify salary expectations and package alignment",
        communicationRules: ["qualify salary expectations", "qualify cash/equity trade-off boundaries", "avoid assumptions"],
        forbiddenPatterns: ["Making package assumptions", "Multiple questions at once"],
        expectedOutcome: "Understand package requirements",
      };

    case "QUALIFY_EXPERIENCE":
      return {
        strategy: "QUALIFICATION",
        objective: "Verify technical systems depth",
        communicationRules: ["gather evidence", "verify claims", "avoid selling role"],
        forbiddenPatterns: ["Pitching or overselling", "Assuming skills fit without proof"],
        expectedOutcome: "Verify technical capabilities",
      };

    case "ADDRESS_CONCERN":
      return {
        strategy: "OBJECTION_HANDLING",
        objective: "Reduce candidate uncertainty and address concerns",
        communicationRules: ["acknowledge concern", "answer directly", "avoid pressure"],
        forbiddenPatterns: ["Defensiveness", "Overselling runway or compute details"],
        expectedOutcome: "Reduce candidate uncertainty",
      };

    case "BOOK_CALL":
      return {
        strategy: "CONVERSION",
        objective: "Schedule call and book technical introduction",
        communicationRules: ["create urgency", "offer scheduling options", "keep concise"],
        forbiddenPatterns: ["Vague follow ups", "Long scheduling paragraphs"],
        expectedOutcome: "Book introductory call",
      };

    default:
      return {
        strategy: "ENGAGEMENT",
        objective: "Progress candidate recruitment lifecycle",
        communicationRules: ["maintain context-aware dialog", "stay concise", "provide value first"],
        forbiddenPatterns: ["Generic template messages", "Unstructured requests"],
        expectedOutcome: "Keep candidate engaged",
      };
  }
}
