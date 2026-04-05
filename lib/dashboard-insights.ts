import type { MissionAttemptRecord } from "@/lib/types";
import type { StudyProgress } from "@/lib/storage";

export function getCurrentStreak(studyProgress: StudyProgress) {
  const completed = [...new Set(studyProgress.completedDays)].sort((a, b) => a - b);
  if (completed.length === 0) {
    return 0;
  }

  let streak = 1;

  for (let index = completed.length - 1; index > 0; index -= 1) {
    if (completed[index] - completed[index - 1] !== 1) {
      break;
    }

    streak += 1;
  }

  return streak;
}

export function getQuestionsSolved(attempts: MissionAttemptRecord[]) {
  return attempts.length;
}
