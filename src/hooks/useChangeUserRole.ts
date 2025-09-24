// src/hooks/useChangeUserRole.ts
import { useState } from "react";
import { changeUserRole } from "@services/useUserService";
import type { User } from "@app-types/admin/admin";

export function useChangeUserRole() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateRole = async (userId: number, role: string, reason?: string) => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    try {
      const updatedUser = await changeUserRole(userId, role, reason, controller.signal);
      setUser(updatedUser);
    } catch (err) {
      setError((err as Error).message || "Failed to change role");
    } finally {
      setLoading(false);
    }

    return () => controller.abort(); // cleanup if needed
  };

  return { user, loading, error, updateRole };
}
