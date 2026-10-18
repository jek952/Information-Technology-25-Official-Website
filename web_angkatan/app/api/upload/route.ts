import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/app/lib/cloudinary";
import sharp from "sharp";
import { z } from "zod";
import { verifyAdminSession } from "@/app/lib/auth";
import { logSecurityEvent } from "@/app/lib/security-logger";
import { getClientIp } from "@/app/lib/ip";
import { checkSharedRateLimit } from "@/app/lib/rate-limiter";

const UploadSchema = z.object({
  folder: z.string().regex(/^[a-zA-Z0-9_-]+$/).default("general"),
});

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_RAW_SIZE = 5 * 1024 * 1024; // 5 MB
const MAX_UPLOADS_PER_WINDOW = 20;
const UPLOAD_WINDOW_MS = 10 * 60 * 1000; // 10 menit

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);

    const rateResult = await checkSharedRateLimit("upload", ip, MAX_UPLOADS_PER_WINDOW, UPLOAD_WINDOW_MS);
    if (!rateResult.allowed) {
      logSecurityEvent({
        type: "UPLOAD_RATE_LIMITED",
        ip,
        detail: `IP melebihi kuota upload (${MAX_UPLOADS_PER_WINDOW} per 10 menit). Tunggu ${rateResult.resetInMinutes} menit.`,
      });
      return NextResponse.json(
        {
          success: false,
          error: `Batas unggah gambar terlampaui. Maksimal 20 unggahan per 10 menit. Silakan tunggu ${rateResult.resetInMinutes} menit lagi.`,
        },
        { status: 429 }
      );
    }

    const session = await verifyAdminSession(req);
    if (!session.authenticated) {
      return NextResponse.json(
        { success: false, error: session.error || "Akses ditolak: Autentikasi admin diperlukan." },
        { status: 401 }
      );
    }

    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      console.error("Upload error: Cloudinary credentials missing in .env.local");
      return NextResponse.json(
        {
          success: false,
          error: "Konfigurasi Cloudinary belum lengkap di .env.local (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET).",
        },
        { status: 500 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const rawFolder = formData.get("folder")?.toString() || "general";

    if (!file) {
      return NextResponse.json(
        { success: false, error: "File tidak ditemukan." },
        { status: 400 }
      );
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      logSecurityEvent({
        type: "UPLOAD_INVALID_MIME",
        ip,
        detail: `Percobaan unggah tipe file dilarang: ${file.type || "unknown"} (nama: ${file.name || "unnamed"})`,
      });
      return NextResponse.json(
        { success: false, error: "Format file tidak didukung. Gunakan JPG, PNG, atau WebP." },
        { status: 400 }
      );
    }

    if (file.size > MAX_RAW_SIZE) {
      return NextResponse.json(
        { success: false, error: "Ukuran file terlalu besar. Maksimal 5 MB." },
        { status: 400 }
      );
    }

    const parsed = UploadSchema.safeParse({ folder: rawFolder });
    const targetFolder = parsed.success ? parsed.data.folder : "general";

    const arrayBuffer = await file.arrayBuffer();
    const rawBuffer = Buffer.from(arrayBuffer);

    const compressedBuffer = await sharp(rawBuffer)
      .resize(1000, 1000, { fit: "inside", withoutEnlargement: true })
      .webp({ quality: 80, effort: 4 })
      .toBuffer();

    const uploadResponse = await new Promise<any>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: `proximiti-2026/${targetFolder}`,
          format: "webp",
        },
        (err, res) => (err ? reject(err) : resolve(res))
      );
      stream.end(compressedBuffer);
    });
    

    return NextResponse.json({
      success: true,
      url: uploadResponse.secure_url,
      public_id: uploadResponse.public_id,
      compressed_size_kb: Math.round(compressedBuffer.length / 1024),
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengompres dan mengunggah gambar. Terjadi kesalahan pada server." },
      { status: 500 }
    );
  }
}
