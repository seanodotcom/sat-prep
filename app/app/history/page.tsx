import { AppShell } from "@/components/layout/app-shell";
import { QuestionHistory } from "@/components/history/question-history";

export default function HistoryPage() {
  return (
    <AppShell currentPath="/app/history">
      <section className="panel rounded-[28px] p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-amber-300">
          Question history
        </p>
        <h1 className="mt-3 text-3xl font-bold text-slate-100">
          Every submitted answer, with the context that makes it useful.
        </h1>
        <p className="mt-3 max-w-3xl text-slate-400">
          This view turns raw attempt logging into something you can actually learn from:
          question, outcome, timing, and the explanation you would want when reviewing a miss.
        </p>
      </section>
      <QuestionHistory />
    </AppShell>
  );
}
