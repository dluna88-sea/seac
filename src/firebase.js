import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore/lite";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDIS5dpFmXD6qjmH51HrQ_UMmKWtRvKKxc",
  authDomain: "transparenciaseac.firebaseapp.com",
  projectId: "transparenciaseac",
  storageBucket: "transparenciaseac.appspot.com",
  messagingSenderId: "640440931494",
  appId: "1:640440931494:web:81e2d4d8a42d3422a0d067"
};

initializeApp(firebaseConfig);

const db = getFirestore();
const auth = getAuth();

export { db, auth, firebaseConfig };