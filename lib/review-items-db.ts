import { prisma } from "@/lib/prisma";
import { seedReviewItems } from "@/lib/review-seeds";
import type { PersistedReviewItem, ReviewItem } from "@/lib/types";

function toPersistedItem(item: ReviewItem): PersistedReviewItem {
  return {
    ...item,
    questionId: null,
    source: "seed",
    status: item.retryReady ? "ready" : "new"
  };
}

function normalizeItem(item: {
  id: string;
  questionId: string | null;
  prompt: string;
  skill: string;
  errorType: string;
  lastSeen: string;
  section: string;
  retryReady: boolean;
  source: string;
  status: string;
}): PersistedReviewItem {
  return {
    id: item.id,
    questionId: item.questionId,
    prompt: item.prompt,
    skill: item.skill,
    errorType: item.errorType,
    lastSeen: item.lastSeen,
    section: item.section,
    retryReady: item.retryReady,
    source: item.source as PersistedReviewItem["source"],
    status: item.status as PersistedReviewItem["status"]
  };
}

export async function readReviewItemsFromDb() {
  const existing = await prisma.reviewItem.findMany({
    where: { userProfileId: 1 },
    orderBy: [{ createdAt: "asc" }]
  });

  if (existing.length > 0) {
    return existing.map(normalizeItem);
  }

  const seeds = seedReviewItems.map(toPersistedItem);

  await prisma.reviewItem.createMany({
    data: seeds.map((item) => ({
      id: item.id,
      questionId: item.questionId,
      prompt: item.prompt,
      skill: item.skill,
      errorType: item.errorType,
      lastSeen: item.lastSeen,
      section: item.section,
      retryReady: item.retryReady,
      source: item.source,
      status: item.status,
      userProfileId: 1
    })),
    skipDuplicates: true
  });

  return seeds;
}

export async function upsertReviewItemInDb(item: PersistedReviewItem) {
  const saved = await prisma.reviewItem.upsert({
    where: { id: item.id },
    update: {
      questionId: item.questionId,
      prompt: item.prompt,
      skill: item.skill,
      errorType: item.errorType,
      lastSeen: item.lastSeen,
      section: item.section,
      retryReady: item.retryReady,
      source: item.source,
      status: item.status
    },
    create: {
      id: item.id,
      questionId: item.questionId,
      prompt: item.prompt,
      skill: item.skill,
      errorType: item.errorType,
      lastSeen: item.lastSeen,
      section: item.section,
      retryReady: item.retryReady,
      source: item.source,
      status: item.status,
      userProfileId: 1
    }
  });

  return normalizeItem(saved);
}

export async function deleteReviewItemFromDb(id: string) {
  await prisma.reviewItem.delete({
    where: { id }
  }).catch(() => undefined);
}

export async function clearActiveReviewItemsInDb() {
  await prisma.reviewItem.deleteMany({
    where: {
      userProfileId: 1,
      source: {
        in: ["missed", "flagged"]
      }
    }
  });
}

export async function clearAllReviewItemsInDb() {
  await prisma.reviewItem.deleteMany({
    where: { userProfileId: 1 }
  });
}
