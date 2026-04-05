"use client";

import { useEffect, useMemo, useState } from "react";
import { dashboardStats } from "@/data/mock-data";
import { ProgressBar } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  getCurrentDayProgress,
  getDayRationale,
  getMissionSnapshot,
  getUpcomingDayPreview
} from "@/lib/mission";
import {
  defaultOnboardingPreferences,
  defaultMissionProgress,
  defaultStudyProgress,
  MISSION_PROGRESS_KEY,
  ONBOARDING_PREFERENCES_KEY,
  STUDY_PROGRESS_KEY,
  type OnboardingPreferences,
  type StoredMissionProgress,
  type StudyProgress
} from "@/lib/storage";

export function HeroCard() {
  const [progress, setProgress] = useState<StoredMissionProgress>(defaultMissionProgress);
  const [preferences, setPreferences] = useState<OnboardingPreferences>(defaultOnboardingPreferences);
  const [studyProgress, setStudyProgress] = useState<StudyProgress>(defaultStudyProgress);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const storedMission = window.localStorage.getItem(MISSION_PROGRESS_KEY);
      if (storedMission) {
        setProgress({
          ...defaultMissionProgress,
          ...JSON.parse(storedMission)
        });
      }

      const storedPreferences = window.localStorage.getItem(ONBOARDING_PREFERENCES_KEY);
      if (storedPreferences) {
        setPreferences({
          ...defaultOnboardingPreferences,
          ...JSON.parse(storedPreferences)
        });
      }

      const storedStudyProgress = window.localStorage.getItem(STUDY_PROGRESS_KEY);
      if (storedStudyProgress) {
        setStudyProgress({
          ...defaultStudyProgress,
          ...JSON.parse(storedStudyProgress)
        });
      }
    } catch {
      window.localStorage.removeItem(MISSION_PROGRESS_KEY);
      window.localStorage.removeItem(ONBOARDING_PREFERENCES_KEY);
      window.localStorage.removeItem(STUDY_PROGRESS_KEY);
    } finally {
      setHydrated(true);
    }
  }, []);

  const snapshot = useMemo(() => getMissionSnapshot(progress), [progress]);
  const dayProgress = useMemo(() => getCurrentDayProgress(studyProgress), [studyProgress]);
  const upcomingDay = useMemo(() => getUpcomingDayPreview(studyProgress), [studyProgress]);
  const missionComplete = snapshot.completedSteps >= snapshot.totalSteps;
  const dayRationale = useMemo(() => getDayRationale(dayProgress.currentDay), [dayProgress.currentDay]);
  const completedDayLabel = missionComplete
    ? upcomingDay.hasUpcomingDay
      ? Math.max(1, dayProgress.currentDay - 1)
      : dayProgress.currentDay
    : dayProgress.currentDay;
  const targetTestDateLabel = preferences.targetTestDate
    ? new Date(`${preferences.targetTestDate}T12:00:00`).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
      })
    : "Pick a date";
  const missionHeadline =
    missionComplete
      ? upcomingDay.hasUpcomingDay
        ? `Day ${completedDayLabel} is done. Day ${dayProgress.currentDay} is ready to launch.`
        : "Day 30 is complete. The full mission plan is closed out."
      : dayProgress.currentDay === 1 && snapshot.activeStep.id === "brief"
        ? `Day 1 starts simple${preferences.firstName ? `, ${preferences.firstName}` : ""}: understand the mission, complete the first drill, and build momentum.`
      : snapshot.activeStep.id === "brief"
        ? "Start with the mission brief, then move into the drill with a clear target."
        : snapshot.activeStep.id === "drill"
          ? "You’re in the targeted drill. Lock in setup accuracy before pace pressure kicks in."
          : snapshot.activeStep.id === "mini"
            ? "You’re in the mini-test now. Hold your nerve and stay on pace."
            : "Close the loop in review so misses turn into next-step reps.";
  const launchChecklist = [
    "Read the brief so the mission makes sense before you begin.",
    "Complete the drill in order without jumping around.",
    "Finish the mini-test, then review anything you missed."
  ];

  return (
    <section className="panel relative overflow-hidden rounded-[32px] p-6 lg:p-8">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-r from-teal-500/10 via-sky-500/10 to-coral/10 blur-3xl" />
      <div className="grid gap-8 lg:grid-cols-[1.25fr_0.75fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-teal-300">Today's Mission</p>
          <h2 className="mt-3 max-w-2xl text-3xl font-bold text-balance text-slate-100 lg:text-4xl">
            {missionHeadline}
          </h2>
          <p className="mt-4 max-w-2xl text-base text-slate-400">
            {hydrated
                ? missionComplete
                  ? upcomingDay.hasUpcomingDay
                  ? `Tomorrow is already queued up: Day ${dayProgress.currentDay} is ${dayProgress.currentPlan.title}. Start it fresh when you’re ready, or open review if you want one more pass at Day ${completedDayLabel}.`
                  : "You’ve reached the end of the 30-day plan. Review anything still hanging around or restart the flow from the mission screen."
                : dayProgress.currentDay === 1
                ? `This is your first day of the 30-day plan. The goal is to get oriented, finish the full mission flow once, and make the routine feel easy to repeat tomorrow.`
                : `Today is Day ${dayProgress.currentDay}: ${dayProgress.currentPlan.title}. You’re aiming for ${preferences.targetScore} with ${preferences.preferredDailyMinutes}-minute study blocks and ${preferences.focusSection} first.`
              : "The app is guiding one clean daily flow: brief, drill, prove it under time, then close the loop with review."}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button href={missionComplete ? "/app/mission?fresh=1" : "/app/mission"}>
              {missionComplete
                ? upcomingDay.hasUpcomingDay
                  ? `Start Day ${dayProgress.currentDay} mission`
                  : "Restart mission"
                : snapshot.primaryLabel}
            </Button>
            {snapshot.completedSteps > 0 ? (
              <Button href="/app/review" variant="secondary">
                Open mistake review
              </Button>
            ) : null}
          </div>
          <div className="mt-8 max-w-xl">
            <div className="mb-2 flex items-center justify-between text-sm text-slate-400">
              <span>Mission flow progress</span>
              <span>{snapshot.flowPercent}% complete</span>
            </div>
            <ProgressBar value={snapshot.flowPercent} />
          </div>
        </div>
        <div className="space-y-4">
          <div className="panel-strong rounded-[28px] border border-sky-500/20 bg-gradient-to-br from-sky-500/12 to-slate-950 p-5">
            <p className="text-sm text-slate-400">Live mission state</p>
            <p className="mt-2 text-4xl font-bold text-slate-100">{snapshot.completedSteps}/{snapshot.totalSteps}</p>
            <p className="mt-2 text-sm text-slate-400">
              {snapshot.completedSteps >= snapshot.totalSteps
                ? "All mission steps completed."
                : `${snapshot.activeStep.title} is your current checkpoint.`}
            </p>
          </div>
          {dayProgress.currentDay === 1 ? (
            <div className="rounded-[28px] border border-teal-400/20 bg-gradient-to-br from-teal-500/10 to-slate-950/95 p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-200">Day 1 launch</p>
              <div className="mt-4 space-y-3">
                {launchChecklist.map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <span className="mt-1 inline-flex h-2.5 w-2.5 rounded-full bg-teal-300" />
                    <p className="text-sm text-slate-300">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
          {missionComplete && upcomingDay.hasUpcomingDay ? (
            <div className="rounded-[28px] border border-amber-400/20 bg-gradient-to-br from-amber-500/10 to-slate-950/95 p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-200">Next up</p>
              <p className="mt-3 text-2xl font-bold text-slate-100">
                Day {dayProgress.currentDay}: {dayProgress.currentPlan.title}
              </p>
              <p className="mt-2 text-sm text-slate-400">
                Focus: {dayProgress.currentPlan.focus}. Mission type: {dayProgress.currentPlan.missionType}. Expected time: {dayProgress.currentPlan.duration}.
              </p>
              <div className="mt-4 rounded-[22px] border border-slate-800 bg-slate-950/70 p-4">
                <p className="text-sm text-slate-300">
                  Clear next step: start the next day fresh. The mission button above opens the new brief instead of dropping you back into yesterday’s completed state.
                </p>
              </div>
            </div>
          ) : null}
          {!missionComplete ? (
            <div className="rounded-[28px] border border-sky-400/18 bg-gradient-to-br from-sky-500/10 to-slate-950/95 p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-200">Why this day</p>
              <p className="mt-3 text-sm leading-6 text-slate-300">{dayRationale}</p>
            </div>
          ) : null}
          <div className="grid grid-cols-2 gap-4">
            <StatCard label="Target" value={preferences.targetScore.toString()} />
            <StatCard label="Daily mins" value={`${preferences.preferredDailyMinutes}`} />
            <StatCard label="Streak" value={`${dashboardStats.streakDays} days`} />
            <StatCard label="Test date" value={targetTestDateLabel} />
          </div>
        </div>
      </div>
    </section>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  const accents: Record<string, string> = {
    Target: "border-teal-500/25 bg-gradient-to-br from-teal-500/12 to-slate-950",
    "Daily mins": "border-sky-500/25 bg-gradient-to-br from-sky-500/12 to-slate-950",
    Streak: "border-coral/25 bg-gradient-to-br from-coral/12 to-slate-950",
    "Test date": "border-amber-500/25 bg-gradient-to-br from-amber-500/12 to-slate-950"
  };

  return (
    <div className={`panel-strong rounded-[24px] border p-4 ${accents[label] ?? "border-slate-700"}`}>
      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-2 text-2xl font-bold text-slate-100">{value}</p>
    </div>
  );
}
