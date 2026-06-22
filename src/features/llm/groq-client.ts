import { MODEL_CONFIG } from "./model-config";
import { GenerationResult } from "./generation-result";

export class GroqClient {
  private readonly apiKey: string;
  private readonly customFetch: typeof fetch;

  constructor(customFetch?: typeof fetch) {
    this.apiKey = process.env.GROQ_API_KEY || "";
    this.customFetch = customFetch || globalThis.fetch.bind(globalThis);
  }

  async generate(prompt: string): Promise<GenerationResult> {
    const startTime = performance.now();
    let currentModel: string = MODEL_CONFIG.PRIMARY_MODEL;

    if (!prompt || prompt.trim().length === 0) {
      return {
        success: false,
        error: "Prompt cannot be empty",
        latencyMs: Math.round(performance.now() - startTime),
        model: currentModel,
      };
    }

    if (!this.apiKey) {
      return {
        success: false,
        error: "Groq API key is not configured in environment",
        latencyMs: Math.round(performance.now() - startTime),
        model: currentModel,
      };
    }

    let attempt = 0;
    while (attempt <= MODEL_CONFIG.MAX_RETRIES) {
      attempt++;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), MODEL_CONFIG.TIMEOUT_MS);

      try {
        const response = await this.customFetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.apiKey}`,
          },
          body: JSON.stringify({
            model: currentModel,
            messages: [{ role: "user", content: prompt }],
            temperature: MODEL_CONFIG.TEMPERATURE,
            max_tokens: MODEL_CONFIG.MAX_TOKENS,
          }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          const data = await response.json();
          const content = data?.choices?.[0]?.message?.content;
          if (typeof content !== "string") {
            return {
              success: false,
              error: "Malformed API response structure",
              latencyMs: Math.round(performance.now() - startTime),
              model: currentModel,
            };
          }
          return {
            success: true,
            content,
            latencyMs: Math.round(performance.now() - startTime),
            model: currentModel,
          };
        }

        // Handle errors
        if (response.status === 429) {
          console.warn(`Groq rate limit hit (429). Attempt ${attempt} of ${MODEL_CONFIG.MAX_RETRIES}`);
          currentModel = MODEL_CONFIG.FALLBACK_MODEL;
        } else if (response.status >= 500) {
          console.warn(`Groq server error (${response.status}). Attempt ${attempt} of ${MODEL_CONFIG.MAX_RETRIES}`);
        } else {
          const errText = await response.text();
          clearTimeout(timeoutId);
          return {
            success: false,
            error: `Groq API client error (${response.status}): ${errText}`,
            latencyMs: Math.round(performance.now() - startTime),
            model: currentModel,
          };
        }

      } catch (err: any) {
        clearTimeout(timeoutId);
        if (err.name === "AbortError") {
          console.warn(`Groq request timed out. Attempt ${attempt} of ${MODEL_CONFIG.MAX_RETRIES}`);
        } else {
          console.warn(`Groq connection failure: ${err.message || err}. Attempt ${attempt} of ${MODEL_CONFIG.MAX_RETRIES}`);
        }
      }

      if (attempt <= MODEL_CONFIG.MAX_RETRIES) {
        const delay = Math.pow(2, attempt) * 100;
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }

    return {
      success: false,
      error: `Failed after ${MODEL_CONFIG.MAX_RETRIES} attempts. Latency exhausted.`,
      latencyMs: Math.round(performance.now() - startTime),
      model: currentModel,
    };
  }
}
