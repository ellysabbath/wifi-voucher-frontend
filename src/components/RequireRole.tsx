import { Navigate, useLocation } from "react-router-dom";
import { type ReactNode } from "react";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { isAtLeast, type UserRole } from "../lib/roles";

interface RequireRoleProps {
  minRole: UserRole;
  children: ReactNode;
}

export default function RequireRole({ minRole, children }: RequireRoleProps) {
  const { user, loading } = useCurrentUser();
  const location = useLocation();

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading…</div>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isAtLeast(user.role, minRole)) {
    return <Navigate to="/user/dashboard" replace />;
  }

  return <>{children}</>;
}