import { NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

// Routes that require authentication
const protectedPaths = ["/catalogo", "/curso", "/checkout", "/minha-conta"];

// Routes that should redirect to /catalogo if already logged in
const authPaths = ["/login", "/signup", "/forgot-password", "/reset-password"];

export async function middleware(request: NextRequest) {
  const hostname = request.headers.get("host") || "";
  const { pathname } = request.nextUrl;

  // mapa.peliculasideral.com.br → serve /mapa-astral na raiz
  if (hostname.startsWith("mapa.peliculasideral") && pathname === "/") {
    return NextResponse.rewrite(new URL("/mapa-astral", request.url));
  }

  // Refresh session cookies on every request
  const { user, supabaseResponse } = await updateSession(request);

  // Protected routes — redirect to login if not authenticated
  const isProtected = protectedPaths.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );
  if (isProtected && !user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Auth routes — redirect to catalogo if already logged in
  const isAuthRoute = authPaths.some((p) => pathname === p);
  if (isAuthRoute && user) {
    return NextResponse.redirect(new URL("/catalogo", request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico, sitemap.xml, robots.txt
     * - public assets
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|assets/).*)",
  ],
};
