"use client";

import { useMemo } from "react";
import { useStudyContent } from "@/lib/use-study-content";

export function RewardsUpcoming() {
  const { planDays } = useStudyContent();

  const upcoming = useMemo(
    () =>
      planDays
        .filter((item) => item.day >= 13 && item.day <= 16)
        .sort((left, right) => left.day - right.day),
    [planDays]
  );

  return (
    <div className="mt-5 space-y-3">
      {upcoming.map((item) => (
        <div key={item.day} className="rounded-[20px] border border-slate-800 bg-slate-950/60 p-4">
          <p className="font-semibold text-slate-100">
            Day {item.day}: {item.title}
          </p>
          <p className="mt-2 text-sm text-slate-400">{item.focus}</p>
        </div>
      ))}
    </div>
  );
}
