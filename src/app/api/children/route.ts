import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { readDb } from "@/lib/db";

/** Full roster — admin only. Parents use `/api/parent/children`. */
export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const db = await readDb();
  return NextResponse.json({ data: db.children });
}
