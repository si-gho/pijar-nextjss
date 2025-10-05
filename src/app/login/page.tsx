"use client";

import { useState, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Lock, LogIn, AlertCircle, Package } from "lucide-react";
import React from "react";

const LoginForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { data: session, status } = useSession();

  // Handle redirect when user is already logged in
  React.useEffect(() => {
    if (session) {
      const targetUrl = redirectTo && redirectTo !== "/login" ? redirectTo : "/operations";
      router.replace(targetUrl);
    }
  }, [session, redirectTo, router]);

  const onSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedEmail = email.trim().toLowerCase();

    // Validation
    if (!trimmedEmail || !password) {
      setError("Email dan password harus diisi");
      return;
    }

    if (!trimmedEmail.includes("@")) {
      setError("Format email tidak valid");
      return;
    }

    if (password.length < 6) {
      setError("Password minimal 6 karakter");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email: trimmedEmail,
        password,
        redirect: false,
      });

      console.log("SignIn result:", result);

      if (result?.error) {
        console.error("SignIn error:", result.error);
        if (result.error.includes("JSON")) {
          setError("Masalah koneksi server, silakan coba lagi");
        } else {
          setError("Email atau password salah");
        }
        return;
      }

      if (result?.ok) {
        // DIRECT REDIRECT after successful login - NO INTERMEDIATE PAGES
        const targetUrl = redirectTo && redirectTo !== "/login" ? redirectTo : "/operations";
        router.replace(targetUrl);
      } else {
        setError("Login gagal, silakan coba lagi");
      }
    } catch (err) {
      console.error("Login error:", err);
      if (err instanceof Error && err.message.includes("JSON")) {
        setError("Masalah koneksi server, silakan coba lagi");
      } else {
        setError("Terjadi kesalahan saat login");
      }
    } finally {
      setIsLoading(false);
    }
  }, [email, password, router, redirectTo]);

  // Show loading while checking session
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          <span className="text-sm text-muted-foreground">Memeriksa sesi...</span>
        </div>
      </div>
    );
  }

  // Show loading spinner if user is already logged in (redirect is happening)
  if (session) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="bg-gradient-primary p-4 rounded-2xl shadow-md w-16 h-16 mx-auto flex items-center justify-center">
            <User className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-display font-bold text-foreground">
            PIJAR PRO
          </h1>
          <p className="text-sm text-muted-foreground">
            Masuk ke sistem pantau material konstruksi
          </p>
        </div>

        {/* Login Form */}
        <Card className="p-6 shadow-lg border-primary/10">
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Masukkan email"
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Masukkan password"
                  className="pl-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  required
                  autoComplete="current-password"
                />
              </div>
            </div>

            {error && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-md p-3">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-destructive" />
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-gradient-primary hover:opacity-90 transition-opacity"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Memproses...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <LogIn className="h-4 w-4" />
                  Masuk
                </div>
              )}
            </Button>
          </form>
        </Card>

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            © 2025 PIJAR PRO. Sistem Pantau Material Konstruksi.
          </p>
        </div>
      </div>
    </div>
  );
};

const LoginPage = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          <span className="text-sm text-muted-foreground">Memuat...</span>
        </div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
};

export default LoginPage;