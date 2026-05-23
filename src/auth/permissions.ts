// Permission matrix per role. The backend returns one of three roles
// (Admin, Hr, User — see Once.Domain.Enums.EnumRole); the previous fine-
// grained permission matrix is collapsed onto those three buckets so the
// sidebar/page guards keep working off `can("perm")`.

import type { Permission, Role, RoleCode } from "../data/entities";

export const ROLES: Record<RoleCode, Role> = {
  user: {
    code: "user",
    permissions: [
      "learner.read_own",
      "learner.use_assistant",
      "learner.submit_attempt",
      "learner.send_feedback",
    ],
  },
  hr: {
    code: "hr",
    permissions: [
      "user.read",
      "user.create",
      "user.update",
      "user.block",
      "org.manage",
      "assignment.create",
      "progress.read_all",
      "skills.read_all",
      "report.export",
      "notification.send",
    ],
  },
  admin: {
    code: "admin",
    permissions: [
      "learner.read_own",
      "learner.use_assistant",
      "learner.submit_attempt",
      "learner.send_feedback",
      "user.read",
      "user.create",
      "user.update",
      "user.block",
      "org.manage",
      "kb.read",
      "kb.upload",
      "kb.delete",
      "ai.configure",
      "ai.review_logs",
      "plan.create",
      "plan.update",
      "plan.publish",
      "module.manage",
      "quiz.manage",
      "scenario.mock.manage",
      "scenario.fraud.manage",
      "scenario.fraud.report",
      "assignment.create",
      "progress.read_all",
      "skills.read_all",
      "report.export",
      "integration.manage",
      "notification.send",
      "audit.read",
      "system.settings",
      "role.manage",
    ],
  },
};

export function permissionsFor(roleCodes: ReadonlyArray<RoleCode>): Set<Permission> {
  const set = new Set<Permission>();
  for (const code of roleCodes) {
    for (const p of ROLES[code]?.permissions ?? []) set.add(p);
  }
  return set;
}

export function hasPermission(
  roleCodes: ReadonlyArray<RoleCode>,
  permission: Permission,
): boolean {
  return permissionsFor(roleCodes).has(permission);
}

// Convenience checks used by the layout / sidebar to decide which app a user
// can enter. `user` is the only role that uses the Learner Site; `admin` and
// `hr` live in the Admin Site (admin can use both).
export function isLearner(roleCodes: ReadonlyArray<RoleCode>): boolean {
  return roleCodes.includes("user");
}

export function isAdmin(roleCodes: ReadonlyArray<RoleCode>): boolean {
  return roleCodes.some((r) => r === "admin" || r === "hr");
}

// Parse the `Role` claim shape from the backend JWT (enum name string like
// "Admin"/"Hr"/"User", or the numeric id) into the client RoleCode.
export function parseRoleClaim(claim: unknown): RoleCode | null {
  if (typeof claim === "number") {
    if (claim === 1) return "admin";
    if (claim === 2) return "hr";
    if (claim === 3) return "user";
    return null;
  }
  if (typeof claim !== "string") return null;
  const v = claim.toLowerCase();
  if (v === "admin" || v === "1") return "admin";
  if (v === "hr" || v === "2") return "hr";
  if (v === "user" || v === "3") return "user";
  return null;
}
