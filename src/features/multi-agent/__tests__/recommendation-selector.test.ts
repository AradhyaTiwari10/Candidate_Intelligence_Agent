import { selectRecommendation } from "../recommendation-selector";
import { AgentResult } from "../agent-result";

export function runSelectorTests() {
  console.log("Running Recommendation Selector tests...");

  // 1. Objection Precedence (ADDRESS_OBJECTION Rank 1 vs others)
  const resultsObjection: readonly AgentResult[] = [
    { agent: "SOURCER", recommendationType: "CONTINUE_DISCOVERY", recommendationText: "Source profiles", confidence: 90 },
    { agent: "QUALIFIER", recommendationType: "ASK_COMPENSATION", recommendationText: "Ask comp", confidence: 80 },
    { agent: "ENGAGEMENT", recommendationType: "ADDRESS_OBJECTION", recommendationText: "Address runway objection", confidence: 70 }
  ];
  const selectObj = selectRecommendation(resultsObjection);
  if (selectObj.selected.recommendationType !== "ADDRESS_OBJECTION") {
    throw new Error("Objection Precedence test failed");
  }

  // 2. Qualification vs Conversion (ASK_COMPENSATION Rank 2 vs BOOK_CALL Rank 5)
  const resultsQualVsConv: readonly AgentResult[] = [
    { agent: "ENGAGEMENT", recommendationType: "BOOK_CALL", recommendationText: "Recommend call", confidence: 95 },
    { agent: "QUALIFIER", recommendationType: "ASK_COMPENSATION", recommendationText: "Ask comp bounds", confidence: 80 }
  ];
  const selectQual = selectRecommendation(resultsQualVsConv);
  if (selectQual.selected.recommendationType !== "ASK_COMPENSATION") {
    throw new Error("Qualification vs Conversion precedence test failed");
  }

  // 3. Confidence Tie Breaking (Equal Rank 2, Different Confidence)
  const resultsConfidenceTie: readonly AgentResult[] = [
    { agent: "SOURCER", recommendationType: "ASK_COMPENSATION", recommendationText: "Ask comp low confidence", confidence: 75 },
    { agent: "QUALIFIER", recommendationType: "ASK_COMPENSATION", recommendationText: "Ask comp high confidence", confidence: 85 }
  ];
  const selectConf = selectRecommendation(resultsConfidenceTie);
  if (selectConf.selected.confidence !== 85 || selectConf.selected.agent !== "QUALIFIER") {
    throw new Error("Confidence tie breaking test failed");
  }

  // 4. First Encountered Tie Breaking (Equal Rank 2, Equal Confidence 80)
  const resultsFirstEncounteredTie: readonly AgentResult[] = [
    { agent: "SOURCER", recommendationType: "ASK_COMPENSATION", recommendationText: "Comp 1", confidence: 80 },
    { agent: "QUALIFIER", recommendationType: "ASK_COMPENSATION", recommendationText: "Comp 2", confidence: 80 }
  ];
  const selectFirst = selectRecommendation(resultsFirstEncounteredTie);
  if (selectFirst.selected.agent !== "SOURCER" || selectFirst.selected.recommendationText !== "Comp 1") {
    throw new Error("First encountered tie breaking test failed");
  }

  // ── M9.7: selectedBy, rankedCandidates, tieBreakRule tests ──────────────────

  // 5. selectedBy populated correctly — winner agent populates selectedBy
  const resultsSelectedBy: readonly AgentResult[] = [
    { agent: "SOURCER", recommendationType: "CONTINUE_DISCOVERY", recommendationText: "Source", confidence: 70 },
    { agent: "ENGAGEMENT", recommendationType: "ADDRESS_OBJECTION", recommendationText: "Address", confidence: 85 },
  ];
  const selectSelectedBy = selectRecommendation(resultsSelectedBy);
  if (selectSelectedBy.selectedBy !== "ENGAGEMENT") {
    throw new Error(`selectedBy test failed: expected ENGAGEMENT, got ${selectSelectedBy.selectedBy}`);
  }

  // 6. rankedCandidates ordered correctly — lowest rank first
  const resultsRanked: readonly AgentResult[] = [
    { agent: "SOURCER", recommendationType: "CONTINUE_DISCOVERY", recommendationText: "Source", confidence: 90 },
    { agent: "QUALIFIER", recommendationType: "BOOK_CALL", recommendationText: "Book", confidence: 80 },
    { agent: "ENGAGEMENT", recommendationType: "ADDRESS_OBJECTION", recommendationText: "Address", confidence: 70 },
  ];
  const selectRanked = selectRecommendation(resultsRanked);
  const positions = selectRanked.rankedCandidates.map(r => r.agent);
  if (positions[0] !== "ENGAGEMENT" || positions[1] !== "QUALIFIER" || positions[2] !== "SOURCER") {
    throw new Error(`rankedCandidates order test failed: got [${positions.join(", ")}]`);
  }
  if (selectRanked.rankedCandidates[0].finalPosition !== 1) {
    throw new Error("rankedCandidates finalPosition test failed: winner must be position 1");
  }
  if (selectRanked.rankedCandidates[0].rank !== 1) {
    throw new Error(`rankedCandidates rank test failed: ADDRESS_OBJECTION must have rank 1, got ${selectRanked.rankedCandidates[0].rank}`);
  }

  // 7. tieBreakRule = PRIORITY_RANK (different types, different ranks)
  const resultsPriorityRank: readonly AgentResult[] = [
    { agent: "SOURCER", recommendationType: "CONTINUE_DISCOVERY", recommendationText: "Source", confidence: 90 },
    { agent: "ENGAGEMENT", recommendationType: "ADDRESS_OBJECTION", recommendationText: "Address", confidence: 70 },
  ];
  const selectPriorityRank = selectRecommendation(resultsPriorityRank);
  if (selectPriorityRank.tieBreakRule !== "PRIORITY_RANK") {
    throw new Error(`tieBreakRule=PRIORITY_RANK test failed: got ${selectPriorityRank.tieBreakRule}`);
  }

  // 8. tieBreakRule = CONFIDENCE (same type / rank, different confidence)
  const resultsConfBreak: readonly AgentResult[] = [
    { agent: "SOURCER", recommendationType: "ASK_COMPENSATION", recommendationText: "Low conf", confidence: 60 },
    { agent: "QUALIFIER", recommendationType: "ASK_COMPENSATION", recommendationText: "High conf", confidence: 90 },
  ];
  const selectConfBreak = selectRecommendation(resultsConfBreak);
  if (selectConfBreak.tieBreakRule !== "CONFIDENCE") {
    throw new Error(`tieBreakRule=CONFIDENCE test failed: got ${selectConfBreak.tieBreakRule}`);
  }

  // 9. tieBreakRule = FIRST_ENCOUNTERED (same type, same confidence)
  const resultsFirstBreak: readonly AgentResult[] = [
    { agent: "SOURCER", recommendationType: "BOOK_CALL", recommendationText: "First", confidence: 80 },
    { agent: "QUALIFIER", recommendationType: "BOOK_CALL", recommendationText: "Second", confidence: 80 },
  ];
  const selectFirstBreak = selectRecommendation(resultsFirstBreak);
  if (selectFirstBreak.tieBreakRule !== "FIRST_ENCOUNTERED") {
    throw new Error(`tieBreakRule=FIRST_ENCOUNTERED test failed: got ${selectFirstBreak.tieBreakRule}`);
  }
  if (selectFirstBreak.selectedBy !== "SOURCER") {
    throw new Error(`FIRST_ENCOUNTERED selectedBy test failed: expected SOURCER, got ${selectFirstBreak.selectedBy}`);
  }

  console.log("✓ Recommendation Selector tests passed.");
}
