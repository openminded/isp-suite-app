"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";

type UserRole = "super_admin" | "admin" | "technician";

type UserRow = {
  id: string;
  name: string | null;
  email: string;
  role: UserRole;
  createdAt: string | null;
};

export default function UsersManagementPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const [users, setUsers] = useState<UserRow[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isPending) return;

    const role = (session as any)?.user?.role as string | undefined;

    if (!session) {
      router.replace("/sign-in");
      return;
    }

    if (role !== "super_admin") {
      router.replace("/dashboard");
      return;
    }

    const loadUsers = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const res = await fetch("/api/users");
        if (!res.ok) {
          throw new Error("Failed to load users");
        }
        const data: UserRow[] = await res.json();
        setUsers(data);
      } catch (err) {
        setError("Failed to load users");
      } finally {
        setIsLoading(false);
      }
    };

    loadUsers();
  }, [session, isPending, router]);

  const updateRole = async (id: string, role: UserRole) => {
    try {
      setUpdatingId(id);
      setError(null);
      const res = await fetch(`/api/users/${id}/role`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error || "Failed to update role");
      }

      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, role } : u)),
      );
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setUpdatingId(null);
    }
  };

  if (isPending || !session) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 lg:p-6">
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Manage user roles. Only{" "}
            <span className="font-medium">Super Admin</span> can access this
            page.
          </p>

          {error && (
            <p className="text-sm text-destructive">
              {error}
            </p>
          )}

          {isLoading ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Loading users...</span>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-md border">
              <table className="min-w-full text-sm">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-3 py-2 text-left font-medium">Name</th>
                    <th className="px-3 py-2 text-left font-medium">Email</th>
                    <th className="px-3 py-2 text-left font-medium">Role</th>
                    <th className="px-3 py-2 text-left font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="border-t">
                      <td className="px-3 py-2">
                        {u.name || <span className="text-muted-foreground">—</span>}
                      </td>
                      <td className="px-3 py-2">{u.email}</td>
                      <td className="px-3 py-2 uppercase">{u.role}</td>
                      <td className="px-3 py-2">
                        <div className="flex flex-wrap gap-2">
                          <Button
                            variant={u.role === "super_admin" ? "default" : "outline"}
                            size="sm"
                            disabled={updatingId === u.id}
                            onClick={() => updateRole(u.id, "super_admin")}
                          >
                            Super Admin
                          </Button>
                          <Button
                            variant={u.role === "admin" ? "default" : "outline"}
                            size="sm"
                            disabled={updatingId === u.id}
                            onClick={() => updateRole(u.id, "admin")}
                          >
                            Admin
                          </Button>
                          <Button
                            variant={u.role === "technician" ? "default" : "outline"}
                            size="sm"
                            disabled={updatingId === u.id}
                            onClick={() => updateRole(u.id, "technician")}
                          >
                            Technician
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {users.length === 0 && (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-3 py-6 text-center text-sm text-muted-foreground"
                      >
                        No users found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

