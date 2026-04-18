import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { pushChildMongo, readDb, writeDb } from "@/lib/db";
import { isMongoEnabled } from "@/lib/mongo-client";
import type { Child } from "@/lib/types";

const childSchema = z.object({
  name: z.string().min(2),
  age: z.coerce.number().int().min(0).max(18),
  allergies: z.string().optional().default(""),
});

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "parent") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const db = await readDb();
  const mine = db.children.filter((c) => c.parentUserId === session.userId);
  return NextResponse.json({ data: mine });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session || session.role !== "parent") {
    return NextResponse.json({ error: "Parents must be signed in to add a child." }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = childSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please enter a name (at least 2 characters) and an age from 0–18." },
      { status: 400 },
    );
  }

  const allergyRaw = parsed.data.allergies?.trim() ?? "";
  const allergies =
    allergyRaw && allergyRaw.toLowerCase() !== "none" ? allergyRaw : undefined;

  const child: Child = {
    id: `c_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    name: parsed.data.name.trim(),
    age: parsed.data.age,
    classroom: "Pending assignment",
    allergies,
    parentUserId: session.userId,
  };
  /** Strip undefined so Mongo/BSON and JSON file writes never carry explicit undefined keys. */
  const childToSave = JSON.parse(JSON.stringify(child)) as Child;

  try {
    if (isMongoEnabled()) {
      await pushChildMongo(childToSave);
    } else {
      const db = await readDb();
      db.children.push(childToSave);
      await writeDb(db);
    }
    return NextResponse.json({ data: childToSave }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not save child.";
    const needsMongoHint =
      message.includes("Database not configured for Vercel") ||
      message.includes("MongoDB write failed on Vercel") ||
      message.includes("MONGODB_URI") ||
      /mongo(db)?/i.test(message);

    if (needsMongoHint) {
      return NextResponse.json(
        {
          error: message,
          hint: "Check MONGODB_URI in Vercel (or .env.local), Atlas IP access list (0.0.0.0/0 for serverless), database user password, then redeploy.",
        },
        { status: 503 },
      );
    }
    console.error("POST /api/parent/children", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
