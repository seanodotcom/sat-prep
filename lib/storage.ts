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

export function hasCompletedOnboarding(preferences: OnboardingPreferences) {
  return preferences.firstName.trim().length > 0;
}

export type StudyProgress = {
  currentDay: number;
  completedDays: number[];
};

export const defaultStudyProgress: StudyProgress = {
  currentDay: 1,
  completedDays: []
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function mergeStoredValue<T>(fallback: T, parsed: unknown): T {
  if (isRecord(fallback) && isRecord(parsed)) {
    return {
      ...fallback,
      ...parsed
    } as T;
  }

  return (parsed as T) ?? fallback;
}

function readStorage<T>(key: string, fallback: T) {
  if (typeof window === "undefined") {
    return fallback;
  }

  const stored = window.localStorage.getItem(key);
  if (!stored) {
    return fallback;
  }

  return mergeStoredValue(fallback, JSON.parse(stored));
}

export function loadMissionProgress() {
  return readStorage(MISSION_PROGRESS_KEY, defaultMissionProgress);
}

export function saveMissionProgress(value: StoredMissionProgress) {
  window.localStorage.setItem(MISSION_PROGRESS_KEY, JSON.stringify(value));
}

export function clearMissionProgress() {
  window.localStorage.removeItem(MISSION_PROGRESS_KEY);
}

export function loadOnboardingPreferences() {
  return readStorage(ONBOARDING_PREFERENCES_KEY, defaultOnboardingPreferences);
}

export function saveOnboardingPreferences(value: OnboardingPreferences) {
  window.localStorage.setItem(ONBOARDING_PREFERENCES_KEY, JSON.stringify(value));
}

export function clearOnboardingPreferences() {
  window.localStorage.removeItem(ONBOARDING_PREFERENCES_KEY);
}

export function loadStudyProgress() {
  return readStorage(STUDY_PROGRESS_KEY, defaultStudyProgress);
}

export function saveStudyProgress(value: StudyProgress) {
  window.localStorage.setItem(STUDY_PROGRESS_KEY, JSON.stringify(value));
}

export function clearStudyProgress() {
  window.localStorage.removeItem(STUDY_PROGRESS_KEY);
}

export function clearAppStorage() {
  APP_STORAGE_KEYS.forEach((key) => window.localStorage.removeItem(key));
}
