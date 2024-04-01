// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCr6qopRglvtVV0dnjnF5sUKnKSkjeiG-U",
  authDomain: "ecommerce-lama-25868.firebaseapp.com",
  projectId: "ecommerce-lama-25868",
  storageBucket: "ecommerce-lama-25868.appspot.com",
  messagingSenderId: "854947960993",
  appId: "1:854947960993:web:a2c4d49fa69300e30a78e0",
  measurementId: "G-QRB06LQBNK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export default app;