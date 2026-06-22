import { getRelevantMemories } from "../memory-retriever";
import { MemoryRecord } from "../memory-record";

export function runMemoryRetrieverTests() {
  console.log("Running Memory Retriever tests...");

  const mockMemories: readonly MemoryRecord[] = [
    { id: "1", candidateId: "cand-1", category: "general", fact: "Gen fact", timestamp: "1" },
    { id: "2", candidateId: "cand-1", category: "flexibility", fact: "Flex fact", timestamp: "2" },
    { id: "3", candidateId: "cand-1", category: "compensation", fact: "Comp fact", timestamp: "3" },
    { id: "4", candidateId: "cand-1", category: "motivation", fact: "Mot fact", timestamp: "4" },
    { id: "5", candidateId: "cand-1", category: "experience", fact: "Exp fact", timestamp: "5" },
    { id: "6", candidateId: "cand-1", category: "general", fact: "Gen fact 2", timestamp: "6" },
  ];

  // 1. remote retrieval
  console.log("Testing ASK_REMOTE...");
  const remoteRes = getRelevantMemories(mockMemories, "ASK_REMOTE");
  if (remoteRes[0].category !== "flexibility") {
    throw new Error("ASK_REMOTE did not prioritize flexibility memory");
  }
  if (remoteRes.length > 5) {
    throw new Error("Returned more than 5 memories");
  }

  // 2. compensation retrieval
  console.log("Testing ASK_COMPENSATION...");
  const compRes = getRelevantMemories(mockMemories, "ASK_COMPENSATION");
  if (compRes[0].category !== "compensation") {
    throw new Error("ASK_COMPENSATION did not prioritize compensation memory");
  }

  // 3. motivation retrieval
  console.log("Testing ASK_MOTIVATION...");
  const motRes = getRelevantMemories(mockMemories, "ASK_MOTIVATION");
  if (motRes[0].category !== "motivation") {
    throw new Error("ASK_MOTIVATION did not prioritize motivation memory");
  }

  // 4. experience retrieval
  console.log("Testing QUALIFY_EXPERIENCE...");
  const expRes = getRelevantMemories(mockMemories, "QUALIFY_EXPERIENCE");
  if (expRes[0].category !== "experience") {
    throw new Error("QUALIFY_EXPERIENCE did not prioritize experience memory");
  }

  // 5. fallback retrieval
  console.log("Testing default/fallback action...");
  const defaultRes = getRelevantMemories(mockMemories, "ASK_OTHER_THING");
  if (defaultRes[0].id !== "1") {
    throw new Error("Default action did not preserve original memory order");
  }

  // 6. max 5 records returned
  console.log("Testing max 5 records limit...");
  if (defaultRes.length !== 5) {
    throw new Error(`Expected exactly 5 memories returned, got ${defaultRes.length}`);
  }

  console.log("✓ All Memory Retriever tests passed.");
}
