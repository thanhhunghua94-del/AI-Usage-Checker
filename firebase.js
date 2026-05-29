import { initializeApp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyA_50zygVEtErODVAfr6DPzRRGOl9d4GM8",
  authDomain: "group6-4da50.firebaseapp.com",
  projectId: "group6-4da50",
  storageBucket: "group6-4da50.firebasestorage.app",
  messagingSenderId: "315110347198",
  appId: "1:315110347198:web:298e83871dac2d5154e9ef",
  measurementId: "G-1G2VYMC8Y8"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);