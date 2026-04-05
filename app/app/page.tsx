import { AppShell } from "@/components/layout/app-shell";
import { HeroCard } from "@/components/dashboard/hero-card";
import { MissionOverview } from "@/components/dashboard/mission-overview";

export default function DashboardPage() {
  return (
    <AppShell currentPath="/app">
      <HeroCard />
      <MissionOverview />
    </AppShell>
  );
}
