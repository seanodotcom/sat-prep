"use client";

import { useEffect, useMemo, useState } from "react";
import { ProgressBar } from "@/components/ui/progress";
import {
  loadMissionAttempts,
  subscribeToMissionAttemptsSync,
  syncMissionAttemptsFromServer
} from "@/lib/mission-attempts-client";
import { loadReviewItems, subscribeToReviewItemsSync, syncReviewItemsFromServer } from "@/lib/review-items-client";
import { getAveragePace, getSectionAccuracy } from "@/lib/attempt-insights";
import { getReviewResolutionStats, getSkillMetricsFromReviewItems } from "@/lib/review-insights";
import { useStudyContent } from "@/lib/use-study-content";
import type { MissionAttemptRecord, PersistedReviewItem } from "@/lib/types";

export function AnalyticsGrid() {
  const [reviewItems, setReviewItems] = useState<PersistedReviewItem[]>([]);
  const [attempts, setAttempts] = useState<MissionAttemptRecord[]>([]);
  const { questions } = useStudyContent();

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
    () => getSkillMetricsFromReviewItems(reviewItems, attempts, questions),
    [reviewItems, attempts, questions]
  );
  const reviewStats = useMemo(() => getReviewResolutionStats(reviewItems), [reviewItems]);
  const mathStats = useMemo(() => getSectionAccuracy(attempts, "Math"), [attempts]);
  const readingStats = useMemo(() => getSectionAccuracy(attempts, "Reading & Writing"), [attempts]);
  const paceStats = useMemo(() => getAveragePace(attempts), [attempts]);

  return (
    <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
      <section className="panel rounded-[28px] p-6">
        <p className="text-sm font-semibold text-slate-100">Section performance</p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <MetricCard
            title="Math accuracy"
            value={`${mathStats.accuracy}%`}
            subtext={`${mathStats.total} math attempts logged`}
            progress={mathStats.accuracy}
            tone="accent"
          />
          <MetricCard
            title="Reading & Writing"
            value={`${readingStats.accuracy}%`}
            subtext={`${readingStats.total} verbal attempts logged`}
            progress={readingStats.accuracy}
            tone="success"
          />
          <MetricCard
            title="Average pace"
            value={paceStats.timedCount ? `${paceStats.avgPaceSec} sec` : "No timer data"}
            subtext={
              paceStats.timedCount
                ? `${paceStats.timedCount} timed attempts recorded`
                : "Complete a timed mini-test to populate pace."
            }
            progress={paceStats.timedCount ? Math.max(0, Math.min(100, 100 - paceStats.avgPaceSec)) : 0}
            tone="warning"
          />
          <MetricCard
            title="Review resolution"
            value={`${reviewStats.resolutionPercent}%`}
            subtext={`${reviewStats.resolved} retries completed`}
            progress={reviewStats.resolutionPercent}
            tone="coral"
          />
        </div>
      </section>
      <section className="panel rounded-[28px] p-6">
        <p className="text-sm font-semibold text-slate-100">Weak-area table</p>
        <div className="mt-5 space-y-4">
          {metrics.map((metric) => (
            <div key={metric.skill} className="rounded-[22px] border border-slate-800 bg-slate-950/60 p-4">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-slate-100">{metric.skill}</p>
                <p className="text-sm text-slate-400">{metric.avgTimeSec}s</p>
              </div>
              <div className="mt-3">
                <ProgressBar
                  value={metric.accuracy}
                  tone={
                    metric.accuracy >= 80
                      ? "success"
                      : metric.accuracy >= 60
                        ? "accent"
                        : "warning"
                  }
                />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function MetricCard({
  title,
  value,
  subtext,
  progress,
  tone
}: {
  title: string;
  value: string;
  subtext: string;
  progress: number;
  tone: "accent" | "success" | "warning" | "coral";
}) {
  return (
    <div className="rounded-[24px] border border-slate-800 bg-slate-950/60 p-5">
      <p className="text-sm text-slate-400">{title}</p>
      <p className="mt-2 text-3xl font-bold text-slate-100">{value}</p>
      <p className="mt-2 text-sm text-slate-400">{subtext}</p>
      <ProgressBar value={progress} tone={tone} className="mt-4" />
    </div>
  );
}
