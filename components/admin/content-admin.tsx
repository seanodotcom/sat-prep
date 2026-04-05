"use client";

import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { hydrateMissionConfig } from "@/lib/content";
import { upsertPlanDayContent, upsertQuestionContent } from "@/lib/content-client";
import { useStudyContent } from "@/lib/use-study-content";
import type { PlanDayContent, Question } from "@/lib/types";

export function ContentAdmin() {
  const { questions, planDays } = useStudyContent();
  const [selectedQuestionId, setSelectedQuestionId] = useState("");
  const [questionDraft, setQuestionDraft] = useState<Question | null>(null);
  const [selectedDay, setSelectedDay] = useState(1);
  const [planDraft, setPlanDraft] = useState<PlanDayContent | null>(null);
  const [saving, setSaving] = useState<"question" | "planDay" | null>(null);

  useEffect(() => {
    if (!selectedQuestionId && questions[0]) {
      setSelectedQuestionId(questions[0].id);
    }
  }, [questions, selectedQuestionId]);

  useEffect(() => {
    if (!planDays.find((item) => item.day === selectedDay) && planDays[0]) {
      setSelectedDay(planDays[0].day);
    }
  }, [planDays, selectedDay]);

  useEffect(() => {
    const nextQuestion = questions.find((question) => question.id === selectedQuestionId) ?? null;
    setQuestionDraft(nextQuestion ? JSON.parse(JSON.stringify(nextQuestion)) : null);
  }, [questions, selectedQuestionId]);

  useEffect(() => {
    const nextPlanDay = planDays.find((planDay) => planDay.day === selectedDay) ?? null;
    setPlanDraft(nextPlanDay ? JSON.parse(JSON.stringify(nextPlanDay)) : null);
  }, [planDays, selectedDay]);

  const missionPreview = useMemo(
    () => (planDraft ? hydrateMissionConfig(planDraft, questions) : null),
    [planDraft, questions]
  );

  async function saveQuestion() {
    if (!questionDraft) return;
    setSaving("question");
    try {
      await upsertQuestionContent({
        ...questionDraft,
        choices: questionDraft.choices.filter(Boolean),
        errorTags: questionDraft.errorTags.filter(Boolean)
      });
    } finally {
      setSaving(null);
    }
  }

  async function savePlanDay() {
    if (!planDraft) return;
    setSaving("planDay");
    try {
      await upsertPlanDayContent(planDraft);
    } finally {
      setSaving(null);
    }
  }

  return (
    <AppShell currentPath="/app/admin">
      <section className="panel rounded-[28px] p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-teal-300">Content admin</p>
        <h1 className="mt-3 text-3xl font-bold text-slate-100">Edit questions and plan content without touching code.</h1>
        <p className="mt-3 max-w-3xl text-slate-400">
          This is a lightweight authoring workspace for your one-person workflow. Update the question bank, tune plan-day copy, and save changes straight into the database.
        </p>
      </section>

      <div className="grid gap-5 xl:grid-cols-[1fr_1fr]">
        <section className="panel rounded-[28px] p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-slate-100">Question bank</p>
              <p className="text-sm text-slate-400">Select a question, edit its content, then save.</p>
            </div>
            <select
              value={selectedQuestionId}
              onChange={(event) => setSelectedQuestionId(event.target.value)}
              className="rounded-[16px] border border-slate-800 bg-slate-950/80 px-4 py-2 text-sm text-slate-100"
            >
              {questions.map((question) => (
                <option key={question.id} value={question.id}>
                  {question.id}
                </option>
              ))}
            </select>
          </div>

          {questionDraft ? (
            <div className="mt-5 space-y-4">
              <TextField label="Prompt" value={questionDraft.prompt} onChange={(value) => setQuestionDraft({ ...questionDraft, prompt: value })} multiline />
              <div className="grid gap-4 md:grid-cols-2">
                <TextField label="Section" value={questionDraft.section} onChange={(value) => setQuestionDraft({ ...questionDraft, section: value as Question["section"] })} />
                <TextField label="Domain" value={questionDraft.domain} onChange={(value) => setQuestionDraft({ ...questionDraft, domain: value })} />
                <TextField label="Skill" value={questionDraft.skill} onChange={(value) => setQuestionDraft({ ...questionDraft, skill: value })} />
                <TextField label="Answer" value={questionDraft.answer} onChange={(value) => setQuestionDraft({ ...questionDraft, answer: value })} />
                <TextField
                  label="Difficulty"
                  value={String(questionDraft.difficulty)}
                  onChange={(value) =>
                    setQuestionDraft({
                      ...questionDraft,
                      difficulty: Math.max(1, Math.min(5, Number(value) || 1)) as Question["difficulty"]
                    })
                  }
                />
                <TextField
                  label="Estimated time (sec)"
                  value={String(questionDraft.estimatedTimeSec)}
                  onChange={(value) =>
                    setQuestionDraft({
                      ...questionDraft,
                      estimatedTimeSec: Math.max(15, Number(value) || 60)
                    })
                  }
                />
              </div>
              <TextField
                label="Choices"
                value={questionDraft.choices.join("\n")}
                onChange={(value) =>
                  setQuestionDraft({
                    ...questionDraft,
                    choices: value.split("\n").map((item) => item.trim()).filter(Boolean)
                  })
                }
                multiline
              />
              <TextField
                label="Error tags"
                value={questionDraft.errorTags.join(", ")}
                onChange={(value) =>
                  setQuestionDraft({
                    ...questionDraft,
                    errorTags: value.split(",").map((item) => item.trim()).filter(Boolean)
                  })
                }
              />
              <TextField
                label="Explanation"
                value={questionDraft.explanation}
                onChange={(value) => setQuestionDraft({ ...questionDraft, explanation: value })}
                multiline
              />
              <Button onClick={saveQuestion}>{saving === "question" ? "Saving..." : "Save question"}</Button>
            </div>
          ) : null}
        </section>

        <section className="panel rounded-[28px] p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-slate-100">Plan day</p>
              <p className="text-sm text-slate-400">Tune the day copy and question assignments.</p>
            </div>
            <select
              value={selectedDay}
              onChange={(event) => setSelectedDay(Number(event.target.value))}
              className="rounded-[16px] border border-slate-800 bg-slate-950/80 px-4 py-2 text-sm text-slate-100"
            >
              {planDays.map((planDay) => (
                <option key={planDay.day} value={planDay.day}>
                  Day {planDay.day}
                </option>
              ))}
            </select>
          </div>

          {planDraft ? (
            <div className="mt-5 space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <TextField label="Title" value={planDraft.title} onChange={(value) => setPlanDraft({ ...planDraft, title: value })} />
                <TextField label="Mission type" value={planDraft.missionType} onChange={(value) => setPlanDraft({ ...planDraft, missionType: value })} />
                <TextField label="Focus" value={planDraft.focus} onChange={(value) => setPlanDraft({ ...planDraft, focus: value })} />
                <TextField label="Duration" value={planDraft.duration} onChange={(value) => setPlanDraft({ ...planDraft, duration: value })} />
              </div>
              <TextField label="Rationale" value={planDraft.rationale} onChange={(value) => setPlanDraft({ ...planDraft, rationale: value })} multiline />
              <TextField
                label="Mission label"
                value={planDraft.missionConfig.missionLabel}
                onChange={(value) =>
                  setPlanDraft({
                    ...planDraft,
                    missionConfig: { ...planDraft.missionConfig, missionLabel: value }
                  })
                }
              />
              <TextField
                label="Brief headline"
                value={planDraft.missionConfig.briefHeadline}
                onChange={(value) =>
                  setPlanDraft({
                    ...planDraft,
                    missionConfig: { ...planDraft.missionConfig, briefHeadline: value }
                  })
                }
              />
              <TextField
                label="Brief body"
                value={planDraft.missionConfig.briefBody}
                onChange={(value) =>
                  setPlanDraft({
                    ...planDraft,
                    missionConfig: { ...planDraft.missionConfig, briefBody: value }
                  })
                }
                multiline
              />
              <TextField
                label="Drill question IDs"
                value={planDraft.missionConfig.questionSets.find((set) => set.stepId === "drill")?.questionIds.join(", ") ?? ""}
                onChange={(value) =>
                  setPlanDraft({
                    ...planDraft,
                    missionConfig: {
                      ...planDraft.missionConfig,
                      questionSets: planDraft.missionConfig.questionSets.map((set) =>
                        set.stepId === "drill"
                          ? {
                              ...set,
                              questionIds: value.split(",").map((item) => item.trim()).filter(Boolean)
                            }
                          : set
                      )
                    }
                  })
                }
              />
              <TextField
                label="Mini-test question IDs"
                value={planDraft.missionConfig.questionSets.find((set) => set.stepId === "mini")?.questionIds.join(", ") ?? ""}
                onChange={(value) =>
                  setPlanDraft({
                    ...planDraft,
                    missionConfig: {
                      ...planDraft.missionConfig,
                      questionSets: planDraft.missionConfig.questionSets.map((set) =>
                        set.stepId === "mini"
                          ? {
                              ...set,
                              questionIds: value.split(",").map((item) => item.trim()).filter(Boolean)
                            }
                          : set
                      )
                    }
                  })
                }
              />
              <Button onClick={savePlanDay}>{saving === "planDay" ? "Saving..." : "Save plan day"}</Button>
              {missionPreview ? (
                <div className="rounded-[22px] border border-slate-800 bg-slate-950/70 p-4 text-sm text-slate-300">
                  <p className="font-semibold text-slate-100">Preview</p>
                  <p className="mt-2">{missionPreview.briefHeadline}</p>
                  <p className="mt-2 text-slate-400">
                    Drill questions: {missionPreview.questionSets.find((set) => set.stepId === "drill")?.questions.length ?? 0}
                    {" · "}
                    Mini-test questions: {missionPreview.questionSets.find((set) => set.stepId === "mini")?.questions.length ?? 0}
                  </p>
                </div>
              ) : null}
            </div>
          ) : null}
        </section>
      </div>
    </AppShell>
  );
}

function TextField({
  label,
  value,
  onChange,
  multiline = false
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
}) {
  const sharedClassName =
    "w-full rounded-[18px] border border-slate-800 bg-slate-950/80 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-sky-400";

  return (
    <label className="grid gap-2">
      <span className="text-sm font-semibold text-slate-100">{label}</span>
      {multiline ? (
        <textarea
          rows={4}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={sharedClassName}
        />
      ) : (
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={sharedClassName}
        />
      )}
    </label>
  );
}
