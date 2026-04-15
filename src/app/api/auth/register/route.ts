import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { z } from "zod";
import { readDb, writeDb } from "@/lib/db";

const bodySchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8, "Use at least 8 characters"),
});
const BCRYPT_ROUNDS = Math.min(
  12,
  Math.max(8, Number.parseInt(process.env.BCRYPT_ROUNDS ?? "8", 10) || 8),
);

export async function POST(request: Request) {
  const parsed = bodySchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid registration data." }, { status: 400 });
  }

  const db = await readDb();
  const email = parsed.data.email.toLowerCase();
  if (db.users.some((u) => u.email.toLowerCase() === email)) {
    return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
  }

  const passwordHash = await hash(parsed.data.password, BCRYPT_ROUNDS);
  const user = {
    id: `pu_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
    name: parsed.data.name.trim(),
    email: parsed.data.email.trim(),
    passwordHash,
    role: "parent" as const,
  };

  db.users.push(user);
  await writeDb(db);

  return NextResponse.json(
    { data: { id: user.id, email: user.email, name: user.name, role: user.role } },
    { status: 201 },
  );
}
