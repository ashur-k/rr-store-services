import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

import { useCurrentUser } from "../../features/auth/hooks/useCurrentUser";
import { useAuth } from "../../features/auth/useAuth";

interface RoleProtectedRouteProps {
  children: ReactNode;
  roles: string[];
}

export function RoleProtectedRoute({
  children,
  roles,
}: RoleProtectedRouteProps) {
  const { isAuthenticated, loading: authLoading } = useAuth();

  const {
    data: user,
    isLoading: userLoading,
  } = useCurrentUser();

  if (authLoading || userLoading) {
    return <p>Loading...</p>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const hasRequiredRole = roles.some((role) =>
    user?.realm_roles.includes(role)
  );

  if (!hasRequiredRole) {
    return <Navigate to="/profile" replace />;
  }

  return <>{children}</>;
}