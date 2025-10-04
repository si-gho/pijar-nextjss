import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ClientUser } from "@/types/auth";

export type User = ClientUser;

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export function useAuth(): AuthState & { signOut: () => Promise<void> } {
  const { data: session, status } = useSession();
  
  const isLoading = status === "loading";
  const isAuthenticated = !!session?.user;
  
  const user: User | null = session?.user ? {
    id: session.user.id,
    name: session.user.name || "",
    email: session.user.email || "",
    role: session.user.role as "admin" | "operator",
  } : null;

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  return {
    user,
    isLoading,
    isAuthenticated,
    signOut: handleSignOut,
  };
}

export function useRequireAuth(redirectTo = "/login") {
  const router = useRouter();
  const { isLoading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(redirectTo);
    }
  }, [isLoading, isAuthenticated, router, redirectTo]);

  return useAuth();
}

export function useRequireRole(requiredRole: "admin" | "operator", redirectTo = "/operations") {
  const router = useRouter();
  const { isLoading, isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      if (user?.role !== requiredRole) {
        router.push(redirectTo);
      }
    }
  }, [isLoading, isAuthenticated, user?.role, requiredRole, router, redirectTo]);

  return useAuth();
}