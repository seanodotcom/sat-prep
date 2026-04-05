import { allMissionQuestions } from "@/data/mock-data";
import type { MissionAttemptRecord, PersistedReviewItem, RewardBadge, SkillMetric } from "@/lib/types";

export function getReviewResolutionStats(items: PersistedReviewItem[]) {
  const tracked = items.filter((item) => item.source !== "seed");
  const resolved = tracked.filter((item) => item.status === "resolved").length;
  const active = tracked.filter((item) => item.status !== "resolved").length;
  const total = resolved + active;

  return {
    resolved,
    active,
    total,
    resolutionPercent: total === 0 ? 0 : Math.round((resolved / total) * 100)
  };
}

export function getSkillMetricsFromReviewItems(
  items: PersistedReviewItem[],
  attempts: MissionAttemptRecord[] = []
): SkillMetric[] {
  const backlogBySkill = new Map<string, number>();
  const resolvedBySkill = new Map<string, number>();
  const attemptsBySkill = new Map<string, MissionAttemptRecord[]>();

  items.forEach((item) => {
    if (item.source === "seed") return;

    if (item.status === "resolved") {
      resolvedBySkill.set(item.skill, (resolvedBySkill.get(item.skill) ?? 0) + 1);
    } else {
      backlogBySkill.set(item.skill, (backlogBySkill.get(item.skill) ?? 0) + 1);
    }
  });

  attempts.forEach((attempt) => {
    const current = attemptsBySkill.get(attempt.skill) ?? [];
    attemptsBySkill.set(attempt.skill, [...current, attempt]);
  });

  const catalog = Array.from(
    new Map(
      allMissionQuestions.map((question) => [
        question.skill,
        {
          skill: question.skill,
          accuracy: 70,
          avgTimeSec: question.estimatedTimeSec,
          backlog: 0,
          trend: "steady" as const
        }
      ])
    ).values()
  );

  return catalog.map((metric) => {
    const backlog = backlogBySkill.get(metric.skill) ?? 0;
    const resolved = resolvedBySkill.get(metric.skill) ?? 0;
    const skillAttempts = attemptsBySkill.get(metric.skill) ?? [];
    const attemptAccuracy =
      skillAttempts.length > 0
        ? Math.round(
            (skillAttempts.filter((attempt) => attempt.isCorrect).length / skillAttempts.length) * 100
          )
        : metric.accuracy;
    const timedAttempts = skillAttempts.filter((attempt) => attempt.elapsedSec > 0);
    const avgTimeSec =
      timedAttempts.length > 0
        ? Math.round(
            timedAttempts.reduce((sum, attempt) => sum + attempt.elapsedSec, 0) / timedAttempts.length
          )
        : metric.avgTimeSec;
    const adjustedAccuracy = Math.max(40, Math.min(99, attemptAccuracy + resolved * 2 - backlog * 2));

    return {
      ...metric,
      avgTimeSec,
      accuracy: adjustedAccuracy,
      backlog
    };
  });
}

export function getRewardBadgesFromReviewItems(
  items: PersistedReviewItem[],
  seedBadges: RewardBadge[]
) {
  const { resolved } = getReviewResolutionStats(items);

  return seedBadges.map((badge) => {
    if (badge.id !== "b2") {
      return badge;
    }

    return {
      ...badge,
      earned: resolved >= 6,
      detail: `Resolve 6 review items through successful retry. Current: ${resolved}/6.`
    };
  });
}
