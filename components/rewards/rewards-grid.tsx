import { rewardBadges } from "@/data/mock-data";
import { Chip } from "@/components/ui/chip";

export function RewardsGrid() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {rewardBadges.map((badge) => (
        <div
          key={badge.id}
          className="panel rounded-[28px] p-5"
        >
          <div className="flex items-center justify-between">
            <Chip tone={badge.earned ? "success" : "default"}>{badge.category}</Chip>
            <p className="text-sm text-slate-500">{badge.earned ? "Earned" : "Locked"}</p>
          </div>
          <p className="mt-5 text-xl font-bold text-slate-100">{badge.title}</p>
          <p className="mt-3 text-sm text-slate-400">{badge.detail}</p>
        </div>
      ))}
    </div>
  );
}
