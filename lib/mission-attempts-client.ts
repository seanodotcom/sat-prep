"use client";

import type { MissionAttemptRecord } from "@/lib/types";

const MISSION_ATTEMPTS_KEY = "summit-sat-mission-attempts";
export const MISSION_ATTEMPTS_SYNC_EVENT = "summit-sat-mission-attempts-sync";

function emitMissionAttemptsSync() {
  window.dispatchEvent(new Event(MISSION_ATTEMPTS_SYNC_EVENT));
}

function saveMissionAttempts(attempts: MissionAttemptRecord[]) {
  window.localStorage.setItem(MISSION_ATTEMPTS_KEY, JSON.stringify(attempts));
}

export function clearStoredMissionAttempts() {
  window.localStorage.removeItem(MISSION_ATTEMPTS_KEY);
}

export function loadMissionAttempts() {
  const stored = window.localStorage.getItem(MISSION_ATTEMPTS_KEY);
  if (!stored) return [] as MissionAttemptRecord[];

  try {
    return JSON.parse(stored) as MissionAttemptRecord[];
  } catch {
    return [] as MissionAttemptRecord[];
  }
}

export function subscribeToMissionAttemptsSync(onSync: () => void) {
  window.addEventListener(MISSION_ATTEMPTS_SYNC_EVENT, onSync);
  return () => window.removeEventListener(MISSION_ATTEMPTS_SYNC_EVENT, onSync);
}

export async function syncMissionAttemptsFromServer() {
  const response = await fetch("/api/mission-attempts", {
    method: "GET",
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error("Unable to load mission attempts");
  }

  const attempts = (await response.json()) as MissionAttemptRecord[];
  saveMissionAttempts(attempts);
  emitMissionAttemptsSync();
  return attempts;
}

export async function upsertMissionAttempt(attempt: MissionAttemptRecord) {
  const local = loadMissionAttempts();
  saveMissionAttempts([...local.filter((entry) => entry.id !== attempt.id), attempt]);
  emitMissionAttemptsSync();

  const response = await fetch("/api/mission-attempts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(attempt)
  });

  if (!response.ok) {
    throw new Error("Unable to save mission attempt");
  }

  return syncMissionAttemptsFromServer();
}

export async function clearMissionAttempts() {
  clearStoredMissionAttempts();
  emitMissionAttemptsSync();

  const response = await fetch("/api/mission-attempts", {
    method: "DELETE"
  });

  if (!response.ok) {
    throw new Error("Unable to clear mission attempts");
  }

  return [] as MissionAttemptRecord[];
}
