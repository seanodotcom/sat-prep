import { cn } from "@/lib/utils";

const progressTones = {
  accent:
    "bg-gradient-to-r from-teal-400 via-sky-400 to-cyan-300 shadow-[0_0_24px_rgba(56,189,248,0.2)]",
  success:
    "bg-gradient-to-r from-emerald-400 via-teal-300 to-lime-300 shadow-[0_0_24px_rgba(52,211,153,0.2)]",
  warning:
    "bg-gradient-to-r from-amber-300 via-orange-400 to-coral shadow-[0_0_24px_rgba(251,146,60,0.2)]",
  coral:
    "bg-gradient-to-r from-coral via-rose-400 to-amber-300 shadow-[0_0_24px_rgba(251,113,133,0.18)]",
  slate:
    "bg-gradient-to-r from-slate-300 via-slate-400 to-slate-200 shadow-[0_0_20px_rgba(148,163,184,0.14)]"
} as const;

export function ProgressBar({
  value,
  className,
  tone = "accent"
}: {
  value: number;
  className?: string;
  tone?: keyof typeof progressTones;
}) {
  const clampedValue = Math.max(0, Math.min(100, value));

  return (
    <div
      className={cn(
        "relative h-2.5 w-full overflow-hidden rounded-full border border-white/5 bg-slate-900/90",
        className
      )}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_60%)]" />
      <div
        className={cn(
          "relative h-full rounded-full transition-[width] duration-500 ease-out",
          progressTones[tone]
        )}
        style={{ width: `${clampedValue}%` }}
      />
    </div>
  );
}
