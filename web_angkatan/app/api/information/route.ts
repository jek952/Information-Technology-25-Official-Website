import { NextRequest, NextResponse } from "next/server";
import { db } from "@/app/lib/firebase-admin";
import { z } from "zod";

const InformationSchema = z.object({
  title: z.string().min(3, "Judul minimal 3 karakter"),
  type: z.string().min(2, "Tipe informasi diperlukan"),
  organizer: z.string().min(2, "Penyelenggara diperlukan"),
  avail_date: z.string().min(8, "Tanggal ketersediaan diperlukan"),
  image: z.string().min(1, "URL foto diperlukan"),
  excerpt: z.string().min(5, "Ringkasan minimal 5 karakter"),
  content: z.string().min(10, "Konten minimal 10 karakter"),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");

    let query: FirebaseFirestore.Query = db.collection("information");

    if (type && type !== "Semua") {
      query = query.where("type", "==", type);
    }

    const snapshot = await query.get();
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("GET information error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memuat data informasi." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = InformationSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const docRef = await db.collection("information").add({
      ...parsed.data,
      created_at: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      id: docRef.id,
      message: "Informasi berhasil ditambahkan.",
    });
  } catch (error) {
    console.error("POST information error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menyimpan informasi." },
      { status: 500 }
    );
  }
}
