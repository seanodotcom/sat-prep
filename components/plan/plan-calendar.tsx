"use client";

import { useEffect, useMemo, useState } from "react";
import { dayPlan, getMissionDayConfig } from "@/data/mock-data";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { ProgressBar } from "@/components/ui/progress";
import { getCurrentDayProgress, getDayRationale, getUpcomingDayPreview } from "@/lib/mission";
import {
  defaultStudyProgress,
  STUDY_PROGRESS_KEY,
  type StudyProgress
} from "@/lib/storage";
import { cn } from "@/lib/utils";

export function PlanCalendar() {
  const [studyProgress, setStudyProgress] = useState<StudyProgress>(defaultStudyProgress);
  const [selectedDay, setSelectedDay] = useState<number>(defaultStudyProgress.currentDay);

  useEffect(() => {
    try {
      const storedStudyProgress = window.localStorage.getItem(STUDY_PROGRESS_KEY);
      if (storedStudyProgress) {
        setStudyProgress({
          ...defaultStudyProgress,
          ...JSON.parse(storedStudyProgress)
        });
      }
    } catch {
      window.localStorage.removeItem(STUDY_PROGRESS_KEY);
    }
  }, []);

  const dayProgress = useMemo(() => getCurrentDayProgress(studyProgress), [studyProgress]);
  const upcomingDay = useMemo(() => getUpcomingDayPreview(studyProgress), [studyProgress]);
  const completedCount = studyProgress.completedDays.length;
  const checkpointDays = dayPlan.filter((item) => item.missionType === "Checkpoint").map((item) => item.day);
  const completedCheckpoints = checkpointDays.filter((day) => studyProgress.completedDays.includes(day)).length;
  const todayRationale = useMemo(() => getDayRationale(dayProgress.currentDay), [dayProgress.currentDay]);
  const selectedPlanDay = dayPlan.find((item) => item.day === selectedDay) ?? dayProgress.currentPlan;
  const selectedMissionConfig = useMemo(
    () => getMissionDayConfig(selectedPlanDay.day, selectedPlanDay),
    [selectedPlanDay]
  );
  const selectedRationale = useMemo(() => getDayRationale(selectedPlanDay.day), [selectedPlanDay.day]);
  const selectedQuestionCount = selectedMissionConfig.questionSets.reduce(
    (total, set) => total + set.questions.length,
    0
  );

  const visiblePlan = dayPlan.map((item) => ({
    ...item,
    liveStatus: studyProgress.completedDays.includes(item.day)
      ? "complete"
      : item.day === dayProgress.currentDay
        ? "current"
        : item.day < dayProgress.currentDay
          ? "skipped"
          : "upcoming"
  }));

  return (
    <section className="space-y-5">
      <div className="grid gap-5 xl:grid-cols-[1fr_0.9fr]">
        <div className="panel rounded-[28px] p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-teal-300">30-day plan</p>
          <h1 className="mt-3 text-3xl font-bold text-slate-100">One month, one visible path.</h1>
          <p className="mt-3 max-w-2xl text-slate-400">
            This is the full mission map, driven by your saved day progress instead of placeholder numbers.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <PlanStat label="Days completed" value={`${completedCount} / ${dayPlan.length}`} tone="success" />
            <PlanStat label="Current day" value={`Day ${dayProgress.currentDay}`} tone="accent" />
            <PlanStat label="Checkpoints cleared" value={`${completedCheckpoints} / ${checkpointDays.length}`} tone="warning" />
          </div>

          <div className="mt-6 rounded-[24px] border border-slate-800 bg-slate-950/60 p-5">
            <div className="mb-2 flex items-center justify-between gap-3 text-sm text-slate-400">
              <span>Plan progress</span>
              <span className="font-semibold text-slate-200">{dayProgress.progressPercent}%</span>
            </div>
            <ProgressBar value={dayProgress.progressPercent} />
            <p className="mt-4 text-sm leading-6 text-slate-300">{todayRationale}</p>
          </div>
        </div>

        <div className="panel rounded-[28px] p-6">
          <p className="text-sm font-semibold text-slate-100">What’s next</p>
          <div className="mt-5 space-y-5">
            <div>
              <div className="mb-2 flex items-center justify-between text-sm text-slate-400">
                <span>Current mission day</span>
                <span className="font-semibold text-slate-200">Day {dayProgress.currentDay}</span>
              </div>
              <div className="rounded-[22px] border border-sky-400/20 bg-gradient-to-br from-sky-500/10 to-slate-950/95 p-5">
                <p className="text-lg font-bold text-slate-100">{dayProgress.currentPlan.title}</p>
                <p className="mt-2 text-sm text-slate-400">{dayProgress.currentPlan.focus}</p>
                <p className="mt-4 text-sm text-slate-500">
                  {dayProgress.currentPlan.missionType} • {dayProgress.currentPlan.duration}
                </p>
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between text-sm text-slate-400">
                <span>Upcoming day</span>
                <span className="font-semibold text-slate-200">
                  {upcomingDay.hasUpcomingDay ? `Day ${upcomingDay.nextDay}` : "Plan complete"}
                </span>
              </div>
              <div className="rounded-[22px] border border-slate-800 bg-slate-950/60 p-5 text-sm text-slate-300">
                {upcomingDay.hasUpcomingDay ? (
                  <>
                    <p className="font-semibold text-slate-100">{upcomingDay.nextPlan.title}</p>
                    <p className="mt-2 text-slate-400">{upcomingDay.nextPlan.focus}</p>
                    <p className="mt-4 text-slate-500">
                      {upcomingDay.nextPlan.missionType} • {upcomingDay.nextPlan.duration}
                    </p>
                  </>
                ) : (
                  <p>You’ve reached the end of the 30-day sequence.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="panel rounded-[28px] p-6">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-slate-100">30-day study map</p>
            <p className="text-sm text-slate-400">Completed, current, and upcoming days are shown from your saved progress. Click any day to preview it.</p>
          </div>
          <div className="flex gap-2">
            <Chip tone="success">Complete</Chip>
            <Chip tone="accent">Today</Chip>
            <Chip>Upcoming</Chip>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {visiblePlan.map((item) => (
            <button
              key={item.day}
              type="button"
              onClick={() => setSelectedDay(item.day)}
              className={cn(
                "rounded-[24px] border p-4 text-left transition",
                item.liveStatus === "complete" && "border-teal-500/30 bg-teal-500/10",
                item.liveStatus === "current" && "border-sky-400 bg-sky-500/10 shadow-panel",
                item.liveStatus === "skipped" && "border-amber-500/20 bg-amber-500/8",
                item.liveStatus === "upcoming" && "border-slate-800 bg-slate-950/60",
                selectedDay === item.day && "ring-2 ring-sky-300/60"
              )}
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-slate-200">Day {item.day}</p>
                <Chip
                  tone={
                    item.liveStatus === "complete"
                      ? "success"
                      : item.liveStatus === "current"
                        ? "accent"
                        : "default"
                  }
                >
                  {item.liveStatus === "current"
                    ? "Today"
                    : item.liveStatus === "complete"
                      ? "Complete"
                      : item.liveStatus === "skipped"
                        ? "Past"
                        : "Upcoming"}
                </Chip>
              </div>
              <p className="mt-3 text-lg font-bold text-slate-100">{item.title}</p>
              <p className="mt-2 text-sm text-slate-400">{item.focus}</p>
              <p className="mt-4 text-sm text-slate-500">
                {item.missionType} • {item.duration}
              </p>
            </button>
          ))}
        </div>
      </section>

      <section className="panel rounded-[28px] p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-slate-100">Day preview</p>
            <h2 className="mt-2 text-2xl font-bold text-slate-100">
              Day {selectedPlanDay.day}: {selectedPlanDay.title}
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">{selectedRationale}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Chip tone={selectedPlanDay.day === dayProgress.currentDay ? "accent" : "default"}>
              {selectedPlanDay.day === dayProgress.currentDay ? "Current day" : selectedPlanDay.missionType}
            </Chip>
            <Chip>{selectedPlanDay.duration}</Chip>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <PlanStat label="Focus" value={selectedPlanDay.focus} tone="accent" />
          <PlanStat label="Mission label" value={selectedMissionConfig.missionLabel} tone="success" />
          <PlanStat label="Question load" value={`${selectedQuestionCount} questions`} tone="warning" />
        </div>

        <div className="mt-6 grid gap-5 xl:grid-cols-[1fr_0.9fr]">
          <div className="rounded-[24px] border border-slate-800 bg-slate-950/60 p-5">
            <p className="text-sm font-semibold text-slate-100">Mission flow</p>
            <div className="mt-4 space-y-3">
              {selectedMissionConfig.steps.map((step, index) => (
                <div
                  key={step.id}
                  className="rounded-[20px] border border-slate-800 bg-slate-950/80 p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-slate-100">
                      Step {index + 1}: {step.title}
                    </p>
                    <Chip>{step.durationMin} min</Chip>
                  </div>
                  <p className="mt-2 text-sm text-slate-400">{step.detail}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[24px] border border-slate-800 bg-slate-950/60 p-5">
            <p className="text-sm font-semibold text-slate-100">Brief preview</p>
            <p className="mt-4 text-lg font-semibold text-slate-100">{selectedMissionConfig.briefHeadline}</p>
            <p className="mt-3 text-sm leading-6 text-slate-400">{selectedMissionConfig.briefBody}</p>
            <div className="mt-5 space-y-3">
              {selectedMissionConfig.briefCards.map((card) => (
                <div
                  key={card.title}
                  className="rounded-[20px] border border-slate-800 bg-slate-950/80 p-4"
                >
                  <p className="font-semibold text-slate-100">{card.title}</p>
                  <p className="mt-2 text-sm text-slate-400">{card.detail}</p>
                </div>
              ))}
            </div>
            <div className="mt-5">
              <Button href="/app/mission">
                {selectedPlanDay.day === dayProgress.currentDay ? "Open current mission" : "Return to current mission"}
              </Button>
            </div>
          </div>
        </div>
      </section>
    </section>
  );
}

function PlanStat({
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
      <p className="mt-2 text-2xl font-bold text-slate-100">{value}</p>
    </div>
  );
}
