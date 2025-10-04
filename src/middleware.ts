import { auth } from "@/lib/auth"

export default auth((req) => {
  const { pathname } = req.nextUrl;
  console.log("🔒 Middleware hit:", pathname, "Auth:", !!req.auth);
  
  // Skip middleware for API routes (especially NextAuth)
  if (pathname.startsWith('/api/')) {
    console.log("⏭️ Skipping API route:", pathname);
    return;
  }
  
  // Skip middleware for login page to prevent redirect loop
  if (pathname === "/login") {
    console.log("🌍 Login page - skipping middleware");
    return;
  }
  
  // Root page - let it handle its own redirect logic
  if (pathname === "/") {
    console.log("🏠 Root page - allowing through");
    return;
  }
  
  // Protected routes require authentication
  if (!req.auth) {
    console.log("🚫 Protected route, redirecting to login:", pathname);
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("redirect", pathname);
    return Response.redirect(loginUrl);
  }
  
  console.log("✅ Protected route allowed:", pathname);
})

export const config = {
  matcher: [
    /*
     * Only match protected routes - be explicit about what we want to protect
     * Exclude: api, _next, static files, login page
     */
    "/operations/:path*",
    "/admin/:path*",
    "/profile/:path*",
    "/"
  ],
}