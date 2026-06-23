import { AgentRole } from "./agent-role";
import { AgentResult, RecommendationPriorityReason, RecommendationType } from "./recommendation-types";
import { PRIORITY_MAP } from "./priority-map";

export interface RankedCandidate {
  readonly agent: AgentRole;
  readonly recommendationType: RecommendationType;
  readonly confidence: number;
  readonly rank: number;
  readonly finalPosition: number;
}

export type TieBreakRule =
  | "PRIORITY_RANK"
  | "CONFIDENCE"
  | "FIRST_ENCOUNTERED";

export interface SelectionResult {
  readonly selected: AgentResult;
  readonly selectedBy: AgentRole;
  readonly reason: RecommendationPriorityReason;
  readonly rationale: string;
  readonly tieBreakRule: TieBreakRule;
  readonly rankedCandidates: readonly RankedCandidate[];
}

/**
 * Selects the optimal recommendation using structured priority ranking,
 * resolving ties via confidence and original order preservation.
 */
export function selectRecommendation(
  results: readonly AgentResult[]
): SelectionResult {
  if (results.length === 0) {
    throw new Error("No agent results available for selection.");
  }

  // Find the index of each result to preserve original encounter order
  const indexedResults = results.map((result, index) => ({ result, index }));

  // Sort based on:
  // 1. Lower rank (higher priority)
  // 2. Higher confidence
  // 3. Lower original index (first encountered)
  indexedResults.sort((a, b) => {
    const rankA = PRIORITY_MAP[a.result.recommendationType].rank;
    const rankB = PRIORITY_MAP[b.result.recommendationType].rank;
    if (rankA !== rankB) {
      return rankA - rankB;
    }

    if (a.result.confidence !== b.result.confidence) {
      return b.result.confidence - a.result.confidence;
    }

    return a.index - b.index;
  });

  const winner = indexedResults[0].result;
  const runnerUp = indexedResults.length > 1 ? indexedResults[1].result : null;
  const config = PRIORITY_MAP[winner.recommendationType];

  // Determine which tier broke the tie between winner and runner-up
  let tieBreakRule: TieBreakRule = "PRIORITY_RANK";
  if (runnerUp !== null) {
    const winnerRank = PRIORITY_MAP[winner.recommendationType].rank;
    const runnerRank = PRIORITY_MAP[runnerUp.recommendationType].rank;
    if (winnerRank === runnerRank) {
      // Ranks tied — check confidence
      if (winner.confidence !== runnerUp.confidence) {
        tieBreakRule = "CONFIDENCE";
      } else {
        tieBreakRule = "FIRST_ENCOUNTERED";
      }
    }
  }

  // Build the full ranked candidate list
  const rankedCandidates: RankedCandidate[] = indexedResults.map(
    ({ result }, position) => ({
      agent: result.agent as AgentRole,
      recommendationType: result.recommendationType,
      confidence: result.confidence,
      rank: PRIORITY_MAP[result.recommendationType].rank,
      finalPosition: position + 1,
    })
  );

  return {
    selected: winner,
    selectedBy: winner.agent as AgentRole,
    reason: config.reason,
    rationale: `Selected ${winner.agent} recommendation (${winner.recommendationType}) because it holds a higher priority ranking (Rank ${config.rank}) in the orchestration matrix.`,
    tieBreakRule,
    rankedCandidates,
  };
}
export type { AgentResult };
