import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, createUserWithEmailAndPassword as firebaseCreateUserWithEmailAndPassword, signInWithEmailAndPassword as firebaseSignInWithEmailAndPassword, sendPasswordResetEmail as firebaseSendPasswordResetEmail, type User, type Auth } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc, collection, getDocs, query, where, orderBy, limit, addDoc, serverTimestamp, type Firestore } from 'firebase/firestore';
import type { Quote, QuoteSession, QuoteStats } from '../types/quotes';

// Re-export User from firebase/auth for use in components
export { type User } from 'firebase/auth';

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

export async function registerWithEmail(email: string, password: string) {
  if (!auth) return undefined;
  try {
    const result = await firebaseCreateUserWithEmailAndPassword(auth, email, password);
    return result.user;
  } catch (error) {
    throw error;
  }
}

export async function loginWithEmail(email: string, password: string) {
  if (!auth) return undefined;
  try {
    const result = await firebaseSignInWithEmailAndPassword(auth, email, password);
    return result.user;
  } catch (error) {
    throw error;
  }
}

export async function resetPassword(email: string) {
  if (!auth) return;
  try {
    await firebaseSendPasswordResetEmail(auth, email);
  } catch (error) {
    throw error;
  }
}

export async function logout() {
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

export async function saveSettings(uid: string, settings: Record<string, any>) {
  if (!db) return;
  const ref = doc(db, 'users', uid);
  await setDoc(ref, { settings }, { merge: true });
}

export async function loadSettings(uid: string): Promise<any | undefined> {
  if (!db) return undefined;
  const ref = doc(db, 'users', uid);
  const snap = await getDoc(ref);
  return snap.exists() ? (snap.data().settings as any) : undefined;
}

export async function saveTestResult(uid: string, testResult: any) {
  if (!db) return;
  const ref = doc(db, 'users', uid);
  const existingData = await getDoc(ref);
  const currentTests = existingData.exists() ? (existingData.data().tests || []) : [];
  const updatedTests = [testResult, ...currentTests].slice(0, 50); // Keep last 50 test results
  await setDoc(ref, { tests: updatedTests }, { merge: true });
}

export async function loadTestHistory(uid: string): Promise<any[]> {
  if (!db) return [];
  const ref = doc(db, 'users', uid);
  const snap = await getDoc(ref);
  return snap.exists() ? (snap.data().tests || []) : [];
}

export async function updateUserStats(uid: string, stats: any) {
  if (!db) return;
  const ref = doc(db, 'users', uid);
  await setDoc(ref, { stats }, { merge: true });
}

// Quote Management Functions
export async function getQuotes(difficulty?: Quote['difficulty']): Promise<Quote[]> {
  if (!db) return [];
  
  const quotesRef = collection(db, 'quotes');
  let q = query(quotesRef, orderBy('createdAt', 'desc'));
  
  if (difficulty) {
    q = query(quotesRef, where('difficulty', '==', difficulty), orderBy('createdAt', 'desc'));
  }
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    ...doc.data(),
    id: doc.id,
    createdAt: doc.data().createdAt?.toDate() || new Date()
  })) as Quote[];
}

export async function getRandomQuote(difficulty?: Quote['difficulty']): Promise<Quote | null> {
  if (!db) return null;
  
  const quotesRef = collection(db, 'quotes');
  let q = query(quotesRef);
  
  if (difficulty) {
    q = query(quotesRef, where('difficulty', '==', difficulty));
  }
  
  const snapshot = await getDocs(q);
  const quotes = snapshot.docs.map(doc => ({
    ...doc.data(),
    id: doc.id,
    createdAt: doc.data().createdAt?.toDate() || new Date()
  })) as Quote[];
  
  if (quotes.length === 0) return null;
  
  const randomIndex = Math.floor(Math.random() * quotes.length);
  return quotes[randomIndex];
}

export async function saveQuote(quote: Omit<Quote, 'id' | 'createdAt'>): Promise<string | null> {
  if (!db) return null;
  
  try {
    const quoteWithTimestamp = {
      ...quote,
      createdAt: serverTimestamp()
    };
    
    const docRef = await addDoc(collection(db, 'quotes'), quoteWithTimestamp);
    return docRef.id;
  } catch (error) {
    console.error('Error saving quote:', error);
    return null;
  }
}

