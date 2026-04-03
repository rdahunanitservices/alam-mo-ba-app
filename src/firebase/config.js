// ============================================================
// FIREBASE CONFIG — Alam Mo Ba?! Pinoy Quiz
// ============================================================

import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAXLjb6TyNvHEW7kJp5ZLQwVCAEV_YCjBk",
  authDomain: "alam-mo-ba.firebaseapp.com",
  projectId: "alam-mo-ba",
  storageBucket: "alam-mo-ba.firebasestorage.app",
  messagingSenderId: "786067987222",
  appId: "1:786067987222:web:298696400c0fe6307dae37",
  measurementId: "G-WC0M8D6521",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export default app;
