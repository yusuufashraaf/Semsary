// src/services/userService.ts
import { usersApi } from "@api/endpoints/admin";
import type { User } from "@app-types/admin/admin";

export const userService = {
  activate: async (userId: number, reason?: string): Promise<User> => {
    return usersApi.activateUser(userId);
  },

  suspend: async (userId: number, reason: string): Promise<User> => {
    return usersApi.suspendUser(userId);
  },

  changeRole: async (
    userId: number,
    role: string,
    reason?: string
  ): Promise<User> => {
    return usersApi.changeRole(userId, { role, reason });
  },
};
