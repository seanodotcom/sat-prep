import { NextResponse } from "next/server";
import { readAppStateFromDb, updateAppStateInDb } from "@/lib/app-state-db";

export const runtime = "nodejs";

export async function GET() {
  const appState = await readAppStateFromDb();
  return NextResponse.json(appState);
}

export async function PUT(request: Request) {
  const body = (await request.json()) as {
    onboardingPreferences?: Parameters<typeof updateAppStateInDb>[0]["onboardingPreferences"];
    studyProgress?: Parameters<typeof updateAppStateInDb>[0]["studyProgress"];
    missionProgress?: Parameters<typeof updateAppStateInDb>[0]["missionProgress"];
  };

  const nextState = await updateAppStateInDb({
    onboardingPreferences: body.onboardingPreferences,
    studyProgress: body.studyProgress,
    missionProgress: body.missionProgress
  });

  return NextResponse.json(nextState);
}
