import { NextRequest, NextResponse } from "next/server";
import { db } from "@/app/lib/firebase-admin";
import { z } from "zod";

const GaleriSchema = z.object({
  kategori: z.enum(["proximiti", "megabit", "ultras"]),
  src: z.string().refine((v) => v.startsWith("https://") || v.startsWith("http://") || v.startsWith("/"), {
    message: "URL foto tidak valid",
  }),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const kategori = searchParams.get("kategori");

    let query: FirebaseFirestore.Query = db.collection("galeri");

    if (kategori) {
      query = query.where("kategori", "==", kategori);
    }

    const snapshot = await query.get();
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ success: true, data });
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
    const body = await req.json();
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
