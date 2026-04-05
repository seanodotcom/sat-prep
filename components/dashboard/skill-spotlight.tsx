"use client";

import { useEffect, useMemo, useState } from "react";
import { ProgressBar } from "@/components/ui/progress";
import {
  loadMissionAttempts,
  subscribeToMissionAttemptsSync,
  syncMissionAttemptsFromServer
} from "@/lib/mission-attempts-client";
import { loadReviewItems, subscribeToReviewItemsSync, syncReviewItemsFromServer } from "@/lib/review-items-client";
import { getSkillMetricsFromReviewItems } from "@/lib/review-insights";
import type { MissionAttemptRecord, PersistedReviewItem } from "@/lib/types";

export function SkillSpotlight() {
  const [reviewItems, setReviewItems] = useState<PersistedReviewItem[]>([]);
  const [attempts, setAttempts] = useState<MissionAttemptRecord[]>([]);

  useEffect(() => {
    function syncLocal() {
      setReviewItems(loadReviewItems());
      setAttempts(loadMissionAttempts());
    }

    syncLocal();
    void syncReviewItemsFromServer().then(setReviewItems);
    void syncMissionAttemptsFromServer().then(setAttempts);
    const unsubscribeReviewItems = subscribeToReviewItemsSync(syncLocal);
    const unsubscribeAttempts = subscribeToMissionAttemptsSync(syncLocal);
    return () => {
      unsubscribeReviewItems();
      unsubscribeAttempts();
    };
  }, []);

  const metrics = useMemo(
    () => getSkillMetricsFromReviewItems(reviewItems, attempts),
    [reviewItems, attempts]
  );

  return (
    <section className="panel rounded-[28px] p-6">
      <div className="mb-6">
        <p className="text-sm font-semibold text-slate-100">Skill spotlight</p>
        <p className="text-sm text-slate-400">Starter analytics cards for the v1 dashboard and section-level mastery view.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {metrics.map((metric) => (
          <div key={metric.skill} className="rounded-[24px] border border-slate-800 bg-slate-950/60 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-slate-100">{metric.skill}</p>
                <p className="text-sm text-slate-400">{metric.avgTimeSec}s avg time</p>
              </div>
              <p className="text-sm font-semibold text-slate-400">{metric.backlog} in review</p>
            </div>
            <div className="mt-4">
              <div className="mb-2 flex items-center justify-between text-sm text-slate-400">
                <span>Recent accuracy</span>
                <span>{metric.accuracy}%</span>
              </div>
              <ProgressBar value={metric.accuracy} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
