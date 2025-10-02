import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyA-8bvs0ogm0HAqr-ngrC-K21Lxg4WRavI",
    authDomain: "tiendalevelup-66aa8.firebaseapp.com",
    projectId: "tiendalevelup-66aa8",
    storageBucket: "tiendalevelup-66aa8.firebasestorage.app",
    messagingSenderId: "500431750193",
    appId: "1:500431750193:web:b4542d0c40934a02034110",
    measurementId: "G-87KTP9XR6E"
  };

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);