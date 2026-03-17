import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  
  authDomain: "daily-habit-tracker-107.firebaseapp.com",
  projectId: "daily-habit-tracker-107",
  storageBucket: "daily-habit-tracker-107.appspot.com",
  messagingSenderId: "839559301934",
  appId: "1:839559301934:web:75706a5f9e244f37d448bf",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

const provider = new GoogleAuthProvider();

export const loginWithGoogle = () =>
  signInWithPopup(auth, provider);

export const logoutUser = () =>
  signOut(auth);

export const listenAuth = (callback: any) =>
  onAuthStateChanged(auth, callback);
