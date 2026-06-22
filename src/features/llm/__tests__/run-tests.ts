import { runGroqClientTests } from "./groq-client.test";

async function main() {
  console.log("=== Starting PSVIEW LLM Infrastructure Suite ===");
  try {
    await runGroqClientTests();
    console.log("================================================");
    console.log("ALL LLM INFRASTRUCTURE TESTS COMPLETED.");
    process.exit(0);
  } catch (error: any) {
    console.error("LLM INFRASTRUCTURE TEST SUITE FAILED:");
    console.error(error.message || error);
    console.log("================================================");
    process.exit(1);
  }
}

main();
