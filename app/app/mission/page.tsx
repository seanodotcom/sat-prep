import { AppShell } from "@/components/layout/app-shell";
import { MissionExperience } from "@/components/mission/mission-experience";

export default function MissionPage() {
  return (
    <AppShell currentPath="/app/mission">
      <MissionExperience />
    </AppShell>
  );
}
