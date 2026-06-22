import { GroqClient } from "../groq-client";
import { MODEL_CONFIG } from "../model-config";

export async function runGroqClientTests() {
  console.log("Running GroqClient test suite...");

  // Mock API Key env
  process.env.GROQ_API_KEY = "gsk_mock_api_key_for_testing";

  // Helper mock Response generator
  const createMockResponse = (status: number, ok: boolean, body: any): Response => {
    return {
      status,
      ok,
      json: async () => body,
      text: async () => typeof body === "string" ? body : JSON.stringify(body),
    } as Response;
  };

  // Test Case 1: Valid Prompt
  {
    console.log("Test Case 1: Valid Prompt");
    const mockFetch = async () => {
      return createMockResponse(200, true, {
        choices: [{ message: { content: "Mocked candidate outreach message response." } }]
      });
    };

    const client = new GroqClient(mockFetch as any);
    const res = await client.generate("Outline benefits of working at Vanguard.");
    if (!res.success) {
      throw new Error(`Expected success true, got false. Error: ${res.error}`);
    }
    if (res.content !== "Mocked candidate outreach message response.") {
      throw new Error(`Expected content mismatch, got: ${res.content}`);
    }
    if (res.model !== MODEL_CONFIG.PRIMARY_MODEL) {
      throw new Error(`Expected primary model, got: ${res.model}`);
    }
    console.log("✓ Valid prompt passed.");
  }

  // Test Case 2: Empty Prompt
  {
    console.log("Test Case 2: Empty Prompt");
    const mockFetch = async () => {
      throw new Error("Fetch should not be called for empty prompt");
    };

    const client = new GroqClient(mockFetch as any);
    const res = await client.generate("   ");
    if (res.success) {
      throw new Error("Expected success false for empty prompt");
    }
    if (res.error !== "Prompt cannot be empty") {
      throw new Error(`Expected empty prompt error, got: ${res.error}`);
    }
    console.log("✓ Empty prompt validation passed.");
  }

  // Test Case 3: Timeout Abort/Retry
  {
    console.log("Test Case 3: Timeout Abort/Retry");
    let callCount = 0;
    const mockFetch = async () => {
      callCount++;
      const err = new Error("Request timed out");
      err.name = "AbortError";
      throw err;
    };

    const client = new GroqClient(mockFetch as any);
    const res = await client.generate("Get interview prep tips.");
    if (res.success) {
      throw new Error("Expected failure for persistent timeouts");
    }
    // Attempted initial call + MAX_RETRIES
    const expectedCalls = 1 + MODEL_CONFIG.MAX_RETRIES;
    if (callCount !== expectedCalls) {
      throw new Error(`Expected ${expectedCalls} calls, got ${callCount}`);
    }
    console.log("✓ Timeout/Retry handling passed.");
  }

  // Test Case 4: Rate Limit and Fallback Model
  {
    console.log("Test Case 4: Rate Limit and Fallback Model");
    let callCount = 0;
    const mockFetch = async (url: string, init?: RequestInit) => {
      callCount++;
      const body = JSON.parse(init?.body as string);
      
      // First call (attempt 1) hits rate limit (429) using primary model
      if (callCount === 1) {
        if (body.model !== MODEL_CONFIG.PRIMARY_MODEL) {
          throw new Error("First attempt should use primary model");
        }
        return createMockResponse(429, false, "Rate limit exceeded");
      }
      
      // Subsequent call uses fallback model and succeeds
      if (body.model !== MODEL_CONFIG.FALLBACK_MODEL) {
        throw new Error("Fallback model should be utilized after retries");
      }
      return createMockResponse(200, true, {
        choices: [{ message: { content: "Successful fallback response." } }]
      });
    };

    const client = new GroqClient(mockFetch as any);
    const res = await client.generate("Tell me about our company.");
    if (!res.success) {
      throw new Error(`Expected successful fallback execution, got: ${res.error}`);
    }
    if (res.model !== MODEL_CONFIG.FALLBACK_MODEL) {
      throw new Error(`Expected model to be fallback, got: ${res.model}`);
    }
    console.log("✓ Rate limit fallback handling passed.");
  }

  // Test Case 5: Fail Fast client error (e.g. 401 Unauthorized)
  {
    console.log("Test Case 5: Fail Fast Client Error");
    let callCount = 0;
    const mockFetch = async () => {
      callCount++;
      return createMockResponse(401, false, "Invalid API Key");
    };

    const client = new GroqClient(mockFetch as any);
    const res = await client.generate("Hello world");
    if (res.success) {
      throw new Error("Expected failure on 401 Unauthorized");
    }
    if (callCount !== 1) {
      throw new Error(`Expected client error to fail fast on first attempt, but called ${callCount} times`);
    }
    if (!res.error?.includes("Groq API client error (401)")) {
      throw new Error(`Expected specific unauthorized error, got: ${res.error}`);
    }
    console.log("✓ Fail fast client error handling passed.");
  }
}
