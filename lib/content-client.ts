"use client";

import { seedPlanDays, seedQuestions } from "@/lib/content-seeds";
import type { ContentState } from "@/lib/content";
import type { PlanDayContent, Question } from "@/lib/types";

const QUESTION_BANK_KEY = "summit-sat-question-bank";
const PLAN_DAYS_KEY = "summit-sat-plan-days";
export const CONTENT_SYNC_EVENT = "summit-sat-content-sync";

function emitContentSync() {
  window.dispatchEvent(new Event(CONTENT_SYNC_EVENT));
}

function saveQuestions(questions: Question[]) {
  window.localStorage.setItem(QUESTION_BANK_KEY, JSON.stringify(questions));
}

function savePlanDays(planDays: PlanDayContent[]) {
  window.localStorage.setItem(PLAN_DAYS_KEY, JSON.stringify(planDays));
}

function isEqual<T>(left: T, right: T) {
  return JSON.stringify(left) === JSON.stringify(right);
}

export function loadQuestions() {
  const stored = window.localStorage.getItem(QUESTION_BANK_KEY);
  if (!stored) return seedQuestions;

  try {
    return JSON.parse(stored) as Question[];
  } catch {
    return seedQuestions;
  }
}

export function loadPlanDays() {
  const stored = window.localStorage.getItem(PLAN_DAYS_KEY);
  if (!stored) return seedPlanDays;

  try {
    return JSON.parse(stored) as PlanDayContent[];
  } catch {
    return seedPlanDays;
  }
}

export function readClientContentState(): ContentState {
  return {
    questions: loadQuestions(),
    planDays: loadPlanDays()
  };
}

export function subscribeToContentSync(onSync: () => void) {
  window.addEventListener(CONTENT_SYNC_EVENT, onSync);
  return () => window.removeEventListener(CONTENT_SYNC_EVENT, onSync);
}

export async function syncContentFromServer() {
  const response = await fetch("/api/content", {
    method: "GET",
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error("Unable to sync content");
  }

  const data = (await response.json()) as ContentState;
  const current = readClientContentState();

  if (!isEqual(current.questions, data.questions)) {
    saveQuestions(data.questions);
  }

  if (!isEqual(current.planDays, data.planDays)) {
    savePlanDays(data.planDays);
  }

  if (!isEqual(current.questions, data.questions) || !isEqual(current.planDays, data.planDays)) {
    emitContentSync();
  }

  return data;
}

export async function upsertQuestionContent(value: Question) {
  const nextQuestions = [...loadQuestions().filter((question) => question.id !== value.id), value].sort((a, b) =>
    a.id.localeCompare(b.id)
  );
  saveQuestions(nextQuestions);
  emitContentSync();

  const response = await fetch("/api/content", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      type: "question",
      value
    })
  });

  if (!response.ok) {
    throw new Error("Unable to save question content");
  }

  return syncContentFromServer();
}

export async function upsertPlanDayContent(value: PlanDayContent) {
  const nextPlanDays = [...loadPlanDays().filter((planDay) => planDay.day !== value.day), value].sort(
    (a, b) => a.day - b.day
  );
  savePlanDays(nextPlanDays);
  emitContentSync();

  const response = await fetch("/api/content", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      type: "planDay",
      value
    })
  });

  if (!response.ok) {
    throw new Error("Unable to save plan day content");
  }

  return syncContentFromServer();
}
