import { NextResponse } from "next/server";
import { readContentFromDb, upsertPlanDayInDb, upsertQuestionInDb } from "@/lib/content-db";
import type { PlanDayContent, Question } from "@/lib/types";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json(await readContentFromDb());
}

export async function PUT(request: Request) {
  const body = (await request.json()) as
    | { type: "question"; value: Question }
    | { type: "planDay"; value: PlanDayContent };

  if (body.type === "question") {
    return NextResponse.json({
      type: "question",
      value: await upsertQuestionInDb(body.value)
    });
  }

  if (body.type === "planDay") {
    return NextResponse.json({
      type: "planDay",
      value: await upsertPlanDayInDb(body.value)
    });
  }

  return NextResponse.json({ error: "Unsupported content update" }, { status: 400 });
}
