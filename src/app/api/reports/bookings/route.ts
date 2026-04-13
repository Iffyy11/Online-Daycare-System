import { getSession } from "@/lib/auth";
import { readDb } from "@/lib/db";

function csvCell(value: string): string {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return new Response("Forbidden", { status: 403 });
  }
  const db = await readDb();
  const header = [
    "id",
    "parentUserId",
    "parentName",
    "parentEmail",
    "parentPhone",
    "childName",
    "childAge",
    "childAllergies",
    "emergencyContactName",
    "emergencyContactPhone",
    "date",
    "dropOffTime",
    "pickUpTime",
    "programType",
    "notes",
    "paymentMethod",
    "paymentReference",
    "paymentStatus",
    "status",
  ];
  const rows = db.bookings.map((item) =>
    [
      item.id,
      item.parentUserId,
      item.parentName,
      item.parentEmail,
      item.parentPhone,
      item.childName,
      item.childAge,
      item.childAllergies,
      item.emergencyContactName,
      item.emergencyContactPhone,
      item.date,
      item.dropOffTime,
      item.pickUpTime,
      item.programType,
      item.notes,
      item.paymentMethod,
      item.paymentReference,
      item.paymentStatus,
      item.status,
    ].map(csvCell).join(","),
  );
  const csv = [header.join(","), ...rows].join("\n");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="bookings-report.csv"',
    },
  });
}
