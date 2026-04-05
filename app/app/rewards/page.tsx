import { AppShell } from "@/components/layout/app-shell";
import { RewardsGrid } from "@/components/rewards/rewards-grid";
import { dayPlan } from "@/data/mock-data";

export default function RewardsPage() {
  return (
    <AppShell currentPath="/app/rewards">
      <section className="grid gap-5 xl:grid-cols-[1fr_1fr]">
        <div className="panel rounded-[28px] p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-gold">Rewards</p>
          <h1 className="mt-3 text-3xl font-bold text-slate-100">Momentum systems that stay serious.</h1>
          <p className="mt-3 text-slate-400">
            Rewards in v1 reinforce consistency, review quality, and checkpoint completion. The visual language stays mature so the app feels performance-oriented, not childish.
          </p>
        </div>
        <div className="panel rounded-[28px] p-6">
          <p className="text-sm font-semibold text-slate-100">Upcoming checkpoints</p>
          <div className="mt-5 space-y-3">
            {dayPlan.slice(12, 16).map((item) => (
              <div key={item.day} className="rounded-[20px] border border-slate-800 bg-slate-950/60 p-4">
                <p className="font-semibold text-slate-100">Day {item.day}: {item.title}</p>
                <p className="mt-2 text-sm text-slate-400">{item.focus}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <RewardsGrid />
    </AppShell>
  );
}
