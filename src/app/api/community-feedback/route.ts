import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { prependCommunityFeedbackMongo, readDb, writeDb } from "@/lib/db";
import { isMongoEnabled } from "@/lib/mongo-client";
import type { CommunityFeedback } from "@/lib/types";

const postSchema = z.object({
  content: z.string().min(15).max(800),
});

export async function GET() {
  const db = await readDb();
  const list = [...db.communityFeedback].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
  return NextResponse.json({ data: list });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session || session.role !== "parent") {
    return NextResponse.json({ error: "Parents must be signed in to share feedback." }, { status: 401 });
  }

  const parsed = postSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Please write at least a few sentences (15–800 characters)." }, { status: 400 });
  }

  const entry: CommunityFeedback = {
    id: `fb_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    authorUserId: session.userId,
    authorName: session.name,
    content: parsed.data.content.trim(),
    createdAt: new Date().toISOString(),
  };

  try {
    if (isMongoEnabled()) {
      await prependCommunityFeedbackMongo(entry);
    } else {
      const db = await readDb();
      db.communityFeedback.unshift(entry);
      await writeDb(db);
    }
    return NextResponse.json({ data: entry }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not save feedback.";
    if (
      message.includes("Database not configured for Vercel") ||
      message.includes("MongoDB write failed on Vercel")
    ) {
      return NextResponse.json(
        {
          error: message,
          hint: "In Vercel: Project → Settings → Environment Variables → add MONGODB_URI, redeploy, then try again.",
        },
        { status: 503 },
      );
    }
    console.error("POST /api/community-feedback", error);
    return NextResponse.json(
      { error: message.includes("Mongo") ? message : "Could not save feedback. Please try again." },
      { status: 500 },
    );
  }
}
