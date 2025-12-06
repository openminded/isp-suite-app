"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const ALLOWED_ROLES = ["admin", "super_admin"] as const;

export default function AdminDashboardPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const role = (session as any)?.user?.role as string | undefined;
  const isAllowedRole =
    !!role && ALLOWED_ROLES.includes(role as (typeof ALLOWED_ROLES)[number]);

  useEffect(() => {
    if (isPending) return;

    if (!session) {
      router.replace("/sign-in");
      return;
    }

    if (role && !isAllowedRole) {
      router.replace("/dashboard");
    }
  }, [session, role, isAllowedRole, isPending, router]);

  if (isPending || !session) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-sm text-muted-foreground">Checking permissions...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 lg:p-6">
      <Card>
        <CardHeader>
          <CardTitle>Admin Dashboard</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm text-muted-foreground">
            You are signed in as <span className="font-medium">{session.user.email}</span> with role{" "}
            <span className="font-medium uppercase">{role ?? "unknown"}</span>.
          </p>
          <p className="text-sm text-muted-foreground">
            This area is restricted to <span className="font-medium">Admin</span> and{" "}
            <span className="font-medium">Super Admin</span> users. Technicians will be redirected away from this page.
          </p>
          <Button
            variant="outline"
            onClick={async () => {
              await signOut();
              router.replace("/sign-in");
            }}
          >
            Sign out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
