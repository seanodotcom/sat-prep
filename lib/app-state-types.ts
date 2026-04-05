import {
  defaultMissionProgress,
  defaultOnboardingPreferences,
  defaultStudyProgress,
  type OnboardingPreferences,
  type StoredMissionProgress,
  type StudyProgress
} from "@/lib/storage";

export type AppStateRecord = {
  onboardingPreferences: OnboardingPreferences;
  studyProgress: StudyProgress;
  missionProgress: StoredMissionProgress;
};

export const defaultAppState: AppStateRecord = {
  onboardingPreferences: defaultOnboardingPreferences,
  studyProgress: defaultStudyProgress,
  missionProgress: defaultMissionProgress
};
