import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { readDb, writeDb } from "@/lib/db";

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
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const parsed = childSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid child data." }, { status: 400 });
  }

  const db = await readDb();
  const child = {
    id: `c_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    name: parsed.data.name.trim(),
    age: parsed.data.age,
    classroom: "Pending assignment",
    allergies: parsed.data.allergies?.trim() || undefined,
    parentUserId: session.userId,
  };
  db.children.push(child);
  await writeDb(db);
  return NextResponse.json({ data: child }, { status: 201 });
}
