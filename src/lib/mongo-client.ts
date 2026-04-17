import { MongoClient } from "mongodb";

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
      // Keep auth/register routes responsive when Mongo is unreachable.
      serverSelectionTimeoutMS: 1500,
      connectTimeoutMS: 1500,
    });
    global.__daycareMongoClientPromise = client.connect();
  }
  return global.__daycareMongoClientPromise;
}

export async function getMongoDb() {
  const client = await getMongoClient();
  const name = process.env.MONGODB_DB?.trim() || "daycare";
  return client.db(name);
}
