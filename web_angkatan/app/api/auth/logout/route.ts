import { NextRequest, NextResponse } from "next/server";
import { clearAuthCookie, verifyAdminSession } from "@/app/lib/auth";
import { db } from "@/app/lib/firebase-admin";
import { getClientIp } from "@/app/lib/ip";
import { checkSharedRateLimit } from "@/app/lib/rate-limiter";

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);

  // 1. Rate limiting untuk mencegah DoS flooding pada endpoint logout
  const rateCheck = await checkSharedRateLimit("logout", ip, 15, 60 * 1000);
  if (!rateCheck.allowed) {
    return NextResponse.json(
      { success: false, error: "Terlalu banyak permintaan logout. Silakan tunggu sebentar." },
      { status: 429 }
    );
  }

  // 2. Verifikasi sesi aktif dan CSRF origin
  const session = await verifyAdminSession(req);

  // Jika sesi valid dan aktif, lakukan invalidasi server-side
  if (session.authenticated && session.admin && session.admin.uid) {
    const adminRef = db.collection("admins").doc(session.admin.uid);
    const tokenVersion = typeof session.admin.token_version === "number" ? session.admin.token_version : 1;

    try {
      await db.runTransaction(async (t) => {
        const doc = await t.get(adminRef);
        if (!doc.exists) return;

        const currentVersion = typeof doc.data()?.token_version === "number" ? doc.data()?.token_version : 1;

        // Hanya naikkan version jika token yang dipakai logout persis cocok dengan version aktif di DB.
        // Mencegah penyerang memakai token lama yang sudah di-revoke untuk menaikkan version admin yang baru login.
        if (currentVersion === tokenVersion) {
          t.update(adminRef, {
            token_version: currentVersion + 1,
            last_logout_at: new Date().toISOString(),
          });
        }
      });
    } catch (error) {
      console.error("Logout transaction error:", error);
    }
  }

  const response = NextResponse.json({
    success: true,
    message: "Berhasil logout dan sesi telah dicabut di server.",
  });

  // Hapus cookie di browser klien dan cegah caching
  clearAuthCookie(response);
  response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
  return response;
}

