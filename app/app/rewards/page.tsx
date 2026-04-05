import { AppShell } from "@/components/layout/app-shell";
import { RewardsGrid } from "@/components/rewards/rewards-grid";
import { RewardsSummary } from "@/components/rewards/rewards-summary";
import { RewardsUpcoming } from "@/components/rewards/rewards-upcoming";

export default function RewardsPage() {
  return (
    <AppShell currentPath="/app/rewards">
      <section className="grid gap-5 xl:grid-cols-[1fr_1fr]">
        <div className="panel rounded-[28px] p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-gold">Rewards</p>
          <h1 className="mt-3 text-3xl font-bold text-slate-100">Momentum systems that stay serious.</h1>
          <p className="mt-3 text-slate-400">
            Rewards reinforce consistency, review quality, and checkpoint completion without turning the app into a toy. The goal is visible momentum you can trust.
          </p>
        </div>
        <div className="panel rounded-[28px] p-6">
          <p className="text-sm font-semibold text-slate-100">Upcoming checkpoints</p>
          <RewardsUpcoming />
        </div>
      </section>
      <RewardsSummary />
      <RewardsGrid />
    </AppShell>
  );
}
