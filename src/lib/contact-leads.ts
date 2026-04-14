import { promises as fs } from "fs";
import path from "path";

export type ContactLeadRecord = {
  id: string;
  name: string;
  email: string;
  message: string;
  receivedAt: string;
  emailDispatched: boolean;
};

const filePath = path.join(process.cwd(), "data", "contact-leads.json");

/**
 * Appends a contact lead to `data/contact-leads.json` when the filesystem is writable (local dev).
 * On read-only hosts (e.g. many serverless deployments), logs and returns null — callers should not fail.
 */
export async function appendContactLead(
  entry: Pick<ContactLeadRecord, "name" | "email" | "message" | "emailDispatched">,
): Promise<ContactLeadRecord | null> {
  try {
    await fs.mkdir(path.dirname(filePath), { recursive: true });
  } catch (e) {
    console.warn("[contact-leads] could not ensure data directory:", e);
    return null;
  }

  let list: ContactLeadRecord[] = [];
  try {
    const raw = await fs.readFile(filePath, "utf-8");
    const parsed = JSON.parse(raw) as unknown;
    if (Array.isArray(parsed)) {
      list = parsed as ContactLeadRecord[];
    }
  } catch {
    list = [];
  }

  const record: ContactLeadRecord = {
    id: `cl_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    name: entry.name,
    email: entry.email,
    message: entry.message,
    receivedAt: new Date().toISOString(),
    emailDispatched: entry.emailDispatched,
  };

  list.push(record);
  try {
    await fs.writeFile(filePath, JSON.stringify(list, null, 2), "utf-8");
  } catch (e) {
    console.warn("[contact-leads] could not write file (common on serverless):", e);
    return null;
  }
  return record;
}
