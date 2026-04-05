"use client";

import { useEffect, useMemo, useState } from "react";
import { allMissionQuestions } from "@/data/mock-data";
import { Chip } from "@/components/ui/chip";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { defaultMissionProgress, type StoredMissionProgress } from "@/lib/storage";
import type { MissionDayConfig, MissionQuestionSet, MissionStep } from "@/lib/types";

export function MissionPlayer({
  currentDay,
  missionConfig,
  progress,
  questionSet,
  steps,
  onAdvanceStep,
  onResetMission,
  setProgress
}: {
  currentDay: number;
  missionConfig: MissionDayConfig;
  progress: StoredMissionProgress;
  questionSet: MissionQuestionSet;
  steps: MissionStep[];
  onAdvanceStep: () => void;
  onResetMission: () => void;
  setProgress: React.Dispatch<React.SetStateAction<StoredMissionProgress>>;
}) {
  const [elapsedSec, setElapsedSec] = useState(0);
  const currentStep = steps[Math.min(progress.currentStepIndex, steps.length - 1)];
  const questions = questionSet.questions;
  const reviewItems = allMissionQuestions.filter(
    (item) =>
      progress.reviewQuestionIds.includes(item.id) || progress.flaggedQuestionIds.includes(item.id)
  );
  const hasReviewItems = reviewItems.length > 0;
  const safeQuestionIndex = Math.min(progress.questionIndex, Math.max(questions.length - 1, 0));
  const question = questions[safeQuestionIndex] ?? allMissionQuestions[0];
  const isCorrect = progress.selectedChoice === question.answer;
  const isLast = progress.questionIndex === questions.length - 1;
  const completedQuestions = progress.answeredQuestionIds.length;
  const progressPercent = Math.round((completedQuestions / questions.length) * 100);
  const accuracyPercent = completedQuestions === 0 ? 0 : Math.round((progress.correctCount / completedQuestions) * 100);
  const drillComplete = progress.currentStepIndex === 1 && progress.submitted && isLast;
  const miniComplete = progress.currentStepIndex === 2 && progress.submitted && isLast;
  const inMiniTest = currentStep.id === "mini";
  const paceTargetSec = question.estimatedTimeSec;
  const remainingSec = paceTargetSec - elapsedSec;
  const paceProgress = Math.min((elapsedSec / paceTargetSec) * 100, 100);
  const timerTone =
    remainingSec <= 0 ? "danger" : remainingSec <= 15 ? "warning" : "good";

  const submitDisabled = !progress.selectedChoice || progress.submitted;
  const alreadyQueuedForReview = progress.reviewQuestionIds.includes(question.id);
  const isFlagged = progress.flaggedQuestionIds.includes(question.id);

  const missionSummary = useMemo(
    () => [
      { label: "Completed", value: `${completedQuestions}/${questions.length}`, tone: "accent" as const },
      { label: "Correct", value: `${progress.correctCount}`, tone: "success" as const },
      { label: "Accuracy", value: `${accuracyPercent}%`, tone: "warning" as const }
    ],
    [accuracyPercent, completedQuestions, progress.correctCount, questions.length]
  );

  useEffect(() => {
    setElapsedSec(0);
  }, [progress.currentStepIndex, progress.questionIndex]);

  useEffect(() => {
    if (!inMiniTest || progress.submitted) return;

    const intervalId = window.setInterval(() => {
      setElapsedSec((value) => value + 1);
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [inMiniTest, progress.submitted]);

  function handleSubmit() {
    if (!progress.selectedChoice) return;

    setProgress((current) => {
      const activeQuestion = questions[current.questionIndex];
      const questionId = activeQuestion.id;
      const answeredQuestionIds = current.answeredQuestionIds.includes(questionId)
        ? current.answeredQuestionIds
        : [...current.answeredQuestionIds, questionId];
      const gotCorrect = current.selectedChoice === activeQuestion.answer;

      return {
        ...current,
        submitted: true,
        answeredQuestionIds,
        correctCount:
          gotCorrect && !current.answeredQuestionIds.includes(questionId)
            ? current.correctCount + 1
            : current.correctCount,
        reviewQuestionIds:
          !gotCorrect && !current.reviewQuestionIds.includes(questionId)
            ? [...current.reviewQuestionIds, questionId]
            : current.reviewQuestionIds
      };
    });
  }

  function handleNext() {
    if (isLast) return;
    setProgress((current) => ({
      ...current,
      questionIndex: current.questionIndex + 1,
      selectedChoice: null,
      submitted: false
    }));
  }

  function handleReset() {
    setProgress(defaultMissionProgress);
  }

  function handleQueueForReview() {
    setProgress((current) => ({
      ...current,
      reviewQuestionIds: current.reviewQuestionIds.includes(question.id)
        ? current.reviewQuestionIds
        : [...current.reviewQuestionIds, question.id]
    }));
  }

  function handleFlag() {
    setProgress((current) => ({
      ...current,
      flaggedQuestionIds: current.flaggedQuestionIds.includes(question.id)
        ? current.flaggedQuestionIds.filter((id) => id !== question.id)
        : [...current.flaggedQuestionIds, question.id]
    }));
  }

  if (currentStep.id === "brief") {
    return (
      <div className="space-y-5">
        <section className="grid gap-4 md:grid-cols-3">
          <SummaryCard label="Mission length" value={missionConfig.missionLengthLabel} tone="accent" />
          <SummaryCard label="Primary focus" value={missionConfig.primaryFocusLabel} tone="success" />
          <SummaryCard label="Finish line" value={missionConfig.finishLineLabel} tone="warning" />
        </section>

        <section className="panel rounded-[28px] p-6">
          <div className="flex flex-wrap items-center gap-3">
            <Chip tone="warning">Step 1 of {steps.length}</Chip>
            <Chip tone="accent">Mission Brief</Chip>
            <Chip>Day {currentDay}</Chip>
            <Chip>{missionConfig.missionLabel}</Chip>
          </div>

          <h2 className="mt-5 text-3xl font-bold text-slate-100">{missionConfig.briefHeadline}</h2>
          <p className="mt-3 max-w-2xl text-slate-400">
            {missionConfig.briefBody}
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {missionConfig.briefCards.map((card) => (
              <BriefCard key={card.title} title={card.title} detail={card.detail} />
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button onClick={onAdvanceStep}>Start targeted drill</Button>
            <Button variant="secondary" onClick={onResetMission}>
              Reset mission
            </Button>
          </div>
        </section>
      </div>
    );
  }

  if (progress.currentStepIndex === 3) {
    return (
      <div className="space-y-5">
        <section className="grid gap-4 md:grid-cols-3">
          <SummaryCard label="Queued" value={`${reviewItems.length}`} tone="accent" />
          <SummaryCard label="Missed" value={`${progress.reviewQuestionIds.length}`} tone="warning" />
          <SummaryCard label="Flagged" value={`${progress.flaggedQuestionIds.length}`} tone="success" />
        </section>

        <section className="panel rounded-[28px] p-6">
          <div className="flex flex-wrap items-center gap-3">
            <Chip tone="warning">Step 4 of 4</Chip>
            <Chip>{currentStep.title}</Chip>
          </div>
          <h2 className="mt-5 text-2xl font-bold text-slate-100">Close the loop on today's misses</h2>
          <p className="mt-3 max-w-2xl text-slate-400">
            The mission is now handing off to review. Everything you missed or flagged in the drill and mini-test is surfaced here before you jump into the dedicated review screen.
          </p>

          {reviewItems.length ? (
            <div className="mt-6 grid gap-4">
              {reviewItems.map((item) => {
                const tone = progress.reviewQuestionIds.includes(item.id) ? "warning" : "accent";

                return (
                  <div
                    key={item.id}
                    className="rounded-[24px] border border-slate-800 bg-gradient-to-br from-slate-900/90 to-slate-950 p-5"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <Chip tone={tone}>
                        {progress.reviewQuestionIds.includes(item.id) ? "Missed earlier" : "Flagged earlier"}
                      </Chip>
                      <Chip>{item.section}</Chip>
                      <Chip tone="success">{item.skill}</Chip>
                    </div>
                    <p className="mt-4 text-lg font-semibold text-slate-100">{item.prompt}</p>
                    <p className="mt-3 text-sm text-slate-400">{item.explanation}</p>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="mt-6 rounded-[24px] border border-dashed border-teal-400/35 bg-teal-500/6 p-5 text-sm text-slate-300">
              Clean run. You didn't miss or flag anything in this prototype mission, so there's nothing waiting in the review queue.
            </div>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            {hasReviewItems ? (
              <>
                <Button href="/app/review">Open review screen</Button>
                <Button variant="secondary" onClick={onAdvanceStep}>
                  Finish mission
                </Button>
              </>
            ) : (
              <>
                <Button onClick={onAdvanceStep}>Finish mission</Button>
                <Button href="/app/review" variant="secondary">
                  Open review screen
                </Button>
              </>
            )}
          </div>
        </section>
      </div>
    );
  }

  if (progress.currentStepIndex >= steps.length) {
    return (
      <div className="space-y-5">
        <section className="panel rounded-[28px] p-6">
          <Chip tone="success">Mission complete</Chip>
          <h2 className="mt-5 text-3xl font-bold text-slate-100">{missionConfig.completionHeadline}</h2>
          <p className="mt-3 max-w-2xl text-slate-400">
            {missionConfig.completionBody}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button href="/app/review">Go to review</Button>
            <Button variant="secondary" onClick={onResetMission}>
              Restart mission
            </Button>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <section className="grid gap-4 md:grid-cols-3">
        {missionSummary.map((item) => (
          <SummaryCard key={item.label} label={item.label} value={item.value} tone={item.tone} />
        ))}
      </section>

      <section className="panel rounded-[28px] p-6">
        <div className="flex flex-wrap items-center gap-3">
          <Chip tone="warning">Step {progress.currentStepIndex + 1} of {steps.length}</Chip>
          <Chip tone="accent">{currentStep.title}</Chip>
          <Chip tone="accent">{question.section}</Chip>
          <Chip>
            Question {progress.questionIndex + 1} of {questions.length}
          </Chip>
          {isFlagged ? <Chip tone="warning">Flagged</Chip> : null}
        </div>

        <h2 className="mt-5 text-2xl font-bold text-slate-100">{question.prompt}</h2>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-slate-400">
            {questionSet.introLabel} · {question.domain} · {question.skill} · Difficulty {question.difficulty}
          </p>
          <div className="h-2 w-40 overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-teal-400 via-sky-400 to-orange-400"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {inMiniTest ? (
          <div
            className={cn(
              "mt-5 rounded-[22px] border p-4 transition-all duration-300",
              timerTone === "good" &&
                "border-emerald-400/30 bg-gradient-to-r from-emerald-500/12 to-slate-950/90",
              timerTone === "warning" &&
                "border-amber-400/35 bg-gradient-to-r from-amber-500/14 to-slate-950/90",
              timerTone === "danger" &&
                "border-rose-400/35 bg-gradient-to-r from-rose-500/14 to-slate-950/90"
            )}
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-100">Mini-test pace check</p>
                <p className="mt-1 text-sm text-slate-400">
                  Target pace for this item: {formatDuration(paceTargetSec)}
                </p>
              </div>
              <div className="text-right">
                <p
                  className={cn(
                    "text-2xl font-bold tabular-nums",
                    timerTone === "good" && "text-emerald-200",
                    timerTone === "warning" && "text-amber-200",
                    timerTone === "danger" && "text-rose-200"
                  )}
                >
                  {remainingSec >= 0
                    ? formatDuration(remainingSec)
                    : `+${formatDuration(Math.abs(remainingSec))}`}
                </p>
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                  {timerTone === "good" && "On pace"}
                  {timerTone === "warning" && "Wrap this up"}
                  {timerTone === "danger" && "Over target"}
                </p>
              </div>
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-900/80">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-500",
                  timerTone === "good" && "bg-gradient-to-r from-emerald-400 to-sky-400",
                  timerTone === "warning" && "bg-gradient-to-r from-amber-400 to-orange-400",
                  timerTone === "danger" && "bg-gradient-to-r from-rose-400 to-red-500"
                )}
                style={{ width: `${paceProgress}%` }}
              />
            </div>
          </div>
        ) : null}

        <div className="mt-6 space-y-3">
          {question.choices.map((choice) => {
            const selected = progress.selectedChoice === choice;
            const correct = progress.submitted && choice === question.answer;
            const wrong = progress.submitted && selected && choice !== question.answer;

            return (
              <button
                key={choice}
                type="button"
                aria-pressed={selected}
                onClick={() =>
                  !progress.submitted &&
                  setProgress((current) => ({ ...current, selectedChoice: choice }))
                }
                className={cn(
                  "w-full rounded-[22px] border px-4 py-4 text-left text-sm font-medium transition-all duration-300 ease-out",
                  "border-slate-800 bg-gradient-to-br from-slate-900/90 to-slate-950/90 text-slate-200 hover:border-slate-700 hover:from-slate-800 hover:to-slate-950",
                  selected &&
                    "border-sky-300 bg-sky-500/18 text-sky-50 ring-2 ring-sky-300/70 shadow-[0_0_0_1px_rgba(125,211,252,0.35),0_16px_40px_rgba(14,165,233,0.18)]",
                  correct &&
                    "border-emerald-400 bg-emerald-500/14 text-emerald-100 ring-2 ring-emerald-300/75 shadow-[0_0_0_1px_rgba(110,231,183,0.4),0_18px_45px_rgba(16,185,129,0.22)]",
                  wrong &&
                    "border-rose-400 bg-rose-500/14 text-rose-200 ring-2 ring-rose-300/45"
                )}
              >
                <div className="flex items-center justify-between gap-3">
                  <span>{choice}</span>
                  {selected ? (
                    <span
                      className={cn(
                        "inline-flex h-7 w-7 items-center justify-center rounded-full border text-xs font-bold transition-all duration-300 ease-out",
                        correct &&
                          "border-emerald-200/90 bg-emerald-300/20 text-emerald-50 shadow-[0_0_18px_rgba(52,211,153,0.28)]",
                        wrong && "border-rose-200/80 bg-rose-300/20 text-rose-50",
                        selected &&
                          !progress.submitted &&
                          "border-sky-200/80 bg-sky-300/20 text-sky-50"
                      )}
                    >
                      ✓
                    </span>
                  ) : (
                    <span className="h-7 w-7 rounded-full border border-slate-700/80 bg-slate-900/70" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        <div className="sticky bottom-4 z-10 mt-6">
          <div className="rounded-[24px] border border-slate-800 bg-slate-950/95 p-4 shadow-[0_24px_60px_rgba(2,6,23,0.55)] backdrop-blur">
            {progress.submitted ? (
              <div className="text-sm text-slate-300">
                <p className="font-semibold text-slate-100">
                  {isCorrect ? "Correct." : "Not quite."}
                </p>
                <p className="mt-2">{question.explanation}</p>
                {!isCorrect ? (
                  <p className="mt-3 text-slate-400">
                    This question is already waiting in your review queue.
                  </p>
                ) : null}
                {drillComplete ? (
                  <p className="mt-3 text-slate-400">
                    Drill complete. The next step is the timed mini-test.
                  </p>
                ) : null}
                {miniComplete ? (
                  <p className="mt-3 text-slate-400">
                    Mini-test complete. Continue into review to clean up anything you missed or flagged.
                  </p>
                ) : null}
                <div className="mt-4 flex flex-wrap gap-3">
                  {!isLast ? (
                    <Button onClick={handleNext}>Next question</Button>
                  ) : drillComplete ? (
                    <Button onClick={onAdvanceStep}>Continue to Timed Mini-Test</Button>
                  ) : miniComplete ? (
                    <Button onClick={onAdvanceStep}>Continue to Mistake Review</Button>
                  ) : (
                    <Button onClick={handleReset}>Restart question set</Button>
                  )}
                  <Button variant="secondary" onClick={handleQueueForReview}>
                    {alreadyQueuedForReview ? "Queued for review" : "Send to review queue"}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-slate-400">
                  Choose an answer, then submit. You can flag this question without leaving the flow.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button
                    onClick={handleSubmit}
                    className={submitDisabled ? "pointer-events-none opacity-50" : ""}
                  >
                    {inMiniTest && remainingSec < 0 ? "Submit answer and move on" : "Submit answer"}
                  </Button>
                  <Button variant="secondary" onClick={handleFlag}>
                    {isFlagged ? "Unflag question" : "Flag for review"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

function formatDuration(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function BriefCard({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="rounded-[24px] border border-slate-800 bg-slate-950/60 p-5">
      <p className="text-lg font-semibold text-slate-100">{title}</p>
      <p className="mt-2 text-sm text-slate-400">{detail}</p>
    </div>
  );
}

function SummaryCard({
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
        "rounded-[24px] border p-4",
        tone === "accent" && "border-sky-400/30 bg-gradient-to-br from-sky-500/14 to-slate-950/90",
        tone === "success" && "border-teal-400/30 bg-gradient-to-br from-teal-500/14 to-slate-950/90",
        tone === "warning" && "border-amber-400/30 bg-gradient-to-br from-amber-500/14 to-slate-950/90"
      )}
    >
      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-2 text-2xl font-bold text-slate-100">{value}</p>
    </div>
  );
}
