import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDVCvrwyQiTV_mZjKYaDL3ZWKukdLgjdu8",
  authDomain: "eride-14b48.firebaseapp.com",
  databaseURL: "https://eride-14b48.firebaseio.com",
  projectId: "eride-14b48",
  storageBucket: "eride-14b48.firebasestorage.app",
  messagingSenderId: "606565325075",
  appId: "1:606565325075:web:6de3e31d741ceae59022e6"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
