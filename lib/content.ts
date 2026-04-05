import { seedPlanDays, seedQuestions } from "@/lib/content-seeds";
import type {
  MissionDayConfig,
  MissionQuestionSet,
  PlanDayContent,
  Question
} from "@/lib/types";
import type { StudyProgress } from "@/lib/storage";

export type ContentState = {
  questions: Question[];
  planDays: PlanDayContent[];
};

export function hydrateMissionConfig(
  planDay: PlanDayContent,
  questions: Question[] = seedQuestions
): MissionDayConfig {
  const questionMap = new Map(questions.map((question) => [question.id, question]));

  const questionSets: MissionQuestionSet[] = planDay.missionConfig.questionSets.map((set) => ({
    stepId: set.stepId,
    introLabel: set.introLabel,
    questions: set.questionIds
      .map((questionId) => questionMap.get(questionId))
      .filter((question): question is Question => Boolean(question))
  }));

  return {
    ...planDay.missionConfig,
    questionSets
  };
}

export function getCurrentDayProgressFromPlan(
  progress: StudyProgress,
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

export function getUpcomingDayPreviewFromPlan(
  progress: StudyProgress,
  planDays: PlanDayContent[] = seedPlanDays
) {
  const { currentDay, totalDays, currentPlan } = getCurrentDayProgressFromPlan(progress, planDays);
  const normalizedPlanDays = planDays.length ? planDays : seedPlanDays;
  const nextDay = Math.min(currentDay + 1, totalDays);
  const nextPlan = normalizedPlanDays[nextDay - 1] ?? currentPlan;
  const hasUpcomingDay = currentDay < totalDays;

  return {
    hasUpcomingDay,
    nextDay,
    nextPlan
  };
}

export function getDayRationaleFromPlan(day: number, planDays: PlanDayContent[] = seedPlanDays) {
  const normalizedPlanDays = planDays.length ? planDays : seedPlanDays;
  return (
    normalizedPlanDays.find((item) => item.day === day)?.rationale ??
    "This day continues the sequence with one clear focus so the routine stays understandable and repeatable."
  );
}
