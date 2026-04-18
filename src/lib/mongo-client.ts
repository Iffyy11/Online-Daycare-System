import { MongoClient, ServerApiVersion } from "mongodb";

declare global {
  // eslint-disable-next-line no-var -- Next.js dev HMR: reuse one client promise
  var __daycareMongoClientPromise: Promise<MongoClient> | undefined;
}

/** Non-empty `MONGODB_URI` (may still be invalid — use `isMongoEnabled()` for real use). */
export function isMongoUriProvided(): boolean {
  const uri = process.env.MONGODB_URI;
  return typeof uri === "string" && uri.trim().length > 0;
}

function isWellFormedMongoUri(uri: string): boolean {
  return uri.startsWith("mongodb://") || uri.startsWith("mongodb+srv://");
}

/** True when reads/writes should use MongoDB (URI present and syntactically valid). */
export function isMongoEnabled(): boolean {
  const uri = process.env.MONGODB_URI?.trim();
  if (!uri) return false;
  return isWellFormedMongoUri(uri);
}

export async function getMongoClient(): Promise<MongoClient> {
  const uri = process.env.MONGODB_URI?.trim();
  if (!uri) {
    throw new Error("MONGODB_URI is not set");
  }
  if (!isWellFormedMongoUri(uri)) {
    throw new Error('MONGODB_URI must start with "mongodb://" or "mongodb+srv://"');
  }
  if (!global.__daycareMongoClientPromise) {
    const client = new MongoClient(uri, {
      // Atlas + Node on serverless: avoids IPv4/IPv6 mismatch TLS failures (alert 80) on some hosts.
      autoSelectFamily: false,
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
      maxPoolSize: 10,
      minPoolSize: 0,
      serverSelectionTimeoutMS: 10_000,
      connectTimeoutMS: 10_000,
    });
    const connected = client.connect();
    global.__daycareMongoClientPromise = connected.catch((err: unknown) => {
      global.__daycareMongoClientPromise = undefined;
      throw err;
    });
  }
  return global.__daycareMongoClientPromise;
}

export async function getMongoDb() {
  const client = await getMongoClient();
  const name = process.env.MONGODB_DB?.trim() || "daycare";
  return client.db(name);
}

/** Extra hint when Atlas rejects credentials (shown in API JSON for parents/operators). */
export function mongoAuthTroubleshootingHint(message: string): string | undefined {
  if (!/bad auth|authentication failed|not authorized on/i.test(message)) {
    return undefined;
  }
  return [
    "Atlas is rejecting the username/password inside MONGODB_URI (not your Atlas website login).",
    "1) Atlas → Database Access → add a Database User (Password) or reset password → role: Read and write on your database (or readWriteAnyDatabase for dev).",
    "2) Atlas → Connect your app → Drivers → copy the connection string → replace <password> with that database user’s password.",
    "3) If the password has @ # : / ? & = + % characters, URL-encode them (e.g. @ → %40, # → %23) in the URI only.",
    "4) Vercel: Project → Settings → Environment Variables → edit MONGODB_URI → Redeploy (no extra quotes around the whole URL).",
    "5) Local dev: after fixing .env.local, stop and restart npm run dev so Mongo can reconnect.",
    "Why only some actions fail: while MONGODB_URI is set, failed Atlas auth still lets the app fall back to local or bundled JSON for reads (pages, login lookup, listing children), but saving always needs Mongo—add child, new bookings, register, etc. Local-only workaround: unset MONGODB_URI to use data/db.json for reads and writes.",
  ].join(" ");
}
