import { CandidateIntelligence } from "@/types";
import { extractObservations } from "./observation-engine";
import { makeInferences } from "./inference-engine";
import { formulateHypotheses } from "./hypothesis-engine";
import { updateCandidateIntelligence } from "./candidate-updater";

export interface PipelineResult {
  readonly observations: readonly string[];
  readonly inferences: readonly string[];
  readonly hypotheses: readonly string[];
  readonly updatedCandidate: CandidateIntelligence;
}

export function runIntelligencePipeline(
  message: string,
  candidate: CandidateIntelligence
): PipelineResult {
  const observations = extractObservations(message);
  const inferences = makeInferences(observations);
  const hypotheses = formulateHypotheses(observations, inferences);
  const updatedCandidate = updateCandidateIntelligence(candidate, observations, hypotheses);

  return {
    observations,
    inferences,
    hypotheses,
    updatedCandidate,
  };
}
