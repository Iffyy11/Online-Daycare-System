import { MongoClient } from "mongodb";

declare global {
  // eslint-disable-next-line no-var -- Next.js dev HMR: reuse one client promise
  var __daycareMongoClientPromise: Promise<MongoClient> | undefined;
}

/** True when API routes should persist to MongoDB instead of `data/db.json`. */
export function isMongoEnabled(): boolean {
  const uri = process.env.MONGODB_URI;
  return typeof uri === "string" && uri.trim().length > 0;
}

export async function getMongoClient(): Promise<MongoClient> {
  const uri = process.env.MONGODB_URI?.trim();
  if (!uri) {
    throw new Error("MONGODB_URI is not set");
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
