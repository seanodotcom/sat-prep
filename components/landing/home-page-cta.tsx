"use client";

import { useEffect, useState } from "react";
import {
  readClientAppState,
  subscribeToAppStateSync,
  syncAppStateFromServer
} from "@/lib/app-state-client";
import { Button } from "@/components/ui/button";
import {
  defaultOnboardingPreferences,
  hasCompletedOnboarding,
  type OnboardingPreferences
} from "@/lib/storage";

export function HomePageCta() {
  const [preferences, setPreferences] = useState<OnboardingPreferences>(defaultOnboardingPreferences);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    function syncFromClientState() {
      setPreferences(readClientAppState().onboardingPreferences);
    }

    try {
      syncFromClientState();
      void syncAppStateFromServer().then((state) => {
        setPreferences(state.onboardingPreferences);
      });
    } finally {
      setHydrated(true);
    }

    return subscribeToAppStateSync(syncFromClientState);
  }, []);

  const returningStudent = hydrated && hasCompletedOnboarding(preferences);

  return (
    <div className="mt-8 space-y-4">
      <Button href={returningStudent ? "/app" : "/onboarding"}>
        {returningStudent ? "Resume my plan" : "Set up personal info"}
      </Button>
      {returningStudent ? (
        <p className="text-sm text-slate-500">
          Welcome back, {preferences.firstName}. Your saved target is {preferences.targetScore}.
        </p>
      ) : null}
    </div>
  );
}
