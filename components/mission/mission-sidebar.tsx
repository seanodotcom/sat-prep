import { ProgressBar } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import type { MissionStep } from "@/lib/types";

export function MissionSidebar({
  steps,
  completedSteps,
  progressValue,
  onResetMission,
  canReset
}: {
  steps: MissionStep[];
  completedSteps: number;
  progressValue: number;
  onResetMission: () => void;
  canReset: boolean;
}) {
  return (
    <div className="space-y-5">
      <section className="panel rounded-[28px] p-5">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-slate-100">Mission progress</p>
          {canReset ? (
            <button
              type="button"
              onClick={onResetMission}
              className="rounded-full border border-slate-700 bg-slate-950/70 px-3 py-1.5 text-xs font-semibold text-slate-300 transition hover:border-slate-600 hover:text-slate-100"
            >
              Reset progress
            </button>
          ) : null}
        </div>
        <div className="mt-4">
          <div className="mb-2 flex items-center justify-between text-sm text-slate-400">
            <span>{completedSteps} of {steps.length} complete</span>
            <span className="font-semibold text-slate-200">{progressValue}%</span>
          </div>
          <ProgressBar value={progressValue} />
          <div className="mt-4 flex flex-wrap gap-2">
            {steps.map((step, index) => (
              <span
                key={step.id}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em]",
                  step.status === "complete" && "border-teal-400/25 bg-teal-500/10 text-teal-200",
                  step.status === "active" && "border-sky-400/25 bg-sky-500/10 text-sky-200",
                  step.status === "up-next" && "border-slate-800 bg-slate-950/60 text-slate-500"
                )}
              >
                <span
                  className={cn(
                    "h-2 w-2 rounded-full",
                    step.status === "complete" && "bg-teal-300",
                    step.status === "active" && "bg-sky-300",
                    step.status === "up-next" && "bg-slate-700"
                  )}
                />
                Step {index + 1}
              </span>
            ))}
          </div>
        </div>
      </section>
      <section className="panel rounded-[28px] p-5">
        <p className="text-sm font-semibold text-slate-100">Step stack</p>
        <div className="mt-4 space-y-3">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={cn(
                "rounded-[20px] border p-3 transition",
                step.status === "active" &&
                  "border-sky-400/35 bg-gradient-to-br from-sky-500/14 to-slate-950/90 shadow-[0_12px_30px_rgba(14,165,233,0.12)]",
                step.status === "complete" &&
                  "border-teal-400/30 bg-gradient-to-br from-teal-500/10 to-slate-950/90",
                step.status === "up-next" && "border-slate-800 bg-slate-950/60"
              )}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "h-3 w-3 rounded-full border-2",
                      step.status === "active" && "border-sky-300 ring-4 ring-sky-400/25",
                      step.status === "complete" && "border-teal-300 bg-teal-300/90",
                      step.status === "up-next" && "border-slate-600"
                    )}
                  />
                  <div>
                  <p className="font-medium text-slate-100">{step.title}</p>
                  <p className="mt-1 text-xs text-slate-500">Step {index + 1}</p>
                  </div>
                </div>
                <p
                  className={cn(
                    "text-xs uppercase tracking-[0.18em]",
                    step.status === "active" && "text-sky-300",
                    step.status === "complete" && "text-teal-300",
                    step.status === "up-next" && "text-slate-500"
                  )}
                >
                  {step.status}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
