"use client";

import { useEffect, useMemo, useState } from "react";
import { readClientAppState, subscribeToAppStateSync, syncAppStateFromServer } from "@/lib/app-state-client";
import { Chip } from "@/components/ui/chip";
import { hydrateMissionConfig } from "@/lib/content";
import { getCurrentDayProgressFromPlan, getDayRationaleFromPlan, getMissionSnapshot } from "@/lib/mission";
import {
  defaultMissionProgress,
  defaultStudyProgress,
  type StoredMissionProgress,
  type StudyProgress
} from "@/lib/storage";
import { cn } from "@/lib/utils";
import { useStudyContent } from "@/lib/use-study-content";

export function MissionOverview() {
  const [progress, setProgress] = useState<StoredMissionProgress>(defaultMissionProgress);
  const [studyProgress, setStudyProgress] = useState<StudyProgress>(defaultStudyProgress);
  const { questions, planDays } = useStudyContent();

  useEffect(() => {
    function syncFromClientState() {
      const state = readClientAppState();
      setProgress(state.missionProgress);
      setStudyProgress(state.studyProgress);
    }

    try {
      syncFromClientState();
      void syncAppStateFromServer().then((state) => {
        setProgress(state.missionProgress);
        setStudyProgress(state.studyProgress);
      });
    } catch {
      setProgress(defaultMissionProgress);
      setStudyProgress(defaultStudyProgress);
    }

    return subscribeToAppStateSync(syncFromClientState);
  }, []);

  const snapshot = useMemo(() => getMissionSnapshot(progress), [progress]);
  const dayProgress = useMemo(
    () => getCurrentDayProgressFromPlan(studyProgress, planDays),
    [planDays, studyProgress]
  );
  const missionConfig = useMemo(
    () => hydrateMissionConfig(dayProgress.currentPlan, questions),
    [dayProgress.currentPlan, questions]
  );
  const dayRationale = useMemo(
    () => getDayRationaleFromPlan(dayProgress.currentDay, planDays),
    [dayProgress.currentDay, planDays]
  );
  const missionComplete = snapshot.completedSteps >= snapshot.totalSteps;
  const steps = missionConfig.steps.map((step, index) => ({
    ...step,
    status:
      missionComplete
        ? "complete"
        : index < progress.currentStepIndex
          ? "complete"
          : index === progress.currentStepIndex
            ? "active"
            : "up-next"
  }));

  return (
    <section className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
      <div className="panel rounded-[28px] p-6">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-slate-100">Today's briefing</p>
            <p className="text-sm text-slate-400">
              Day {dayProgress.currentDay}: {dayProgress.currentPlan.title}
            </p>
          </div>
          <Chip tone="accent">{missionConfig.missionLengthLabel}</Chip>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <BriefStat label="Focus" value={dayProgress.currentPlan.focus} tone="accent" />
          <BriefStat label="Mission type" value={dayProgress.currentPlan.missionType} tone="success" />
          <BriefStat
            label="Next move"
            value={missionComplete ? `Start Day ${dayProgress.currentDay}` : snapshot.activeStep.title}
            tone="warning"
          />
        </div>

        <div className="mt-6 rounded-[24px] border border-slate-800 bg-slate-950/60 p-5">
          <div className="flex flex-wrap items-center gap-2">
            <Chip tone="warning">Mission flow</Chip>
            <Chip>{missionConfig.missionLabel}</Chip>
          </div>
          <p className="mt-4 text-base text-slate-300">
            {missionComplete
              ? `Today's mission is wrapped. The next launch will open Day ${dayProgress.currentDay} with a fresh brief and a new question set.`
              : missionConfig.briefBody}
          </p>
        </div>

        <div className="mt-4 rounded-[24px] border border-slate-800 bg-slate-950/60 p-5">
          <div className="flex flex-wrap items-center gap-2">
            <Chip tone="accent">Why this day</Chip>
          </div>
          <p className="mt-4 text-sm leading-6 text-slate-300">{dayRationale}</p>
        </div>

        <div className="mt-6 space-y-1">
          {steps.map((step, index) => (
            <div key={step.id} className="grid grid-cols-[52px_1fr] gap-4">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "flex h-11 w-11 items-center justify-center rounded-full border text-sm font-bold transition",
                    step.status === "complete" && "border-teal-400/40 bg-teal-500/14 text-teal-200",
                    step.status === "active" &&
                      "border-sky-300 bg-sky-500/16 text-sky-100 ring-4 ring-sky-400/20",
                    step.status === "up-next" && "border-slate-700 bg-slate-900 text-slate-300"
                  )}
                >
                  {index + 1}
                </div>
                {index < steps.length - 1 ? (
                  <div
                    className={cn(
                      "mt-2 h-full min-h-10 w-px",
                      index < progress.currentStepIndex ? "bg-teal-400/40" : "bg-slate-800"
                    )}
                  />
                ) : null}
              </div>
              <div className="pb-6">
                <div
                  className={cn(
                    "rounded-[22px] border p-4",
                    step.status === "active" &&
                      "border-sky-400/30 bg-gradient-to-br from-sky-500/12 to-slate-950/90",
                    step.status === "complete" &&
                      "border-teal-400/25 bg-gradient-to-br from-teal-500/10 to-slate-950/90",
                    step.status === "up-next" && "border-slate-800 bg-slate-950/60"
                  )}
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-100">{step.title}</p>
                      <p className="mt-1 text-sm text-slate-400">{step.durationMin} min</p>
                    </div>
                    <Chip
                      tone={
                        step.status === "complete"
                          ? "success"
                          : step.status === "active"
                            ? "accent"
                            : "default"
                      }
                    >
                      {step.status === "up-next" ? "up next" : step.status}
                    </Chip>
                  </div>
                  <p className="mt-3 text-sm text-slate-400">{step.detail}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="panel rounded-[28px] p-6">
        <p className="text-sm font-semibold text-slate-100">How today works</p>
        <p className="mt-2 text-sm text-slate-400">
          This screen should answer one question clearly: what do I do next?
        </p>
        <div className="mt-5 space-y-4">
          <Rule text="Start the mission and follow the steps top to bottom. There is no branching path to figure out." />
          <Rule text="The current highlighted step is the one that matters. Everything else is either already done or waiting." />
          <Rule text="If you miss or flag questions, they show up at the end of the mission and in review automatically." />
        </div>
      </div>
    </section>
  );
}

function BriefStat({
  label,
  value,
  tone
}: {
  label: string;
  value: string;
  tone: "accent" | "success" | "warning";
}) {
  return (
    <div
      className={cn(
        "rounded-[22px] border p-4",
        tone === "accent" && "border-sky-400/25 bg-gradient-to-br from-sky-500/12 to-slate-950/90",
        tone === "success" && "border-teal-400/25 bg-gradient-to-br from-teal-500/12 to-slate-950/90",
        tone === "warning" && "border-amber-400/25 bg-gradient-to-br from-amber-500/12 to-slate-950/90"
      )}
    >
      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-2 text-lg font-semibold text-slate-100">{value}</p>
    </div>
  );
}

function Rule({ text }: { text: string }) {
  return (
    <div className="rounded-[22px] border border-slate-800 bg-slate-950/60 p-4 text-sm text-slate-300">
      {text}
    </div>
  );
}
