import { runOrchestrationTest } from "./orchestrator.test";

async function main() {
  console.log("=== Starting PSVIEW Agent Orchestrator Suite ===");
  try {
    runOrchestrationTest();
    console.log("=================================================");
    console.log("ALL ORCHESTRATOR TESTS COMPLETED SUCCESSFULLY.");
    process.exit(0);
  } catch (error: any) {
    console.error("ORCHESTRATOR TEST SUITE FAILED:");
    console.error(error.message || error);
    console.error("=================================================");
    process.exit(1);
  }
}

main();
