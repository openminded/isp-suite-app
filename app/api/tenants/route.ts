import { NextResponse } from "next/server";
import { db } from "@/db";
import { tenant } from "@/db/schema/tenant";
import { getCurrentTenantFromSession } from "@/lib/tenant";
import { sql, eq } from "drizzle-orm";

export async function POST(request: Request) {
  const result = await getCurrentTenantFromSession(request.headers);
  const currentUser = result?.user as any;

  if (!currentUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (currentUser.role !== "super_admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json().catch(() => null) as {
    name?: string;
    slug?: string;
  } | null;

  const name = body?.name?.trim();
  const slug = body?.slug?.trim();

  if (!name || !slug) {
    return NextResponse.json(
      { error: "name and slug are required" },
      { status: 400 },
    );
  }

  const safeSlug = slug.toLowerCase().replace(/[^a-z0-9-]/g, "-");
  const schemaName = `tenant_${safeSlug}`;

  const existing = await db
    .select()
    .from(tenant)
    .where(eq(tenant.slug, safeSlug))
    .limit(1);

  if (existing[0]) {
    return NextResponse.json(
      { error: "Tenant with this slug already exists" },
      { status: 400 },
    );
  }

  // Create schema for this tenant if it doesn't exist.
  await db.execute(sql.raw(`create schema if not exists "${schemaName}"`));

  const id = safeSlug;
  const now = new Date();

  await db.insert(tenant).values({
    id,
    name,
    slug: safeSlug,
    schemaName,
    createdAt: now,
  });

  return NextResponse.json(
    {
      id,
      name,
      slug: safeSlug,
      schemaName,
      createdAt: now.toISOString(),
    },
    { status: 201 },
  );
}
