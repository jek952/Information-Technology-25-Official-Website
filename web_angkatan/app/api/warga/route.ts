import { NextRequest, NextResponse } from "next/server";
import { db } from "@/app/lib/firebase-admin";
import { z } from "zod";
import { verifyAdminSession } from "@/app/lib/auth";

function extractSocial(raw: unknown, platform: "instagram" | "github" | "linkedin"): string {
  if (typeof raw !== "string") return "";
  const trimmed = raw.trim();
  if (!trimmed) return "";

  if (platform === "instagram") {
    const match = trimmed.match(/(?:https?:\/\/(?:www\.)?instagram\.com\/)?(?:@)?([a-zA-Z0-9._]+)/i);
    return match && match[1] && (!trimmed.includes("://") || trimmed.includes("instagram.com"))
      ? `https://instagram.com/${match[1]}`
      : "";
  }

  if (platform === "github") {
    const match = trimmed.match(/(?:https?:\/\/(?:www\.)?github\.com\/)?(?:@)?([a-zA-Z0-9_-]+)/i);
    return match && match[1] && (!trimmed.includes("://") || trimmed.includes("github.com"))
      ? `https://github.com/${match[1]}`
      : "";
  }

  if (platform === "linkedin") {
    const match = trimmed.match(/(?:https?:\/\/(?:www\.)?linkedin\.com\/in\/)?([a-zA-Z0-9._-]+)/i);
    return match && match[1] && (!trimmed.includes("://") || trimmed.includes("linkedin.com"))
      ? `https://linkedin.com/in/${match[1]}`
      : "";
  }

  return "";
}

const safeUrl = z
  .string()
  .refine((v) => !v || v.startsWith("https://") || v.startsWith("http://") || v.startsWith("/"), {
    message: "Format URL tidak valid",
  });

const WargaSchema = z.object({
  nama: z.string().min(2, "Nama minimal 2 karakter"),
  email: z.string().email().optional().or(z.literal("")),
  github: safeUrl.optional().or(z.literal("")),
  instagram: safeUrl.optional().or(z.literal("")),
  linkedin: safeUrl.optional().or(z.literal("")),
  foto: z.string().refine((v) => v.startsWith("https://") || v.startsWith("http://") || v.startsWith("/"), {
    message: "URL foto tidak valid",
  }),
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
    const session = await verifyAdminSession(req);
    if (!session.authenticated) {
      return NextResponse.json(
        { success: false, error: session.error || "Akses ditolak: Autentikasi admin diperlukan." },
        { status: 401 }
      );
    }

    const rawBody = await req.json();
    if (JSON.stringify(rawBody).length > 20000) {
      return NextResponse.json(
        { success: false, error: "Ukuran data payload terlalu besar (maksimal 20 KB)." },
        { status: 413 }
      );
    }
    const body = {
      ...rawBody,
      github: extractSocial(rawBody.github, "github"),
      instagram: extractSocial(rawBody.instagram, "instagram"),
      linkedin: extractSocial(rawBody.linkedin, "linkedin"),
    };
    const parsed = WargaSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    if (parsed.data.role === "waldos") {
      const existingWaldos = await db
        .collection("warga")
        .where("kelas", "==", parsed.data.kelas)
        .where("role", "==", "waldos")
        .get();

      if (!existingWaldos.empty) {
        return NextResponse.json(
          {
            success: false,
            error: `Kelas ${parsed.data.kelas} sudah memiliki Dosen Wali. Hanya boleh 1 Dosen Wali per kelas. Gunakan menu edit untuk memperbarui data.`,
          },
          { status: 400 }
        );
      }
    }

    if (parsed.data.role === "ketua_kelas") {
      const existingKetua = await db
        .collection("warga")
        .where("kelas", "==", parsed.data.kelas)
        .where("role", "==", "ketua_kelas")
        .get();

      if (!existingKetua.empty) {
        const batch = db.batch();
        existingKetua.docs.forEach((doc) => {
          batch.update(doc.ref, {
            role: "anggota",
            updated_at: new Date().toISOString(),
          });
        });
        await batch.commit();
      }
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
    if (JSON.stringify(rawBody).length > 20000) {
      return NextResponse.json(
        { success: false, error: "Ukuran data payload terlalu besar (maksimal 20 KB)." },
        { status: 413 }
      );
    }
    const { id, ...rest } = rawBody;
    const SAFE_DOC_ID = /^[a-zA-Z0-9_-]{1,128}$/;
    if (!id || typeof id !== "string" || !SAFE_DOC_ID.test(id)) {
      return NextResponse.json(
        { success: false, error: "Format ID warga tidak valid." },
        { status: 400 }
      );
    }

    const body = {
      ...rest,
      github: extractSocial(rest.github, "github"),
      instagram: extractSocial(rest.instagram, "instagram"),
      linkedin: extractSocial(rest.linkedin, "linkedin"),
    };

    const parsed = WargaSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const docRef = db.collection("warga").doc(id);
    const existing = await docRef.get();
    if (!existing.exists) {
      return NextResponse.json(
        { success: false, error: "Data warga tidak ditemukan." },
        { status: 404 }
      );
    }

    if (parsed.data.role === "ketua_kelas") {
      const otherKetua = await db
        .collection("warga")
        .where("kelas", "==", parsed.data.kelas)
        .where("role", "==", "ketua_kelas")
        .get();

      const batch = db.batch();
      otherKetua.docs.forEach((doc) => {
        if (doc.id !== id) {
          batch.update(doc.ref, {
            role: "anggota",
            updated_at: new Date().toISOString(),
          });
        }
      });
      await batch.commit();
    }

    if (parsed.data.role === "waldos") {
      const otherWaldos = await db
        .collection("warga")
        .where("kelas", "==", parsed.data.kelas)
        .where("role", "==", "waldos")
        .get();

      const batch = db.batch();
      otherWaldos.docs.forEach((doc) => {
        if (doc.id !== id) {
          batch.update(doc.ref, {
            role: "anggota",
            updated_at: new Date().toISOString(),
          });
        }
      });
      await batch.commit();
    }

    await docRef.update({
      ...parsed.data,
      updated_at: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: "Data warga berhasil diperbarui.",
    });
  } catch (error) {
    console.error("PUT warga error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memperbarui data warga." },
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
        { success: false, error: "Format ID warga tidak valid." },
        { status: 400 }
      );
    }

    const docRef = db.collection("warga").doc(id);
    const existing = await docRef.get();
    if (!existing.exists) {
      return NextResponse.json(
        { success: false, error: "Data warga tidak ditemukan." },
        { status: 404 }
      );
    }

    await docRef.delete();

    return NextResponse.json({
      success: true,
      message: "Data warga berhasil dihapus.",
    });
  } catch (error) {
    console.error("DELETE warga error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menghapus data warga." },
      { status: 500 }
    );
  }
}

