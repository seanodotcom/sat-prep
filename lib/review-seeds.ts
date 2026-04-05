import type { ReviewItem } from "@/lib/types";

export const seedReviewItems: ReviewItem[] = [
  {
    id: "r1",
    prompt: "Choose the transition that best connects the finding to the prior claim.",
    skill: "Transitions",
    errorType: "Evidence Error",
    lastSeen: "Yesterday",
    section: "Reading & Writing",
    retryReady: true
  },
  {
    id: "r2",
    prompt: "Solve for the constant term after expanding the expression.",
    skill: "Quadratics",
    errorType: "Process Error",
    lastSeen: "2 days ago",
    section: "Math",
    retryReady: true
  },
  {
    id: "r3",
    prompt: "Interpret the slope from the table and select the valid claim.",
    skill: "Linear functions",
    errorType: "Misread Question",
    lastSeen: "Today",
    section: "Math",
    retryReady: false
  }
];
