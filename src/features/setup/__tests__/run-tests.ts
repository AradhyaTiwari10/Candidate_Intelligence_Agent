import { runPersonaTests, runStrategyTests, runBootstrapTests } from "./bootstrap.test";

async function main() {
  console.log("=== Starting PSVIEW Agent Studio Setup Suite ===");
  try {
    runPersonaTests();
    runStrategyTests();
    runBootstrapTests();
    console.log("================================================");
    console.log("ALL TESTS COMPLETED SUCCESSFULLY.");
    process.exit(0);
  } catch (error: any) {
    console.error("TEST SUITE FAILED:");
    console.error(error.message || error);
    console.error("================================================");
    process.exit(1);
  }
}

main();
