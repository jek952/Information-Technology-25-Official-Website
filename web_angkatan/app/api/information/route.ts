import { NextRequest, NextResponse } from "next/server";
import { db } from "@/app/lib/firebase-admin";
import { z } from "zod";
import DOMPurify from "isomorphic-dompurify";
import { verifyAdminSession } from "@/app/lib/auth";

const InformationSchema = z.object({
  title: z.string().min(3, "Judul minimal 3 karakter"),
  type: z.string().min(2, "Tipe informasi diperlukan"),
  organizer: z.string().min(2, "Penyelenggara diperlukan"),
  avail_date: z.string().min(8, "Tanggal ketersediaan diperlukan"),
  image: z.string().refine((val) => val.startsWith("https://") || val.startsWith("http://") || val.startsWith("/"), {
    message: "URL foto tidak valid",
  }),
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
    const session = await verifyAdminSession(req);
    if (!session.authenticated) {
      return NextResponse.json(
        { success: false, error: session.error || "Akses ditolak: Autentikasi admin diperlukan." },
        { status: 401 }
      );
    }

    const body = await req.json();
    if (JSON.stringify(body).length > 100000) {
      return NextResponse.json(
        { success: false, error: "Ukuran konten informasi terlalu besar (maksimal 100 KB)." },
        { status: 413 }
      );
    }
    const parsed = InformationSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const cleanContent = DOMPurify.sanitize(parsed.data.content);

    const docRef = await db.collection("information").add({
      ...parsed.data,
      content: cleanContent,
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

export async function PUT(req: NextRequest) {
  try {
    const session = await verifyAdminSession(req);
    if (!session.authenticated) {
      return NextResponse.json(
        { success: false, error: session.error || "Akses ditolak: Autentikasi admin diperlukan." },
        { status: 401 }
      );
    }

    const rawBody = await req.json();
    if (JSON.stringify(rawBody).length > 100000) {
      return NextResponse.json(
        { success: false, error: "Ukuran konten informasi terlalu besar (maksimal 100 KB)." },
        { status: 413 }
      );
    }
    const { id, ...rest } = rawBody;
    const SAFE_DOC_ID = /^[a-zA-Z0-9_-]{1,128}$/;
    if (!id || typeof id !== "string" || !SAFE_DOC_ID.test(id)) {
      return NextResponse.json(
        { success: false, error: "Format ID informasi tidak valid." },
        { status: 400 }
      );
    }

    const parsed = InformationSchema.safeParse(rest);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const docRef = db.collection("information").doc(id);
    const existing = await docRef.get();
    if (!existing.exists) {
      return NextResponse.json(
        { success: false, error: "Data informasi tidak ditemukan." },
        { status: 404 }
      );
    }

    const cleanContent = DOMPurify.sanitize(parsed.data.content);

    await docRef.update({
      ...parsed.data,
      content: cleanContent,
      updated_at: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: "Informasi berhasil diperbarui.",
    });
  } catch (error) {
    console.error("PUT information error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memperbarui informasi." },
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
    let id = searchParams.get("id");
    if (!id) {
      try {
        const body = await req.json();
        id = body?.id;
      } catch {
        // no body
      }
    }

    const SAFE_DOC_ID = /^[a-zA-Z0-9_-]{1,128}$/;
    if (!id || typeof id !== "string" || !SAFE_DOC_ID.test(id)) {
      return NextResponse.json(
        { success: false, error: "Format ID informasi tidak valid." },
        { status: 400 }
      );
    }

    const docRef = db.collection("information").doc(id);
    const existing = await docRef.get();
    if (!existing.exists) {
      return NextResponse.json(
        { success: false, error: "Data informasi tidak ditemukan." },
        { status: 404 }
      );
    }

    await docRef.delete();

    return NextResponse.json({
      success: true,
      message: "Informasi berhasil dihapus.",
    });
  } catch (error) {
    console.error("DELETE information error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menghapus informasi." },
      { status: 500 }
    );
  }
}

