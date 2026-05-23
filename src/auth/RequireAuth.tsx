import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./AuthProvider";

// Wraps a route subtree to require an authenticated user. Unauthenticated
// visitors are redirected to /login with the original destination preserved
// in router state so the login page can send them back after sign-in.
export function RequireAuth() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <Outlet />;
}
