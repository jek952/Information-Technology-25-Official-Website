import { db } from "@/app/lib/firebase-admin";

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetInMinutes?: number;
}

let lastCleanupTime = 0;

/**
 * Pembersihan berkala otomatis (self-pruning) untuk menghapus dokumen kedaluwarsa
 * tanpa perlu dependensi cron eksternal. Berjalan non-blocking maksimal sekali per 10 menit.
 */
async function pruneExpiredRateLimits(): Promise<void> {
  const now = Date.now();
  if (now - lastCleanupTime < 10 * 60 * 1000) return;
  lastCleanupTime = now;

  try {
    const expiredSnap = await db
      .collection("rate_limits")
      .where("expiry", "<=", now)
      .limit(50)
      .get();

    if (!expiredSnap.empty) {
      const batch = db.batch();
      expiredSnap.docs.forEach((doc) => batch.delete(doc.ref));
      await batch.commit();
    }
  } catch {
    // Non-blocking
  }
}

/**
 * Atomic shared rate limiter across serverless instances using Firestore Transactions.
 */
export async function checkSharedRateLimit(
  action: string, // e.g. "upload", "login", "logout"
  identifier: string, // client IP
  limit: number,
  windowMs: number
): Promise<RateLimitResult> {
  const safeId = `${action}_${identifier}`.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 120);
  const ref = db.collection("rate_limits").doc(safeId);
  const now = Date.now();

  // Jalankan pruning non-blocking di background
  pruneExpiredRateLimits().catch(() => {});

  try {
    return await db.runTransaction(async (t) => {
      const doc = await t.get(ref);
      const data = doc.data();

      if (!doc.exists || !data || (typeof data.expiry === "number" && data.expiry <= now)) {
        t.set(ref, {
          action,
          identifier,
          count: 1,
          expiry: now + windowMs,
          // Field expire_at bertipe Date native Firestore untuk mendukung Firestore Native TTL Policy
          expire_at: new Date(now + windowMs),
          updated_at: new Date().toISOString(),
        });
        return { allowed: true, remaining: limit - 1 };
      }

      if (data.count >= limit) {
        const remainingMinutes = Math.max(1, Math.ceil((data.expiry - now) / 60000));
        return { allowed: false, remaining: 0, resetInMinutes: remainingMinutes };
      }

      t.update(ref, {
        count: data.count + 1,
        updated_at: new Date().toISOString(),
      });
      return { allowed: true, remaining: limit - (data.count + 1) };
    });
  } catch (error) {
    console.error(`[RATE LIMIT ERROR on ${action}]:`, error);
    return { allowed: true, remaining: 1 };
  }
}

