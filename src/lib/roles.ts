// src/lib/roles.ts
export type UserRole =
  | "admin"
  | "pastor"
  | "elder"
  | "leader"
  | "member";

/**
 * Role hierarchy — higher index = more permissions.
 */
const HIERARCHY: Record<UserRole, number> = {
  member: 1,
  leader: 2,
  elder: 3,
  pastor: 4,
  admin: 5,
};

export function isAtLeast(
  userRole: string | undefined,
  minimum: UserRole
): boolean {
  if (!userRole) return false;
  const userLevel = HIERARCHY[userRole as UserRole] ?? 0;
  const requiredLevel = HIERARCHY[minimum];
  return userLevel >= requiredLevel;
}

export function isStaffRole(role: string | undefined): boolean {
  return isAtLeast(role, "elder");
}

export function isAdminRole(role: string | undefined): boolean {
  return isAtLeast(role, "admin");
}

// =========================================================
// Admin-only URL paths (matches App.tsx routing)
// =========================================================
const ADMIN_PATHS = new Set<string>([
  "/dashboard",
  "/members",
  "/sms",
  "/gallery",
  "/books",
  "/chat",
  "/leadership",
  "/news",
  "/calendar",
  "/ministries",
  "/profile",
  "/settings",
]);

export function isAdminPath(pathname: string): boolean {
  return ADMIN_PATHS.has(pathname);
}