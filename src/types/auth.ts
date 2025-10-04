import { DefaultSession } from "next-auth"

// For client-side usage
export interface ClientUser {
  id: string;
  name?: string;
  email: string;
  role: "admin" | "operator";
}

// Extend NextAuth types
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
    } & DefaultSession["user"]
  }

  interface User {
    role: string;
  }
}