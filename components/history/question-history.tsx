"use client";

import { useEffect, useMemo, useState } from "react";
import { allMissionQuestions } from "@/data/mock-data";
import {
  loadMissionAttempts,
  subscribeToMissionAttemptsSync,
  syncMissionAttemptsFromServer
} from "@/lib/mission-attempts-client";
import { getAveragePace } from "@/lib/attempt-insights";
import { Chip } from "@/components/ui/chip";
import type { MissionAttemptRecord } from "@/lib/types";

function formatStep(stepId: string) {
  if (stepId === "drill") return "Targeted Drill";
  if (stepId === "mini") return "Timed Mini-Test";
  if (stepId === "brief") return "Mission Brief";
  if (stepId === "review") return "Mistake Review";
  return stepId;
}

export function QuestionHistory() {
  const [attempts, setAttempts] = useState<MissionAttemptRecord[]>([]);

  useEffect(() => {
    function syncLocal() {
      setAttempts(loadMissionAttempts());
    }

    syncLocal();
    void syncMissionAttemptsFromServer().then(setAttempts);
    return subscribeToMissionAttemptsSync(syncLocal);
  }, []);

  const sortedAttempts = useMemo(
    () =>
      [...attempts].sort((a, b) => {
        const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return bTime - aTime;
      }),
    [attempts]
  );

  const stats = useMemo(() => {
    const correct = attempts.filter((attempt) => attempt.isCorrect).length;
    const total = attempts.length;
    const accuracy = total === 0 ? 0 : Math.round((correct / total) * 100);
    const pace = getAveragePace(attempts);

    return {
      total,
      correct,
      accuracy,
      pace
    };
  }, [attempts]);

  return (
    <section className="space-y-5">
      <div className="grid gap-4 md:grid-cols-3">
        <HistoryStat label="Attempts logged" value={`${stats.total}`} tone="accent" />
        <HistoryStat label="Correct" value={`${stats.accuracy}%`} tone="success" />
        <HistoryStat
          label="Average pace"
          value={stats.pace.timedCount ? `${stats.pace.avgPaceSec}s` : "No timer data"}
          tone="warning"
        />
      </div>

      <div className="panel rounded-[28px] p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-slate-100">Recent attempts</p>
            <p className="text-sm text-slate-400">
              Every submitted mission answer is saved here with outcome, timing, and the correct answer.
            </p>
          </div>
          <Chip>{stats.correct} correct</Chip>
        </div>

        {sortedAttempts.length ? (
          <div className="mt-5 grid gap-4">
            {sortedAttempts.map((attempt) => {
              const question = allMissionQuestions.find((item) => item.id === attempt.questionId);
              const createdLabel = attempt.createdAt
                ? new Date(attempt.createdAt).toLocaleString("en-US", {
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit"
                  })
                : "Saved recently";

              return (
                <div
                  key={attempt.id}
                  className="rounded-[24px] border border-slate-800 bg-slate-950/60 p-5"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <Chip tone={attempt.isCorrect ? "success" : "warning"}>
                      {attempt.isCorrect ? "Correct" : "Incorrect"}
                    </Chip>
                    <Chip>{attempt.section}</Chip>
                    <Chip tone="accent">{attempt.skill}</Chip>
                    <Chip>Day {attempt.day}</Chip>
                    <Chip>{formatStep(attempt.stepId)}</Chip>
                  </div>

                  <p className="mt-4 text-lg font-semibold text-slate-100">
                    {question?.prompt ?? attempt.questionId}
                  </p>
                  <div className="mt-4 grid gap-3 md:grid-cols-3">
                    <HistoryDetail label="Your answer" value={attempt.selectedChoice} />
                    <HistoryDetail label="Correct answer" value={question?.answer ?? "Unknown"} />
                    <HistoryDetail
                      label="Time"
                      value={attempt.elapsedSec ? `${attempt.elapsedSec}s` : "No timer"}
                    />
                  </div>
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-400">
                    <span>{createdLabel}</span>
                    <span>{question?.domain ?? "Mission item"}</span>
                  </div>
                  {!attempt.isCorrect && question ? (
                    <div className="mt-4 rounded-[20px] border border-slate-800 bg-slate-950/80 p-4 text-sm text-slate-300">
                      <p className="font-semibold text-slate-100">Why it missed</p>
                      <p className="mt-2">{question.explanation}</p>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="mt-5 rounded-[22px] border border-dashed border-slate-700 bg-slate-950/40 p-5 text-sm text-slate-400">
            No attempts yet. Finish a mission drill or mini-test and the history view will start filling in.
          </div>
        )}
      </div>
    </section>
  );
}

function HistoryStat({
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

function HistoryDetail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[18px] border border-slate-800 bg-slate-950/80 p-4">
      <p className="text-xs uppercase tracking-[0.16em] text-slate-500">{label}</p>
      <p className="mt-2 text-sm font-semibold text-slate-100">{value}</p>
    </div>
  );
}
