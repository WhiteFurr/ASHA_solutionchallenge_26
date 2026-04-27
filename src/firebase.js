// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
//import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBPi1vwaAuYD01YZBU5xO2E7-OcD20cnaY",
  authDomain: "careroute-77f0c.firebaseapp.com",
  projectId: "careroute-77f0c",
  storageBucket: "careroute-77f0c.firebasestorage.app",
  messagingSenderId: "91647910264",
  appId: "1:91647910264:web:3b915a242ef8031168288d",
  measurementId: "G-2WY52NBT3B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
//const analytics = getAnalytics(app);