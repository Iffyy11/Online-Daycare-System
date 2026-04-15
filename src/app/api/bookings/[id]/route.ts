import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { readDb, writeDb } from "@/lib/db";
import type { Booking } from "@/lib/types";

const patchSchema = z
  .object({
    status: z.enum(["pending", "approved", "declined"]).optional(),
    paymentStatus: z.enum(["unpaid", "pending_verification", "paid"]).optional(),
    paymentReference: z.string().optional(),
  })
  .refine((d) => d.status !== undefined || d.paymentStatus !== undefined || d.paymentReference !== undefined, {
    message: "No updates provided.",
  });

export async function PATCH(request: Request, ctx: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session || session.role === "parent") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await ctx.params;
  const parsed = patchSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid update." }, { status: 400 });
  }

  const db = await readDb();
  const idx = db.bookings.findIndex((b) => b.id === id);
  if (idx === -1) {
    return NextResponse.json({ error: "Booking not found." }, { status: 404 });
  }

  const current = db.bookings[idx];
  const next: Booking = { ...current };

  if (parsed.data.status !== undefined) {
    next.status = parsed.data.status;
  }
  if (parsed.data.paymentStatus !== undefined) {
    next.paymentStatus = parsed.data.paymentStatus;
  }
  if (parsed.data.paymentReference !== undefined) {
    next.paymentReference = parsed.data.paymentReference;
  }

  db.bookings[idx] = next;
  await writeDb(db);
  return NextResponse.json({ data: next });
}
