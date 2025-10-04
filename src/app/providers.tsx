"use client";

import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import AuthSessionProvider from "@/components/providers/SessionProvider";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { ConnectionStatus } from "@/components/ConnectionStatus";

export function Providers({ children }: { children: React.ReactNode }) {
  console.log("🧩 Providers initializing");
  
  return (
    <QueryProvider>
      <AuthSessionProvider>
        <TooltipProvider>
          {children}
          <ConnectionStatus />
          <Toaster />
          <Sonner />
        </TooltipProvider>
      </AuthSessionProvider>
    </QueryProvider>
  );
}