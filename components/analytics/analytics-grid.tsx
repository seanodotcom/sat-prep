import { skillMetrics } from "@/data/mock-data";
import { ProgressBar } from "@/components/ui/progress";

export function AnalyticsGrid() {
  return (
    <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
      <section className="panel rounded-[28px] p-6">
        <p className="text-sm font-semibold text-slate-100">Section performance</p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <MetricCard title="Math accuracy" value="81%" subtext="+6 pts this week" progress={81} />
          <MetricCard title="Reading & Writing" value="74%" subtext="+3 pts this week" progress={74} />
          <MetricCard title="Average pace" value="64 sec" subtext="Goal: under 60 sec" progress={68} />
          <MetricCard title="Review resolution" value="58%" subtext="7 retries completed" progress={58} />
        </div>
      </section>
      <section className="panel rounded-[28px] p-6">
        <p className="text-sm font-semibold text-slate-100">Weak-area table</p>
        <div className="mt-5 space-y-4">
          {skillMetrics.map((metric) => (
            <div key={metric.skill} className="rounded-[22px] border border-slate-800 bg-slate-950/60 p-4">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-slate-100">{metric.skill}</p>
                <p className="text-sm text-slate-400">{metric.avgTimeSec}s</p>
              </div>
              <div className="mt-3">
                <ProgressBar value={metric.accuracy} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function MetricCard({
  title,
  value,
  subtext,
  progress
}: {
  title: string;
  value: string;
  subtext: string;
  progress: number;
}) {
  return (
    <div className="rounded-[24px] border border-slate-800 bg-slate-950/60 p-5">
      <p className="text-sm text-slate-400">{title}</p>
      <p className="mt-2 text-3xl font-bold text-slate-100">{value}</p>
      <p className="mt-2 text-sm text-slate-400">{subtext}</p>
      <ProgressBar value={progress} className="mt-4" />
    </div>
  );
}
