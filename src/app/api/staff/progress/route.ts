import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { readDb, writeDb } from "@/lib/db";
import type { ProgressCategory } from "@/lib/types";

const schema = z.object({
  childId: z.string().min(1),
  title: z.string().min(2),
  detail: z.string().min(1),
  category: z.enum(["learning", "social", "wellbeing", "general"]),
});

export async function POST(request: Request) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid progress data." }, { status: 400 });
  }

  const db = await readDb();
  const child = db.children.find((c) => c.id === parsed.data.childId);
  if (!child) {
    return NextResponse.json({ error: "Child not found." }, { status: 404 });
  }

  const entry = {
    id: `pr_${Date.now()}`,
    childId: parsed.data.childId,
    title: parsed.data.title.trim(),
    detail: parsed.data.detail.trim(),
    category: parsed.data.category as ProgressCategory,
    recordedAt: new Date().toISOString(),
    recordedByName: session.name,
  };
  db.progress.unshift(entry);
  await writeDb(db);
  return NextResponse.json({ data: entry }, { status: 201 });
}
