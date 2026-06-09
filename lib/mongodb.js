import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "ai_demo";

if (!uri) {
  throw new Error("Missing MONGODB_URI environment variable");
}

let cached = globalThis._campMongo;

if (!cached) {
  cached = globalThis._campMongo = { client: null, promise: null };
}

export async function getDb() {
  if (!cached.promise) {
    cached.client = new MongoClient(uri);
    cached.promise = cached.client.connect();
  }

  const client = await cached.promise;
  return client.db(dbName);
}
