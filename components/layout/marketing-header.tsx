import { marketingNav } from "@/lib/navigation";
import { Button } from "@/components/ui/button";

export function MarketingHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/65 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-teal-300">Summit SAT</p>
          <p className="text-lg font-bold text-slate-100">Study Workspace</p>
        </div>
        <nav className="hidden items-center gap-6 text-sm text-slate-400 md:flex">
          {marketingNav.map((item) => (
            <a key={item.href} href={item.href} className="transition hover:text-slate-100">
              {item.label}
            </a>
          ))}
        </nav>
        <Button href="/onboarding" className="hidden md:inline-flex">
          Start studying
        </Button>
      </div>
    </header>
  );
}
