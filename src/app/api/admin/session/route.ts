import { NextResponse } from "next/server";
import { isAdminSession } from "@/lib/admin-auth";
import { isDbConfigured } from "@/lib/mongodb";

export async function GET() {
  const isAdmin = await isAdminSession();
  return NextResponse.json({ isAdmin, dbConfigured: isDbConfigured() });
}
