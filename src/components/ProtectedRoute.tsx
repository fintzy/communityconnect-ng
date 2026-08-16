import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { store } from "../services/store";

interface ProtectedRouteProps {
  children: React.ReactNode;
  roles?: ("resident" | "admin" | "super-admin")[];
}

export default function ProtectedRoute({
  children,
  roles,
}: ProtectedRouteProps) {
  const location = useLocation();
  const user = store.getCurrentUser();

  if (!user) {
    return (
      <Navigate
        to="/auth"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}