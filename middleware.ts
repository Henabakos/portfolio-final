// middleware.js
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname, origin } = request.nextUrl;
  const cookies = Object.fromEntries(
    request.cookies.getAll().map((cookie) => [cookie.name, cookie.value])
  );
  const token = request.cookies.get("admin_auth")?.value;

  console.log("Middleware triggered:", {
    pathname,
    origin,
    cookies,
    admin_auth: token,
  }); // Debug log

  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    if (!token || token !== "1") {
      console.log("Redirecting to /admin/login from:", pathname);
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
