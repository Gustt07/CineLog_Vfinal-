import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCuSSCyZTwtS8KQPErn_AFoifVWXyu2tq4",
  authDomain: "aplicativo-de-mapas-para-lojas.firebaseapp.com",
  projectId: "aplicativo-de-mapas-para-lojas",
  storageBucket: "aplicativo-de-mapas-para-lojas.firebasestorage.app",
  messagingSenderId: "487025211657",
  appId: "1:487025211657:web:10d39d0b7ccbd02de07bd8",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export {
  auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User,
};
