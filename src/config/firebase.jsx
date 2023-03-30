// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from '@firebase/firestore'
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDpR9R5L6xuFPuwf7JQkjEnXLGF64qodew",
  authDomain: "mahdara-e8299.firebaseapp.com",
  projectId: "mahdara-e8299",
  storageBucket: "mahdara-e8299.appspot.com",
  messagingSenderId: "7712837976",
  appId: "1:7712837976:web:aace9912481e18d00b152d",
  measurementId: "G-NFHNGNZH9Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)
export const auth = getAuth(app)