import { CandidateIntelligence, PlannerStage } from "@/types";

export const STAGE_OBJECTIVES: Record<PlannerStage, string[]> = {
  DISCOVERY: [
    "Understand motivations",
    "Understand ownership expectations",
    "Understand remote preferences",
  ],
  QUALIFICATION: [
    "Validate role fit",
    "Validate experience",
  ],
  ENGAGEMENT: [
    "Build excitement",
    "Address concerns",
  ],
  BOOKING: [
    "Schedule call",
  ],
};

export function getCompletedObjectives(candidate: CandidateIntelligence): string[] {
  const completed: string[] = [];
  const obsLower = candidate.observations.map((o) => o.toLowerCase());

  // Discovery checks
  if (
    obsLower.some((o) => o.includes("motivation") || o.includes("growth") || o.includes("learn")) ||
    candidate.motivations.length > 0
  ) {
    completed.push("Understand motivations");
  }

  if (obsLower.some((o) => o.includes("ownership") || o.includes("autonomy") || o.includes("decision"))) {
    completed.push("Understand ownership expectations");
  }

  if (obsLower.some((o) => o.includes("remote") || o.includes("flexibility") || o.includes("wfh"))) {
    completed.push("Understand remote preferences");
  }

  // Qualification checks
  if (candidate.roleFit >= 75) {
    completed.push("Validate role fit");
  }
  if (candidate.observations.length >= 2 || candidate.roleFit >= 80) {
    completed.push("Validate experience");
  }

  // Engagement checks
  if (candidate.interestScore >= 80) {
    completed.push("Build excitement");
  }
  // If candidate has no active concerns, or we have formulated a hypothesis to address concerns
  if (
    candidate.concerns.length === 0 ||
    candidate.hypotheses.some((h) => h.includes("mitigate") || h.includes("appeal") || h.includes("offset"))
  ) {
    completed.push("Address concerns");
  }

  return completed;
}

export function determineStageAndObjective(completed: string[]): { stage: PlannerStage; activeObjective: string } {
  // Discovery Stage
  const discoveryIncomplete = STAGE_OBJECTIVES.DISCOVERY.filter((obj) => !completed.includes(obj));
  if (discoveryIncomplete.length > 0) {
    return { stage: "DISCOVERY", activeObjective: discoveryIncomplete[0] };
  }

  // Qualification Stage
  const qualIncomplete = STAGE_OBJECTIVES.QUALIFICATION.filter((obj) => !completed.includes(obj));
  if (qualIncomplete.length > 0) {
    return { stage: "QUALIFICATION", activeObjective: qualIncomplete[0] };
  }

  // Engagement Stage
  const engagementIncomplete = STAGE_OBJECTIVES.ENGAGEMENT.filter((obj) => !completed.includes(obj));
  if (engagementIncomplete.length > 0) {
    return { stage: "ENGAGEMENT", activeObjective: engagementIncomplete[0] };
  }

  // Booking Stage
  return { stage: "BOOKING", activeObjective: "Schedule call" };
}
