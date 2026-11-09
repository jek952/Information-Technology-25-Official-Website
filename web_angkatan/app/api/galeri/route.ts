import { NextRequest, NextResponse } from "next/server";
import { db } from "@/app/lib/firebase-admin";
import { z } from "zod";
import { verifyAdminSession } from "@/app/lib/auth";

const GaleriSchema = z.object({
  kategori: z.enum(["proximiti", "megabit", "ultras"]),
  caption: z.string().max(200).optional(),
  src: z.string().refine((v) => v.startsWith("https://") || v.startsWith("http://") || v.startsWith("/"), {
    message: "URL foto tidak valid",
  }),
});

const cacheStore = new Map<string, { data: any[]; timestamp: number }>();
const CACHE_TTL_MS = 60 * 1000;

function invalidateGaleriCache(): void {
  cacheStore.clear();
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const kategori = searchParams.get("kategori") || "all";

    const cached = cacheStore.get(kategori);
    const now = Date.now();
    if (cached && now - cached.timestamp < CACHE_TTL_MS) {
      const response = NextResponse.json({ success: true, data: cached.data });
      response.headers.set("Cache-Control", "public, s-maxage=60, stale-while-revalidate=120");
      return response;
    }

    let query: FirebaseFirestore.Query = db.collection("galeri");

    if (kategori && kategori !== "all") {
      query = query.where("kategori", "==", kategori);
    }

    const snapshot = await query.get();
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    cacheStore.set(kategori, { data, timestamp: now });

    const response = NextResponse.json({ success: true, data });
    response.headers.set("Cache-Control", "public, s-maxage=60, stale-while-revalidate=120");
    return response;
  } catch (error) {
    console.error("GET galeri error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memuat galeri." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
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
    const parsed = GaleriSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const docRef = await db.collection("galeri").add({
      ...parsed.data,
      created_at: new Date().toISOString(),
    });

    invalidateGaleriCache();

    return NextResponse.json({
      success: true,
      id: docRef.id,
      message: "Foto galeri berhasil ditambahkan.",
    });
  } catch (error) {
    console.error("POST galeri error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menyimpan foto galeri." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await verifyAdminSession(req);
    if (!session.authenticated) {
      return NextResponse.json(
        { success: false, error: session.error || "Akses ditolak: Autentikasi admin diperlukan." },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const SAFE_DOC_ID = /^[a-zA-Z0-9_-]{1,128}$/;
    if (!id || typeof id !== "string" || !SAFE_DOC_ID.test(id)) {
      return NextResponse.json(
        { success: false, error: "Format ID foto tidak valid." },
        { status: 400 }
      );
    }

    const docRef = db.collection("galeri").doc(id);
    const doc = await docRef.get();
    if (!doc.exists) {
      return NextResponse.json(
        { success: false, error: "Foto tidak ditemukan." },
        { status: 404 }
      );
    }

    await docRef.delete();

    invalidateGaleriCache();

    return NextResponse.json({
      success: true,
      message: "Foto berhasil dihapus.",
    });
  } catch (error) {
    console.error("DELETE galeri error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menghapus foto galeri." },
      { status: 500 }
    );
  }
}
