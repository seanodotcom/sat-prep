"use client";

import {
  loadOnboardingPreferences,
  loadStudyProgress,
  loadMissionProgress,
  saveOnboardingPreferences,
  saveStudyProgress,
  saveMissionProgress,
  type OnboardingPreferences,
  type StudyProgress,
  type StoredMissionProgress
} from "@/lib/storage";

export const APP_STATE_SYNC_EVENT = "summit-sat-app-state-sync";

export type ClientAppState = {
  onboardingPreferences: OnboardingPreferences;
  studyProgress: StudyProgress;
  missionProgress: StoredMissionProgress;
};

function isEqual<T>(left: T, right: T) {
  return JSON.stringify(left) === JSON.stringify(right);
}

function emitAppStateSync() {
  window.dispatchEvent(new Event(APP_STATE_SYNC_EVENT));
}

async function updateAppStateOnServer(body: Partial<ClientAppState>) {
  const response = await fetch("/api/app-state", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    throw new Error("Unable to persist app state");
  }

  const data = (await response.json()) as ClientAppState;
  saveOnboardingPreferences(data.onboardingPreferences);
  saveStudyProgress(data.studyProgress);
  saveMissionProgress(data.missionProgress);
  emitAppStateSync();

  return data;
}

export function readClientAppState(): ClientAppState {
  return {
    onboardingPreferences: loadOnboardingPreferences(),
    studyProgress: loadStudyProgress(),
    missionProgress: loadMissionProgress()
  };
}

export function subscribeToAppStateSync(onSync: () => void) {
  window.addEventListener(APP_STATE_SYNC_EVENT, onSync);
  return () => window.removeEventListener(APP_STATE_SYNC_EVENT, onSync);
}

export async function syncAppStateFromServer() {
  const response = await fetch("/api/app-state", {
    method: "GET",
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error("Unable to sync app state");
  }

  const data = (await response.json()) as ClientAppState;
  const current = readClientAppState();

  if (!isEqual(current.onboardingPreferences, data.onboardingPreferences)) {
    saveOnboardingPreferences(data.onboardingPreferences);
  }

  if (!isEqual(current.studyProgress, data.studyProgress)) {
    saveStudyProgress(data.studyProgress);
  }

  if (!isEqual(current.missionProgress, data.missionProgress)) {
    saveMissionProgress(data.missionProgress);
  }

  if (
    !isEqual(current.onboardingPreferences, data.onboardingPreferences) ||
    !isEqual(current.studyProgress, data.studyProgress) ||
    !isEqual(current.missionProgress, data.missionProgress)
  ) {
    emitAppStateSync();
  }

  return data;
}

export async function persistOnboardingPreferences(value: OnboardingPreferences) {
  if (isEqual(loadOnboardingPreferences(), value)) {
    return readClientAppState();
  }

  saveOnboardingPreferences(value);
  emitAppStateSync();

  return updateAppStateOnServer({
    onboardingPreferences: value
  });
}

export async function persistStudyProgress(value: StudyProgress) {
  if (isEqual(loadStudyProgress(), value)) {
    return readClientAppState();
  }

  saveStudyProgress(value);
  emitAppStateSync();

  return updateAppStateOnServer({
    studyProgress: value
  });
}

export async function persistMissionProgress(value: StoredMissionProgress) {
  if (isEqual(loadMissionProgress(), value)) {
    return readClientAppState();
  }

  saveMissionProgress(value);
  emitAppStateSync();

  return updateAppStateOnServer({
    missionProgress: value
  });
}
