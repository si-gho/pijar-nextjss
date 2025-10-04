import { ClientUser } from "@/types/auth";

// Type-safe user extraction from Better Auth session
export function extractUserFromSession(sessionUser: any): ClientUser | null {
  if (!sessionUser) return null;

  return {
    id: sessionUser.id,
    name: sessionUser.name || undefined,
    email: sessionUser.email,
    role: sessionUser.role || "operator", // Default to operator if role is missing
  };
}

// Type guard to check if user has specific role
export function hasRole(user: ClientUser | null, role: "admin" | "operator"): boolean {
  return user?.role === role;
}

// Get user role display name
export function getUserRoleDisplayName(role: "admin" | "operator"): string {
  switch (role) {
    case "admin":
      return "Administrator";
    case "operator":
      return "Operator";
    default:
      return "Pengguna";
  }
}

// Check if user can access operations (all authenticated users can)
export function canAccessOperations(user: ClientUser | null): boolean {
  return user?.role === "admin" || user?.role === "operator";
}