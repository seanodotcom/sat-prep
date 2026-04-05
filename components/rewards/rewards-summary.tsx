"use client";

import { useEffect, useMemo, useState } from "react";
import {
  loadMissionAttempts,
  subscribeToMissionAttemptsSync,
  syncMissionAttemptsFromServer
} from "@/lib/mission-attempts-client";
import { loadReviewItems, subscribeToReviewItemsSync, syncReviewItemsFromServer } from "@/lib/review-items-client";
import { readClientAppState, subscribeToAppStateSync, syncAppStateFromServer } from "@/lib/app-state-client";
import { getReadinessGain, getWeeklyCompletion, getXpFromAttemptsAndReviews } from "@/lib/rewards-insights";
import { defaultStudyProgress, type StudyProgress } from "@/lib/storage";
import { useStudyContent } from "@/lib/use-study-content";
import type { MissionAttemptRecord, PersistedReviewItem } from "@/lib/types";

export function RewardsSummary() {
  const [attempts, setAttempts] = useState<MissionAttemptRecord[]>([]);
  const [reviewItems, setReviewItems] = useState<PersistedReviewItem[]>([]);
  const [studyProgress, setStudyProgress] = useState<StudyProgress>(defaultStudyProgress);
  const { planDays } = useStudyContent();

  useEffect(() => {
    function syncLocal() {
      setAttempts(loadMissionAttempts());
      setReviewItems(loadReviewItems());
      setStudyProgress(readClientAppState().studyProgress);
    }

    syncLocal();
    void syncMissionAttemptsFromServer().then(setAttempts);
    void syncReviewItemsFromServer().then(setReviewItems);
    void syncAppStateFromServer().then((state) => setStudyProgress(state.studyProgress));

    const unsubscribeAttempts = subscribeToMissionAttemptsSync(syncLocal);
    const unsubscribeReviews = subscribeToReviewItemsSync(syncLocal);
    const unsubscribeAppState = subscribeToAppStateSync(syncLocal);

    return () => {
      unsubscribeAttempts();
      unsubscribeReviews();
      unsubscribeAppState();
    };
  }, []);

  const xp = useMemo(() => getXpFromAttemptsAndReviews(attempts, reviewItems), [attempts, reviewItems]);
  const weeklyCompletion = useMemo(
    () => getWeeklyCompletion(studyProgress, planDays),
    [planDays, studyProgress]
  );
  const readinessGain = useMemo(
    () => getReadinessGain(attempts, reviewItems),
    [attempts, reviewItems]
  );

  return (
    <section className="grid gap-4 md:grid-cols-3">
      <RewardStat label="XP earned" value={`${xp}`} tone="accent" />
      <RewardStat label="Weekly completion" value={`${weeklyCompletion}%`} tone="success" />
      <RewardStat label="Readiness" value={`${readinessGain}%`} tone="warning" />
    </section>
  );
}

function RewardStat({
  label,
  value,
  tone
}: {
  label: string;
  value: string;
  tone: "accent" | "success" | "warning";
}) {
  const classes =
    tone === "accent"
      ? "border-sky-400/25 bg-gradient-to-br from-sky-500/12 to-slate-950/90"
      : tone === "success"
        ? "border-teal-400/25 bg-gradient-to-br from-teal-500/12 to-slate-950/90"
        : "border-amber-400/25 bg-gradient-to-br from-amber-500/12 to-slate-950/90";

  return (
    <div className={`rounded-[22px] border p-4 ${classes}`}>
      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-2 text-2xl font-bold text-slate-100">{value}</p>
    </div>
  );
}
