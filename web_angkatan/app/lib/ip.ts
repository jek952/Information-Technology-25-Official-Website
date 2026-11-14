import { NextRequest } from "next/server";

export function getClientIp(req: NextRequest): string {
  const realIp = req.headers.get("x-real-ip");
  if (realIp && realIp.trim()) {
    return realIp.trim();
  }

  const cfRay = req.headers.get("cf-ray");
  const cfIp = req.headers.get("cf-connecting-ip");
  if (cfRay && cfIp && cfIp.trim()) {
    return cfIp.trim();
  }

  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) {
    const parts = forwardedFor
      .split(",")
      .map((s) => s.trim())
      .filter((s) => /^[a-fA-F0-9:.]+$/.test(s));

    if (parts.length > 0) {
      return parts[0];
    }
  }

  const vercelIp = req.headers.get("x-vercel-ip");
  if (vercelIp && vercelIp.trim()) {
    return vercelIp.trim();
  }

  const runtimeIp = (req as unknown as { ip?: string }).ip;
  if (runtimeIp && typeof runtimeIp === "string") {
    return runtimeIp.trim();
  }

  return "127.0.0.1";
}

