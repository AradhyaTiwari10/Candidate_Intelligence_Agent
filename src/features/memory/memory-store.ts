import { MemoryRecord } from "./memory-record";

export function filterMemoryByCandidate(
  records: readonly MemoryRecord[],
  candidateId: string
): readonly MemoryRecord[] {
  return records.filter((r) => r.candidateId === candidateId);
}

export function deduplicateRecords(
  existing: readonly MemoryRecord[],
  incoming: readonly MemoryRecord[]
): readonly MemoryRecord[] {
  const result = [...existing];
  
  for (const record of incoming) {
    // Check if a record with the same fact text or category already exists
    const isDuplicate = existing.some(
      (r) => r.category === record.category && r.fact.toLowerCase() === record.fact.toLowerCase()
    );
    if (!isDuplicate) {
      result.push(record);
    }
  }

  return result;
}
