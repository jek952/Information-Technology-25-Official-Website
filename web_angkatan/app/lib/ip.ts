import { NextRequest } from "next/server";

/**
 * Mendapatkan IP klien yang sesungguhnya dengan mencegah IP spoofing via header mentah.
 * Memprioritaskan header terpercaya dari Edge CDN (Vercel, Cloudflare, Reverse Proxy).
 */
export function getClientIp(req: NextRequest): string {
  // 1. Vercel edge IP (diset langsung oleh edge network Vercel, tidak bisa dipalsukan klien)
  const vercelIp = req.headers.get("x-vercel-ip");
  if (vercelIp && vercelIp.trim()) {
    return vercelIp.trim();
  }

  // 2. Cloudflare Connecting IP
  const cfIp = req.headers.get("cf-connecting-ip");
  if (cfIp && cfIp.trim()) {
    return cfIp.trim();
  }

  // 3. Reverse Proxy Real IP
  const realIp = req.headers.get("x-real-ip");
  if (realIp && realIp.trim()) {
    return realIp.trim();
  }

  // 4. NextRequest runtime ip (jika didukung runtime)
  const runtimeIp = (req as unknown as { ip?: string }).ip;
  if (runtimeIp && typeof runtimeIp === "string") {
    return runtimeIp.trim();
  }

  // 5. X-Forwarded-For:
  // Ketika request melewati reverse proxy terpercaya (seperti Vercel, AWS ALB, Cloudflare, Nginx),
  // header yang dikirim oleh attacker ditaruh di awal, dan proxy menambahkan IP asli koneksi di AKHIR deretan.
  // Oleh karena itu, membaca index 0 sangat rentan spoofing (attacker inject header palsu).
  // Mengambil elemen terakhir menjamin IP didapatkan dari hop proxy terpercaya terakhir.
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) {
    const parts = forwardedFor
      .split(",")
      .map((s) => s.trim())
      .filter((s) => /^[a-fA-F0-9:.]+$/.test(s));
    
    if (parts.length > 0) {
      // Ambil hop terakhir yang dijamin berasal dari proxy network, bukan header buatan attacker
      return parts[parts.length - 1];
    }
  }

  return "127.0.0.1";
}

