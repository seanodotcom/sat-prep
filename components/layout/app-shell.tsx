"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Route } from "next";
import { appNav } from "@/lib/navigation";
import {
  readClientAppState,
  subscribeToAppStateSync,
  syncAppStateFromServer
} from "@/lib/app-state-client";
import {
  loadMissionAttempts,
  clearMissionAttempts,
  subscribeToMissionAttemptsSync,
  syncMissionAttemptsFromServer
} from "@/lib/mission-attempts-client";
import { clearAllReviewItems } from "@/lib/review-items-client";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { cn } from "@/lib/utils";
import { getCurrentStreak, getQuestionsSolved } from "@/lib/dashboard-insights";
import { getCurrentDayProgressFromPlan, getMissionSnapshot } from "@/lib/mission";
import { useStudyContent } from "@/lib/use-study-content";
import {
  defaultOnboardingPreferences,
  defaultStudyProgress,
  defaultMissionProgress,
  clearAppStorage,
  loadMissionProgress,
  loadOnboardingPreferences,
  loadStudyProgress,
  hasCompletedOnboarding,
  type OnboardingPreferences,
  type StoredMissionProgress,
  type StudyProgress
} from "@/lib/storage";
import type { MissionAttemptRecord } from "@/lib/types";

export function AppShell({
  children,
  currentPath
}: {
  children: React.ReactNode;
  currentPath: string;
}) {
  const router = useRouter();
  const [progress, setProgress] = useState<StoredMissionProgress>(defaultMissionProgress);
  const [preferences, setPreferences] = useState<OnboardingPreferences>(defaultOnboardingPreferences);
  const [studyProgress, setStudyProgress] = useState<StudyProgress>(defaultStudyProgress);
  const [attempts, setAttempts] = useState<MissionAttemptRecord[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const { planDays } = useStudyContent();

  useEffect(() => {
    function setProgressIfChanged(nextValue: StoredMissionProgress) {
      setProgress((current) =>
        JSON.stringify(current) === JSON.stringify(nextValue) ? current : nextValue
      );
    }

    function setPreferencesIfChanged(nextValue: OnboardingPreferences) {
      setPreferences((current) =>
        JSON.stringify(current) === JSON.stringify(nextValue) ? current : nextValue
      );
    }

    function setStudyProgressIfChanged(nextValue: StudyProgress) {
      setStudyProgress((current) =>
        JSON.stringify(current) === JSON.stringify(nextValue) ? current : nextValue
      );
    }

    function setAttemptsIfChanged(nextValue: MissionAttemptRecord[]) {
      setAttempts((current) =>
        JSON.stringify(current) === JSON.stringify(nextValue) ? current : nextValue
      );
    }

    function syncFromClientState() {
      const state = readClientAppState();
      setProgressIfChanged(state.missionProgress);
      setPreferencesIfChanged(state.onboardingPreferences);
      setStudyProgressIfChanged(state.studyProgress);
      setAttemptsIfChanged(loadMissionAttempts());
    }

    try {
      syncFromClientState();
      void syncAppStateFromServer().then((state) => {
        setProgressIfChanged(state.missionProgress);
        setPreferencesIfChanged(state.onboardingPreferences);
        setStudyProgressIfChanged(state.studyProgress);
      });
      void syncMissionAttemptsFromServer().then(setAttemptsIfChanged);
    } catch {
      setProgress(defaultMissionProgress);
      setPreferences(defaultOnboardingPreferences);
      setStudyProgress(defaultStudyProgress);
    } finally {
      setHydrated(true);
    }

    const unsubscribeAppState = subscribeToAppStateSync(syncFromClientState);
    const unsubscribeAttempts = subscribeToMissionAttemptsSync(() => {
      setAttemptsIfChanged(loadMissionAttempts());
    });

    return () => {
      unsubscribeAppState();
      unsubscribeAttempts();
    };
  }, []);

  useEffect(() => {
    if (!hydrated || hasCompletedOnboarding(preferences)) return;
    router.replace("/onboarding");
  }, [hydrated, preferences, router]);

  const snapshot = useMemo(() => getMissionSnapshot(progress), [progress]);
  const dayProgress = useMemo(
    () => getCurrentDayProgressFromPlan(studyProgress, planDays),
    [planDays, studyProgress]
  );
  const streakDays = useMemo(() => getCurrentStreak(studyProgress), [studyProgress]);
  const questionsSolved = useMemo(() => getQuestionsSolved(attempts), [attempts]);
  const onboardingComplete = hasCompletedOnboarding(preferences);

  async function confirmFullReset() {
    clearAppStorage();

    try {
      await Promise.all([
        fetch("/api/app-state", { method: "DELETE" }),
        clearMissionAttempts(),
        clearAllReviewItems()
      ]);
    } catch (error) {
      console.error("Unable to fully reset saved data", error);
    }

    setProgress(defaultMissionProgress);
    setPreferences(defaultOnboardingPreferences);
    setStudyProgress(defaultStudyProgress);
    setAttempts([]);
    setResetConfirmOpen(false);
    setMenuOpen(false);
    router.push("/");
    router.refresh();
  }

  if (!hydrated || !onboardingComplete) {
    return (
      <div className="min-h-screen">
        <div className="mx-auto flex max-w-5xl px-6 py-10 lg:px-8">
          <section className="panel w-full rounded-[32px] p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-teal-300">
              Setup required
            </p>
            <h1 className="mt-4 text-3xl font-bold text-slate-100">
              Finishing onboarding keeps the mission personalized and saved on this device.
            </h1>
            <p className="mt-4 max-w-2xl text-slate-400">
              {hydrated
                ? "Redirecting you to the setup screen now."
                : "Loading your saved profile and study state."}
            </p>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-4 lg:px-6">
        {menuOpen ? (
          <div
            className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm"
            onClick={() => {
              setResetConfirmOpen(false);
              setMenuOpen(false);
            }}
          >
            <aside
              className="panel absolute left-4 top-4 max-h-[calc(100vh-2rem)] w-[280px] overflow-y-auto rounded-[28px] p-5"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="mb-8 flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-teal-300">Summit SAT</p>
                  <h1 className="mt-2 text-2xl font-bold text-slate-100">Mission Control</h1>
                  <p className="mt-2 text-sm text-slate-400">One 30-day mission. One next step.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-full border border-slate-700 px-3 py-2 text-sm text-slate-300"
                >
                  Close
                </button>
              </div>
              <div className="mb-5 rounded-[24px] border border-slate-800 bg-slate-950/70 p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Chip tone="accent">Day {dayProgress.currentDay}</Chip>
                  <Chip>{dayProgress.currentPlan.title}</Chip>
                </div>
                <p className="mt-4 text-sm text-slate-400">Current focus</p>
                <p className="mt-1 text-base font-semibold text-slate-100">{dayProgress.currentPlan.focus}</p>
                <div className="mt-4 rounded-[18px] border border-slate-800 bg-slate-900/80 p-3">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Next action</p>
                  <p className="mt-1 text-sm font-medium text-slate-200">
                    {snapshot.completedSteps >= snapshot.totalSteps
                      ? "Start the next mission day from the brief."
                      : `${snapshot.activeStep.title} is your live step right now.`}
                  </p>
                </div>
              </div>
              <nav className="space-y-2">
                {appNav.map((item) => {
                  const active = currentPath === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href as Route}
                      onClick={() => setMenuOpen(false)}
                      className={cn(
                        "flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium transition",
                        active ? "bg-white text-slate-950" : "text-slate-300 hover:bg-slate-900"
                      )}
                    >
                      {item.label}
                      {active ? <Chip tone="success">Live</Chip> : null}
                    </Link>
                  );
                })}
              </nav>
              <div className="mt-8 border-t border-slate-800 pt-5">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Danger zone</p>
                <p className="mt-2 text-sm text-slate-400">
                  Completely erase local progress, onboarding info, and mission state.
                </p>
                <button
                  type="button"
                  onClick={() => setResetConfirmOpen(true)}
                  className="mt-4 flex w-full items-center justify-center rounded-2xl border border-rose-500/35 bg-rose-500/10 px-4 py-3 text-sm font-semibold text-rose-100 transition hover:bg-rose-500/18"
                >
                  Reset everything
                </button>
              </div>
            </aside>
          </div>
        ) : null}

        {resetConfirmOpen ? (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-4 backdrop-blur-sm"
            onClick={() => setResetConfirmOpen(false)}
          >
            <div
              className="panel w-full max-w-md rounded-[28px] border border-rose-500/25 p-6"
              onClick={(event) => event.stopPropagation()}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-rose-200">Reset Everything</p>
              <h2 className="mt-3 text-2xl font-bold text-slate-100">Erase all saved data?</h2>
              <p className="mt-3 text-sm leading-6 text-slate-400">
                This will permanently remove onboarding info, mission progress, and day progress on this device, then return you to the main page.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button variant="secondary" onClick={() => setResetConfirmOpen(false)}>
                  Cancel
                </Button>
                <button
                  type="button"
                  onClick={confirmFullReset}
                  className="ui-button inline-flex min-h-11 items-center justify-center rounded-full border border-rose-500/35 bg-rose-500/12 px-5 py-3 text-sm font-semibold text-rose-100 transition hover:bg-rose-500/18"
                >
                  Yes, erase everything
                </button>
              </div>
            </div>
          </div>
        ) : null}

        <main className="space-y-6">
          <div className="panel flex flex-col gap-4 rounded-[28px] px-5 py-4 lg:grid lg:grid-cols-[1fr_minmax(320px,420px)_1fr] lg:items-center lg:px-6">
            <div className="min-w-0 lg:justify-self-start">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setMenuOpen(true)}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-700 bg-slate-950/60 text-slate-100"
                  aria-label="Open navigation menu"
                >
                  <span className="flex flex-col gap-1">
                    <span className="block h-0.5 w-4 bg-current" />
                    <span className="block h-0.5 w-4 bg-current" />
                    <span className="block h-0.5 w-4 bg-current" />
                  </span>
                </button>
                <div>
                  <p className="text-sm text-slate-400">
                    {preferences.firstName ? `Welcome back, ${preferences.firstName}` : "30-day mission"}
                  </p>
                  <p className="text-xl font-bold text-slate-100">
                    Day {dayProgress.currentDay} of {dayProgress.totalDays}
                  </p>
                </div>
              </div>
            </div>
            <div className="min-w-0 lg:w-full lg:justify-self-center">
              <div className="rounded-[22px] border border-slate-800 bg-slate-950/70 px-4 py-3">
                <div className="mb-2 flex items-center justify-between text-sm text-slate-400">
                  <span>Overall progress</span>
                  <span className="font-semibold text-slate-200">{dayProgress.progressPercent}%</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-slate-900/90">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-teal-400 via-sky-400 to-orange-400"
                    style={{ width: `${dayProgress.progressPercent}%` }}
                  />
                </div>
                <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                  <span>Start</span>
                  <span className="rounded-full border border-slate-800 px-2 py-1 text-slate-300">
                    Day {dayProgress.currentDay}
                  </span>
                  <span>Day {dayProgress.totalDays}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 lg:justify-self-end">
              <Chip>{preferences.targetScore} target</Chip>
              <Chip tone="success">{streakDays} day streak</Chip>
              <Chip>{questionsSolved} solved</Chip>
              <Button href="/app/mission">{snapshot.primaryLabel}</Button>
            </div>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
