import type { RewardBadge } from "@/lib/types";

export const rewardBadgeDefinitions: RewardBadge[] = [
  {
    id: "b1",
    title: "Five-Day Lock-In",
    detail: "Complete five daily mission days in a row.",
    earned: false,
    category: "streak"
  },
  {
    id: "b2",
    title: "Review Closer",
    detail: "Resolve 6 review items through successful retry.",
    earned: false,
    category: "review"
  },
  {
    id: "b3",
    title: "Checkpoint 2",
    detail: "Reach the second weekly checkpoint with strong consistency.",
    earned: false,
    category: "checkpoint"
  },
  {
    id: "b4",
    title: "Accuracy Builder",
    detail: "Reach 75% overall accuracy across saved attempts.",
    earned: false,
    category: "mastery"
  }
];
