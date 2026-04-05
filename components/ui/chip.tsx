import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function Chip({
  children,
  tone = "default"
}: {
  children: ReactNode;
  tone?: "default" | "accent" | "success" | "warning";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
        tone === "default" && "bg-slate-800 text-slate-300",
        tone === "accent" && "bg-sky-500/15 text-sky-300",
        tone === "success" && "bg-teal-500/15 text-teal-300",
        tone === "warning" && "bg-amber-500/15 text-amber-300"
      )}
    >
      {children}
    </span>
  );
}
