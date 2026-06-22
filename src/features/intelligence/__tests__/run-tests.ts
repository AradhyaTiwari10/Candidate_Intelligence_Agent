import { runOwnershipTest, runRemoteTest, runSalaryTest, runGrowthTest } from "./intelligence.test";

async function main() {
  console.log("=== Starting PSVIEW Candidate Intelligence Engine Suite ===");
  try {
    runOwnershipTest();
    runRemoteTest();
    runSalaryTest();
    runGrowthTest();
    console.log("==========================================================");
    console.log("ALL INTELLIGENCE TESTS COMPLETED SUCCESSFULLY.");
    process.exit(0);
  } catch (error: any) {
    console.error("INTELLIGENCE TEST SUITE FAILED:");
    console.error(error.message || error);
    console.error("==========================================================");
    process.exit(1);
  }
}

main();
