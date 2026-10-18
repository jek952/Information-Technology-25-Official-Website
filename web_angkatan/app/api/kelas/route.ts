import { NextRequest, NextResponse } from "next/server";
import { db } from "@/app/lib/firebase-admin";
import { verifyAdminSession } from "@/app/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const kelas = searchParams.get("kelas");

    if (kelas) {
      const doc = await db.collection("kelas_meta").doc(kelas).get();
      if (!doc.exists) {
        return NextResponse.json({
          success: true,
          data: {
            kelas,
            banner: "https://res.cloudinary.com/hvnrszvj/image/upload/v1791307752/proximiti-2026/galeri/proximiti/f1b4kso4lakrmnkykk5h.jpg",
            slogan: "",
          },
        });
      }
      return NextResponse.json({
        success: true,
        data: { id: doc.id, ...doc.data() },
      });
    }

    const snapshot = await db.collection("kelas_meta").get();
    const data: Record<string, any> = {};
    snapshot.docs.forEach((doc) => {
      data[doc.id] = { id: doc.id, ...doc.data() };
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("GET kelas error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memuat metadata kelas." },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await verifyAdminSession(req);
    if (!session.authenticated) {
      return NextResponse.json(
        { success: false, error: session.error || "Akses ditolak: Autentikasi admin diperlukan." },
        { status: 401 }
      );
    }

    const body = await req.json();
    if (JSON.stringify(body).length > 10000) {
      return NextResponse.json(
        { success: false, error: "Ukuran data payload terlalu besar (maksimal 10 KB)." },
        { status: 413 }
      );
    }
    const { kelas, banner, slogan } = body;

    const SAFE_ID_REGEX = /^[a-zA-Z0-9_-]{1,32}$/;
    if (!kelas || typeof kelas !== "string" || !SAFE_ID_REGEX.test(kelas)) {
      return NextResponse.json(
        { success: false, error: "Nama kelas tidak valid." },
        { status: 400 }
      );
    }

    const payload: Record<string, any> = {
      kelas,
      updated_at: new Date().toISOString(),
    };

    if (typeof banner === "string") {
      if (banner && !banner.startsWith("https://") && !banner.startsWith("http://") && !banner.startsWith("/")) {
        return NextResponse.json(
          { success: false, error: "Format URL banner tidak valid." },
          { status: 400 }
        );
      }
      payload.banner = banner;
    }
    if (typeof slogan === "string") {
      payload.slogan = slogan.slice(0, 150);
    }

    await db.collection("kelas_meta").doc(kelas).set(payload, { merge: true });

    return NextResponse.json({
      success: true,
      message: `Header kelas ${kelas} berhasil diperbarui.`,
    });
  } catch (error) {
    console.error("PUT kelas error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memperbarui header kelas." },
      { status: 500 }
    );
  }
}
