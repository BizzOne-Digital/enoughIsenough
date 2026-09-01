import { NextResponse } from "next/server";
import { resetSiteContent } from "@/lib/content-service";
import { isAdminSession } from "@/lib/admin-auth";
import { isDbConfigured } from "@/lib/mongodb";

export async function POST() {
  if (!(await isAdminSession())) {
    return NextResponse.json({ error: "Not authorized." }, { status: 401 });
  }
  if (!isDbConfigured()) {
    return NextResponse.json(
      { error: "No database connected yet. Add MONGODB_URI to your environment and restart the server." },
      { status: 503 }
    );
  }
  try {
    const content = await resetSiteContent();
    return NextResponse.json({ content });
  } catch (err) {
    console.error("[api/content/reset]", err);
    return NextResponse.json({ error: "Failed to reset content." }, { status: 500 });
  }
}
