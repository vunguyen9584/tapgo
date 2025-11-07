import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, type User, type Auth } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc, type Firestore } from 'firebase/firestore';

const cfg = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const enabled = !!cfg.apiKey && !!cfg.projectId;

let app: FirebaseApp | undefined;
if (enabled) {
  app = getApps().length === 0 ? initializeApp(cfg) : getApps()[0];
}
export const firebaseEnabled = enabled;
export const auth: Auth | undefined = app ? getAuth(app) : undefined;
export const db: Firestore | undefined = app ? getFirestore(app) : undefined;

export async function loginWithGoogle() {
  if (!auth) return undefined;
  const provider = new GoogleAuthProvider();
  const res = await signInWithPopup(auth, provider);
  return res.user;
}

export async function logoutWithGoogle() {
  if (!auth) return;
  await signOut(auth);
}

export function onUserChange(cb: (user: User | null) => void) {
  if (!auth) { cb(null); return () => { }; }
  return onAuthStateChanged(auth, cb);
}

export async function loadProgress(uid: string): Promise<any | undefined> {
  if (!db) return undefined;
  const ref = doc(db, 'users', uid);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : undefined;
}

export async function saveProgress(uid: string, lessons: Record<string, any>) {
  if (!db) return;
  const ref = doc(db, 'users', uid);
  await setDoc(ref, { lessons }, { merge: true });
}
