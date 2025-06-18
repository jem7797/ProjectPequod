// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBwS16UI49qWigfNGJ9Ciczb-rI7uOvRPA",
  authDomain: "projectpequod-a3145.firebaseapp.com",
  projectId: "projectpequod-a3145",
  storageBucket: "projectpequod-a3145.firebasestorage.app",
  messagingSenderId: "359511347434",
  appId: "1:359511347434:web:cc43347bc45cf999430793",
  measurementId: "G-13FND3GXTN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
