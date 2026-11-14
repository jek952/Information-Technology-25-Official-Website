/* eslint-disable @typescript-eslint/no-explicit-any */
import { db } from "@/app/lib/firebase-admin";

export type SecurityEventType =
  | "LOGIN_FAILED"
  | "LOGIN_LOCKOUT"
  | "CSRF_ORIGIN_MISMATCH"
  | "UPLOAD_INVALID_MIME"
  | "UPLOAD_RATE_LIMITED"
  | "AUTH_TOKEN_INVALID"
  | "SESSION_REVOKED";

export interface SecurityLogPayload {
  type: SecurityEventType;
  ip: string;
  detail?: string;
  metadata?: Record<string, any>;
}

const THROTTLE_WINDOW_MS = 5 * 60 * 1000;
const inMemoryFloodShield = new Map<string, number>();

export async function logSecurityEvent(payload: SecurityLogPayload): Promise<void> {
  try {
    const safeIp = payload.ip.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 50);
    const throttleKey = `${payload.type}_${safeIp}`;
    const now = Date.now();

    const lastSeenMemory = inMemoryFloodShield.get(throttleKey);
    if (lastSeenMemory && (now - lastSeenMemory) < 15_000) {
      return;
    }
    inMemoryFloodShield.set(throttleKey, now);

    if (inMemoryFloodShield.size > 2000) {
      for (const [k, v] of inMemoryFloodShield.entries()) {
        if (now - v > 60_000) inMemoryFloodShield.delete(k);
      }
    }

    const throttleRef = db.collection("security_log_throttles").doc(throttleKey);
    const throttleSnap = await throttleRef.get();
    if (throttleSnap.exists) {
      const data = throttleSnap.data();
      if (data && typeof data.expiry === "number" && data.expiry > now) {
        const lastAttemptMs = data.last_attempt_ms || 0;
        if (now - lastAttemptMs > 30_000) {
          await throttleRef.update({
            suppressed_count: (data.suppressed_count || 0) + 1,
            last_attempt: new Date().toISOString(),
            last_attempt_ms: now,
          });
        }
        return;
      }
    }

    await throttleRef.set({
      type: payload.type,
      ip: payload.ip,
      expiry: now + THROTTLE_WINDOW_MS,
      expire_at: new Date(now + THROTTLE_WINDOW_MS),
      suppressed_count: 0,
      last_attempt: new Date().toISOString(),
    });

    await db.collection("security_logs").add({
      ...payload,
      created_at: new Date().toISOString(),
    });
  } catch (err) {
    console.error("[SECURITY LOG ERROR]", err);
  }
}
