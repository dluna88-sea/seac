import { initializeApp } from "firebase/app";
// import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";
import { getFirestore } from "firebase/firestore/lite";
import { getAuth } from "firebase/auth";


/**
 * Base de datos de producción:
 */
const firebaseConfig = {
  apiKey: "AIzaSyDIS5dpFmXD6qjmH51HrQ_UMmKWtRvKKxc",
  authDomain: "transparenciaseac.firebaseapp.com",
  projectId: "transparenciaseac",
  storageBucket: "transparenciaseac.appspot.com",
  messagingSenderId: "640440931494",
  appId: "1:640440931494:web:81e2d4d8a42d3422a0d067"
};

// const appCheck = initializeAppCheck(app, {
//   provider: new ReCaptchaV3Provider('6LciEyIlAAAAAMSwAfx7rmUaR-gkt3YFhPuCOxiegit'),

//   // Optional argument. If true, the SDK automatically refreshes App Check
//   // tokens as needed.
//   isTokenAutoRefreshEnabled: true
// });


/**
 * Base de datos de pruebas:
 */
// const firebaseConfig = {
//   apiKey: "AIzaSyCTuFryyv-L7EmkoKAKNuwgg9JcsVoHnzE",
//   authDomain: "pruebastransparenciaseac.firebaseapp.com",
//   projectId: "pruebastransparenciaseac",
//   storageBucket: "pruebastransparenciaseac.appspot.com",
//   messagingSenderId: "496952588393",
//   appId: "1:496952588393:web:ec1ddb266e1353f2994af8"
// };

initializeApp(firebaseConfig);

const db = getFirestore();
const auth = getAuth();

export { db, auth, firebaseConfig };