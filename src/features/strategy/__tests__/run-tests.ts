import { runStrategyEngineTests } from "./strategy.test";

async function main() {
  console.log("=== Starting PSVIEW Message Strategy Suite ===");
  try {
    runStrategyEngineTests();
    console.log("==============================================");
    console.log("ALL MESSAGE STRATEGY TESTS COMPLETED.");
    process.exit(0);
  } catch (error: any) {
    console.error("MESSAGE STRATEGY TEST SUITE FAILED:");
    console.error(error.message || error);
    console.log("==============================================");
    process.exit(1);
  }
}

main();
