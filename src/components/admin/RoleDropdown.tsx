// src/components/admin/users/RoleDropdown.tsx
import React, { useEffect, useState } from "react";
import { cn } from "@utils/classNames";
import { useChangeUserRole } from "@hooks/useChangeUserRole";
import type { User } from "@app-types/admin/admin";

interface RoleDropdownProps {
  user: User;
  disabled?: boolean;
  onRoleChanged?: (updatedUser: User) => void;
}

const roles = [
  { value: "admin", label: "Admin", color: "text-red-600" },
  { value: "agent", label: "Agent", color: "text-blue-600" },
  { value: "owner", label: "Owner", color: "text-yellow-600" },
  { value: "user", label: "User", color: "text-gray-600" },
];

export const RoleDropdown: React.FC<RoleDropdownProps> = ({
  user,
  disabled,
  onRoleChanged,
}) => {
  const [currentRole, setCurrentRole] = useState(user.role);
  const { user: updatedUser, loading, error, updateRole } =
    useChangeUserRole();

  useEffect(() => {
    if (updatedUser) {
      setCurrentRole(updatedUser.role);
      onRoleChanged?.(updatedUser);
    }
  }, [updatedUser, onRoleChanged]);

  const handleChange = async (newRole: string) => {
    if (newRole === currentRole) return;
    await updateRole(user.id, newRole, "Role changed via dropdown");
  };

  return (
    <div className="relative inline-block w-full">
      <select
        value={currentRole}
        disabled={disabled || loading}
        onChange={(e) => handleChange(e.target.value)}
        className={cn(
          "appearance-none px-3 py-1.5 pr-8 rounded-lg text-sm font-medium border shadow-sm focus:outline-none focus:ring-2 transition w-full",
          roles.find((r) => r.value === currentRole)?.color,
          (disabled || loading) && "opacity-50 cursor-not-allowed"
        )}
      >
        {roles.map((role) => (
          <option key={role.value} value={role.value}>
            {role.label}
          </option>
        ))}
      </select>

      {/* Small dropdown arrow */}
      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
        ▼
      </span>

      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
};
