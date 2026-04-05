import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl items-center px-6 py-10 lg:px-8">
      <section className="panel w-full rounded-[36px] p-8 lg:p-12">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-teal-300">Welcome</p>
        <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-tight text-slate-100 lg:text-6xl">
          Summit SAT gives you one clear 30-day mission and tells you exactly what to do next.
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-slate-400">
          Start by adding your personal info. Once that's set, the app will take you straight
          into your day-by-day mission flow.
        </p>
        <div className="mt-8">
          <Button href="/onboarding">Set up personal info</Button>
        </div>
      </section>
    </main>
  );
}
