import { runExplanationEngineTest, runReasoningTraceTest } from "./explainability.test";

async function main() {
  console.log("=== Starting PSVIEW Explainability Layer Suite ===");
  try {
    runExplanationEngineTest();
    runReasoningTraceTest();
    console.log("==================================================");
    console.log("ALL EXPLAINABILITY TESTS COMPLETED SUCCESSFULLY.");
    process.exit(0);
  } catch (error: any) {
    console.error("EXPLAINABILITY TEST SUITE FAILED:");
    console.error(error.message || error);
    console.error("==================================================");
    process.exit(1);
  }
}

main();
