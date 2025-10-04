"use client";

import { SessionProvider } from "next-auth/react";

export default function AuthSessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  console.log("🔑 SessionProvider initializing");
  
  return <SessionProvider>{children}</SessionProvider>;
}