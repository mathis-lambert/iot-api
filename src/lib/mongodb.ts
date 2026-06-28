import { MongoClient } from "mongodb";
import { env } from "@/lib/env";

declare global {
  var mongoClientPromise: Promise<MongoClient> | undefined;
}

const clientPromise =
  global.mongoClientPromise ??
  new MongoClient(env.MONGODB_URI).connect();

if (process.env.NODE_ENV !== "production") {
  global.mongoClientPromise = clientPromise;
}

export async function getMongoClient() {
  return clientPromise;
}

export async function getDb() {
  const client = await getMongoClient();
  return client.db(env.MONGODB_DB);
}
