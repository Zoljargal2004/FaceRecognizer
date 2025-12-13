import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("bearer");

  // Ignore API routes
  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // Ignore Next internals
  if (
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  const PUBLIC_PAGES = ["/login", "/token", "/change-password"];
  const isPublic = PUBLIC_PAGES.includes(pathname);

  // 🔒 Not logged in → block protected pages
  if (!token && !isPublic) {
    return NextResponse.redirect(
      new URL("/login", request.url)
    );
  }

  // 🚫 Logged in → block login page
  // ❗ BUT NOT during prefetch
  const isPrefetch =
    request.headers.get("purpose") === "prefetch" ||
    request.headers.get("x-middleware-prefetch") === "1";

  if (token && pathname === "/login" && !isPrefetch) {
    return NextResponse.redirect(
      new URL("/", request.url)
    );
  }

  return NextResponse.next();
}
