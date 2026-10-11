import { NextRequest, NextResponse } from "next/server";
import { db } from "@/app/lib/firebase-admin";
import { z } from "zod";

const WargaSchema = z.object({
  nama: z.string().min(2, "Nama minimal 2 karakter"),
  email: z.string().email().optional().or(z.literal("")),
  github: z.string().optional().or(z.literal("")),
  instagram: z.string().optional().or(z.literal("")),
  linkedin: z.string().optional().or(z.literal("")),
  foto: z.string().min(1, "URL foto diperlukan"),
  kelas: z.string().min(1, "Kelas diperlukan"),
  role: z.enum(["anggota", "ketua_kelas", "waldos"]).default("anggota"),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const kelas = searchParams.get("kelas");
    const role = searchParams.get("role");

    let query: FirebaseFirestore.Query = db.collection("warga");

    if (kelas) {
      query = query.where("kelas", "==", kelas);
    }
    if (role) {
      query = query.where("role", "==", role);
    }

    const snapshot = await query.get();
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("GET warga error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memuat data warga." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = WargaSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const docRef = await db.collection("warga").add({
      ...parsed.data,
      created_at: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      id: docRef.id,
      message: "Data warga berhasil ditambahkan.",
    });
  } catch (error) {
    console.error("POST warga error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menyimpan data warga." },
      { status: 500 }
    );
  }
}
