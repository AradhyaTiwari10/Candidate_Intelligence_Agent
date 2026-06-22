import { GenerationInput } from "../generation/generation-input";
import { GenerationService } from "../llm/generation-service";
import { GenerationResult } from "../llm/generation-result";
import { buildPrompt } from "../generation/prompt-builder";

export async function generateResponse(
  input: GenerationInput,
  service?: GenerationService
): Promise<GenerationResult> {
  const promptCtx = buildPrompt(input);
  const genService = service || new GenerationService();
  return genService.generateText(promptCtx.fullPrompt);
}
