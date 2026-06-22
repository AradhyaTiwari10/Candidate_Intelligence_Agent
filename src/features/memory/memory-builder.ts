import { MemoryRecord } from "./memory-record";

/**
 * Formats a list of memory records into a structured Markdown block.
 * Format:
 * # CONVERSATION MEMORY
 * * [Category] Fact (Timestamp)
 */
export function buildMemoryBlock(records: readonly MemoryRecord[]): string {
  if (records.length === 0) {
    return "# CONVERSATION MEMORY\n(No historical memory records found for this candidate.)";
  }

  const lines = [
    "# CONVERSATION MEMORY",
    ...records.map((r) => {
      const displayCategory = r.category.toUpperCase();
      return `* [${displayCategory}] ${r.fact} (${r.timestamp})`;
    }),
  ];

  return lines.join("\n");
}