export async function saveQuoteSession(session: Omit<QuoteSession, 'id'>): Promise<string | null> {
  if (!db) return null;
  
  try {
    const sessionWithTimestamp = {
      ...session,
      startedAt: serverTimestamp(),
      completedAt: serverTimestamp()
    };
    
    const docRef = await addDoc(collection(db, 'quoteSessions'), sessionWithTimestamp);
    
    // Update user's quote stats
    await updateUserQuoteStats(session.userId);
    
    return docRef.id;
  } catch (error) {
    console.error('Error saving quote session:', error);
    return null;
  }
}

export async function getQuoteSessions(userId: string, limit: number = 50): Promise<QuoteSession[]> {
  if (!db) return [];
  
  const sessionsRef = collection(db, 'quoteSessions');
  const q = query(
    sessionsRef, 
    where('userId', '==', userId),
    orderBy('completedAt', 'desc'),
    limit(limit)
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    ...doc.data(),
    id: doc.id,
    startedAt: doc.data().startedAt?.toDate() || new Date(),
    completedAt: doc.data().completedAt?.toDate() || new Date()
  })) as QuoteSession[];
}

export async function getQuoteStats(userId: string): Promise<QuoteStats | null> {
  if (!db) return null;
  
  const sessions = await getQuoteSessions(userId, 1000); // Get all sessions for stats
  
  if (sessions.length === 0) {
    return {
      totalQuotes: 0,
      averageWpm: 0,
      averageAccuracy: 0,
      bestWpm: 0,
      bestAccuracy: 0,
      quotesByDifficulty: {
        easy: { completed: 0, averageWpm: 0, averageAccuracy: 0 },
        medium: { completed: 0, averageWpm: 0, averageAccuracy: 0 },
        hard: { completed: 0, averageWpm: 0, averageAccuracy: 0 }
      }
    };
  }
  
  const totalQuotes = sessions.length;
  const averageWpm = sessions.reduce((sum, s) => sum + s.wpm, 0) / totalQuotes;
  const averageAccuracy = sessions.reduce((sum, s) => sum + s.accuracy, 0) / totalQuotes;
  const bestWpm = Math.max(...sessions.map(s => s.wpm));
  const bestAccuracy = Math.max(...sessions.map(s => s.accuracy));
  
  // Group by difficulty
  const sessionsByDifficulty = {
    easy: sessions.filter(s => s.difficulty === 'easy'),
    medium: sessions.filter(s => s.difficulty === 'medium'),
    hard: sessions.filter(s => s.difficulty === 'hard')
  };
  
  const quotesByDifficulty = {
    easy: {
      completed: sessionsByDifficulty.easy.length,
      averageWpm: sessionsByDifficulty.easy.length > 0 
        ? sessionsByDifficulty.easy.reduce((sum, s) => sum + s.wpm, 0) / sessionsByDifficulty.easy.length 
        : 0,
      averageAccuracy: sessionsByDifficulty.easy.length > 0 
        ? sessionsByDifficulty.easy.reduce((sum, s) => sum + s.accuracy, 0) / sessionsByDifficulty.easy.length 
        : 0
    },
    medium: {
      completed: sessionsByDifficulty.medium.length,
      averageWpm: sessionsByDifficulty.medium.length > 0 
        ? sessionsByDifficulty.medium.reduce((sum, s) => sum + s.wpm, 0) / sessionsByDifficulty.medium.length 
        : 0,
      averageAccuracy: sessionsByDifficulty.medium.length > 0 
        ? sessionsByDifficulty.medium.reduce((sum, s) => sum + s.accuracy, 0) / sessionsByDifficulty.medium.length 
        : 0
    },
    hard: {
      completed: sessionsByDifficulty.hard.length,
      averageWpm: sessionsByDifficulty.hard.length > 0 
        ? sessionsByDifficulty.hard.reduce((sum, s) => sum + s.wpm, 0) / sessionsByDifficulty.hard.length 
        : 0,
      averageAccuracy: sessionsByDifficulty.hard.length > 0 
        ? sessionsByDifficulty.hard.reduce((sum, s) => sum + s.accuracy, 0) / sessionsByDifficulty.hard.length 
        : 0
    }
  };
  
  return {
    totalQuotes,
    averageWpm,
    averageAccuracy,
    bestWpm,
    bestAccuracy,
    quotesByDifficulty
  };
}

export async function updateUserQuoteStats(userId: string): Promise<void> {
  if (!db) return;
  
  const stats = await getQuoteStats(userId);
  const ref = doc(db, 'users', userId);
  await setDoc(ref, { quoteStats: stats }, { merge: true });
}
