import { runMemoryTests } from "./memory.test";

async function main() {
  console.log("=== Starting PSVIEW Conversation Memory Suite ===");
  try {
    runMemoryTests();
    console.log("==============================================");
    console.log("ALL CONVERSATION MEMORY TESTS COMPLETED.");
    process.exit(0);
  } catch (error: any) {
    console.error("CONVERSATION MEMORY TEST SUITE FAILED:");
    console.error(error.message || error);
    console.log("==============================================");
    process.exit(1);
  }
}

main();
