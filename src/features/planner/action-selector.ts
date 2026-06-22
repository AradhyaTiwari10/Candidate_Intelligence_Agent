export type RecruitingAction =
  | "ASK_MOTIVATION"
  | "ASK_OWNERSHIP"
  | "ASK_REMOTE"
  | "ASK_COMPENSATION"
  | "QUALIFY_EXPERIENCE"
  | "ADDRESS_CONCERN"
  | "BOOK_CALL";

export function selectAction(activeObjective: string): RecruitingAction {
  switch (activeObjective) {
    case "Understand motivations":
      return "ASK_MOTIVATION";
    case "Understand ownership expectations":
      return "ASK_OWNERSHIP";
    case "Understand remote preferences":
      return "ASK_REMOTE";
    case "Validate role fit":
      return "ASK_COMPENSATION";
    case "Validate experience":
      return "QUALIFY_EXPERIENCE";
    case "Build excitement":
      return "ASK_MOTIVATION";
    case "Address concerns":
      return "ADDRESS_CONCERN";
    case "Schedule call":
      return "BOOK_CALL";
    default:
      return "ASK_MOTIVATION";
  }
}
