import Module from "module";
import path from "path";

const originalResolveFilename = (Module as any)._resolveFilename;
(Module as any)._resolveFilename = function (request: string, parent: any, isMain: boolean) {
  if (request.startsWith("@/")) {
    const relativePath = request.slice(2);
    request = path.join(__dirname, "../../../", relativePath);
  }
  return originalResolveFilename.call(this, request, parent, isMain);
};

import { runAgentRecommendationTests } from "./agent-recommendation.test";
import { runOrchestratorTests } from "./multi-agent-orchestrator.test";
import { runSelectorTests } from "./recommendation-selector.test";
import { runStoreIntegrationTests } from "./store-integration.test";
import { runStorePersistenceTests } from "../../../stores/__tests__/store-persistence.test";
import { runErrorHandlingTests } from "./error-handling.test";

async function main() {
  console.log("=== Starting PSVIEW Multi-Agent Suite ===");
  try {
    runAgentRecommendationTests();
    runOrchestratorTests();
    runSelectorTests();
    runStoreIntegrationTests();
    runStorePersistenceTests();
    runErrorHandlingTests();
    console.log("===============================================================");
    console.log("ALL MULTI-AGENT TESTS COMPLETED SUCCESSFULLY.");
    process.exit(0);
  } catch (error: any) {
    console.error("MULTI-AGENT TEST SUITE FAILED:");
    console.error(error.message || error);
    console.log("===============================================================");
    process.exit(1);
  }
}

main();
