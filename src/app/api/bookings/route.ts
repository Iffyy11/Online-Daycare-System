import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { readDb, writeDb } from "@/lib/db";
import type { Booking } from "@/lib/types";

const bookingSchema = z.object({
  parentName: z.string().min(2),
  parentEmail: z.string().email(),
  parentPhone: z.string().min(5),
  childName: z.string().min(2),
  childAge: z.string().min(1),
  childAllergies: z.string().optional().default(""),
  emergencyContactName: z.string().min(2),
  emergencyContactPhone: z.string().min(5),
  date: z.string().min(8),
  dropOffTime: z.string().min(4),
  pickUpTime: z.string().min(4),
  programType: z.string().min(2),
  notes: z.string().optional().default(""),
  paymentMethod: z.enum(["mpesa", "cash"]),
  paymentReference: z.string().optional().default(""),
});

function derivePaymentStatus(method: Booking["paymentMethod"]): Booking["paymentStatus"] {
  if (method === "cash") return "unpaid";
  return "pending_verification";
}

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const db = await readDb();
  if (session.role === "parent") {
    const mine = db.bookings.filter((b) => b.parentUserId === session.userId);
    return NextResponse.json({ data: mine });
  }
  return NextResponse.json({ data: db.bookings });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = bookingSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid booking data." }, { status: 400 });
  }

  const db = await readDb();
  const paymentStatus = derivePaymentStatus(parsed.data.paymentMethod);
  const parentUserId = session.role === "parent" ? session.userId : "";

  const booking: Booking = {
    id: `b${Date.now()}`,
    parentUserId,
    parentName: parsed.data.parentName,
    parentEmail: parsed.data.parentEmail,
    parentPhone: parsed.data.parentPhone,
    childName: parsed.data.childName,
    childAge: parsed.data.childAge,
    childAllergies: parsed.data.childAllergies ?? "",
    emergencyContactName: parsed.data.emergencyContactName,
    emergencyContactPhone: parsed.data.emergencyContactPhone,
    date: parsed.data.date,
    dropOffTime: parsed.data.dropOffTime,
    pickUpTime: parsed.data.pickUpTime,
    programType: parsed.data.programType,
    notes: parsed.data.notes ?? "",
    paymentMethod: parsed.data.paymentMethod,
    paymentReference: parsed.data.paymentReference ?? "",
    paymentStatus,
    status: "pending",
  };

  db.bookings.unshift(booking);
  await writeDb(db);
  return NextResponse.json({ data: booking }, { status: 201 });
}
