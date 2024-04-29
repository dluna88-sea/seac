import { initializeApp } from "firebase/app";
// import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";
import { getFirestore } from "firebase/firestore/lite";
import { getAuth } from "firebase/auth";

/**
 * Base de datos de producción:
 */
const firebaseConfig = {
  apiKey: "AIzaSyCai8j43fY184V_m7CbMfGeQ-WhUa1zQ5o",
  authDomain: "seseac-107b3.firebaseapp.com",
  projectId: "seseac-107b3",
  storageBucket: "seseac-107b3.appspot.com",
  messagingSenderId: "618073615445",
  appId: "1:618073615445:web:150d093db9aa19b6edb8dc"
};

initializeApp(firebaseConfig);

const db = getFirestore();
const auth = getAuth();

export { db, auth, firebaseConfig };