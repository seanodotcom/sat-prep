"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { getMissionDayConfig, missionSteps } from "@/data/mock-data";
import { MissionPlayer } from "@/components/mission/mission-player";
import { MissionSidebar } from "@/components/mission/mission-sidebar";
import {
  persistMissionProgress,
  persistStudyProgress,
  readClientAppState,
  subscribeToAppStateSync,
  syncAppStateFromServer
} from "@/lib/app-state-client";
import { getCurrentDayProgress } from "@/lib/mission";
import {
  defaultStudyProgress,
  defaultMissionProgress,
  type StoredMissionProgress,
  type StudyProgress
} from "@/lib/storage";
import type { MissionStep } from "@/lib/types";

export function MissionExperience() {
  const router = useRouter();
  const [progress, setProgress] = useState<StoredMissionProgress>(defaultMissionProgress);
  const [studyProgress, setStudyProgress] = useState<StudyProgress>(defaultStudyProgress);
  const [hydrated, setHydrated] = useState(false);
  const hasSyncedInitialMissionRef = useRef(false);
  const hasSyncedInitialStudyRef = useRef(false);

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
    } finally {
      setHydrated(true);
    }

    return subscribeToAppStateSync(syncFromClientState);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (!hasSyncedInitialMissionRef.current) {
      hasSyncedInitialMissionRef.current = true;
      return;
    }
    void persistMissionProgress(progress);
  }, [hydrated, progress]);

  useEffect(() => {
    if (!hydrated) return;
    if (!hasSyncedInitialStudyRef.current) {
      hasSyncedInitialStudyRef.current = true;
      return;
    }
    void persistStudyProgress(studyProgress);
  }, [hydrated, studyProgress]);

  useEffect(() => {
    if (!hydrated) return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("fresh") !== "1") return;

    setProgress(defaultMissionProgress);
    void persistMissionProgress(defaultMissionProgress);
    router.replace("/app/mission");
  }, [hydrated, router]);

  const steps = useMemo<MissionStep[]>(
    () =>
      getMissionDayConfig(studyProgress.currentDay, getCurrentDayProgress(studyProgress).currentPlan).steps.map((step, index) => ({
        ...step,
        status:
          progress.currentStepIndex >= missionSteps.length
            ? "complete"
            : index < progress.currentStepIndex
              ? "complete"
              : index === progress.currentStepIndex
                ? "active"
                : "up-next"
      })),
    [progress.currentStepIndex, studyProgress]
  );

  const currentDayPlan = useMemo(() => getCurrentDayProgress(studyProgress), [studyProgress]);
  const missionConfig = useMemo(
    () => getMissionDayConfig(currentDayPlan.currentDay, currentDayPlan.currentPlan),
    [currentDayPlan]
  );

  const currentStep = steps[Math.min(progress.currentStepIndex, steps.length - 1)];
  const currentQuestionSet =
    missionConfig.questionSets.find((set) => set.stepId === currentStep.id) ?? missionConfig.questionSets[0];
  const completedSteps = Math.min(progress.currentStepIndex, steps.length);
  const progressValue = Math.round((completedSteps / steps.length) * 100);
  const currentSetEstimateMin = Math.max(
    1,
    Math.round(
      currentQuestionSet.questions.reduce((total, item) => total + item.estimatedTimeSec, 0) / 60
    )
  );
  const stepEstimateLabel =
    currentStep.id === "brief" || currentStep.id === "review"
      ? `${currentStep.durationMin} min`
      : `${currentSetEstimateMin} min question set`;

  function resetForNextStep(nextStepIndex: number) {
    setProgress((current) => ({
      ...current,
      currentStepIndex: nextStepIndex,
      questionIndex: 0,
      selectedChoice: null,
      submitted: false,
      answeredQuestionIds: [],
      correctCount: 0
    }));
  }

  function handleAdvanceStep() {
    if (progress.currentStepIndex === steps.length - 1) {
      setStudyProgress((current) => {
        const completedDays = current.completedDays.includes(current.currentDay)
          ? current.completedDays
          : [...current.completedDays, current.currentDay];

        return {
          currentDay: Math.min(current.currentDay + 1, 30),
          completedDays
        };
      });
    }
    const nextStepIndex = Math.min(progress.currentStepIndex + 1, steps.length);
    resetForNextStep(nextStepIndex);
  }

  function handleResetMission() {
    setProgress(defaultMissionProgress);
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
      <div className="space-y-5">
        <section className="panel rounded-[28px] p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-teal-300">Current step</p>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <span className="rounded-full border border-teal-400/30 bg-teal-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-teal-200">
                  {missionConfig.missionLabel}
                </span>
                <span className="rounded-full border border-slate-700 bg-slate-950/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-300">
                  Estimated time: {stepEstimateLabel}
                </span>
              </div>
              <h1 className="mt-3 text-3xl font-bold text-slate-100">
                Step {Math.min(progress.currentStepIndex + 1, steps.length)} of {steps.length}: {currentStep.title}
              </h1>
              {currentStep.id === "brief" ? (
                <p className="mt-3 max-w-2xl text-slate-400">{missionConfig.briefBody}</p>
              ) : null}
            </div>
          </div>
        </section>
        <MissionPlayer
          currentDay={currentDayPlan.currentDay}
          missionConfig={missionConfig}
          progress={progress}
          questionSet={currentQuestionSet}
          steps={steps}
          onAdvanceStep={handleAdvanceStep}
          onResetMission={handleResetMission}
          setProgress={setProgress}
        />
      </div>
      <MissionSidebar
        steps={steps}
        completedSteps={completedSteps}
        progressValue={progressValue}
        onResetMission={handleResetMission}
        canReset={hydrated}
      />
    </div>
  );
}
