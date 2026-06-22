import { GroqClient } from "./groq-client";
import { GenerationResult } from "./generation-result";

export class GenerationService {
  private readonly client: GroqClient;

  constructor(client?: GroqClient) {
    this.client = client || new GroqClient();
  }

  async generateText(prompt: string): Promise<GenerationResult> {
    return this.client.generate(prompt);
  }
}
