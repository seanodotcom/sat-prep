import { AppShell } from "@/components/layout/app-shell";
import { SessionReview } from "@/components/review/session-review";

export default function ReviewPage() {
  return (
    <AppShell currentPath="/app/review">
      <section className="panel rounded-[28px] p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-coral">Mistake review</p>
        <h1 className="mt-3 text-3xl font-bold text-slate-100">Close the loop before the same errors repeat.</h1>
        <p className="mt-3 max-w-3xl text-slate-400">
          v1 centers review as a first-class screen. Each retry card connects the original miss to a clean error label so analytics, adaptivity, and learning all point at the same data.
        </p>
      </section>
      <SessionReview />
    </AppShell>
  );
}
