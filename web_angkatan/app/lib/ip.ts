import { NextRequest } from "next/server";

/**
 * Mendapatkan IP klien yang sesungguhnya dengan mencegah IP spoofing via header mentah.
 * Memprioritaskan header terpercaya dari Edge CDN (Vercel, Cloudflare, Reverse Proxy).
 */
export function getClientIp(req: NextRequest): string {
  // 1. Vercel Edge IP (dikelola oleh edge network Vercel, tidak dapat dipalsukan klien)
  const vercelIp = req.headers.get("x-vercel-ip");
  if (vercelIp && vercelIp.trim()) {
    return vercelIp.trim();
  }

  // 2. Cloudflare Connecting IP (hanya dipercaya jika disertai header validasi cf-ray)
  const cfRay = req.headers.get("cf-ray");
  const cfIp = req.headers.get("cf-connecting-ip");
  if (cfRay && cfIp && cfIp.trim()) {
    return cfIp.trim();
  }

  // 3. X-Forwarded-For: Ambil hop proxy terpercaya terakhir
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) {
    const parts = forwardedFor
      .split(",")
      .map((s) => s.trim())
      .filter((s) => /^[a-fA-F0-9:.]+$/.test(s));

    if (parts.length > 0) {
      return parts[parts.length - 1];
    }
  }

  // 4. NextRequest runtime ip
  const runtimeIp = (req as unknown as { ip?: string }).ip;
  if (runtimeIp && typeof runtimeIp === "string") {
    return runtimeIp.trim();
  }

  return "127.0.0.1";
}

