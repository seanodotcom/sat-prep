export const MISSION_PROGRESS_KEY = "summit-sat-mission-progress";
export const ONBOARDING_PREFERENCES_KEY = "summit-sat-onboarding-preferences";
export const STUDY_PROGRESS_KEY = "summit-sat-study-progress";
export const APP_STORAGE_KEYS = [
  MISSION_PROGRESS_KEY,
  ONBOARDING_PREFERENCES_KEY,
  STUDY_PROGRESS_KEY
] as const;

export type StoredMissionProgress = {
  currentStepIndex: number;
  questionIndex: number;
  selectedChoice: string | null;
  submitted: boolean;
  answeredQuestionIds: string[];
  correctCount: number;
  flaggedQuestionIds: string[];
  reviewQuestionIds: string[];
};

export const defaultMissionProgress: StoredMissionProgress = {
  currentStepIndex: 0,
  questionIndex: 0,
  selectedChoice: null,
  submitted: false,
  answeredQuestionIds: [],
  correctCount: 0,
  flaggedQuestionIds: [],
  reviewQuestionIds: []
};

export type OnboardingPreferences = {
  firstName: string;
  targetScore: number;
  targetTestDate: string;
  preferredDailyMinutes: number;
  focusSection: "Math" | "Reading & Writing";
};

export const defaultOnboardingPreferences: OnboardingPreferences = {
  firstName: "",
  targetScore: 1400,
  targetTestDate: "",
  preferredDailyMinutes: 20,
  focusSection: "Math"
};

export type StudyProgress = {
  currentDay: number;
  completedDays: number[];
};

export const defaultStudyProgress: StudyProgress = {
  currentDay: 1,
  completedDays: []
};
