import { NextRequest, NextResponse } from "next/server";
import * as jose from "jose";
import { logSecurityEvent } from "@/app/lib/security-logger";

const JWT_SECRET_STRING = process.env.JWT_SECRET || "proximiti-super-secure-jwt-secret-key-2026-production-token";
if (process.env.NODE_ENV === "production" && !process.env.JWT_SECRET) {
  console.warn("PERINGATAN KEAMANAN: JWT_SECRET belum diset di environment variables produksi. Menggunakan fallback secret sangat tidak disarankan.");
}
const SECRET_KEY = new TextEncoder().encode(JWT_SECRET_STRING);

import { db } from "@/app/lib/firebase-admin";
import { getClientIp } from "@/app/lib/ip";

export const COOKIE_NAME = "admin_session";

export interface AdminPayload {
  uid: string;
  username: string;
  role: string;
  token_version?: number;
}

export async function createAdminToken(payload: AdminPayload): Promise<string> {
  return await new jose.SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setIssuedAt()
    .setExpirationTime("8h")
    .setSubject(payload.uid)
    .sign(SECRET_KEY);
}

export async function verifyAdminToken(token: string): Promise<AdminPayload | null> {
  try {
    const { payload } = await jose.jwtVerify(token, SECRET_KEY, {
      algorithms: ["HS256"],
    });
    return {
      uid: (payload.uid as string) || (payload.sub as string),
      username: payload.username as string,
      role: (payload.role as string) || "admin",
      token_version: typeof payload.token_version === "number" ? payload.token_version : 1,
    };
  } catch {
    return null;
  }
}

export async function verifyAdminSession(req: NextRequest): Promise<{
  authenticated: boolean;
  admin?: AdminPayload;
  error?: string;
}> {
  const method = req.method.toUpperCase();
  if (["POST", "PUT", "DELETE", "PATCH"].includes(method)) {
    const origin = req.headers.get("origin");
    const host = req.headers.get("host");
    if (origin && host) {
      const originHost = new URL(origin).host;
      if (originHost !== host) {
        const ip = getClientIp(req);
        logSecurityEvent({
          type: "CSRF_ORIGIN_MISMATCH",
          ip,
          detail: `Origin (${originHost}) tidak sesuai dengan Host (${host})`,
        });
        return { authenticated: false, error: "Origin tidak valid" };
      }
    }
  }

  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) {
    return { authenticated: false, error: "Sesi tidak ditemukan. Silakan login." };
  }

  const admin = await verifyAdminToken(token);
  if (!admin) {
    return { authenticated: false, error: "Token sesi tidak valid atau telah kedaluwarsa." };
  }

  // Verifikasi pembatalan sesi server-side (Server-Side Session Revocation)
  try {
    const adminDoc = await db.collection("admins").doc(admin.uid).get();
    if (!adminDoc.exists) {
      return { authenticated: false, error: "Akun admin tidak ditemukan." };
    }
    const adminData = adminDoc.data();
    const currentTokenVersion = typeof adminData?.token_version === "number" ? adminData.token_version : 1;
    const tokenVersion = typeof admin.token_version === "number" ? admin.token_version : 1;

    if (tokenVersion < currentTokenVersion) {
      logSecurityEvent({
        type: "SESSION_REVOKED",
        ip: getClientIp(req),
        detail: `Percobaan menggunakan token sesi yang sudah di-revoke (versi ${tokenVersion} < ${currentTokenVersion})`,
      });
      return { authenticated: false, error: "Sesi ini telah dicabut atau logout. Silakan login kembali." };
    }
  } catch (error) {
    console.error("Session verification DB error:", error);
    // Jika DB lookup gagal sementara, token kriptografis JWT tetap berlaku
  }

  return { authenticated: true, admin };
}

export function setAuthCookie(res: NextResponse, token: string): void {
  const isProduction = process.env.NODE_ENV === "production";
  res.cookies.set({
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
    maxAge: 8 * 60 * 60,
  });
}

export function clearAuthCookie(res: NextResponse): void {
  res.cookies.set({
    name: COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}
