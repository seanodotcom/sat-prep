import { prisma } from "@/lib/prisma";
import type { MissionAttemptRecord } from "@/lib/types";

export async function upsertMissionAttemptInDb(attempt: MissionAttemptRecord) {
  const saved = await prisma.missionAttempt.upsert({
    where: { id: attempt.id },
    update: {
      selectedChoice: attempt.selectedChoice,
      isCorrect: attempt.isCorrect,
      elapsedSec: attempt.elapsedSec
    },
    create: {
      id: attempt.id,
      questionId: attempt.questionId,
      day: attempt.day,
      stepId: attempt.stepId,
      section: attempt.section,
      skill: attempt.skill,
      selectedChoice: attempt.selectedChoice,
      isCorrect: attempt.isCorrect,
      elapsedSec: attempt.elapsedSec,
      userProfileId: 1
    }
  });

  return {
    id: saved.id,
    questionId: saved.questionId,
    day: saved.day,
    stepId: saved.stepId,
    section: saved.section as MissionAttemptRecord["section"],
    skill: saved.skill,
    selectedChoice: saved.selectedChoice,
    isCorrect: saved.isCorrect,
    elapsedSec: saved.elapsedSec,
    createdAt: saved.createdAt.toISOString()
  } satisfies MissionAttemptRecord;
}

export async function readMissionAttemptsFromDb() {
  const attempts = await prisma.missionAttempt.findMany({
    where: { userProfileId: 1 },
    orderBy: [{ createdAt: "desc" }]
  });

  return attempts.map((attempt) => ({
    id: attempt.id,
    questionId: attempt.questionId,
    day: attempt.day,
    stepId: attempt.stepId,
    section: attempt.section as MissionAttemptRecord["section"],
    skill: attempt.skill,
    selectedChoice: attempt.selectedChoice,
    isCorrect: attempt.isCorrect,
    elapsedSec: attempt.elapsedSec,
    createdAt: attempt.createdAt.toISOString()
  })) satisfies MissionAttemptRecord[];
}

export async function clearMissionAttemptsInDb() {
  await prisma.missionAttempt.deleteMany({
    where: { userProfileId: 1 }
  });
}
