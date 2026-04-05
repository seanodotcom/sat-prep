import { dayPlan } from "@/data/mock-data";
import { getCurrentStreak } from "@/lib/dashboard-insights";
import { getReviewResolutionStats } from "@/lib/review-insights";
import type {
  MissionAttemptRecord,
  PersistedReviewItem,
  RewardBadge
} from "@/lib/types";
import type { StudyProgress } from "@/lib/storage";

export function getXpFromAttemptsAndReviews(
  attempts: MissionAttemptRecord[],
  reviewItems: PersistedReviewItem[]
) {
  const correctAttempts = attempts.filter((attempt) => attempt.isCorrect).length;
  const resolvedReviews = getReviewResolutionStats(reviewItems).resolved;
  return correctAttempts * 10 + resolvedReviews * 20;
}

export function getWeeklyCompletion(studyProgress: StudyProgress) {
  const completedThisWeek = studyProgress.completedDays.filter((day) => day >= 1 && day <= 7).length;
  return Math.round((completedThisWeek / Math.min(7, dayPlan.length)) * 100);
}

export function getReadinessGain(attempts: MissionAttemptRecord[], reviewItems: PersistedReviewItem[]) {
  if (attempts.length === 0) {
    return 0;
  }

  const correctRate = attempts.filter((attempt) => attempt.isCorrect).length / attempts.length;
  const reviewResolution = getReviewResolutionStats(reviewItems).resolutionPercent / 100;
  return Math.min(99, Math.round(correctRate * 70 + reviewResolution * 30));
}

export function getRewardBadgesFromLiveData(
  rewardBadges: RewardBadge[],
  attempts: MissionAttemptRecord[],
  reviewItems: PersistedReviewItem[],
  studyProgress: StudyProgress
) {
  const streak = getCurrentStreak(studyProgress);
  const { resolved } = getReviewResolutionStats(reviewItems);
  const accuracy = attempts.length
    ? Math.round((attempts.filter((attempt) => attempt.isCorrect).length / attempts.length) * 100)
    : 0;

  return rewardBadges.map((badge) => {
    if (badge.id === "b1") {
      return {
        ...badge,
        earned: streak >= 5,
        detail: `Complete five daily mission days in a row. Current: ${streak}/5.`
      };
    }

    if (badge.id === "b2") {
      return {
        ...badge,
        earned: resolved >= 6,
        detail: `Resolve 6 review items through successful retry. Current: ${resolved}/6.`
      };
    }

    if (badge.id === "b3") {
      return {
        ...badge,
        earned: studyProgress.currentDay >= 13,
        detail: `Reach Day 13 to clear the second checkpoint. Current day: ${studyProgress.currentDay}.`
      };
    }

    return {
      ...badge,
      earned: accuracy >= 75 && attempts.length >= 8,
      detail: `Reach 75% overall accuracy across saved attempts. Current: ${accuracy}% across ${attempts.length} attempts.`
    };
  });
}
