import { auth } from "@/lib/auth"

export default auth((req) => {
  const { pathname } = req.nextUrl;
  
  // Skip middleware for API routes (especially NextAuth)
  if (pathname.startsWith('/api/')) {
    return;
  }
  
  // Skip middleware for login page to prevent redirect loop
  if (pathname === "/login") {
    return;
  }
  
  // Root page - let it handle its own redirect logic
  if (pathname === "/") {
    return;
  }
  
  // Protected routes require authentication
  if (!req.auth) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("redirect", pathname);
    return Response.redirect(loginUrl);
  }
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