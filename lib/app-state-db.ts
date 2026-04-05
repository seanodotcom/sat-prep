import { prisma } from "@/lib/prisma";
import type { AppStateRecord } from "@/lib/app-state-types";
import {
  defaultOnboardingPreferences,
  defaultMissionProgress,
  defaultStudyProgress,
  type OnboardingPreferences,
  type StoredMissionProgress,
  type StudyProgress
} from "@/lib/storage";

function toFocusSection(
  value: OnboardingPreferences["focusSection"]
): "MATH" | "READING_WRITING" {
  return value === "Reading & Writing" ? "READING_WRITING" : "MATH";
}

function fromFocusSection(value: "MATH" | "READING_WRITING"): OnboardingPreferences["focusSection"] {
  return value === "READING_WRITING" ? "Reading & Writing" : "Math";
}

function normalizeCompletedDays(value: unknown): number[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is number => typeof item === "number");
}

function normalizeQuestionIds(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string => typeof item === "string");
}

export async function readAppStateFromDb(): Promise<AppStateRecord> {
  const userProfile = await prisma.userProfile.findUnique({
    where: { id: 1 },
    include: { studyProgress: true, missionProgress: true }
  });

  if (!userProfile) {
    return {
      onboardingPreferences: defaultOnboardingPreferences,
      studyProgress: defaultStudyProgress,
      missionProgress: defaultMissionProgress
    };
  }

  return {
    onboardingPreferences: {
      firstName: userProfile.firstName,
      targetScore: userProfile.targetScore,
      targetTestDate: userProfile.targetTestDate
        ? userProfile.targetTestDate.toISOString().slice(0, 10)
        : "",
      preferredDailyMinutes: userProfile.preferredDailyMinutes,
      focusSection: fromFocusSection(userProfile.focusSection)
    },
    studyProgress: userProfile.studyProgress
      ? {
          currentDay: userProfile.studyProgress.currentDay,
          completedDays: normalizeCompletedDays(userProfile.studyProgress.completedDays)
        }
      : defaultStudyProgress,
    missionProgress: userProfile.missionProgress
      ? {
          currentStepIndex: userProfile.missionProgress.currentStepIndex,
          questionIndex: userProfile.missionProgress.questionIndex,
          selectedChoice: userProfile.missionProgress.selectedChoice,
          submitted: userProfile.missionProgress.submitted,
          answeredQuestionIds: normalizeQuestionIds(userProfile.missionProgress.answeredQuestionIds),
          correctCount: userProfile.missionProgress.correctCount,
          flaggedQuestionIds: normalizeQuestionIds(userProfile.missionProgress.flaggedQuestionIds),
          reviewQuestionIds: normalizeQuestionIds(userProfile.missionProgress.reviewQuestionIds)
        }
      : defaultMissionProgress
  };
}

export async function updateAppStateInDb(partial: Partial<AppStateRecord>) {
  const nextOnboarding = partial.onboardingPreferences;
  const nextStudyProgress = partial.studyProgress;
  const nextMissionProgress = partial.missionProgress;

  await prisma.userProfile.upsert({
    where: { id: 1 },
    update: nextOnboarding
      ? {
          firstName: nextOnboarding.firstName,
          targetScore: nextOnboarding.targetScore,
          targetTestDate: nextOnboarding.targetTestDate
            ? new Date(`${nextOnboarding.targetTestDate}T12:00:00`)
            : null,
          preferredDailyMinutes: nextOnboarding.preferredDailyMinutes,
          focusSection: toFocusSection(nextOnboarding.focusSection)
        }
      : {},
    create: {
      id: 1,
      firstName: nextOnboarding?.firstName ?? defaultOnboardingPreferences.firstName,
      targetScore: nextOnboarding?.targetScore ?? defaultOnboardingPreferences.targetScore,
      targetTestDate: nextOnboarding?.targetTestDate
        ? new Date(`${nextOnboarding.targetTestDate}T12:00:00`)
        : null,
      preferredDailyMinutes:
        nextOnboarding?.preferredDailyMinutes ?? defaultOnboardingPreferences.preferredDailyMinutes,
      focusSection: toFocusSection(
        nextOnboarding?.focusSection ?? defaultOnboardingPreferences.focusSection
      )
    }
  });

  if (nextStudyProgress) {
    await prisma.studyProgress.upsert({
      where: { id: 1 },
      update: {
        currentDay: nextStudyProgress.currentDay,
        completedDays: nextStudyProgress.completedDays
      },
      create: {
        id: 1,
        currentDay: nextStudyProgress.currentDay,
        completedDays: nextStudyProgress.completedDays,
        userProfileId: 1
      }
    });
  }

  if (nextMissionProgress) {
    await prisma.missionProgress.upsert({
      where: { id: 1 },
      update: {
        currentStepIndex: nextMissionProgress.currentStepIndex,
        questionIndex: nextMissionProgress.questionIndex,
        selectedChoice: nextMissionProgress.selectedChoice,
        submitted: nextMissionProgress.submitted,
        answeredQuestionIds: nextMissionProgress.answeredQuestionIds,
        correctCount: nextMissionProgress.correctCount,
        flaggedQuestionIds: nextMissionProgress.flaggedQuestionIds,
        reviewQuestionIds: nextMissionProgress.reviewQuestionIds
      },
      create: {
        id: 1,
        currentStepIndex: nextMissionProgress.currentStepIndex,
        questionIndex: nextMissionProgress.questionIndex,
        selectedChoice: nextMissionProgress.selectedChoice,
        submitted: nextMissionProgress.submitted,
        answeredQuestionIds: nextMissionProgress.answeredQuestionIds,
        correctCount: nextMissionProgress.correctCount,
        flaggedQuestionIds: nextMissionProgress.flaggedQuestionIds,
        reviewQuestionIds: nextMissionProgress.reviewQuestionIds,
        userProfileId: 1
      }
    });
  }

  return readAppStateFromDb();
}
