import { NextResponse } from "next/server";
import { readDb } from "@/lib/db";
import { getMongoClient, isMongoEnabled } from "@/lib/mongo-client";

export const dynamic = "force-dynamic";

/**
 * Quick connectivity check for MongoDB vs local JSON.
 * Does not print secrets. Safe to hit from browser while debugging deploys.
 */
export async function GET() {
  const mongoUriConfigured = isMongoEnabled();
  const databaseName = process.env.MONGODB_DB?.trim() || "daycare";
  const onVercel = process.env.VERCEL === "1" || process.env.VERCEL === "true";

  try {
    if (mongoUriConfigured) {
      const pingStart = Date.now();
      const client = await getMongoClient();
      await client.db("admin").command({ ping: 1 });
      const pingMs = Date.now() - pingStart;

      const readStart = Date.now();
      const db = await readDb();
      const readMs = Date.now() - readStart;

      return NextResponse.json({
        ok: true,
        persistence: "mongodb",
        mongoUriConfigured: true,
        onVercel,
        database: databaseName,
        pingMs,
        readMs,
        counts: {
          users: db.users.length,
          bookings: db.bookings.length,
          children: db.children.length,
          messages: db.messages.length,
        },
        hint: "If login or saves fail, confirm this shows ok:true after deploy and that MONGODB_URI has no angle brackets or spaces.",
      });
    }

    const db = await readDb();
    return NextResponse.json({
      ok: true,
      persistence: "local-json",
      mongoUriConfigured: false,
      onVercel,
      database: databaseName,
      counts: {
        users: db.users.length,
        bookings: db.bookings.length,
        children: db.children.length,
        messages: db.messages.length,
      },
      note: "MONGODB_URI is not set — using data/db.json. Fine for local dev.",
      warning: onVercel
        ? "On Vercel you must set MONGODB_URI or sign-up, bookings, and staff data will not persist reliably."
        : undefined,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      {
        ok: false,
        persistence: mongoUriConfigured ? "mongodb" : "local-json",
        mongoUriConfigured,
        onVercel,
        database: databaseName,
        error: message,
        hint: "Check the password in MONGODB_URI (replace <db_password>), IP access list in Atlas (allow 0.0.0.0/0 for testing or Vercel egress), and redeploy after changing env vars.",
      },
      { status: 503 },
    );
  }
}
