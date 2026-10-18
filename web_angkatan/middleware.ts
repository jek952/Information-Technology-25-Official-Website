import { NextRequest, NextResponse } from "next/server";
import * as jose from "jose";

const JWT_SECRET_STRING = process.env.JWT_SECRET || "proximiti-super-secure-jwt-secret-key-2026-production-token";
const SECRET_KEY = new TextEncoder().encode(JWT_SECRET_STRING);
const COOKIE_NAME = "admin_session";

export async function middleware(req: NextRequest) {
  // CVE-2025-29927 defense-in-depth: Tolak injeksi header internal Next.js dari luar
  if (req.headers.has("x-middleware-subrequest")) {
    return new NextResponse("Bad Request: Spoofed internal header detected", { status: 400 });
  }

  const { pathname } = req.nextUrl;
  const token = req.cookies.get(COOKIE_NAME)?.value;

  let isValidSession = false;
  if (token) {
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
      return response;
    }
  }

  if (pathname === "/login") {
    if (isValidSession) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/login"],
};
