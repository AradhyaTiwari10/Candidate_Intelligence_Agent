import { runMemoryRetrieverTests } from "./memory-retriever.test";

async function main() {
  console.log("=== Starting PSVIEW Memory Retriever Suite ===");
  try {
    runMemoryRetrieverTests();
    console.log("==============================================");
    console.log("ALL MEMORY RETRIEVER TESTS COMPLETED.");
    process.exit(0);
  } catch (error: any) {
    console.error("MEMORY RETRIEVER TEST SUITE FAILED:");
    console.error(error.message || error);
    console.log("==============================================");
    process.exit(1);
  }
}

main();
