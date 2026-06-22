import { runPromptBuilderTest } from "./generation.test";

async function main() {
  console.log("=== Starting PSVIEW Prompt Builder Suite ===");
  try {
    runPromptBuilderTest();
    console.log("============================================");
    console.log("ALL PROMPT BUILDER TESTS COMPLETED SUCCESSFULLY.");
    process.exit(0);
  } catch (error: any) {
    console.error("PROMPT BUILDER TEST SUITE FAILED:");
    console.error(error.message || error);
    console.error("============================================");
    process.exit(1);
  }
}

main();
