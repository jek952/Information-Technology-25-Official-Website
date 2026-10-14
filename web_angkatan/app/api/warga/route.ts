import { NextRequest, NextResponse } from "next/server";
import { db } from "@/app/lib/firebase-admin";
import { z } from "zod";

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
    const rawBody = await req.json();
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
