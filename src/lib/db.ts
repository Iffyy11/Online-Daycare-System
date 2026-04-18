import { promises as fs } from "fs";
import path from "path";
import {
  AppDatabase,
  Booking,
  ChatMessage,
  Child,
  CommunityFeedback,
  ProgressCategory,
  ProgressEntry,
  User,
  UserRole,
} from "@/lib/types";
import { getMongoDb, isMongoEnabled } from "@/lib/mongo-client";

const PAYMENT_METHODS: Booking["paymentMethod"][] = ["mpesa", "cash"];
const PAYMENT_STATUSES: Booking["paymentStatus"][] = ["unpaid", "pending_verification", "paid"];
const BOOKING_STATUSES: Booking["status"][] = ["pending", "approved", "declined"];
const PROGRESS_CATEGORIES: ProgressCategory[] = ["learning", "social", "wellbeing", "general"];
/** Precomputed with bcryptjs rounds=10 for default seed accounts (avoids sync hash on cold start). */
const ADMIN_PASSWORD_HASH = "$2b$10$oev4/yqExRj/ATkdNQEpFOBOu7CbRf5X7ZnEVkHQg3ylsKivPgnsy";
const TEACHER_PASSWORD_HASH = "$2b$10$R3G7SYvZLVOx7UlAqQtW9eUXXbNNqgJ90VmDj/vKx6Ly7HI6ylkbO";

const isVercel = process.env.VERCEL === "1" || process.env.VERCEL === "true";

/** True while `npm run build` / `next build` is running (Vercel uses this too). */
function isNpmBuildLifecycle(): boolean {
  return process.env.npm_lifecycle_event === "build";
}

/** Next.js sets this during `next build` (including on Vercel). */
function isNextBuildPhase(): boolean {
  const p = process.env.NEXT_PHASE;
  return p === "phase-production-build" || p === "phase-development-build";
}

function isRunningAppBuild(): boolean {
  return isNpmBuildLifecycle() || isNextBuildPhase();
}

const SNAPSHOT_ID = "app" as const;
const SNAPSHOT_COLLECTION = "app_snapshot";

type AppSnapshotDoc = { _id: typeof SNAPSHOT_ID } & AppDatabase;

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
    paymentMethod: PAYMENT_METHODS.includes(pm) ? pm : "cash",
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

