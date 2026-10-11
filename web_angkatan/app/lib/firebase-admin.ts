import { initializeApp, getApps, cert, getApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");
const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;

function getFirebaseAdminApp() {
  if (getApps().length > 0) {
    return getApp();
  }

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error("Firebase Admin environment variables are not properly configured.");
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

const adminApp = getFirebaseAdminApp();
export const db = getFirestore(adminApp);
export const storage = getStorage(adminApp);
