import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { getCurrentTenantFromSession } from "@/lib/tenant";

export default async function UsersLayout({
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

  if (role !== "super_admin") {
    redirect("/dashboard");
  }

  return <>{children}</>;
}
