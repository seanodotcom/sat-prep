import { dayPlan, dayRationales, missionSteps } from "@/data/mock-data";
import {
  defaultMissionProgress,
  defaultStudyProgress,
  type StoredMissionProgress,
  type StudyProgress
} from "@/lib/storage";

export function getMissionSnapshot(progress: StoredMissionProgress = defaultMissionProgress) {
  const totalSteps = missionSteps.length;
  const currentStepIndex = Math.min(progress.currentStepIndex, totalSteps);
  const activeStep = missionSteps[Math.min(currentStepIndex, totalSteps - 1)];
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
  const currentDay = Math.min(progress.currentDay, dayPlan.length);
  const totalDays = dayPlan.length;
  const currentPlan = dayPlan[currentDay - 1] ?? dayPlan[0];

  return {
    currentDay,
    totalDays,
    progressPercent: Math.round((currentDay / totalDays) * 100),
    currentPlan
  };
}

export function getUpcomingDayPreview(progress: StudyProgress = defaultStudyProgress) {
  const { currentDay, totalDays, currentPlan } = getCurrentDayProgress(progress);
  const nextDay = Math.min(currentDay + 1, totalDays);
  const nextPlan = dayPlan[nextDay - 1] ?? currentPlan;
  const hasUpcomingDay = currentDay < totalDays;

  return {
    hasUpcomingDay,
    nextDay,
    nextPlan
  };
}

export function getDayRationale(day: number) {
  return (
    dayRationales[day] ??
    "This day continues the 30-day sequence with one clear focus so the routine stays understandable and repeatable."
  );
}
