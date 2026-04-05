"use client";

import { useEffect, useMemo, useState } from "react";
import { Chip } from "@/components/ui/chip";
import {
  loadMissionAttempts,
  subscribeToMissionAttemptsSync,
  syncMissionAttemptsFromServer
} from "@/lib/mission-attempts-client";
import { loadReviewItems, subscribeToReviewItemsSync, syncReviewItemsFromServer } from "@/lib/review-items-client";
import { readClientAppState, subscribeToAppStateSync, syncAppStateFromServer } from "@/lib/app-state-client";
import { rewardBadgeDefinitions } from "@/lib/reward-definitions";
import { getRewardBadgesFromLiveData } from "@/lib/rewards-insights";
import { defaultStudyProgress, type StudyProgress } from "@/lib/storage";
import type { MissionAttemptRecord, PersistedReviewItem } from "@/lib/types";

export function RewardsGrid() {
  const [reviewItems, setReviewItems] = useState<PersistedReviewItem[]>([]);
  const [attempts, setAttempts] = useState<MissionAttemptRecord[]>([]);
  const [studyProgress, setStudyProgress] = useState<StudyProgress>(defaultStudyProgress);

  useEffect(() => {
    function syncLocal() {
      setReviewItems(loadReviewItems());
      setAttempts(loadMissionAttempts());
      setStudyProgress(readClientAppState().studyProgress);
    }

    syncLocal();
    void syncReviewItemsFromServer().then(setReviewItems);
    void syncMissionAttemptsFromServer().then(setAttempts);
    void syncAppStateFromServer().then((state) => {
      setStudyProgress(state.studyProgress);
    });
    const unsubscribeReviews = subscribeToReviewItemsSync(syncLocal);
    const unsubscribeAttempts = subscribeToMissionAttemptsSync(syncLocal);
    const unsubscribeAppState = subscribeToAppStateSync(syncLocal);
    return () => {
      unsubscribeReviews();
      unsubscribeAttempts();
      unsubscribeAppState();
    };
  }, []);

  const badges = useMemo(
    () => getRewardBadgesFromLiveData(rewardBadgeDefinitions, attempts, reviewItems, studyProgress),
    [attempts, reviewItems, studyProgress]
  );

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {badges.map((badge) => (
        <div
          key={badge.id}
          className="panel rounded-[28px] p-5"
        >
          <div className="flex items-center justify-between">
            <Chip tone={badge.earned ? "success" : "default"}>{badge.category}</Chip>
            <p className="text-sm text-slate-500">{badge.earned ? "Earned" : "Locked"}</p>
          </div>
          <p className="mt-5 text-xl font-bold text-slate-100">{badge.title}</p>
          <p className="mt-3 text-sm text-slate-400">{badge.detail}</p>
        </div>
      ))}
    </div>
  );
}
