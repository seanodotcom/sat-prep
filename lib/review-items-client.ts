"use client";

import type { PersistedReviewItem } from "@/lib/types";

export const REVIEW_ITEMS_SYNC_EVENT = "summit-sat-review-items-sync";
const REVIEW_ITEMS_KEY = "summit-sat-review-items";

function emitReviewItemsSync() {
  window.dispatchEvent(new Event(REVIEW_ITEMS_SYNC_EVENT));
}

function saveReviewItems(items: PersistedReviewItem[]) {
  window.localStorage.setItem(REVIEW_ITEMS_KEY, JSON.stringify(items));
}

export function loadReviewItems(): PersistedReviewItem[] {
  const stored = window.localStorage.getItem(REVIEW_ITEMS_KEY);
  if (!stored) return [];

  try {
    return JSON.parse(stored) as PersistedReviewItem[];
  } catch {
    return [];
  }
}

export function subscribeToReviewItemsSync(onSync: () => void) {
  window.addEventListener(REVIEW_ITEMS_SYNC_EVENT, onSync);
  return () => window.removeEventListener(REVIEW_ITEMS_SYNC_EVENT, onSync);
}

export async function syncReviewItemsFromServer() {
  const response = await fetch("/api/review-items", {
    method: "GET",
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error("Unable to load review items");
  }

  const items = (await response.json()) as PersistedReviewItem[];
  saveReviewItems(items);
  emitReviewItemsSync();
  return items;
}

export async function upsertReviewItem(item: PersistedReviewItem) {
  const local = loadReviewItems();
  saveReviewItems([...local.filter((entry) => entry.id !== item.id), item]);
  emitReviewItemsSync();

  const response = await fetch("/api/review-items", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(item)
  });

  if (!response.ok) {
    throw new Error("Unable to save review item");
  }

  return syncReviewItemsFromServer();
}

export async function deleteReviewItem(id: string) {
  saveReviewItems(loadReviewItems().filter((item) => item.id !== id));
  emitReviewItemsSync();

  const response = await fetch(`/api/review-items?id=${encodeURIComponent(id)}`, {
    method: "DELETE"
  });

  if (!response.ok) {
    throw new Error("Unable to delete review item");
  }

  return syncReviewItemsFromServer();
}

export async function clearSessionReviewItems() {
  saveReviewItems(
    loadReviewItems().filter((item) => !["missed", "flagged"].includes(item.source))
  );
  emitReviewItemsSync();

  const response = await fetch("/api/review-items?scope=session", {
    method: "DELETE"
  });

  if (!response.ok) {
    throw new Error("Unable to clear session review items");
  }

  return syncReviewItemsFromServer();
}

export async function resolveReviewItem(item: PersistedReviewItem) {
  return upsertReviewItem({
    ...item,
    retryReady: false,
    status: "resolved",
    lastSeen: "Today"
  });
}
