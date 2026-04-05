"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { allMissionQuestions, reviewQueue } from "@/data/mock-data";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { defaultMissionProgress, MISSION_PROGRESS_KEY, type StoredMissionProgress } from "@/lib/storage";
import { getMissionSnapshot } from "@/lib/mission";
import type { SessionReviewItem } from "@/lib/types";

export function SessionReview() {
  const [progress, setProgress] = useState<StoredMissionProgress>(defaultMissionProgress);
  const [hydrated, setHydrated] = useState(false);
  const [activeRetryId, setActiveRetryId] = useState<string | null>(null);
  const [retryChoice, setRetryChoice] = useState<string | null>(null);
  const [retrySubmitted, setRetrySubmitted] = useState(false);
  const retryPanelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(MISSION_PROGRESS_KEY);
      if (stored) {
        setProgress({
          ...defaultMissionProgress,
          ...JSON.parse(stored)
        });
      }
    } catch {
      window.localStorage.removeItem(MISSION_PROGRESS_KEY);
    } finally {
      setHydrated(true);
    }
  }, []);

  const sessionItems = useMemo<SessionReviewItem[]>(() => {
    const reviewIds = new Set(progress.reviewQuestionIds);
    const flaggedIds = new Set(progress.flaggedQuestionIds);

    return allMissionQuestions.flatMap((question) => {
      const inReview = reviewIds.has(question.id);
      const flagged = flaggedIds.has(question.id);

      if (!inReview && !flagged) {
        return [];
      }

      return [
        {
          id: question.id,
          prompt: question.prompt,
          skill: question.skill,
          section: question.section,
          source: inReview ? "missed" : "flagged",
          status: inReview ? "ready" : "new"
        }
      ];
    });
  }, [progress.flaggedQuestionIds, progress.reviewQuestionIds]);

  const snapshot = useMemo(() => getMissionSnapshot(progress), [progress]);
  const missionIsComplete = snapshot.completedSteps >= snapshot.totalSteps;
  const missionReturnLabel = missionIsComplete
    ? "Restart mission"
    : snapshot.activeStep.id === "review"
      ? "Return to mission review"
      : `Resume ${snapshot.activeStep.title}`;
  const missionReturnDetail = missionIsComplete
    ? "You’ve already completed the full mission flow on this device. Restart it if you want to test the loop again."
    : snapshot.activeStep.id === "review"
      ? "You’re already in the review step of the mission flow. Use the mission screen if you want the in-flow version of this handoff."
      : `Your live mission state says the next active step is ${snapshot.activeStep.title}. Jump back in without losing your saved progress.`;
  const activeRetryQuestion = activeRetryId
    ? allMissionQuestions.find((question) => question.id === activeRetryId) ?? null
    : null;
  const retryCorrect = retrySubmitted && retryChoice === activeRetryQuestion?.answer;

  function clearSessionQueue() {
    const nextProgress: StoredMissionProgress = {
      ...progress,
      flaggedQuestionIds: [],
      reviewQuestionIds: []
    };

    setProgress(nextProgress);
    window.localStorage.setItem(MISSION_PROGRESS_KEY, JSON.stringify(nextProgress));
  }

  function startRetry(questionId: string) {
    setActiveRetryId(questionId);
    setRetryChoice(null);
    setRetrySubmitted(false);
  }

  function closeRetry() {
    setActiveRetryId(null);
    setRetryChoice(null);
    setRetrySubmitted(false);
  }

  function submitRetry() {
    if (!retryChoice) return;
    setRetrySubmitted(true);
  }

  function markRetryReviewed(questionId: string) {
    const nextProgress: StoredMissionProgress = {
      ...progress,
      flaggedQuestionIds: progress.flaggedQuestionIds.filter((id) => id !== questionId),
      reviewQuestionIds: progress.reviewQuestionIds.filter((id) => id !== questionId)
    };

    setProgress(nextProgress);
    window.localStorage.setItem(MISSION_PROGRESS_KEY, JSON.stringify(nextProgress));
    closeRetry();
  }

  useEffect(() => {
    if (!activeRetryQuestion || !retryPanelRef.current) return;

    retryPanelRef.current.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }, [activeRetryQuestion]);

  return (
    <section className="space-y-5">
      <div className="panel rounded-[28px] p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-slate-100">Mission handoff</p>
            <p className="mt-2 max-w-2xl text-sm text-slate-400">{missionReturnDetail}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Chip tone={missionIsComplete ? "success" : "accent"}>{snapshot.statusLabel}</Chip>
            <Button href="/app/mission">{missionReturnLabel}</Button>
          </div>
        </div>
      </div>

      <div className="panel rounded-[28px] p-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-slate-100">Current session review</p>
            <p className="text-sm text-slate-400">
              Missed and flagged mission questions now feed this queue directly.
            </p>
          </div>
          {sessionItems.length ? (
            <Button variant="secondary" onClick={clearSessionQueue}>
              Clear session queue
            </Button>
          ) : null}
        </div>

        {!hydrated ? (
          <div className="mt-5 rounded-[22px] border border-slate-800 bg-slate-950/60 p-4 text-sm text-slate-400">
            Loading session review...
          </div>
        ) : sessionItems.length ? (
          <div className="mt-5 grid gap-4">
            {sessionItems.map((item) => (
              <div
                key={item.id}
                className="rounded-[24px] border border-slate-800 bg-gradient-to-br from-slate-900/90 to-slate-950 p-5"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <Chip tone={item.source === "missed" ? "warning" : "accent"}>
                    {item.source === "missed" ? "Missed in mission" : "Flagged in mission"}
                  </Chip>
                  <Chip>{item.section}</Chip>
                  <Chip tone="success">{item.skill}</Chip>
                </div>
                <p className="mt-4 text-lg font-semibold text-slate-100">{item.prompt}</p>
                <p className="mt-3 text-sm text-slate-400">
                  Status: {item.status === "ready" ? "Ready to retry now" : "Saved for later review"}
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <Button variant="secondary" onClick={() => startRetry(item.id)}>
                    {item.source === "missed" ? "Retry now" : "Open review"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-5 rounded-[22px] border border-dashed border-slate-700 bg-slate-950/40 p-5 text-sm text-slate-400">
            No live session items yet. Miss or flag a question in the mission player and it will appear here.
          </div>
        )}
      </div>

      <div className="panel rounded-[28px] p-6">
        <p className="text-sm font-semibold text-slate-100">Seed review bank</p>
        <p className="mt-2 text-sm text-slate-400">
          The static mock queue is still here below the live session layer so the screen stays populated for v1 demos.
        </p>
        <div className="mt-5 grid gap-4">
          {reviewQueue.map((item) => (
            <div
              key={item.id}
              className="rounded-[24px] border border-slate-800 bg-slate-950/60 p-5"
            >
              <div className="flex flex-wrap items-center gap-2">
                <Chip tone="accent">{item.section}</Chip>
                <Chip>{item.skill}</Chip>
                <Chip tone="warning">{item.errorType}</Chip>
              </div>
              <p className="mt-4 text-lg font-semibold text-slate-100">{item.prompt}</p>
              <p className="mt-3 text-sm text-slate-400">Last seen {item.lastSeen}</p>
            </div>
          ))}
        </div>
      </div>

      {activeRetryQuestion ? (
        <div ref={retryPanelRef} className="panel rounded-[28px] border border-sky-400/25 p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-slate-100">Retry question</p>
              <p className="mt-2 text-sm text-slate-400">
                Work through the question again here, then mark it reviewed when you’re done.
              </p>
            </div>
            <Button variant="secondary" onClick={closeRetry}>
              Close retry
            </Button>
          </div>

          <div className="mt-5 rounded-[24px] border border-slate-800 bg-slate-950/60 p-5">
            <div className="flex flex-wrap items-center gap-2">
              <Chip tone="warning">{activeRetryQuestion.section}</Chip>
              <Chip>{activeRetryQuestion.domain}</Chip>
              <Chip tone="success">{activeRetryQuestion.skill}</Chip>
            </div>
            <p className="mt-4 text-lg font-semibold text-slate-100">{activeRetryQuestion.prompt}</p>

            <div className="mt-5 grid gap-3">
              {activeRetryQuestion.choices.map((choice) => {
                const selected = retryChoice === choice;
                const correct = retrySubmitted && choice === activeRetryQuestion.answer;
                const wrong = retrySubmitted && selected && choice !== activeRetryQuestion.answer;

                return (
                  <button
                    key={choice}
                    type="button"
                    onClick={() => !retrySubmitted && setRetryChoice(choice)}
                    className={
                      "w-full rounded-[20px] border px-4 py-4 text-left text-sm font-medium transition " +
                      (selected
                        ? "border-sky-300 bg-sky-500/18 text-sky-50"
                        : "border-slate-800 bg-slate-950/80 text-slate-200 hover:border-slate-700") +
                      (correct ? " border-emerald-400 bg-emerald-500/14 text-emerald-100" : "") +
                      (wrong ? " border-rose-400 bg-rose-500/14 text-rose-200" : "")
                    }
                  >
                    {choice}
                  </button>
                );
              })}
            </div>

            {retrySubmitted ? (
              <div className="mt-5 rounded-[20px] border border-slate-800 bg-slate-950/90 p-4 text-sm text-slate-300">
                <p className="font-semibold text-slate-100">
                  {retryCorrect ? "Nice. That retry is correct." : "Not yet."}
                </p>
                <p className="mt-2">{activeRetryQuestion.explanation}</p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <Button onClick={() => markRetryReviewed(activeRetryQuestion.id)}>
                    Mark as reviewed
                  </Button>
                  {!retryCorrect ? (
                    <Button
                      variant="secondary"
                      onClick={() => {
                        setRetryChoice(null);
                        setRetrySubmitted(false);
                      }}
                    >
                      Try again
                    </Button>
                  ) : null}
                </div>
              </div>
            ) : (
              <div className="mt-5 flex flex-wrap gap-3">
                <Button
                  onClick={submitRetry}
                  className={!retryChoice ? "pointer-events-none opacity-50" : ""}
                >
                  Submit retry
                </Button>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </section>
  );
}
