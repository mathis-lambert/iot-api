import { getDb } from "@/lib/mongodb";

let initialized = false;

export async function ensureIndexes() {
  if (initialized) return;
  const db = await getDb();
  await Promise.all([
    db.collection("devices").createIndex({ lastSeenAt: -1 }),
    db.collection("devices").createIndex({ location: 1 }),
    db.collection("telemetry").createIndex({ deviceId: 1, receivedAt: -1 }),
    db.collection("telemetry").createIndex({ receivedAt: -1 }),
  ]);
  initialized = true;
}
