import { compare } from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { readDb } from "@/lib/db";
import { UserRole } from "@/lib/types";

const AUTH_COOKIE = "daycare_auth_token";
const AUTH_SECRET = process.env.AUTH_SECRET ?? "dev-only-secret-change-me";

type AuthPayload = {
  userId: string;
  email: string;
  role: UserRole;
  name: string;
};

export async function authenticate(email: string, password: string) {
  const db = await readDb();
  const user = db.users.find((item) => item.email.toLowerCase() === email.toLowerCase());
  if (!user) return null;
  const valid = await compare(password, user.passwordHash);
  if (!valid) return null;

  const payload: AuthPayload = {
    userId: user.id,
    email: user.email,
    role: user.role === "parent" ? "parent" : "admin",
    name: user.name,
  };
  const token = jwt.sign(payload, AUTH_SECRET, { expiresIn: "12h" });
  return { token, payload };
}

export async function getSession(): Promise<AuthPayload | null> {
  const store = await cookies();
  const token = store.get(AUTH_COOKIE)?.value;
  if (!token) return null;
  try {
    const raw = jwt.verify(token, AUTH_SECRET) as AuthPayload;
    const role: UserRole = raw.role === "parent" ? "parent" : "admin";
    return { ...raw, role };
  } catch {
    return null;
  }
}

export const authCookieName = AUTH_COOKIE;
