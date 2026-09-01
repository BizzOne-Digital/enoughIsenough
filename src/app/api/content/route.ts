import { NextRequest, NextResponse } from "next/server";
import { getSiteContent, saveSiteContent } from "@/lib/content-service";
import { isAdminSession } from "@/lib/admin-auth";
import { isDbConfigured } from "@/lib/mongodb";

export async function GET() {
  const content = await getSiteContent();
  return NextResponse.json({ content, dbConfigured: isDbConfigured() });
}

export async function PUT(req: NextRequest) {
  if (!(await isAdminSession())) {
    return NextResponse.json({ error: "Not authorized." }, { status: 401 });
  }
  if (!isDbConfigured()) {
    return NextResponse.json(
      { error: "No database connected yet. Add MONGODB_URI to your environment and restart the server to enable saving." },
      { status: 503 }
    );
  }

  let updates: Record<string, unknown>;
  try {
    updates = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  try {
    const content = await saveSiteContent(updates);
    return NextResponse.json({ content });
  } catch (err) {
    console.error("[api/content PUT]", err);
    return NextResponse.json({ error: "Failed to save content." }, { status: 500 });
  }
}
