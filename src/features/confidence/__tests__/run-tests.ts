import { runConfidenceEngineTests } from "./confidence.test";

async function main() {
  console.log("=== Starting PSVIEW Confidence Engine Suite ===");
  try {
    runConfidenceEngineTests();
    console.log("===============================================");
    console.log("ALL CONFIDENCE TESTS COMPLETED SUCCESSFULLY.");
    process.exit(0);
  } catch (error: any) {
    console.error("CONFIDENCE TEST SUITE FAILED:");
    console.error(error.message || error);
    console.error("===============================================");
    process.exit(1);
  }
}

main();
