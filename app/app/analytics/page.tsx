import { AppShell } from "@/components/layout/app-shell";
import { AnalyticsGrid } from "@/components/analytics/analytics-grid";

export default function AnalyticsPage() {
  return (
    <AppShell currentPath="/app/analytics">
      <section className="panel rounded-[28px] p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-700">Analytics</p>
        <h1 className="mt-3 text-3xl font-bold text-slate-100">Progress should feel measurable, not vague.</h1>
        <p className="mt-3 max-w-3xl text-slate-400">
          These views track completion, readiness, accuracy, pacing, and review follow-through so you can see exactly where momentum is building and where it still needs work.
        </p>
      </section>
      <AnalyticsGrid />
    </AppShell>
  );
}
