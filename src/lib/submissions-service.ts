import "server-only";
import { ObjectId } from "mongodb";
import { getDb, isDbConfigured } from "@/lib/mongodb";

export type SubmissionKind = "contact_submissions" | "newsletter_subscribers" | "fund_applications";

const ALLOWED: SubmissionKind[] = ["contact_submissions", "newsletter_subscribers", "fund_applications"];

function assertKind(kind: string): asserts kind is SubmissionKind {
  if (!ALLOWED.includes(kind as SubmissionKind)) {
    throw new Error(`Unknown submission collection: ${kind}`);
  }
}

export async function saveSubmission(kind: SubmissionKind, data: Record<string, unknown>) {
  assertKind(kind);
  if (!isDbConfigured()) throw new Error("DB_NOT_CONFIGURED");
  const db = await getDb();
  if (!db) throw new Error("DB_UNAVAILABLE");

  const doc = { ...data, createdAt: new Date(), read: false };
  const result = await db.collection(kind).insertOne(doc);
  return { ...doc, _id: result.insertedId.toString() };
}

export async function listSubmissions(kind: SubmissionKind) {
  assertKind(kind);
  const db = await getDb();
  if (!db) return [];
  const docs = await db.collection(kind).find().sort({ createdAt: -1 }).limit(500).toArray();
  return docs.map((d) => ({ ...d, _id: d._id.toString() }));
}

export async function markSubmissionRead(kind: SubmissionKind, id: string, read: boolean) {
  assertKind(kind);
  const db = await getDb();
  if (!db) throw new Error("DB_UNAVAILABLE");
  await db.collection(kind).updateOne({ _id: new ObjectId(id) }, { $set: { read } });
}

export async function deleteSubmission(kind: SubmissionKind, id: string) {
  assertKind(kind);
  const db = await getDb();
  if (!db) throw new Error("DB_UNAVAILABLE");
  await db.collection(kind).deleteOne({ _id: new ObjectId(id) });
}
