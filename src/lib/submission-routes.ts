import "server-only";
import { NextRequest, NextResponse } from "next/server";
import { isAdminSession } from "@/lib/admin-auth";
import { notifyAdmin, sendConfirmation } from "@/lib/email";
import {
  deleteSubmission,
  listSubmissions,
  markSubmissionRead,
  saveSubmission,
  type SubmissionKind,
} from "@/lib/submissions-service";

export interface SubmissionNotifyConfig {
  /** Subject + plain-text body of the email sent to ADMIN_EMAIL. */
  adminSubject: (body: Record<string, unknown>) => string;
  adminBody: (body: Record<string, unknown>) => string;
  /** Optional short confirmation sent back to the submitter, if the
   *  submission includes an `email` field. */
  confirmation?: {
    subject: string;
    body: (body: Record<string, unknown>) => string;
  };
}

/**
 * Shared implementation for the small "collect this form into MongoDB"
 * endpoints (contact, newsletter, fund applications). Keeps each route
 * file a one-liner while the validation and email copy stay per-form.
 */
export function createSubmissionCollectionRoute(
  kind: SubmissionKind,
  validate: (body: Record<string, unknown>) => string | null,
  notify?: SubmissionNotifyConfig
) {
  async function POST(req: NextRequest) {
    let body: Record<string, unknown>;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid request." }, { status: 400 });
    }

    // Honeypot: a hidden field real visitors never fill in.
    if (typeof body._hp === "string" && body._hp.trim() !== "") {
      return NextResponse.json({ ok: true });
    }

    const error = validate(body);
    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }

    try {
      const { _hp: _unused, ...clean } = body;
      void _unused;
      const saved = await saveSubmission(kind, clean);

      // Email is best-effort and never blocks or fails the response — the
      // submission is already safely in MongoDB by this point.
      if (notify) {
        const submitterEmail = typeof clean.email === "string" ? clean.email : undefined;
        void notifyAdmin(notify.adminSubject(clean), notify.adminBody(clean), submitterEmail);
        if (notify.confirmation && submitterEmail) {
          void sendConfirmation(submitterEmail, notify.confirmation.subject, notify.confirmation.body(clean));
        }
      }

      return NextResponse.json({ ok: true, submission: saved });
    } catch (err) {
      if (err instanceof Error && err.message === "DB_NOT_CONFIGURED") {
        return NextResponse.json(
          { error: "This site's database isn't connected yet, so submissions can't be saved. Please try again later or contact us directly." },
          { status: 503 }
        );
      }
      console.error(`[api/${kind} POST]`, err);
      return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
    }
  }

  async function GET() {
    if (!(await isAdminSession())) {
      return NextResponse.json({ error: "Not authorized." }, { status: 401 });
    }
    const items = await listSubmissions(kind);
    return NextResponse.json({ items });
  }

  return { GET, POST };
}

export function createSubmissionItemRoute(kind: SubmissionKind) {
  async function PATCH(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
    if (!(await isAdminSession())) {
      return NextResponse.json({ error: "Not authorized." }, { status: 401 });
    }
    const { id } = await ctx.params;
    let body: { read?: boolean };
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid request." }, { status: 400 });
    }
    try {
      await markSubmissionRead(kind, id, Boolean(body.read));
      return NextResponse.json({ ok: true });
    } catch (err) {
      console.error(`[api/${kind}/${id} PATCH]`, err);
      return NextResponse.json({ error: "Failed to update." }, { status: 500 });
    }
  }

  async function DELETE(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
    if (!(await isAdminSession())) {
      return NextResponse.json({ error: "Not authorized." }, { status: 401 });
    }
    const { id } = await ctx.params;
    try {
      await deleteSubmission(kind, id);
      return NextResponse.json({ ok: true });
    } catch (err) {
      console.error(`[api/${kind}/${id} DELETE]`, err);
      return NextResponse.json({ error: "Failed to delete." }, { status: 500 });
    }
  }

  return { PATCH, DELETE };
}
