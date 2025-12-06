import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { getCurrentTenantFromSession } from "@/lib/tenant";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const headersList = await headers();
  const result = await getCurrentTenantFromSession(headersList);

  if (!result) {
    redirect("/sign-in");
  }

  const { user } = result;
  const role: string | undefined = user.role;
  const isAdmin = role === "admin" || role === "super_admin";

  if (!isAdmin) {
    redirect("/dashboard");
  }

  return <>{children}</>;
}
