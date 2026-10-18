import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/app/lib/auth";

export async function GET(req: NextRequest) {
  const session = await verifyAdminSession(req);
  if (!session.authenticated || !session.admin) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({
    authenticated: true,
    user: {
      username: session.admin.username,
      role: session.admin.role,
    },
  });
}
