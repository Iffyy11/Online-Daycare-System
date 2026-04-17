import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { readDb, writeDb } from "@/lib/db";
import type { ProgressCategory } from "@/lib/types";

function isStaff(role: string): boolean {
  return role === "admin" || role === "teacher";
}

const schema = z.object({
  childId: z.string().min(1),
  title: z.string().min(2),
  detail: z.string().min(1),
  category: z.enum(["learning", "social", "wellbeing", "general"]),
});

export async function POST(request: Request) {
  const session = await getSession();
  if (!session || !isStaff(session.role)) {
    return NextResponse.json({ error: "Only staff can log progress." }, { status: 403 });
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
  try {
    await writeDb(db);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Save failed.";
    console.error("POST /api/staff/progress", err);
    return NextResponse.json(
      {
        error: message.includes("MongoDB") ? message : "Could not save to the database.",
        hint: message.includes("Vercel") || message.includes("MongoDB")
          ? "Confirm MONGODB_URI on the server and redeploy."
          : undefined,
      },
      { status: 503 },
    );
  }
  revalidatePath("/children");
  revalidatePath("/parent/my-children");
  revalidatePath(`/parent/my-children/${parsed.data.childId}`);
  return NextResponse.json({ data: entry }, { status: 201 });
}
