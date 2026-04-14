/**
 * One-time: copy local `data/db.json` into MongoDB as the app snapshot.
 *
 * Usage (PowerShell):
 *   $env:MONGODB_URI="mongodb+srv://..."
 *   $env:MONGODB_DB="daycare"   # optional, default daycare
 *   npm run db:import-json
 */

const { readFileSync, existsSync } = require("fs");
const path = require("path");
const { MongoClient } = require("mongodb");

const SNAPSHOT_ID = "app";
const SNAPSHOT_COLLECTION = "app_snapshot";

async function main() {
  const uri = process.env.MONGODB_URI?.trim();
  if (!uri) {
    console.error("Set MONGODB_URI to your Atlas (or local) connection string.");
    process.exit(1);
  }
  const dbName = process.env.MONGODB_DB?.trim() || "daycare";
  const jsonPath = path.join(process.cwd(), "data", "db.json");
  if (!existsSync(jsonPath)) {
    console.error("Missing file:", jsonPath);
    process.exit(1);
  }
  const raw = JSON.parse(readFileSync(jsonPath, "utf8"));
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(dbName);
  await db.collection(SNAPSHOT_COLLECTION).replaceOne(
    { _id: SNAPSHOT_ID },
    { _id: SNAPSHOT_ID, ...raw },
    { upsert: true },
  );
  console.log("Imported", jsonPath, "→", dbName + "." + SNAPSHOT_COLLECTION);
  await client.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
