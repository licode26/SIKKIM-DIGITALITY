import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDcpxAqpyQwuF4u2K0sx35pI1qTf3kPWB0",
    authDomain: "cabmine-c2f45.firebaseapp.com",
    projectId: "cabmine-c2f45",
    storageBucket: "cabmine-c2f45.firebasestorage.app",
    messagingSenderId: "1040933773469",
    appId: "1:1040933773469:web:6e65c3030c10da40c17474",
    measurementId: "G-CXNW4Q1PK1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
