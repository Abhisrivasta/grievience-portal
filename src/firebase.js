import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY  || "AIzaSyC8gJPhkiDz5LvEeFV_ZMOytb3t4KlClI8",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "grivienceportal.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "grivienceportal",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
console.log(auth);