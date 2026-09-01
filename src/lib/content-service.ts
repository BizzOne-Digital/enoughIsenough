import "server-only";
import { getDb, isDbConfigured } from "@/lib/mongodb";
import defaultContent from "@/data/default-content.json";
import type { SiteContent } from "@/types/content";

const CONTENT_COLLECTION = "site_content";
const CONTENT_DOC_ID = "site";

type ContentDoc = Partial<SiteContent> & { _id: string };

function mergeWithDefaults(stored: Partial<SiteContent> | null | undefined): SiteContent {
  const defaults = defaultContent as SiteContent;
  const s = stored || {};
  return {
    ...defaults,
    ...s,
    theme: { ...defaults.theme, ...s.theme },
    home: { ...defaults.home, ...s.home },
    about: { ...defaults.about, ...s.about },
    services: {
      ...defaults.services,
      ...s.services,
      items: s.services?.items?.length ? s.services.items : defaults.services.items,
    },
    specialOffers: { ...defaults.specialOffers, ...s.specialOffers },
    blog: {
      ...defaults.blog,
      ...s.blog,
      posts: s.blog?.posts?.length ? s.blog.posts : defaults.blog.posts,
    },
    contact: { ...defaults.contact, ...s.contact },
    boardMembers: s.boardMembers?.length ? s.boardMembers : defaults.boardMembers,
    testimonials: s.testimonials?.length ? s.testimonials : defaults.testimonials,
    stats: s.stats?.length ? s.stats : defaults.stats,
    faqs: s.faqs?.length ? s.faqs : defaults.faqs,
    timeline: s.timeline?.length ? s.timeline : defaults.timeline,
  };
}

/**
 * Reads the live site content from MongoDB. Falls back to the bundled
 * defaults (no crash, no local cache) whenever the database isn't
 * configured yet or is briefly unreachable, so the public site never
 * breaks while MONGODB_URI hasn't been added.
 */
export async function getSiteContent(): Promise<SiteContent> {
  const db = await getDb();
  if (!db) return defaultContent as SiteContent;

  try {
    const doc = await db.collection<ContentDoc>(CONTENT_COLLECTION).findOne({ _id: CONTENT_DOC_ID });

    if (!doc) {
      // First run against a fresh database — seed it with the defaults
      // so the admin panel has something real to edit and future reads
      // are fast.
      await db
        .collection<ContentDoc>(CONTENT_COLLECTION)
        .updateOne(
          { _id: CONTENT_DOC_ID },
          { $setOnInsert: { ...(defaultContent as SiteContent), _id: CONTENT_DOC_ID } },
          { upsert: true }
        );
      return defaultContent as SiteContent;
    }

    const { _id: _unused, ...rest } = doc;
    void _unused;
    return mergeWithDefaults(rest as Partial<SiteContent>);
  } catch (err) {
    console.error("[content-service] getSiteContent failed:", err);
    return defaultContent as SiteContent;
  }
}

/**
 * Persists a partial (or full) content update to MongoDB. Returns the
 * merged document that was saved, or throws if the database isn't
 * configured — callers (API routes) turn that into a 503 so the admin UI
 * can show a clear "add MONGODB_URI" message instead of a silent no-op.
 */
export async function saveSiteContent(updates: Partial<SiteContent>): Promise<SiteContent> {
  if (!isDbConfigured()) {
    throw new Error("DB_NOT_CONFIGURED");
  }
  const db = await getDb();
  if (!db) {
    throw new Error("DB_UNAVAILABLE");
  }

  const current = await getSiteContent();
  const next = mergeWithDefaults({ ...current, ...updates });

  await db
    .collection<ContentDoc>(CONTENT_COLLECTION)
    .updateOne({ _id: CONTENT_DOC_ID }, { $set: { ...next, _id: CONTENT_DOC_ID } }, { upsert: true });

  return next;
}

export async function resetSiteContent(): Promise<SiteContent> {
  if (!isDbConfigured()) {
    throw new Error("DB_NOT_CONFIGURED");
  }
  const db = await getDb();
  if (!db) {
    throw new Error("DB_UNAVAILABLE");
  }
  const defaults = defaultContent as SiteContent;
  await db
    .collection<ContentDoc>(CONTENT_COLLECTION)
    .updateOne({ _id: CONTENT_DOC_ID }, { $set: { ...defaults, _id: CONTENT_DOC_ID } }, { upsert: true });
  return defaults;
}
