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

export async function appendContactLead(
  entry: Pick<ContactLeadRecord, "name" | "email" | "message" | "emailDispatched">,
): Promise<ContactLeadRecord> {
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
  await fs.writeFile(filePath, JSON.stringify(list, null, 2), "utf-8");
  return record;
}
