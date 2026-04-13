import { promises as fs } from "fs";
import path from "path";
import { hashSync } from "bcryptjs";
import {
  AppDatabase,
  Booking,
  ChatMessage,
  Child,
  ProgressCategory,
  ProgressEntry,
  User,
  UserRole,
} from "@/lib/types";

const PAYMENT_METHODS: Booking["paymentMethod"][] = [
  "card",
  "mpesa",
  "bank_transfer",
  "cash",
  "pay_later",
];
const PAYMENT_STATUSES: Booking["paymentStatus"][] = ["unpaid", "pending_verification", "paid"];
const BOOKING_STATUSES: Booking["status"][] = ["pending", "approved", "declined"];
const PROGRESS_CATEGORIES: ProgressCategory[] = ["learning", "social", "wellbeing", "general"];

function normalizeBooking(raw: Record<string, unknown>): Booking {
  const base = raw as Partial<Booking>;
  const pm = base.paymentMethod as Booking["paymentMethod"];
  const ps = base.paymentStatus as Booking["paymentStatus"];
  const st = base.status as Booking["status"];
  return {
    id: String(base.id ?? ""),
    parentUserId: String(base.parentUserId ?? ""),
    parentName: String(base.parentName ?? ""),
    parentEmail: String(base.parentEmail ?? ""),
    parentPhone: String(base.parentPhone ?? ""),
    childName: String(base.childName ?? ""),
    childAge: String(base.childAge ?? ""),
    childAllergies: String(base.childAllergies ?? ""),
    emergencyContactName: String(base.emergencyContactName ?? ""),
    emergencyContactPhone: String(base.emergencyContactPhone ?? ""),
    date: String(base.date ?? ""),
    dropOffTime: String(base.dropOffTime ?? ""),
    pickUpTime: String(base.pickUpTime ?? ""),
    programType: String(base.programType ?? "Full day"),
    notes: String(base.notes ?? ""),
    paymentMethod: PAYMENT_METHODS.includes(pm) ? pm : "pay_later",
    paymentReference: String(base.paymentReference ?? ""),
    paymentStatus: PAYMENT_STATUSES.includes(ps) ? ps : "unpaid",
    status: BOOKING_STATUSES.includes(st) ? st : "pending",
  };
}

function normalizeChild(raw: Record<string, unknown>): Child {
  const base = raw as Partial<Child>;
  return {
    id: String(base.id ?? ""),
    name: String(base.name ?? ""),
    age: typeof base.age === "number" ? base.age : Number(base.age) || 0,
    classroom: String(base.classroom ?? "Unassigned"),
    allergies: base.allergies !== undefined ? String(base.allergies) : undefined,
    parentUserId: String(base.parentUserId ?? ""),
  };
}

function normalizeMessage(raw: Record<string, unknown>): ChatMessage {
  const base = raw as Partial<ChatMessage>;
  const role = base.role === "parent" || base.role === "staff" ? base.role : "staff";
  return {
    id: String(base.id ?? ""),
    from: String(base.from ?? ""),
    role,
    message: String(base.message ?? ""),
    sentAt: String(base.sentAt ?? new Date().toISOString()),
    threadParentUserId: String(base.threadParentUserId ?? ""),
  };
}

function normalizeProgress(raw: Record<string, unknown>): ProgressEntry {
  const base = raw as Partial<ProgressEntry>;
  const cat = base.category as ProgressCategory;
  return {
    id: String(base.id ?? ""),
    childId: String(base.childId ?? ""),
    title: String(base.title ?? ""),
    detail: String(base.detail ?? ""),
    category: PROGRESS_CATEGORIES.includes(cat) ? cat : "general",
    recordedAt: String(base.recordedAt ?? new Date().toISOString()),
    recordedByName: String(base.recordedByName ?? ""),
  };
}

const dbPath = path.join(process.cwd(), "data", "db.json");

function normalizeUserRole(role: string): UserRole {
  return role === "parent" ? "parent" : "admin";
}

const defaultDb: AppDatabase = {
  users: [
    {
      id: "u1",
      name: "Admin User",
      email: "admin@daycare.com",
      passwordHash: hashSync("admin123", 10),
      role: "admin",
    },
  ],
  children: [
    { id: "c1", name: "Ayaan N.", age: 4, classroom: "Sunflower", parentUserId: "", allergies: undefined },
    { id: "c2", name: "Mia K.", age: 3, classroom: "Rainbow", parentUserId: "", allergies: "Peanuts" },
    { id: "c3", name: "Noah T.", age: 5, classroom: "Explorer", parentUserId: "" },
  ],
  bookings: [
    {
      id: "b1",
      parentUserId: "",
      parentName: "Fatma Ali",
      parentEmail: "fatma@example.com",
      parentPhone: "+254712000000",
      childName: "Ayaan N.",
      childAge: "4",
      childAllergies: "None",
      emergencyContactName: "Omar Ali",
      emergencyContactPhone: "+254723000000",
      date: "2026-04-14",
      dropOffTime: "08:00",
      pickUpTime: "16:00",
      programType: "Full day",
      notes: "Early drop-off agreed",
      paymentMethod: "mpesa",
      paymentReference: "QAB1CDE2",
      paymentStatus: "paid",
      status: "approved",
    },
  ],
  messages: [
    {
      id: "m1",
      from: "Teacher Grace",
      role: "staff",
      message: "Staff notice: review new parent registrations in Bookings.",
      sentAt: new Date().toISOString(),
      threadParentUserId: "",
    },
  ],
  progress: [
    {
      id: "p1",
      childId: "c1",
      title: "Settled well after circle time",
      detail: "Joined group song and shared during show-and-tell.",
      category: "social",
      recordedAt: new Date().toISOString(),
      recordedByName: "Teacher Grace",
    },
  ],
};

async function ensureDb() {
  try {
    await fs.access(dbPath);
  } catch {
    await fs.mkdir(path.dirname(dbPath), { recursive: true });
    await fs.writeFile(dbPath, JSON.stringify(defaultDb, null, 2), "utf-8");
  }
}

export async function readDb(): Promise<AppDatabase> {
  await ensureDb();
  const raw = await fs.readFile(dbPath, "utf-8");
  const data = JSON.parse(raw) as AppDatabase;
  data.users = (data.users ?? []).map((u) => ({
    ...(u as User),
    role: normalizeUserRole(String((u as User).role)),
  }));
  data.bookings = data.bookings.map((b) => normalizeBooking(b as unknown as Record<string, unknown>));
  data.children = (data.children ?? []).map((c) => normalizeChild(c as unknown as Record<string, unknown>));
  data.messages = (data.messages ?? []).map((m) => normalizeMessage(m as unknown as Record<string, unknown>));
  data.progress = (data.progress ?? []).map((p) => normalizeProgress(p as unknown as Record<string, unknown>));
  return data;
}

export async function writeDb(data: AppDatabase): Promise<void> {
  await fs.writeFile(dbPath, JSON.stringify(data, null, 2), "utf-8");
}
