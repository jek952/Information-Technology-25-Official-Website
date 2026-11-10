import { NextRequest, NextResponse } from "next/server";
import { db } from "@/app/lib/firebase-admin";
import { z } from "zod";
import { verifyAdminSession } from "@/app/lib/auth";

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

    const { id, ...rest } = body;
    if (!id || typeof id !== "string") {
      return NextResponse.json(
        { success: false, error: "ID dokumen diperlukan." },
        { status: 400 }
      );
    }

    const parsed = HallOfFameSchema.safeParse(rest);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const docRef = db.collection("hall_of_fame").doc(id);
    const doc = await docRef.get();
    if (!doc.exists) {
      return NextResponse.json(
        { success: false, error: "Data Hall of Fame tidak ditemukan." },
        { status: 404 }
      );
    }

    await docRef.update({
      ...parsed.data,
      updated_at: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      id,
      message: "Data Hall of Fame berhasil diperbarui.",
    });
  } catch (error) {
    console.error("PUT hall-of-fame error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memperbarui data Hall of Fame." },
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
    if (!id) {
      return NextResponse.json(
        { success: false, error: "ID dokumen diperlukan." },
        { status: 400 }
      );
    }

    const docRef = db.collection("hall_of_fame").doc(id);
    const doc = await docRef.get();
    if (!doc.exists) {
      return NextResponse.json(
        { success: false, error: "Data Hall of Fame tidak ditemukan." },
        { status: 404 }
      );
    }

    await docRef.delete();

    return NextResponse.json({
      success: true,
      id,
      message: "Data Hall of Fame berhasil dihapus.",
    });
  } catch (error) {
    console.error("DELETE hall-of-fame error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menghapus data Hall of Fame." },
      { status: 500 }
    );
  }
}
