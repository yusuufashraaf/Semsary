// src/services/userService.ts
import type { User } from "@app-types/admin/admin";
import api from "@services/axios-global";

export async function changeUserRole(
  userId: number,
  role: string,
  reason?: string,
  signal?: AbortSignal
): Promise<User> {
  const { data } = await api.post(
    `admin/users/${userId}/change-role`,
    { role, reason },
    { signal }
  );
  return data;
}
