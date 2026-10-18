import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  type Firestore,
} from "firebase/firestore";
import type { TranslationResult } from "./gesture-types";

// Local storage key for fallback logging
const LOCAL_STORAGE_ISHARA_KEY = "ishara_live_sessions_local";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
};

let app: FirebaseApp | null = null;
let db: Firestore | null = null;

export const isFirebaseConfigured = (): boolean => {
  return Boolean(
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
      process.env.NEXT_PUBLIC_FIREBASE_API_KEY
  );
};

export const getFirestoreClient = (): Firestore | null => {
  if (!isFirebaseConfigured()) {
    return null;
  }

  try {
    if (!getApps().length) {
      app = initializeApp(firebaseConfig);
    } else {
      app = getApps()[0];
    }
    if (!db && app) {
      db = getFirestore(app);
    }
    return db;
  } catch (err) {
    console.warn("Firebase initialization warning (falling back to local state):", err);
    return null;
  }
};

/**
 * Persist Ishara Live session turn to Firestore or graceful local state
 */
export async function logIsharaSession(
  scenario: string,
  gestureTokens: string[],
  translation: TranslationResult
): Promise<{ success: boolean; persistedTo: "FIRESTORE" | "LOCAL_STATE"; docId?: string }> {
  const firestore = getFirestoreClient();

  if (firestore) {
    try {
      const docRef = await addDoc(collection(firestore, "ishara_live_sessions"), {
        scenario,
        gestureTokens,
        translation,
        createdAt: serverTimestamp(),
        source: "Ishara-Live-Bridge",
      });
      return { success: true, persistedTo: "FIRESTORE", docId: docRef.id };
    } catch (e) {
      console.warn("Failed saving session to Firestore, falling back to local storage:", e);
    }
  }

  // Graceful local storage fallback
  try {
    if (typeof window !== "undefined") {
      const existingStr = window.localStorage.getItem(LOCAL_STORAGE_ISHARA_KEY);
      const existingLogs = existingStr ? JSON.parse(existingStr) : [];
      const newEntry = {
        id: `ishara-session-${Date.now()}`,
        scenario,
        gestureTokens,
        translation,
        timestamp: new Date().toISOString(),
        persistedTo: "LOCAL_STATE",
      };
      existingLogs.unshift(newEntry);
      window.localStorage.setItem(LOCAL_STORAGE_ISHARA_KEY, JSON.stringify(existingLogs.slice(0, 20)));
      return { success: true, persistedTo: "LOCAL_STATE", docId: newEntry.id };
    }
  } catch (err) {
    console.warn("Local storage fallback warning:", err);
  }

  return { success: true, persistedTo: "LOCAL_STATE" };
}
