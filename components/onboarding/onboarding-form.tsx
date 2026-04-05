"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { syncAppStateFromServer, persistOnboardingPreferences } from "@/lib/app-state-client";
import {
  defaultOnboardingPreferences,
  hasCompletedOnboarding,
  loadOnboardingPreferences,
  type OnboardingPreferences
} from "@/lib/storage";

export function OnboardingForm() {
  const router = useRouter();
  const [preferences, setPreferences] = useState<OnboardingPreferences>(defaultOnboardingPreferences);
  const [hydrated, setHydrated] = useState(false);
  const returningStudent = hydrated && hasCompletedOnboarding(preferences);

  useEffect(() => {
    try {
      setPreferences(loadOnboardingPreferences());
      void syncAppStateFromServer().then((state) => {
        setPreferences(state.onboardingPreferences);
      });
    } finally {
      setHydrated(true);
    }
  }, []);

  function updatePreference<K extends keyof OnboardingPreferences>(
    key: K,
    value: OnboardingPreferences[K]
  ) {
    setPreferences((current) => ({
      ...current,
      [key]: value
    }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await persistOnboardingPreferences(preferences);
    router.push("/app");
  }

  return (
    <form className="panel rounded-[32px] p-6 lg:p-8" onSubmit={handleSubmit}>
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-teal-300">Personal info</p>
          <h1 className="mt-3 text-4xl font-bold text-slate-100">
            {returningStudent ? "Update your saved plan settings." : "Tell the app who it's planning for."}
          </h1>
          <p className="mt-4 text-slate-400">
            {returningStudent
              ? "These values are already saved on this device. Change them here any time and the rest of the app will pick them up."
              : "Start with your name and a few planning defaults. Once this is saved, the app can drop you directly into the 30-day mission."}
          </p>
        </div>
        <div className="grid gap-4">
          {returningStudent ? (
            <div className="rounded-[22px] border border-teal-400/20 bg-gradient-to-br from-teal-500/10 to-slate-950 p-5 text-sm text-slate-200">
              <p className="font-semibold text-white">Saved profile found</p>
              <p className="mt-2">
                {preferences.firstName}, your current plan is already active. You can update it here or jump straight back into the dashboard.
              </p>
            </div>
          ) : null}
          <Field
            label="First name"
            value={preferences.firstName}
            onChange={(value) => updatePreference("firstName", value)}
          />
          <Field
            label="Target score"
            type="number"
            min={400}
            max={1600}
            step={10}
            value={preferences.targetScore}
            onChange={(value) => updatePreference("targetScore", Number(value) || 1400)}
          />
          <Field
            label="Target test date"
            type="date"
            value={preferences.targetTestDate}
            onChange={(value) => updatePreference("targetTestDate", value)}
          />
          <Field
            label="Preferred daily minutes"
            type="number"
            min={5}
            max={120}
            step={5}
            value={preferences.preferredDailyMinutes}
            onChange={(value) => updatePreference("preferredDailyMinutes", Number(value) || 20)}
          />
          <SelectField
            label="Section to emphasize first"
            value={preferences.focusSection}
            onChange={(value) =>
              updatePreference("focusSection", value as OnboardingPreferences["focusSection"])
            }
            options={["Math", "Reading & Writing"]}
          />
          <div className="rounded-[22px] border border-sky-500/20 bg-gradient-to-br from-sky-500/10 to-slate-950 p-5 text-sm text-slate-200">
            <p className="font-semibold text-white">Starter plan preview</p>
            <p className="mt-2">
              {preferences.firstName || "You"} will start with a {preferences.targetScore} target, {preferences.preferredDailyMinutes}-minute study blocks, and {preferences.focusSection} as the first emphasis area.
            </p>
          </div>
          <div className="rounded-[22px] border border-slate-800 bg-slate-950 p-5 text-sm text-slate-200">
            <p className="font-semibold text-white">Future-ready note</p>
            <p className="mt-2">
              Keep this form intentionally small. The schema should still support later additions like diagnostic score bands, confidence ratings, and school schedule constraints.
            </p>
          </div>
          <div className="flex gap-3">
            <Button type="submit">{returningStudent ? "Save changes" : "Create my starter plan"}</Button>
            {returningStudent ? <Button href="/app" variant="secondary">Back to dashboard</Button> : null}
            <Button href="/" variant="secondary">
              Welcome
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  min,
  max,
  step
}: {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  type?: "text" | "number" | "date";
  min?: number;
  max?: number;
  step?: number;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-semibold text-slate-100">{label}</span>
      <input
        type={type}
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-[18px] border border-slate-800 bg-slate-950/80 px-4 py-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-sky-400"
      />
    </label>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-semibold text-slate-100">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-[18px] border border-slate-800 bg-slate-950/80 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-sky-400"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}
