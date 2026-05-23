import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import type { RoleCode } from "../data/entities";
import { isAdmin, isLearner } from "./permissions";

type Mode = "learner" | "admin";

// Gates a subtree to a specific app or role list. Mismatches go to /forbidden
// with the attempted location preserved so the 403 page can show a helpful
// "you tried to open …" message.
export function RequireRole({
  mode,
  allow,
}: {
  mode?: Mode;
  allow?: ReadonlyArray<RoleCode>;
}) {
  const { roles } = useAuth();
  const location = useLocation();
  const forbidden = (
    <Navigate to="/forbidden" state={{ from: location }} replace />
  );

  if (mode === "learner" && !isLearner(roles) && !roles.includes("admin")) {
    return forbidden;
  }
  if (mode === "admin" && !isAdmin(roles)) {
    return forbidden;
  }

  if (allow && allow.length > 0) {
    const ok = allow.some((r) => roles.includes(r));
    if (!ok) return forbidden;
  }
  return <Outlet />;
}
