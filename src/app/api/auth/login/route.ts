import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";
import { authCookieName, authenticate } from "@/lib/auth";

const bodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(request: Request) {
  const parsed = bodySchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input." }, { status: 400 });
  }

  const result = await authenticate(parsed.data.email, parsed.data.password);
  if (!result) {
    return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
  }

  const store = await cookies();
  store.set(authCookieName, result.token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  });

  return NextResponse.json({ data: result.payload });
}
