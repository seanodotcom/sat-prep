import { NextResponse } from "next/server";
import {
  clearActiveReviewItemsInDb,
  deleteReviewItemFromDb,
  readReviewItemsFromDb,
  upsertReviewItemInDb
} from "@/lib/review-items-db";
import type { PersistedReviewItem } from "@/lib/types";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json(await readReviewItemsFromDb());
}

export async function POST(request: Request) {
  const body = (await request.json()) as PersistedReviewItem;
  const item = await upsertReviewItemInDb(body);
  return NextResponse.json(item);
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const scope = searchParams.get("scope");
  const id = searchParams.get("id");

  if (scope === "session") {
    await clearActiveReviewItemsInDb();
    return NextResponse.json({ ok: true });
  }

  if (id) {
    await deleteReviewItemFromDb(id);
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Missing delete target" }, { status: 400 });
}
