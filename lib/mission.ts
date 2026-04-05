import { seedPlanDays } from "@/lib/content-seeds";
import {
  defaultMissionProgress,
  defaultStudyProgress,
  type StoredMissionProgress,
  type StudyProgress
} from "@/lib/storage";
import type { PlanDayContent } from "@/lib/types";

export function getMissionSnapshot(progress: StoredMissionProgress = defaultMissionProgress) {
  const totalSteps = seedPlanDays[0]?.missionConfig.steps.length ?? 4;
  const currentStepIndex = Math.min(progress.currentStepIndex, totalSteps);
  const activeStep = seedPlanDays[0]?.missionConfig.steps[Math.min(currentStepIndex, totalSteps - 1)];
  const completedSteps = Math.min(currentStepIndex, totalSteps);
  const flowPercent = Math.round((completedSteps / totalSteps) * 100);

  const primaryLabel =
    currentStepIndex >= totalSteps
      ? "Restart mission"
      : currentStepIndex === 0
        ? "Start mission"
        : "Resume mission";

  const statusLabel =
    currentStepIndex >= totalSteps
      ? "Mission complete"
      : `Step ${currentStepIndex + 1} of ${totalSteps}`;

  return {
    activeStep,
    completedSteps,
    flowPercent,
    primaryLabel,
    statusLabel,
    totalSteps
  };
}

export function getCurrentDayProgress(progress: StudyProgress = defaultStudyProgress) {
  return getCurrentDayProgressFromPlan(progress);
}

export function getCurrentDayProgressFromPlan(
  progress: StudyProgress = defaultStudyProgress,
  planDays: PlanDayContent[] = seedPlanDays
) {
  const normalizedPlanDays = planDays.length ? planDays : seedPlanDays;
  const currentDay = Math.min(progress.currentDay, normalizedPlanDays.length);
  const totalDays = normalizedPlanDays.length;
  const currentPlan = normalizedPlanDays[currentDay - 1] ?? normalizedPlanDays[0];

  return {
    currentDay,
    totalDays,
    progressPercent: Math.round((currentDay / totalDays) * 100),
    currentPlan
  };
}

export function getUpcomingDayPreview(progress: StudyProgress = defaultStudyProgress) {
  return getUpcomingDayPreviewFromPlan(progress);
}

export function getUpcomingDayPreviewFromPlan(
  progress: StudyProgress = defaultStudyProgress,
  planDays: PlanDayContent[] = seedPlanDays
) {
  const normalizedPlanDays = planDays.length ? planDays : seedPlanDays;
  const { currentDay, totalDays, currentPlan } = getCurrentDayProgressFromPlan(progress, normalizedPlanDays);
  const nextDay = Math.min(currentDay + 1, totalDays);
  const nextPlan = normalizedPlanDays[nextDay - 1] ?? currentPlan;
  const hasUpcomingDay = currentDay < totalDays;

  return {
    hasUpcomingDay,
    nextDay,
    nextPlan
  };
}

export function getDayRationale(day: number) {
  return getDayRationaleFromPlan(day);
}

export function getDayRationaleFromPlan(day: number, planDays: PlanDayContent[] = seedPlanDays) {
  const normalizedPlanDays = planDays.length ? planDays : seedPlanDays;
  return (
    normalizedPlanDays.find((item) => item.day === day)?.rationale ??
    "This day continues the 30-day sequence with one clear focus so the routine stays understandable and repeatable."
  );
}
