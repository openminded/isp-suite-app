import { auth } from "@/lib/auth";
import { db } from "@/db";
import { tenant } from "@/db/schema/tenant";
import { eq, sql } from "drizzle-orm";

export type TenantInfo = {
  id: string;
  name: string;
  slug: string;
  schemaName: string;
};

export async function getCurrentTenantFromSession(
  requestHeaders: Headers | HeadersInit,
) {
  let effectiveHeaders: Headers;

  if (requestHeaders instanceof Headers) {
    effectiveHeaders = requestHeaders;
  } else if (requestHeaders) {
    effectiveHeaders = new Headers(requestHeaders);
  }

  const sessionResult: any = await (auth as any).api.getSession({
    headers: effectiveHeaders,
  });

  const data = sessionResult?.data ?? sessionResult;
  const user = data?.user as any;

  if (!user) return null;

  const tenantId: string =
    (user as any).tenantId ??
    (user as any).tenant_id ??
    "default";

  let tenantInfo: TenantInfo | null = null;

  try {
    const rows = await db
      .select()
      .from(tenant)
      .where(eq(tenant.id, tenantId))
      .limit(1);

    const t = rows[0];
    if (t) {
      tenantInfo = {
        id: t.id,
        name: t.name,
        slug: t.slug,
        schemaName: t.schemaName,
      };
    }
  } catch {
    tenantInfo = null;
  }

  return { user, tenant: tenantInfo };
}

export async function withTenantSchema<T>(
  tenantInfo: TenantInfo,
  fn: (scopedDb: typeof db) => Promise<T>,
) {
  return db.transaction(async (tx) => {
    await tx.execute(
      sql.raw(
        `set local search_path to "${tenantInfo.schemaName}", public`,
      ),
    );
    // Within this transaction, queries will resolve against the tenant schema first.
    return fn(tx as typeof db);
  });
}
