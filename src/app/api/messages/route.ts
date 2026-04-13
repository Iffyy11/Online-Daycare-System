import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { readDb, writeDb } from "@/lib/db";

const parentBodySchema = z.object({
  message: z.string().min(1).max(500),
});

const staffBodySchema = z.object({
  message: z.string().min(1).max(500),
  threadParentUserId: z.string().min(1),
});

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const db = await readDb();
  if (session.role === "parent") {
    const mine = db.messages.filter((m) => m.threadParentUserId === session.userId);
    return NextResponse.json({ data: mine });
  }
  return NextResponse.json({ data: db.messages });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const db = await readDb();

  if (session.role === "parent") {
    const parsed = parentBodySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid message." }, { status: 400 });
    }
    const newMessage = {
      id: `m${Date.now()}`,
      from: session.name,
      role: "parent" as const,
      message: parsed.data.message,
      sentAt: new Date().toISOString(),
      threadParentUserId: session.userId,
    };
    db.messages.push(newMessage);
    await writeDb(db);
    return NextResponse.json({ data: newMessage }, { status: 201 });
  }

  const parsed = staffBodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
           { error: "Invalid message. Include threadParentUserId (parent account id)." },
      { status: 400 },
    );
  }
  const parentExists = db.users.some(
    (u) => u.id === parsed.data.threadParentUserId && u.role === "parent",
  );
  if (!parentExists) {
    return NextResponse.json({ error: "Parent account not found." }, { status: 404 });
  }

  const newMessage = {
    id: `m${Date.now()}`,
    from: session.name,
    role: "staff" as const,
    message: parsed.data.message,
    sentAt: new Date().toISOString(),
    threadParentUserId: parsed.data.threadParentUserId,
  };
  db.messages.push(newMessage);
  await writeDb(db);
  return NextResponse.json({ data: newMessage }, { status: 201 });
}
