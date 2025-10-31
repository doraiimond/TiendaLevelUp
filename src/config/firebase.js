import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDSUIyg4O-6OGemNJYVgtFiNRWTb4tmsRY",
  authDomain: "levelup-7269f.firebaseapp.com",
  projectId: "levelup-7269f",
  storageBucket: "levelup-7269f.appspot.com", // ✅ corregido
  messagingSenderId: "420067821053",
  appId: "1:420067821053:web:ee83cc9a8ba7e86f88c594",
  measurementId: "G-JRZ3GS13XN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Evita error de Analytics en local
let analytics;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

export const db = getFirestore(app);
export const auth = getAuth(app);
