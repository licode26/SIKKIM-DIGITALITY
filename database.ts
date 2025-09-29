// FIX: Switched to Firebase v8 compat imports to fix "no exported member" errors.
// FIX: Switched to Firebase v8 compat imports to resolve errors with firebase.apps, firebase.initializeApp and firebase.auth.
import firebase from "firebase/compat/app";
import "firebase/compat/auth";

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
// FIX: Updated initialization to v8 syntax.
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
export const auth = firebase.auth();
