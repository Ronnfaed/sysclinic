import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB29ilYX138LLrwI84HsHQkoO8GJD05WeU",
  authDomain: "maissaude-c3ca5.firebaseapp.com",
  projectId: "maissaude-c3ca5",
  storageBucket: "maissaude-c3ca5.appspot.com",
  messagingSenderId: "761845635969",
  appId: "1:761845635969:web:3037dedfd292b3e03aa680",
  measurementId: "G-7Y497D3HG9"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };



