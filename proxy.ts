import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AUTH_COOKIE_NAME } from "@/lib/auth/constants";
import { parseSessionToken } from "@/lib/auth/session";

export async function proxy(request: NextRequest) {
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  const session = await parseSessionToken(token);
  const path = request.nextUrl.pathname;

  if (path.startsWith("/login")) {
    if (session) {
      const url = request.nextUrl.clone();
      url.pathname =
        session.role === "admin" ? "/admin/users" : "/dashboard";
      url.search = "";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  if (path.startsWith("/dashboard")) {
    if (!session) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("redirect", path);
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  if (path.startsWith("/admin")) {
    if (!session) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("redirect", path);
      return NextResponse.redirect(url);
    }
    if (session.role !== "admin") {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/dashboard/:path*", "/admin/:path*"],
};
