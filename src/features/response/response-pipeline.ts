import { GenerationInput } from "../generation/generation-input";
import { GenerationService } from "../llm/generation-service";
import { ResponseResult } from "./response-result";
import { generateResponse } from "./response-generator";
import { validateResponse } from "./response-validator";
import { getStrategy } from "../strategy/strategy-engine";

export async function runResponsePipeline(
  input: GenerationInput,
  service?: GenerationService
): Promise<ResponseResult> {
  const startTime = performance.now();
  let modelUsed = "fallback-static";

  const getFallbackResponse = (action: string): string => {
    const strategy = getStrategy(action);
    switch (strategy.strategy) {
      case "DISCOVERY":
        return "Could you share more about what you're looking for in your next opportunity?";
      case "QUALIFICATION":
        return "I'd love to better understand your relevant experience.";
      case "OBJECTION_HANDLING":
        return "Thank you for sharing that concern. Could you tell me a bit more about it?";
      case "CONVERSION":
        return "Would you be open to a brief conversation this week?";
      default:
        return "Thank you for the update. I'd love to stay in touch and progress our conversation.";
    }
  };

  try {
    const genRes = await generateResponse(input, service);
    modelUsed = genRes.model;

    if (genRes.success && genRes.content) {
      const validation = validateResponse(genRes.content);
      if (validation.valid) {
        return {
          success: true,
          message: genRes.content,
          validationPassed: true,
          latencyMs: Math.round(performance.now() - startTime),
          model: modelUsed,
        };
      } else {
        console.warn(`Response validation failed with issues: ${validation.issues.join("; ")}. Triggering fallback.`);
      }
    } else {
      console.warn(`Response generation failed with error: ${genRes.error || "no content"}. Triggering fallback.`);
    }
  } catch (err: any) {
    console.error(`Response pipeline error: ${err.message || err}. Triggering fallback.`);
  }

  return {
    success: false,
    message: getFallbackResponse(input.selectedAction),
    validationPassed: false,
    latencyMs: Math.round(performance.now() - startTime),
    model: modelUsed,
  };
}
