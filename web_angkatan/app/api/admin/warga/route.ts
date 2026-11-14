import { NextRequest, NextResponse } from "next/server";
import { db } from "@/app/lib/firebase-admin";
import { verifyAdminSession } from "@/app/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await verifyAdminSession(req);
    if (!session.authenticated) {
      return NextResponse.json(
        { success: false, error: session.error || "Akses ditolak: Autentikasi admin diperlukan." },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const kelas = searchParams.get("kelas");
    const role = searchParams.get("role");

    let query: FirebaseFirestore.Query = db.collection("warga");
    if (kelas) query = query.where("kelas", "==", kelas);
    if (role) query = query.where("role", "==", role);

    const snapshot = await query.get();
    const data = snapshot.docs.map((doc) => {
      const docData = doc.data();
      // Buang metadata internal seperti drive_id
      const { drive_id, ...cleanData } = docData;
      return {
        id: doc.id,
        ...cleanData,
      };
    });

    const response = NextResponse.json({ success: true, data });
    response.headers.set("Cache-Control", "private, no-cache, no-store, max-age=0, must-revalidate");
    response.headers.set("Pragma", "no-cache");
    return response;
  } catch (error) {
    console.error("GET admin warga error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memuat data warga admin." },
      { status: 500 }
    );
  }
}
