import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/app/lib/cloudinary";
import sharp from "sharp";
import { z } from "zod";

const UploadSchema = z.object({
  folder: z.string().regex(/^[a-zA-Z0-9_-]+$/).default("general"),
});

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_RAW_SIZE = 10 * 1024 * 1024;

export async function POST(req: NextRequest) {
  try {
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
      return NextResponse.json(
        { success: false, error: "Format file tidak didukung. Gunakan JPG, PNG, atau WebP." },
        { status: 400 }
      );
    }

    if (file.size > MAX_RAW_SIZE) {
      return NextResponse.json(
        { success: false, error: "Ukuran file terlalu besar. Maksimal 10 MB." },
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
      { success: false, error: "Gagal mengompres dan mengunggah gambar." },
      { status: 500 }
    );
  }
}
