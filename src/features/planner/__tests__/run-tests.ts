import {
  runDiscoveryFlowTest,
  runQualificationFlowTest,
  runEngagementFlowTest,
  runBookingFlowTest,
} from "./planner.test";

async function main() {
  console.log("=== Starting PSVIEW Planner Engine Suite ===");
  try {
    runDiscoveryFlowTest();
    runQualificationFlowTest();
    runEngagementFlowTest();
    runBookingFlowTest();
    console.log("============================================");
    console.log("ALL PLANNER TESTS COMPLETED SUCCESSFULLY.");
    process.exit(0);
  } catch (error: any) {
    console.error("PLANNER TEST SUITE FAILED:");
    console.error(error.message || error);
    console.error("============================================");
    process.exit(1);
  }
}

main();
