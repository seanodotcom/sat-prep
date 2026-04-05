import { NextResponse } from "next/server";
import {
  clearMissionAttemptsInDb,
  readMissionAttemptsFromDb,
  upsertMissionAttemptInDb
} from "@/lib/mission-attempts-db";
import type { MissionAttemptRecord } from "@/lib/types";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json(await readMissionAttemptsFromDb());
}

export async function POST(request: Request) {
  const body = (await request.json()) as MissionAttemptRecord;
  return NextResponse.json(await upsertMissionAttemptInDb(body));
}

export async function DELETE() {
  await clearMissionAttemptsInDb();
  return NextResponse.json({ ok: true });
}
