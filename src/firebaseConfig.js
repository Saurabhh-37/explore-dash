// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, addDoc } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDv3CJ_UWWWt3jYski1_LPQdeqmx8uKLN4",
  authDomain: "taskflow-d4a96.firebaseapp.com",
  projectId: "taskflow-d4a96",
  storageBucket: "taskflow-d4a96.firebasestorage.app",
  messagingSenderId: "391567457568",
  appId: "1:391567457568:web:75d0448506c7f07a78ab45",
  measurementId: "G-RQBW4RL31V"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export { app, db, addDoc, collection };