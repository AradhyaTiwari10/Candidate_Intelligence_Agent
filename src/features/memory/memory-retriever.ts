import { MemoryRecord } from "./memory-record";

/**
 * Retrieves and prioritizes memory records based on the selected action.
 * Max 5 memories are returned.
 */
export function getRelevantMemories(
  memories: readonly MemoryRecord[],
  selectedAction: string
): readonly MemoryRecord[] {
  let targetCategory: string | null = null;

  switch (selectedAction) {
    case "ASK_REMOTE":
      targetCategory = "flexibility";
      break;
    case "ASK_COMPENSATION":
      targetCategory = "compensation";
      break;
    case "ASK_MOTIVATION":
      targetCategory = "motivation";
      break;
    case "QUALIFY_EXPERIENCE":
      targetCategory = "experience";
      break;
    default:
      targetCategory = null;
  }

  if (!targetCategory) {
    return memories.slice(0, 5);
  }

  const matching = memories.filter((m) => m.category === targetCategory);
  if (matching.length > 0) {
    return matching.slice(0, 5);
  }

  return memories.slice(0, 5);
}
