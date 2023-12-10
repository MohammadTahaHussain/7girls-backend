// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA0V4fCMkTmjQQW-p9pJnPKFWy-ezIOj7E",
  authDomain: "girlsclub-ece39.firebaseapp.com",
  projectId: "girlsclub-ece39",
  storageBucket: "girlsclub-ece39.appspot.com",
  messagingSenderId: "827068557660",
  appId: "1:827068557660:web:909f98d776da2eeba03999",
  measurementId: "G-3RWXZ4GVP7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const db = getFirestore(app)
const analytics = getAnalytics(app);
