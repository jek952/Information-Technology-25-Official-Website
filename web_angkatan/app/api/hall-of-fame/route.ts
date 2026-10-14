import { NextRequest, NextResponse } from "next/server";
import { db } from "@/app/lib/firebase-admin";
import { z } from "zod";

const HallOfFameSchema = z.object({
  nama: z.string().min(2, "Nama minimal 2 karakter"),
  penghargaan: z.string().min(2, "Nama penghargaan diperlukan"),
  deskripsi: z.string().min(5, "Deskripsi minimal 5 karakter"),
  foto: z.string().refine((v) => v.startsWith("https://") || v.startsWith("http://") || v.startsWith("/"), {
    message: "URL foto tidak valid",
  }),
});

export async function GET() {
  try {
    const snapshot = await db.collection("hall_of_fame").get();
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("GET hall-of-fame error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memuat data Hall of Fame." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = HallOfFameSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const docRef = await db.collection("hall_of_fame").add({
      ...parsed.data,
      created_at: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      id: docRef.id,
      message: "Data Hall of Fame berhasil ditambahkan.",
    });
  } catch (error) {
    console.error("POST hall-of-fame error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menyimpan data Hall of Fame." },
      { status: 500 }
    );
  }
}
