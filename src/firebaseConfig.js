// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCNNtT9EN1ppej9-JwneZEqHOKMiya7JKI",
  authDomain: "fleetsight-c2319.firebaseapp.com",
  databaseURL: "https://fleetsight-c2319-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "fleetsight-c2319",
  storageBucket: "fleetsight-c2319.firebasestorage.app",
  messagingSenderId: "411309115991",
  appId: "1:411309115991:web:25360f9a39c776c65c3112",
  measurementId: "G-PXEC3X92BE"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { app, db };