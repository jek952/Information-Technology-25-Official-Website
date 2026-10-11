import { NextResponse } from "next/server";
import { db } from "@/app/lib/firebase-admin";

export async function GET() {
  try {
    const doc = await db.collection("struktur").doc("ketua-angkatan").get();

    if (!doc.exists) {
      return NextResponse.json({
        success: true,
        data: {
          jabatan: "KETUA ANGKATAN",
          nama: "Fathir An-nafiier",
          kelas: "IT 49-01",
          foto: "https://res.cloudinary.com/hvnrszvj/image/upload/v1791309130/proximiti-2026/struktur/ketua_angkatan.webp",
          visi: "Visi angkatan IT 2026...",
          misi: "Misi angkatan IT 2026..."
        }
      });
    }

    return NextResponse.json({
      success: true,
      data: doc.data(),
    });
  } catch (error) {
    console.error("GET struktur error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memuat struktur angkatan." },
      { status: 500 }
    );
  }
}
