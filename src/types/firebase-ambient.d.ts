 declare module 'firebase/app' {
   export interface FirebaseApp {}
   export function initializeApp(config: any): FirebaseApp;
   export function getApps(): FirebaseApp[];
 }

 declare module 'firebase/auth' {
   import type { FirebaseApp } from 'firebase/app';
   export interface Auth {}
   export interface User { displayName: string | null; email: string | null; uid: string }
   export class GoogleAuthProvider {}
   export function getAuth(app?: FirebaseApp): Auth;
   export function signInWithPopup(auth: Auth, provider: GoogleAuthProvider): Promise<{ user: User }>;
   export function signOut(auth: Auth): Promise<void>;
   export function onAuthStateChanged(auth: Auth, cb: (user: User | null) => void): () => void;
 }

 declare module 'firebase/firestore' {
   import type { FirebaseApp } from 'firebase/app';
   export interface Firestore {}
   export function getFirestore(app?: FirebaseApp): Firestore;
   export function doc(db: Firestore, collection: string, id: string): any;
   export function getDoc(ref: any): Promise<{ exists(): boolean; data(): any }>;
   export function setDoc(ref: any, data: any, options?: any): Promise<void>;
 }
