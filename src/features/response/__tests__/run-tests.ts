process.env.GROQ_API_KEY = "gsk_mock_api_key_for_testing";
import { runResponsePipelineTests } from "./response.test";

async function main() {
  console.log("=== Starting PSVIEW Response Pipeline Suite ===");
  try {
    await runResponsePipelineTests();
    console.log("===============================================");
    console.log("ALL RESPONSE PIPELINE TESTS COMPLETED.");
    process.exit(0);
  } catch (error: any) {
    console.error("RESPONSE PIPELINE TEST SUITE FAILED:");
    console.error(error.message || error);
    console.log("===============================================");
    process.exit(1);
  }
}

main();