function normalizeCommunityFeedback(raw: Record<string, unknown>): CommunityFeedback {
  const base = raw as Partial<CommunityFeedback>;
  return {
    id: String(base.id ?? ""),
    authorUserId: String(base.authorUserId ?? ""),
    authorName: String(base.authorName ?? ""),
    content: String(base.content ?? ""),
    createdAt: String(base.createdAt ?? new Date().toISOString()),
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

const projectDbPath = path.join(process.cwd(), "data", "db.json");
const dbPath =
  (typeof process.env.DB_FILE_PATH === "string" && process.env.DB_FILE_PATH.trim()) ||
  (process.env.VERCEL ? path.join("/tmp", "daycare-db.json") : projectDbPath);

function normalizeUserRole(role: string): UserRole {
  if (role === "parent") return "parent";
  if (role === "teacher") return "teacher";
  return "admin";
}

const defaultDb: AppDatabase = {
  users: [
    {
      id: "u1",
      name: "Admin User",
      email: "admin@daycare.com",
      passwordHash: ADMIN_PASSWORD_HASH,
      role: "admin",
    },
    {
      id: "t1",
      name: "Teacher Grace",
      email: "teacher@daycare.com",
      passwordHash: TEACHER_PASSWORD_HASH,
      role: "teacher",
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
  communityFeedback: [],
};

function normalizeAppDatabase(data: AppDatabase): AppDatabase {
  const users = (data.users ?? []).map((u) => ({
    ...(u as User),
    role: normalizeUserRole(String((u as User).role)),
  }));
  const hasAdmin = users.some((u) => u.role === "admin");
  const hasTeacher = users.some((u) => u.role === "teacher");
  if (!hasAdmin) {
    users.unshift(defaultDb.users[0]);
  }
  if (!hasTeacher) {
    users.push(defaultDb.users[1]);
  }

  return {
    users,
    bookings: (data.bookings ?? []).map((b) => normalizeBooking(b as unknown as Record<string, unknown>)),
    children: (data.children ?? []).map((c) => normalizeChild(c as unknown as Record<string, unknown>)),
    messages: (data.messages ?? []).map((m) => normalizeMessage(m as unknown as Record<string, unknown>)),
    progress: (data.progress ?? []).map((p) => normalizeProgress(p as unknown as Record<string, unknown>)),
    communityFeedback: (data.communityFeedback ?? []).map((f) =>
      normalizeCommunityFeedback(f as unknown as Record<string, unknown>),
    ),
  };
}

async function ensureJsonFile() {
  try {
    await fs.access(dbPath);
  } catch {
    await fs.mkdir(path.dirname(dbPath), { recursive: true });
    try {
      // In serverless environments, seed writable storage from bundled project data if it exists.
      const bundled = await fs.readFile(projectDbPath, "utf-8");
      await fs.writeFile(dbPath, bundled, "utf-8");
    } catch {
      await fs.writeFile(dbPath, JSON.stringify(defaultDb, null, 2), "utf-8");
    }
  }
}

/** Read-only snapshot shipped with the app (works on Vercel without writable disk). */
async function readBundledJsonDb(): Promise<AppDatabase> {
  try {
    const raw = await fs.readFile(projectDbPath, "utf-8");
    return normalizeAppDatabase(JSON.parse(raw) as AppDatabase);
  } catch {
    return normalizeAppDatabase(JSON.parse(JSON.stringify(defaultDb)) as AppDatabase);
  }
}

async function readJsonDb(): Promise<AppDatabase> {
  await ensureJsonFile();
  const raw = await fs.readFile(dbPath, "utf-8");
  const data = JSON.parse(raw) as AppDatabase;
  return normalizeAppDatabase(data);
}

async function writeJsonDb(data: AppDatabase): Promise<void> {
  await fs.writeFile(dbPath, JSON.stringify(data, null, 2), "utf-8");
}

async function readMongoSnapshot(): Promise<AppDatabase> {
  const mongo = await getMongoDb();
  const coll = mongo.collection<AppSnapshotDoc>(SNAPSHOT_COLLECTION);
  const doc = await coll.findOne({ _id: SNAPSHOT_ID });
  if (!doc) {
    const seed: AppSnapshotDoc = { _id: SNAPSHOT_ID, ...defaultDb };
    await coll.replaceOne({ _id: SNAPSHOT_ID }, seed, { upsert: true });
    return normalizeAppDatabase(defaultDb);
  }
  const { _id: _ignored, ...rest } = doc;
  return normalizeAppDatabase(rest as AppDatabase);
}

async function writeMongoSnapshot(data: AppDatabase): Promise<void> {
  const mongo = await getMongoDb();
  const coll = mongo.collection<AppSnapshotDoc>(SNAPSHOT_COLLECTION);
  const doc: AppSnapshotDoc = { _id: SNAPSHOT_ID, ...data };
  await coll.replaceOne({ _id: SNAPSHOT_ID }, doc, { upsert: true });
}

/** Prepends a booking without read-modify-replace (avoids lost rows when parents submit at the same time). */
export async function prependBookingMongo(booking: Booking): Promise<void> {
  const mongo = await getMongoDb();
  const coll = mongo.collection<AppSnapshotDoc>(SNAPSHOT_COLLECTION);
  const exists = await coll.findOne({ _id: SNAPSHOT_ID }, { projection: { _id: 1 } });
  if (!exists) {
    const seed: AppSnapshotDoc = {
      _id: SNAPSHOT_ID,
      ...JSON.parse(JSON.stringify(defaultDb)) as AppDatabase,
    };
    seed.bookings = [booking, ...seed.bookings];
    await coll.replaceOne({ _id: SNAPSHOT_ID }, seed, { upsert: true });
    return;
  }
  await coll.updateOne(
    { _id: SNAPSHOT_ID },
    { $push: { bookings: { $each: [booking], $position: 0 } } },
  );
}

/** Prepends community feedback without read-modify-replace of the full snapshot. */
export async function prependCommunityFeedbackMongo(entry: CommunityFeedback): Promise<void> {
  const mongo = await getMongoDb();
  const coll = mongo.collection<AppSnapshotDoc>(SNAPSHOT_COLLECTION);
  const exists = await coll.findOne({ _id: SNAPSHOT_ID }, { projection: { _id: 1 } });
  if (!exists) {
    const seed: AppSnapshotDoc = {
      _id: SNAPSHOT_ID,
      ...JSON.parse(JSON.stringify(defaultDb)) as AppDatabase,
    };
    seed.communityFeedback = [entry, ...seed.communityFeedback];
    await coll.replaceOne({ _id: SNAPSHOT_ID }, seed, { upsert: true });
    return;
  }
  await coll.updateOne(
    { _id: SNAPSHOT_ID },
    { $push: { communityFeedback: { $each: [entry], $position: 0 } } },
  );
}

export type BookingMongoPatch = Partial<
  Pick<Booking, "status" | "paymentStatus" | "paymentReference">
>;

/** Updates one booking by id using array filters (avoids clobbering other concurrent edits). */
export async function patchBookingMongo(bookingId: string, patch: BookingMongoPatch): Promise<boolean> {
  const mongo = await getMongoDb();
  const coll = mongo.collection<AppSnapshotDoc>(SNAPSHOT_COLLECTION);
  const has = await coll.findOne(
    { _id: SNAPSHOT_ID, bookings: { $elemMatch: { id: bookingId } } },
    { projection: { _id: 1 } },
  );
  if (!has) {
    return false;
  }
  const $set: Record<string, unknown> = {};
  if (patch.status !== undefined) {
    $set["bookings.$[b].status"] = patch.status;
  }
  if (patch.paymentStatus !== undefined) {
    $set["bookings.$[b].paymentStatus"] = patch.paymentStatus;
  }
  if (patch.paymentReference !== undefined) {
    $set["bookings.$[b].paymentReference"] = patch.paymentReference;
  }
  if (Object.keys($set).length === 0) {
    return false;
  }
  await coll.updateOne(
    { _id: SNAPSHOT_ID },
    { $set },
    { arrayFilters: [{ "b.id": bookingId }] },
  );
  return true;
}

function normalizeChildNameKey(name: string): string {
  return name.trim().toLowerCase().replace(/\s+/g, " ");
}

/** Parent account on the booking, or match parent user by email (staff-entered booking). */
function resolveParentUserIdForBooking(db: AppDatabase, booking: Booking): string | null {
  const direct = booking.parentUserId?.trim();
  if (direct) return direct;
  const email = booking.parentEmail?.trim().toLowerCase();
  if (!email) return null;
  const user = db.users.find((u) => u.email.toLowerCase() === email && u.role === "parent");
  return user?.id ?? null;
}

export async function pushChildMongo(child: Child): Promise<void> {
  const mongo = await getMongoDb();
  const coll = mongo.collection<AppSnapshotDoc>(SNAPSHOT_COLLECTION);
  const exists = await coll.findOne({ _id: SNAPSHOT_ID }, { projection: { _id: 1 } });
  if (!exists) {
    const seed: AppSnapshotDoc = {
      _id: SNAPSHOT_ID,
      ...(JSON.parse(JSON.stringify(defaultDb)) as AppDatabase),
    };
    seed.children = [...seed.children, child];
    await coll.replaceOne({ _id: SNAPSHOT_ID }, seed, { upsert: true });
    return;
  }
  await coll.updateOne({ _id: SNAPSHOT_ID }, { $push: { children: child } });
}

/**
 * When staff approves a booking, ensure a roster child exists for that parent (My children).
 * Skips if the same parent already has a child with the same name.
 */
export async function ensureChildFromApprovedBooking(booking: Booking): Promise<void> {
  if (booking.status !== "approved") return;

  const db = await readDb();
  const parentUserId = resolveParentUserIdForBooking(db, booking);
  if (!parentUserId) return;

  const nameKey = normalizeChildNameKey(booking.childName);
  const dup = db.children.some(
    (c) => c.parentUserId === parentUserId && normalizeChildNameKey(c.name) === nameKey,
  );
  if (dup) return;

  const age = Math.min(18, Math.max(0, Number.parseInt(String(booking.childAge), 10) || 0));
  const allergyRaw = booking.childAllergies?.trim();
  const allergies =
    allergyRaw && allergyRaw.toLowerCase() !== "none" ? allergyRaw : undefined;

  const child = normalizeChild({
    id: `c_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
    name: booking.childName.trim(),
    age,
    classroom: "Pending assignment",
    allergies,
    parentUserId,
  } as unknown as Record<string, unknown>);

  if (isMongoEnabled()) {
    await pushChildMongo(child);
    return;
  }

  db.children.push(child);
  await writeDb(db);
}

/**
 * Full app state. Uses MongoDB when `MONGODB_URI` is set; otherwise `data/db.json`.
 */
export async function readDb(): Promise<AppDatabase> {
  if (isMongoEnabled()) {
    try {
      return await readMongoSnapshot();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown Mongo read error";
      console.warn(`Mongo read failed: ${message}`);
      // During production build, Mongo may be unreachable or credentials not injected yet — do not fail
      // the whole `next build`. At request runtime on Vercel, surface the error so operators fix Atlas.
      if (isVercel && isRunningAppBuild()) {
        console.warn("Vercel build: falling back to bundled JSON for prerender after Mongo read failure.");
        return readBundledJsonDb();
      }
      if (isVercel) {
        // Keep the marketing site and dashboards renderable; writes still require working Mongo on Vercel.
        console.error(
          `MongoDB read failed on Vercel (${message}). Serving bundled snapshot until Atlas is reachable. Check /api/health/database.`,
        );
        return readBundledJsonDb();
      }
      return readJsonDb();
    }
  }
  if (isVercel && !isMongoEnabled()) {
    return readBundledJsonDb();
  }
  return readJsonDb();
}

export async function writeDb(data: AppDatabase): Promise<void> {
  const normalized = normalizeAppDatabase(data);
  if (isMongoEnabled()) {
    try {
      await writeMongoSnapshot(normalized);
      return;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown Mongo write error";
      console.warn(`Mongo write failed: ${message}`);
      if (isVercel) {
        throw new Error(
          `MongoDB write failed on Vercel (${message}). Fix MONGODB_URI / database access. File-based storage is not supported for writes on Vercel.`,
        );
      }
    }
  } else if (isVercel) {
    throw new Error(
      "Database not configured for Vercel: set MONGODB_URI (and optionally MONGODB_DB) in Project → Settings → Environment Variables, then redeploy. Sign-up and other saves require MongoDB on Vercel.",
    );
  }
  await writeJsonDb(normalized);
}
