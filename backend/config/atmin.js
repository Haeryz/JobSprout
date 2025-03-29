// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBy2CBBCGT-S-xfz3IGOWSZbwJP1MTYSto",
  authDomain: "jobsprout-c217b.firebaseapp.com",
  projectId: "jobsprout-c217b",
  storageBucket: "jobsprout-c217b.firebasestorage.app",
  messagingSenderId: "735593721229",
  appId: "1:735593721229:web:a9a56c2ea5e7bf38f0e1c4",
  measurementId: "G-CE3ZLHZBGD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);