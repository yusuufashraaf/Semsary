// src/hooks/useRoleBasedNavigation.ts
import { useNavigate } from "react-router-dom";
import { TFullUser } from "@app-types/users/users.types";

export const useRoleBasedNavigation = () => {
  const navigate = useNavigate();

  const navigateByRole = (user: TFullUser | null) => {
    if (!user) {
      navigate("/");
      return;
    }

    switch (user.role) {
      case "admin":
        navigate("/admin/dashboard");
        break;
      case "owner":
        navigate("/owner-dashboard");
        break;
      case "user":
      default:
        navigate("/");
        break;
    }
  };

  const getDefaultRouteByRole = (user: TFullUser | null): string => {
    if (!user) return "/";

    switch (user.role) {
      case "admin":
        return "/admin/dashboard";
      case "owner":
        return "/owner-dashboard";
      case "user":
      default:
        return "/";
    }
  };

  return { navigateByRole, getDefaultRouteByRole };
};
