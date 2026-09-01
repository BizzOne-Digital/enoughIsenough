import { MongoClient, type Db } from "mongodb";

/**
 * Single shared MongoDB connection for the whole app.
 *
 * The site is designed to keep working even before MONGODB_URI is set —
 * every caller should go through `getDb()` and handle a `null` return by
 * falling back to defaults instead of crashing the page.
 */

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "enough_is_enough";

let clientPromise: Promise<MongoClient> | null = null;

function getClientPromise(): Promise<MongoClient> | null {
  if (!uri) return null;
  if (clientPromise) return clientPromise;

  const client = new MongoClient(uri, {
    maxPoolSize: 10,
  });

  // Reuse the same connection across hot-reloads in dev.
  const globalForMongo = global as typeof global & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (process.env.NODE_ENV === "development") {
    if (!globalForMongo._mongoClientPromise) {
      globalForMongo._mongoClientPromise = client.connect();
    }
    clientPromise = globalForMongo._mongoClientPromise;
  } else {
    clientPromise = client.connect();
  }

  return clientPromise;
}

export function isDbConfigured(): boolean {
  return Boolean(uri);
}

export async function getDb(): Promise<Db | null> {
  const promise = getClientPromise();
  if (!promise) return null;
  try {
    const client = await promise;
    return client.db(dbName);
  } catch (err) {
    console.error("[mongodb] Failed to connect:", err);
    clientPromise = null;
    return null;
  }
}
