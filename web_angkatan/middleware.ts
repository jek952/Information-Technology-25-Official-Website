import { NextRequest, NextResponse } from "next/server";
import * as jose from "jose";

const JWT_SECRET_STRING = process.env.JWT_SECRET || (process.env.NODE_ENV !== "production" ? "local-development-secret-key-proximiti-2026" : "");
if (process.env.NODE_ENV === "production" && !process.env.JWT_SECRET) {
  console.error("FATAL: JWT_SECRET environment variable belum dikonfigurasi di environment produksi.");
}
const SECRET_KEY = new TextEncoder().encode(JWT_SECRET_STRING);
const COOKIE_NAME = "admin_session";

export async function middleware(req: NextRequest) {
  if (req.headers.has("x-middleware-subrequest")) {
    return new NextResponse("Bad Request: Spoofed internal header detected", { status: 400 });
  }

  const { pathname } = req.nextUrl;
  const token = req.cookies.get(COOKIE_NAME)?.value;

  let isValidSession = false;
  if (token && JWT_SECRET_STRING) {
    try {
      const { payload } = await jose.jwtVerify(token, SECRET_KEY, {
        algorithms: ["HS256"],
      });
      if (payload && payload.uid) {
        isValidSession = true;
      }
    } catch {
      isValidSession = false;
    }
  }

  if (pathname.startsWith("/admin")) {
    if (!isValidSession) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("from", pathname);
      const response = NextResponse.redirect(loginUrl);
      if (token) {
        response.cookies.delete(COOKIE_NAME);
      }
      response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive, nosnippet");
      return response;
    }
    const response = NextResponse.next();
    response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive, nosnippet");
    return response;
  }

  if (pathname === "/login") {
    if (req.nextUrl.searchParams.has("from")) {
      const response = NextResponse.next();
      response.cookies.delete(COOKIE_NAME);
      response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive, nosnippet");
      return response;
    }
    if (isValidSession) {
      const response = NextResponse.redirect(new URL("/admin", req.url));
      response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive, nosnippet");
      return response;
    }
    const response = NextResponse.next();
    response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive, nosnippet");
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/login"],
};
