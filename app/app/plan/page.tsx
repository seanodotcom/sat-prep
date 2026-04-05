import { AppShell } from "@/components/layout/app-shell";
import { PlanCalendar } from "@/components/plan/plan-calendar";

export default function PlanPage() {
  return (
    <AppShell currentPath="/app/plan">
      <PlanCalendar />
    </AppShell>
  );
}
