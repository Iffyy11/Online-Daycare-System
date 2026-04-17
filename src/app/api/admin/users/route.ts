import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { readDb, writeDb } from "@/lib/db";

const bodySchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8, "Use at least 8 characters"),
  role: z.enum(["teacher"]),
});

const BCRYPT_ROUNDS = Math.min(
  12,
  Math.max(8, Number.parseInt(process.env.BCRYPT_ROUNDS ?? "8", 10) || 8),
);

/** Admin-only: create teacher (or other staff) accounts with known credentials. */
export async function POST(request: Request) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Only administrators can create staff accounts." }, { status: 403 });
  }

  const parsed = bodySchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid data. Use a valid email and password (8+ characters)." }, { status: 400 });
  }

  try {
    const db = await readDb();
    const email = parsed.data.email.toLowerCase();
    if (db.users.some((u) => u.email.toLowerCase() === email)) {
      return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
    }

    const passwordHash = await hash(parsed.data.password, BCRYPT_ROUNDS);
    const user = {
      id: `st_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      name: parsed.data.name.trim(),
      email,
      passwordHash,
      role: parsed.data.role,
    };

    db.users.push(user);
    await writeDb(db);

    return NextResponse.json(
      {
        data: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not create account.";
    if (message.includes("Database not configured for Vercel") || message.includes("MongoDB write failed on Vercel")) {
      return NextResponse.json(
        {
          error: message,
          hint: "Set MONGODB_URI on Vercel and redeploy.",
        },
        { status: 503 },
      );
    }
    console.error("POST /api/admin/users", error);
    return NextResponse.json({ error: "Could not create staff account." }, { status: 500 });
  }
}
