import { NextRequest, NextResponse } from "next/server";
import { db } from "@/app/lib/firebase-admin";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const SAFE_DOC_ID = /^[a-zA-Z0-9_-]{1,128}$/;
    if (!id || typeof id !== "string" || !SAFE_DOC_ID.test(id)) {
      return NextResponse.json(
        { success: false, error: "Format ID informasi tidak valid." },
        { status: 400 }
      );
    }
    const doc = await db.collection("information").doc(id).get();

    if (!doc.exists) {
      return NextResponse.json(
        { success: false, error: "Informasi tidak ditemukan." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { id: doc.id, ...doc.data() },
    });
  } catch (error) {
    console.error("GET information/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memuat detail informasi." },
      { status: 500 }
    );
  }
}
