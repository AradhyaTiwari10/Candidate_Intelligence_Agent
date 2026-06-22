import { MemoryRecord, MemoryCategory } from "./memory-record";

export function extractMemory(candidateId: string, message: string): readonly MemoryRecord[] {
  const records: MemoryRecord[] = [];
  const lowerMsg = message.toLowerCase();

  const createRecord = (category: MemoryCategory, fact: string): MemoryRecord => ({
    id: `mem-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    candidateId,
    category,
    fact,
    timestamp: new Date().toISOString(),
  });

  if (
    lowerMsg.includes("remote") ||
    lowerMsg.includes("hybrid") ||
    lowerMsg.includes("on-site") ||
    lowerMsg.includes("relocat") ||
    lowerMsg.includes("location")
  ) {
    records.push(createRecord("flexibility", `Location & Presence: ${message.trim()}`));
  }

  if (
    lowerMsg.includes("salary") ||
    lowerMsg.includes("compensation") ||
    lowerMsg.includes("pay") ||
    lowerMsg.includes("equity") ||
    lowerMsg.includes("cash")
  ) {
    records.push(createRecord("compensation", `Compensation Bounds: ${message.trim()}`));
  }

  if (
    lowerMsg.includes("ownership") ||
    lowerMsg.includes("autonomy") ||
    lowerMsg.includes("culture") ||
    lowerMsg.includes("flat") ||
    lowerMsg.includes("motivation") ||
    lowerMsg.includes("stifled")
  ) {
    records.push(createRecord("motivation", `Workplace Motivation: ${message.trim()}`));
  }

  if (
    lowerMsg.includes("scale") ||
    lowerMsg.includes("experience") ||
    lowerMsg.includes("loop") ||
    lowerMsg.includes("shipping") ||
    lowerMsg.includes("system") ||
    lowerMsg.includes("architect")
  ) {
    records.push(createRecord("experience", `Technical Domain Experience: ${message.trim()}`));
  }

  if (records.length === 0 && message.trim().length > 0) {
    records.push(createRecord("general", `Dialogue Insight: ${message.trim()}`));
  }

  return records;
}
