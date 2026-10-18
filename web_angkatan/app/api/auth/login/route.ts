import { NextRequest, NextResponse } from "next/server";
import { db } from "@/app/lib/firebase-admin";
import { createAdminToken, setAuthCookie } from "@/app/lib/auth";
import { logSecurityEvent } from "@/app/lib/security-logger";
import bcrypt from "bcryptjs";
import { z } from "zod";

const LoginSchema = z.object({
  username: z.string().min(2, "Username minimal 2 karakter").max(50),
  password: z.string().min(4, "Password minimal 4 karakter").max(100),
});

import { getClientIp } from "@/app/lib/ip";
import { checkSharedRateLimit } from "@/app/lib/rate-limiter";

const MAX_LOGIN_ATTEMPTS = 5;
const LOGIN_LOCKOUT_MS = 15 * 60 * 1000; // 15 menit

const DUMMY_HASH = "$2a$12$e80yq7Kj4UoM3gK1zDq2p.Gz3KjYw9Xy0YQ1mU7A1b8y4T0c3N8Gq";

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);

    // Cek status rate limit login shared
    const rateCheck = await checkSharedRateLimit("login_attempt", ip, MAX_LOGIN_ATTEMPTS, LOGIN_LOCKOUT_MS);
    if (!rateCheck.allowed) {
      logSecurityEvent({
        type: "LOGIN_LOCKOUT",
        ip,
        detail: `IP diblokir sementara karena melebihi ${MAX_LOGIN_ATTEMPTS} kali percobaan login gagal`,
      });
      return NextResponse.json(
        {
          success: false,
          error: `Terlalu banyak percobaan gagal. Akses diblokir sementara selama ${rateCheck.resetInMinutes} menit.`,
        },
        { status: 429 }
      );
    }

    const body = await req.json();
    if (JSON.stringify(body).length > 2000) {
      return NextResponse.json(
        { success: false, error: "Ukuran payload terlalu besar." },
        { status: 413 }
      );
    }
    const parsed = LoginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { username, password } = parsed.data;
    const cleanUsername = username.trim().toLowerCase();

    const snapshot = await db
      .collection("admins")
      .where("username", "==", cleanUsername)
      .limit(1)
      .get();

    if (snapshot.empty) {
      await bcrypt.compare(password, DUMMY_HASH);
      logSecurityEvent({
        type: "LOGIN_FAILED",
        ip,
        detail: `Percobaan login gagal untuk user non-existent: ${cleanUsername}`,
      });
      return NextResponse.json(
        { success: false, error: "Username atau password salah." },
        { status: 401 }
      );
    }

    const adminDoc = snapshot.docs[0];
    const adminData = adminDoc.data();

    const passwordMatch = await bcrypt.compare(password, adminData.password_hash || "");
    if (!passwordMatch) {
      logSecurityEvent({
        type: "LOGIN_FAILED",
        ip,
        detail: `Password salah untuk username: ${cleanUsername}`,
      });
      return NextResponse.json(
        { success: false, error: "Username atau password salah." },
        { status: 401 }
      );
    }

    // Reset rate limit pada login sukses
    const cleanIpDocId = `login_attempt_${ip.replace(/[^a-zA-Z0-9_-]/g, "_")}`;
    await db.collection("rate_limits").doc(cleanIpDocId).delete().catch(() => {});

    await adminDoc.ref.update({
      last_login: new Date().toISOString(),
      last_login_ip: ip,
    });

    const token = await createAdminToken({
      uid: adminDoc.id,
      username: adminData.username,
      role: adminData.role || "admin",
      token_version: typeof adminData.token_version === "number" ? adminData.token_version : 1,
    });

    const response = NextResponse.json({
      success: true,
      message: "Login berhasil.",
      user: {
        username: adminData.username,
        role: adminData.role || "admin",
      },
    });

    setAuthCookie(response, token);
    return response;
  } catch (error) {
    console.error("Login route error:", error);
    return NextResponse.json(
      { success: false, error: "Terjadi kesalahan pada server saat login." },
      { status: 500 }
    );
  }
}
