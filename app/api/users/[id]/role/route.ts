import { NextResponse } from "next/server";
import { db } from "@/db";
import { user as userTable } from "@/db/schema/auth";
import { eq } from "drizzle-orm";
import { getCurrentTenantFromSession } from "@/lib/tenant";

const ALLOWED_ROLES = ["super_admin", "admin", "technician"] as const;

type AllowedRole = (typeof ALLOWED_ROLES)[number];

export async function PATCH(
  request: Request,
  context: { params: { id: string } },
) {
  const { id } = context.params;

  const result = await getCurrentTenantFromSession(request.headers);
  const currentUser = result?.user as any;

  if (!currentUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (currentUser.role !== "super_admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json().catch(() => null) as {
    role?: string;
  } | null;

  const nextRole = body?.role;

  if (!nextRole || !ALLOWED_ROLES.includes(nextRole as AllowedRole)) {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  }

  if (currentUser.id === id && nextRole !== "super_admin") {
    return NextResponse.json(
      { error: "You cannot remove your own super_admin role." },
      { status: 400 },
    );
  }

  await db
    .update(userTable)
    .set({ role: nextRole as AllowedRole })
    .where(eq(userTable.id, id));

  return NextResponse.json({ success: true });
}
