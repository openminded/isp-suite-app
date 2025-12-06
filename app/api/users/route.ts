import { NextResponse } from "next/server";
import { db } from "@/db";
import { user } from "@/db/schema/auth";
import { getCurrentTenantFromSession } from "@/lib/tenant";

export async function GET(request: Request) {
  const result = await getCurrentTenantFromSession(request.headers);
  const currentUser = result?.user as any;

  if (!currentUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (currentUser.role !== "super_admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const users = await db.select().from(user);

  return NextResponse.json(
    users.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: (u as any).role ?? "admin",
      createdAt: u.createdAt,
    })),
  );
}
