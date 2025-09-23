import { useAppSelector } from "@store/hook";
import { Navigate, useLocation } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { jwt, user } = useAppSelector(state => state.Authslice);
  const location = useLocation();


  // Check if user is authenticated
  if (!jwt) {
    return <Navigate to="/login?message=login_required" />;
  }

  // Check if user has required role (case-insensitive)
  if (allowedRoles && user && !allowedRoles.some(role => role.toLowerCase() === user.role.toLowerCase())) {
    return <Navigate to="/error?message=access_denied" />;
  }

  return <>{children}</>;
}

export default ProtectedRoute;