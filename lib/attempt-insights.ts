import type { MissionAttemptRecord } from "@/lib/types";

function roundPercent(value: number) {
  return Math.round(value * 100);
}

export function getSectionAccuracy(
  attempts: MissionAttemptRecord[],
  section: MissionAttemptRecord["section"]
) {
  const filtered = attempts.filter((attempt) => attempt.section === section);
  const correct = filtered.filter((attempt) => attempt.isCorrect).length;
  const total = filtered.length;

  return {
    accuracy: total === 0 ? 0 : roundPercent(correct / total),
    total
  };
}

export function getAveragePace(attempts: MissionAttemptRecord[]) {
  const timedAttempts = attempts.filter((attempt) => attempt.elapsedSec > 0);
  if (timedAttempts.length === 0) {
    return {
      avgPaceSec: 0,
      timedCount: 0
    };
  }

  return {
    avgPaceSec: Math.round(
      timedAttempts.reduce((sum, attempt) => sum + attempt.elapsedSec, 0) / timedAttempts.length
    ),
    timedCount: timedAttempts.length
  };
}
