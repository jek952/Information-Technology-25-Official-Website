import { initializeApp, getApps, cert, getApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

function getFirebaseAdminApp() {
  if (getApps().length > 0) {
    return getApp();
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");
  const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;

  if (!projectId || !clientEmail || !privateKey) {
    return null;
  }

  return initializeApp({
    credential: cert({
      projectId,
      clientEmail,
      privateKey,
    }),
    storageBucket,
  });
}

let _db: FirebaseFirestore.Firestore | null = null;
export const db = new Proxy({} as FirebaseFirestore.Firestore, {
  get(_, prop) {
    if (!_db) {
      const app = getFirebaseAdminApp();
      if (!app) {
        throw new Error("Firebase Admin environment variables are not properly configured.");
      }
      _db = getFirestore(app);
    }
    return (_db as any)[prop];
  },
});

let _storage: any = null;
export const storage = new Proxy({} as any, {
  get(_, prop) {
    if (!_storage) {
      const app = getFirebaseAdminApp();
      if (!app) {
        throw new Error("Firebase Admin environment variables are not properly configured.");
      }
      _storage = getStorage(app);
    }
    return _storage[prop];
  },
});
